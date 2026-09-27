const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('./authRoutes');
const memoryStore = require('../store/memoryStore');
const SubmissionModel = require('../models/Submission');
const { getIsConnected } = require('../config/db');
const { groupDuplicateIssues } = require('../utils/similarity');

// Helper to fetch all submissions across DB or Memory
async function fetchAllSubmissions() {
  if (getIsConnected()) {
    return await SubmissionModel.find().sort({ createdAt: -1 });
  }
  return memoryStore.getSubmissions();
}

// 1. Overview KPIs
router.get('/overview', verifyAdminToken, async (req, res) => {
  try {
    const submissions = await fetchAllSubmissions();

    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'Pending').length;
    const inProgress = submissions.filter(s => s.status === 'In Progress' || s.status === 'Under Review' || s.status === 'Assigned').length;
    const resolved = submissions.filter(s => s.status === 'Resolved').length;
    const highPriority = submissions.filter(s => s.priority === 'High' || s.sentiment === 'Critical').length;

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        highPriority
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving overview KPIs.' });
  }
});

// 2. Charts Data for Recharts
router.get('/charts', verifyAdminToken, async (req, res) => {
  try {
    const submissions = await fetchAllSubmissions();

    // A. Monthly Trends (Last 6 Months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    submissions.forEach(sub => {
      const d = new Date(sub.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, Submissions: 0, Resolved: 0 };
      monthlyMap[key].Submissions += 1;
      if (sub.status === 'Resolved') monthlyMap[key].Resolved += 1;
    });

    const monthlyTrends = Object.values(monthlyMap);

    // B. Category Distribution
    const categoryMap = {};
    submissions.forEach(sub => {
      const cat = sub.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryDistribution = Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat]
    }));

    // C. Status Distribution
    const statusMap = { 'Pending': 0, 'Under Review': 0, 'In Progress': 0, 'Resolved': 0, 'Rejected': 0 };
    submissions.forEach(sub => {
      statusMap[sub.status] = (statusMap[sub.status] || 0) + 1;
    });
    const statusDistribution = Object.keys(statusMap).map(st => ({
      status: st,
      count: statusMap[st]
    }));

    // D. Priority Distribution
    const priorityMap = { 'Low': 0, 'Medium': 0, 'High': 0 };
    submissions.forEach(sub => {
      priorityMap[sub.priority] = (priorityMap[sub.priority] || 0) + 1;
    });
    const priorityDistribution = Object.keys(priorityMap).map(pr => ({
      priority: pr,
      count: priorityMap[pr]
    }));

    // E. Sentiment Breakdown
    const sentimentMap = { 'Positive': 0, 'Neutral': 0, 'Negative': 0, 'Critical': 0 };
    submissions.forEach(sub => {
      const s = sub.sentiment || 'Neutral';
      sentimentMap[s] = (sentimentMap[s] || 0) + 1;
    });
    const sentimentDistribution = Object.keys(sentimentMap).map(st => ({
      sentiment: st,
      count: sentimentMap[st]
    }));

    res.json({
      success: true,
      charts: {
        monthlyTrends,
        categoryDistribution,
        statusDistribution,
        priorityDistribution,
        sentimentDistribution
      }
    });

  } catch (error) {
    console.error('Charts Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Error compiling analytics charts.' });
  }
});

// 3. Common Issues & Duplicate Detection
router.get('/duplicates', verifyAdminToken, async (req, res) => {
  try {
    const submissions = await fetchAllSubmissions();
    const clusters = groupDuplicateIssues(submissions);

    res.json({
      success: true,
      clustersCount: clusters.length,
      clusters
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error detecting duplicate issues.' });
  }
});

// 4. High Priority & Critical Alerts
router.get('/high-priority', verifyAdminToken, async (req, res) => {
  try {
    const submissions = await fetchAllSubmissions();
    const alerts = submissions.filter(s => 
      (s.priority === 'High' || s.sentiment === 'Critical') && s.status !== 'Resolved'
    );

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving high priority alerts.' });
  }
});

module.exports = router;
