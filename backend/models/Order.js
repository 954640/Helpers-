const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    default: null
  },
  items: {
    type: String,
    required: true,
    description: 'Text-based list of items/requirements'
  },
  description: {
    type: String,
    description: 'Additional order details'
  },
  deliveryLocation: {
    address: String,
    latitude: Number,
    longitude: Number,
    instructions: String
  },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String
  }],
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  totalAmount: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  rating: {
    score: Number,
    review: String,
    ratedAt: Date
  },
  liveTracking: {
    enabled: Boolean,
    lastLocation: {
      latitude: Number,
      longitude: Number,
      timestamp: Date
    }
  },
  contactVisibility: {
    userPhoneVisible: {
      type: Boolean,
      default: false
    },
    dpPhoneVisible: {
      type: Boolean,
      default: false
    },
    revealedAt: Date
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

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);