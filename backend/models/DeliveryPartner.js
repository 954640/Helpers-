const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    lowercase: true
  },
  documents: {
    aadhar: String,
    license: String,
    bankAccount: String,
    uploadedAt: Date
  },
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedAt: Date,
    rejectionReason: String
  },
  location: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  vehicleInfo: {
    type: String,
    description: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  onlineStatus: {
    type: Boolean,
    default: false,
    description: 'Is delivery partner currently accepting orders'
  },
  activeOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  earnings: {
    type: Number,
    default: 0
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifsc: String,
    verified: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

deliveryPartnerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);