const mongoose = require('mongoose');

const developmentSchema = new mongoose.Schema({
  developerName: { type: String, required: true },
  email: { type: String },
  projectName: { type: String, required: true },
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Calculate pending amount before saving
developmentSchema.pre('save', function(next) {
  this.pendingAmount = this.totalAmount - this.paidAmount;
  
  // Update payment status based on amounts
  if (this.paidAmount === 0) {
    this.paymentStatus = 'pending';
  } else if (this.paidAmount < this.totalAmount) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'completed';
  }
  
  next();
});

module.exports = mongoose.model('Development', developmentSchema);