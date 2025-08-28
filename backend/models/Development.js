const mongoose = require('mongoose');

const developmentSchema = new mongoose.Schema({
  developerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  projectName: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  hourlyRate: { type: Number },
  hoursWorked: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['bank-transfer', 'paypal', 'cash', 'check'], default: 'bank-transfer' },
  lastPaymentDate: { type: Date },
  nextPaymentDue: { type: Date },
  notes: { type: String },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
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