const mongoose = require('mongoose');

const liveLocationSchema = new mongoose.Schema({
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  accuracy: Number,
  speed: Number,
  heading: Number,
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

liveLocationSchema.index({ deliveryPartner: 1, timestamp: -1 });
liveLocationSchema.index({ order: 1, timestamp: -1 });

module.exports = mongoose.model('LiveLocation', liveLocationSchema);