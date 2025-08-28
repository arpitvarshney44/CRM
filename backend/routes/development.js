const express = require('express');
const Development = require('../models/Development');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all development projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Development.find()
      .populate('client', 'name company')
      .populate('assignedTo createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create development project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Development({ ...req.body, createdBy: req.user._id });
    await project.save();
    await project.populate('client assignedTo createdBy', 'name email company');
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update development project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Development.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('client assignedTo createdBy', 'name email company');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete development project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Development.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;