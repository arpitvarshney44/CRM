const express = require('express');
const Expense = require('../models/Expense');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all expenses
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const expenses = await Expense.find(filter).populate('createdBy approvedBy', 'name email');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create expense
router.post('/', auth, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, createdBy: req.user._id });
    await expense.save();
    await expense.populate('createdBy', 'name email');
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense (admin only for approval)
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Only creator can edit pending expenses, admin can approve/reject
    if (expense.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Staff can only edit their own expenses if pending
    if (req.user.role === 'staff' && expense.status !== 'pending') {
      return res.status(403).json({ message: 'Cannot edit approved/rejected expenses' });
    }

    if (req.body.status && req.user.role === 'admin') {
      req.body.approvedBy = req.user._id;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('createdBy approvedBy', 'name email');
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;