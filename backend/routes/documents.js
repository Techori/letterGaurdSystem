const express = require('express');
const Document = require('../models/Document');
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const documents = await Document.find(query)
      .populate('categoryId', 'name prefix')
      .populate('letterTypeId', 'name')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create document
router.post('/', auth, async (req, res) => {
  try {
    const { title, categoryId, letterTypeId, letterNumber, referenceNumber, issueDate, content, status } = req.body;

    // Check if letter number already exists
    const existingDoc = await Document.findOne({ letterNumber });
    if (existingDoc) {
      console.log("doc exist already")
      return res.status(400).json({ message: 'Letter number already exists' });
    }

    const document = new Document({
      title,
      categoryId,
      letterTypeId,
      letterNumber,
      referenceNumber,
      issueDate,
      content,
      status: status || 'Draft',
      createdBy: req.user._id
    });

    await document.save();
    await document.populate('categoryId letterTypeId createdBy');

    res.status(201).json(document);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create multiple documents from Excel
router.post('/bulk', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const documentsData = req.body.documents ? JSON.parse(req.body.documents) : [];
    
    const createdDocuments = [];
    for (const docData of documentsData) {
      const existingDoc = await Document.findOne({ letterNumber: docData.letterNumber });
      if (existingDoc) {
        continue; // Skip documents with duplicate letter numbers
      }

      const document = new Document({
        ...docData,
        status: docData.status || 'Draft',
        createdBy: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await document.save();
      await document.populate('categoryId letterTypeId createdBy');
      createdDocuments.push(document);
    }

    res.status(201).json({
      message: `Successfully created ${createdDocuments.length} documents`,
      documents: createdDocuments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document
router.put('/:id', auth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const document = await Document.findOneAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoryId letterTypeId createdBy approvedBy');

    if (!document) {
      return res.status(404).json({ message: 'Document not found or access denied' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document status (admin only)
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const updateData = { status };

    if (status === 'Approved') {
      updateData.approvedBy = req.user._id;
      updateData.approvedAt = new Date();
    } else if (status === 'Rejected') {
      updateData.rejectionReason = rejectionReason;
    }

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('categoryId letterTypeId createdBy approvedBy');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
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
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;