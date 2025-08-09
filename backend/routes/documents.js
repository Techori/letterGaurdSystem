
const express = require('express');
const Document = require('../models/Document');
const Category = require('../models/Category');
const LetterType = require('../models/LetterType');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware for document creation/update
const validateDocument = (req, res, next) => {
  const { title, categoryId, letterTypeId, letterNumber, referenceNumber, issueDate, content } = req.body;
  const errors = [];

  // Required field validation
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  if (!categoryId) {
    errors.push('Category ID is required');
  }
  if (!letterTypeId) {
    errors.push('Letter Type ID is required');
  }
  if (!letterNumber || letterNumber.trim() === '') {
    errors.push('Letter number is required');
  }
  if (!referenceNumber || referenceNumber.trim() === '') {
    errors.push('Reference number is required');
  }
  if (!issueDate) {
    errors.push('Issue date is required');
  }
  if (!content || content.trim() === '') {
    errors.push('Content is required');
  }

  // Date validation
  if (issueDate && !Date.parse(issueDate)) {
    errors.push('Invalid issue date format');
  }

  // Status validation
  const validStatuses = ['Draft', 'Pending', 'Approved', 'Rejected'];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    errors.push('Invalid status value');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation errors', errors });
  }

  next();
};

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    console.log("User role:", req.user.role);
    
    const documents = await Document.find(query)
      .populate('categoryId', 'name prefix')
      .populate('letterTypeId', 'name')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log("Documents found:", documents.length);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single document
router.get('/:id', auth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const document = await Document.findOne(query)
      .populate('categoryId letterTypeId createdBy approvedBy');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create document
router.post('/', auth, validateDocument, async (req, res) => {
  try {
    const { title, categoryId, letterTypeId, letterNumber, referenceNumber, issueDate, content, status } = req.body;

     console.log("checkpoint 1")
    // Validate that category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
   

    // Validate that letter type exists and belongs to the category
    const letterType = await LetterType.findById(letterTypeId);
    if (!letterType) {
      return res.status(400).json({ message: 'Invalid letter type ID' });
    }
    if (letterType.categoryId.toString() !== categoryId) {
      return res.status(400).json({ message: 'Letter type does not belong to selected category' });
    }

    // Check if letter number already exists
    const existingDoc = await Document.findOne({ letterNumber: letterNumber.trim() });
    if (existingDoc) {
      return res.status(400).json({ message: 'Letter number already exists' });
    }

    // Validate issue date is not in the future (optional business rule)
    const issueDateTime = new Date(issueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (issueDateTime > today) {
      return res.status(400).json({ message: 'Issue date cannot be in the future' });
    }

    const document = new Document({
      title: title.trim(),
      categoryId,
      letterTypeId,
      letterNumber: letterNumber.trim(),
      referenceNumber: referenceNumber.trim(),
      issueDate: issueDateTime,
      content: content.trim(),
      status: status || 'Draft',
      createdBy: req.user._id
    });

    await document.save();
    await document.populate('categoryId letterTypeId createdBy');

    console.log('Document created:', document._id);
    res.status(201).json(document);
  } catch (error) {
    console.log('Error creating document:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Document with this letter number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document
router.put('/:id', auth, validateDocument, async (req, res) => {
  try {
    const { title, categoryId, letterTypeId, letterNumber, referenceNumber, issueDate, content, status } = req.body;
    
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    // Validate that category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Validate that letter type exists and belongs to the category
    const letterType = await LetterType.findById(letterTypeId);
    if (!letterType) {
      return res.status(400).json({ message: 'Invalid letter type ID' });
    }
    if (letterType.categoryId.toString() !== categoryId) {
      return res.status(400).json({ message: 'Letter type does not belong to selected category' });
    }

    // Check if letter number already exists (excluding current document)
    const existingDoc = await Document.findOne({ 
      letterNumber: letterNumber.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingDoc) {
      return res.status(400).json({ message: 'Letter number already exists' });
    }

    const updateData = {
      title: title.trim(),
      categoryId,
      letterTypeId,
      letterNumber: letterNumber.trim(),
      referenceNumber: referenceNumber.trim(),
      issueDate: new Date(issueDate),
      content: content.trim(),
      ...(status && { status })
    };

    const document = await Document.findOneAndUpdate(
      query,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId letterTypeId createdBy approvedBy');

    if (!document) {
      return res.status(404).json({ message: 'Document not found or access denied' });
    }

    console.log('Document updated:', document._id);
    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Document with this letter number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document status (admin only)
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    // Validate status
    const validStatuses = ['Draft', 'Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Validate rejection reason for rejected status
    if (status === 'Rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
      return res.status(400).json({ message: 'Rejection reason is required when rejecting a document' });
    }

    const updateData = { status };

    if (status === 'Approved') {
      updateData.approvedBy = req.user._id;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = undefined; // Clear any previous rejection reason
    } else if (status === 'Rejected') {
      updateData.rejectionReason = rejectionReason.trim();
      updateData.approvedBy = undefined;
      updateData.approvedAt = undefined;
    }

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('categoryId letterTypeId createdBy approvedBy');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log('Document status updated:', document._id, 'to', status);
    res.json(document);
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const document = await Document.findOneAndDelete(query);
    if (!document) {
      return res.status(404).json({ message: 'Document not found or access denied' });
    }

    console.log('Document deleted:', req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
