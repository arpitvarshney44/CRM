const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          participants: { $addToSet: { $cond: [{ $eq: ['$sender', req.user._id] }, '$receiver', '$sender'] } },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const populatedConversations = await User.populate(conversations, {
      path: 'participants',
      select: 'name email'
    });

    res.json(populatedConversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for conversation
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).populate('sender receiver', 'name email').sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversationId: req.params.conversationId, receiver: req.user._id },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, message, conversationId } = req.body;
    
    const newMessage = new Message({
      sender: req.user._id,
      receiver,
      message,
      conversationId: conversationId || `${[req.user._id, receiver].sort().join('_')}`
    });

    await newMessage.save();
    await newMessage.populate('sender receiver', 'name email');
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users for messaging
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;