const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Suggestion', 'Complaint', 'Feedback', 'Concern'],
    required: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Faculty', 'Infrastructure', 'Hostel', 'Canteen', 'Transportation', 'Examination', 'Library', 'Student Services', 'Other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachment: { type: String, default: null },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  department: { type: String, default: 'General Administration' },
  adminResponse: { type: String, default: '' },
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative', 'Critical'],
    default: 'Neutral'
  },
  statusHistory: [statusHistorySchema]
}, { timestamps: true });

let SubmissionModel;
try {
  SubmissionModel = mongoose.model('Submission');
} catch (e) {
  SubmissionModel = mongoose.model('Submission', submissionSchema);
}

module.exports = SubmissionModel;
