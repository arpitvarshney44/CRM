const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  jobTitle: { type: String },
  source: { type: String, enum: ['website', 'referral', 'social', 'email', 'cold-call', 'trade-show', 'other'], default: 'other' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'proposal-sent', 'negotiation', 'converted', 'lost'], default: 'new' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  estimatedValue: { type: Number, default: 0 },
  probability: { type: Number, min: 0, max: 100, default: 10 },
  expectedCloseDate: { type: Date },
  lastContactDate: { type: Date },
  nextFollowUp: { type: Date },
  industry: { type: String },
  leadScore: { type: Number, min: 0, max: 100, default: 0 },
  notes: { type: String },
  tags: [{ type: String }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);