const express = require('express');
const router = express.Router();
const deliveryPartnerController = require('../controllers/deliveryPartnerController');

// Register delivery partner
router.post('/register', deliveryPartnerController.registerDeliveryPartner);

// Get pending orders in area
router.get('/orders/pending', deliveryPartnerController.getPendingOrders);

// Accept order
router.post('/orders/accept', deliveryPartnerController.acceptOrder);

// Update live location
router.post('/location/update', deliveryPartnerController.updateLiveLocation);

// Complete delivery
router.post('/orders/complete', deliveryPartnerController.completeDelivery);

// Get partner profile
router.get('/profile/:partnerId', deliveryPartnerController.getPartnerProfile);

module.exports = router;
