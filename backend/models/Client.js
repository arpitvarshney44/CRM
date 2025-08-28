const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  contractValue: { type: Number, default: 0 },
  paymentReceived: { type: Number, default: 0 },
  paymentPending: { type: Number, default: 0 },
  lastPaymentDate: { type: Date },
  nextPaymentDue: { type: Date },
  paymentTerms: { type: String, enum: ['net-15', 'net-30', 'net-60', 'immediate'], default: 'net-30' },
  industry: { type: String },
  website: { type: String },
  taxId: { type: String },
  billingAddress: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);