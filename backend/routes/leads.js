const express = require('express');
const Lead = require('../models/Lead');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all leads
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo createdBy', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create lead
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating lead:', req.body);
    console.log('User:', req.user);
    const lead = new Lead({ ...req.body, createdBy: req.user._id });
    await lead.save();
    await lead.populate('assignedTo createdBy', 'name email');
    console.log('Lead created:', lead);
    res.status(201).json(lead);
  } catch (error) {
    console.error('Lead creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo createdBy', 'name email');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;