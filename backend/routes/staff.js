
const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all staff (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const staff = await User.find({})
      .select('-password')
      .sort({ name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//Delete staff by id(admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id=req.params.id
    const staff = await User.findByIdAndDelete({_id:id})
      .select('-password')
      .sort({ name: 1 });
    res.json("Staff member(",staff.name,") deleted succesfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
