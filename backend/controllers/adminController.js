const Admin = require('../models/Admin');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Use environment variables for credentials
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { admin: true, username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: { username }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get Pending Delivery Partners
const getPendingPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ 'approval.status': 'pending' })
      .sort({ createdAt: -1 });

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending partners', error: error.message });
  }
};

// Approve Delivery Partner
const approvePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      {
        'approval.status': 'approved',
        'approval.approvedAt': new Date(),
        isActive: true
      },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({ message: 'Partner approved', partner });
  } catch (error) {
    res.status(500).json({ message: 'Error approving partner', error: error.message });
  }
};

// Reject Delivery Partner
const rejectPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { reason } = req.body;

    const partner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      {
        'approval.status': 'rejected',
        'approval.rejectionReason': reason,
        isActive: false
      },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({ message: 'Partner rejected', partner });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting partner', error: error.message });
  }
};

// Get All Active Orders
const getAllActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['placed', 'accepted', 'out_for_delivery'] }
    })
      .populate('user', 'name mobile address')
      .populate('deliveryPartner', 'name mobile location rating')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      status: { $in: ['placed', 'accepted', 'out_for_delivery'] }
    });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const totalPartners = await DeliveryPartner.countDocuments();
    const approvedPartners = await DeliveryPartner.countDocuments({
      'approval.status': 'approved'
    });
    const pendingPartners = await DeliveryPartner.countDocuments({
      'approval.status': 'pending'
    });

    res.status(200).json({
      orders: {
        total: totalOrders,
        active: activeOrders,
        completed: completedOrders
      },
      partners: {
        total: totalPartners,
        approved: approvedPartners,
        pending: pendingPartners
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = {
  adminLogin,
  getPendingPartners,
  approvePartner,
  rejectPartner,
  getAllActiveOrders,
  getDashboardStats
};
