const User = require('../models/User');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

// Register/Login User
const registerUser = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: 'Name and mobile are required' });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ name, mobile, address });
      await user.save();
      return res.status(201).json({ message: 'User registered successfully', user });
    }

    res.status(200).json({ message: 'User logged in', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('activeOrders completedOrders');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Create Order
const createOrder = async (req, res) => {
  try {
    const { userId, items, description, deliveryLocation } = req.body;

    if (!userId || !items || !deliveryLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = new Order({
      orderNumber: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      user: userId,
      items,
      description,
      deliveryLocation,
      statusHistory: [{
        status: 'placed',
        timestamp: new Date(),
        notes: 'Order placed by user'
      }]
    });

    await order.save();
    user.activeOrders.push(order._id);
    user.totalOrders += 1;
    await user.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate('deliveryPartner', 'name mobile location rating')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get Order Details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'name mobile address')
      .populate('deliveryPartner', 'name mobile location vehicle rating');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Conditionally show contact info
    if (order.contactVisibility.userPhoneVisible === false) {
      if (order.deliveryPartner) {
        order.deliveryPartner.mobile = '****' + order.deliveryPartner.mobile.slice(-4);
      }
    }
    if (order.contactVisibility.dpPhoneVisible === false && order.user) {
      order.user.mobile = '****' + order.user.mobile.slice(-4);
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Rate Delivery Partner
const rateDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { score, review } = req.body;

    if (score < 0 || score > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.rating = { score, review, ratedAt: new Date() };
    await order.save();

    res.status(200).json({ message: 'Rating submitted', order });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating', error: error.message });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  createOrder,
  getUserOrders,
  getOrderDetails,
  rateDelivery
};
