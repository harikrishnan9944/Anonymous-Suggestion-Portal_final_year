const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('./authRoutes');
const memoryStore = require('../store/memoryStore');
const SubmissionModel = require('../models/Submission');
const { getIsConnected } = require('../config/db');
const { analyzeSentiment } = require('../utils/sentiment');

// Helper to generate ASP tracking ID (e.g., ASP-2026-8F42K)
function generateTrackingId() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `ASP-${year}-${rand}`;
}

// 1. PUBLIC: Submit Anonymous Feedback/Complaint
router.post('/', async (req, res) => {
  try {
    const { type, category, priority, title, description, attachment } = req.body;

    if (!type || !category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Submission type, category, title, and description are required.'
      });
    }

    const trackingId = generateTrackingId();
    const sentiment = analyzeSentiment(title, description);

    const submissionData = {
      trackingId,
      type,
      category,
      priority: priority || 'Medium',
      title: title.trim(),
      description: description.trim(),
      attachment: attachment || null,
      status: 'Pending',
      department: 'General Administration',
      adminResponse: '',
      sentiment,
      statusHistory: [
        { status: 'Submitted', date: new Date(), note: 'Submission received anonymously.' }
      ]
    };

    let createdSubmission;

    if (getIsConnected()) {
      createdSubmission = await SubmissionModel.create(submissionData);
    } else {
      createdSubmission = memoryStore.createSubmission(submissionData);
    }

    return res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      trackingId: createdSubmission.trackingId,
      submission: {
        trackingId: createdSubmission.trackingId,
        type: createdSubmission.type,
        category: createdSubmission.category,
        status: createdSubmission.status,
        createdAt: createdSubmission.createdAt
      }
    });

  } catch (error) {
    console.error('Submission Creation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to record anonymous submission.' });
  }
});

// 2. PUBLIC: Track Submission Status by Tracking ID
router.get('/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;

    if (!trackingId) {
      return res.status(400).json({ success: false, message: 'Tracking ID is required.' });
    }

    const cleanId = trackingId.toUpperCase().trim();
    let submission = null;

    if (getIsConnected()) {
      submission = await SubmissionModel.findOne({ trackingId: cleanId }).select('-__v');
    }

    if (!submission) {
      submission = memoryStore.getSubmissionByTrackingId(cleanId);
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: `No submission found with Tracking ID "${cleanId}". Please verify and try again.`
      });
    }

    // Return sanitized public tracking details (no sensitive admin internals)
    return res.json({
      success: true,
      data: {
        trackingId: submission.trackingId,
        type: submission.type,
        category: submission.category,
        priority: submission.priority,
        title: submission.title,
        description: submission.description,
        status: submission.status,
        adminResponse: submission.adminResponse || null,
        statusHistory: submission.statusHistory || [],
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt
      }
    });

  } catch (error) {
    console.error('Track Lookup Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving tracking information.' });
  }
});

// 3. ADMIN: Get All Submissions with Filters & Pagination
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const { search, type, category, priority, status, page = 1, limit = 50 } = req.query;

    let items = [];

    if (getIsConnected()) {
      const query = {};
      if (type) query.type = type;
      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { trackingId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      items = await SubmissionModel.find(query).sort({ createdAt: -1 });
    } else {
      items = memoryStore.getSubmissions();
      
      if (type) items = items.filter(i => i.type === type);
      if (category) items = items.filter(i => i.category === category);
      if (priority) items = items.filter(i => i.priority === priority);
      if (status) items = items.filter(i => i.status === status);
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(i => 
          i.trackingId.toLowerCase().includes(s) ||
          i.title.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s)
        );
      }
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedItems
    });

  } catch (error) {
    console.error('Fetch Submissions Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching submissions.' });
  }
});

// 4. ADMIN: Get Single Submission Details
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;

    if (getIsConnected()) {
      item = await SubmissionModel.findById(id);
    }
    if (!item) {
      item = memoryStore.getSubmissionById(id);
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching submission details.' });
  }
});

// 5. ADMIN: Update Submission (Status, Admin Response, Department, Priority)
router.patch('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse, department, priority, statusNote } = req.body;

    let updated = null;

    if (getIsConnected()) {
      const doc = await SubmissionModel.findById(id);
      if (doc) {
        if (status && status !== doc.status) {
          doc.status = status;
          doc.statusHistory.push({
            status,
            date: new Date(),
            note: statusNote || `Status updated to ${status}`
          });
        }
        if (adminResponse !== undefined) doc.adminResponse = adminResponse;
        if (department) doc.department = department;
        if (priority) doc.priority = priority;
        updated = await doc.save();
      }
    }

    if (!updated) {
      updated = memoryStore.updateSubmission(id, { status, adminResponse, department, priority, statusNote });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: updated
    });

  } catch (error) {
    console.error('Update Submission Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update submission.' });
  }
});

// 6. ADMIN: Delete Submission
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (getIsConnected()) {
      const res = await SubmissionModel.findByIdAndDelete(id);
      if (res) deleted = true;
    }

    if (!deleted) {
      deleted = memoryStore.deleteSubmission(id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete submission.' });
  }
});

module.exports = router;
