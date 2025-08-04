
const express = require('express');
const LetterType = require('../models/LetterType');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all letter types
router.get('/', auth, async (req, res) => {
  try {
    const letterTypes = await LetterType.find({ isActive: true })
      .populate('categoryId', 'name prefix')
      .sort({ name: 1 });
    res.json(letterTypes);
    console.log("letter types:",letterTypes)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single letter type
router.get('/:id', auth, async (req, res) => {
  try {
    const letterType = await LetterType.findById(req.params.id)
      .populate('categoryId', 'name prefix');
    
    if (!letterType) {
      return res.status(404).json({ message: 'Letter type not found' });
    }
    
    res.json(letterType);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create letter type (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const letterType = new LetterType(req.body);
    await letterType.save();
    await letterType.populate('categoryId', 'name prefix');
    res.status(201).json(letterType);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update letter type (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const letterType = await LetterType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name prefix');
    
    if (!letterType) {
      return res.status(404).json({ message: 'Letter type not found' });
    }
    
    res.json(letterType);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete letter type (admin only) - soft delete
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const letterType = await LetterType.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!letterType) {
      return res.status(404).json({ message: 'Letter type not found' });
    }
    
    res.json({ message: 'Letter type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
