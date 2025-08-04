
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  letterTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LetterType',
    required: true
  },
  letterNumber: {
    type: String,
    required: true,
    unique: true
  },
  referenceNumber: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
