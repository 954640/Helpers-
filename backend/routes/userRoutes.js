const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User registration/login
router.post('/register', userController.registerUser);

// Get user profile
router.get('/profile/:userId', userController.getUserProfile);

// Create order
router.post('/orders', userController.createOrder);

// Get user's orders
router.get('/:userId/orders', userController.getUserOrders);

// Get order details
router.get('/orders/:orderId', userController.getOrderDetails);

// Rate delivery
router.post('/orders/:orderId/rate', userController.rateDelivery);

module.exports = router;
