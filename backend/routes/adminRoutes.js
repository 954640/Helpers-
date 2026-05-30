const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', adminController.adminLogin);

// Get pending delivery partners
router.get('/partners/pending', adminController.getPendingPartners);

// Approve delivery partner
router.post('/partners/:partnerId/approve', adminController.approvePartner);

// Reject delivery partner
router.post('/partners/:partnerId/reject', adminController.rejectPartner);

// Get all active orders
router.get('/orders/active', adminController.getAllActiveOrders);

// Get dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
