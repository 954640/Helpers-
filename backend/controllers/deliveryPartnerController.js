const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const LiveLocation = require('../models/LiveLocation');

// Register Delivery Partner
const registerDeliveryPartner = async (req, res) => {
  try {
    const { name, mobile, email, vehicleInfo } = req.body;
    const documents = req.files;

    if (!name || !mobile) {
      return res.status(400).json({ message: 'Name and mobile are required' });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const existingPartner = await DeliveryPartner.findOne({ mobile });
    if (existingPartner) {
      return res.status(400).json({ message: 'Delivery partner already registered with this mobile' });
    }

    const partner = new DeliveryPartner({
      name,
      mobile,
      email,
      vehicleInfo,
      documents: {
        aadhar: documents?.aadhar?.[0]?.filename,
        license: documents?.license?.[0]?.filename,
        uploadedAt: new Date()
      }
    });

    await partner.save();
    res.status(201).json({ message: 'Registration submitted for approval', partner });
  } catch (error) {
    res.status(500).json({ message: 'Error registering delivery partner', error: error.message });
  }
};

// Get Pending Orders in Area
const getPendingOrders = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    // Get orders with status 'placed' within radius
    const orders = await Order.find({
      status: 'placed',
      'deliveryLocation.latitude': {
        $gte: latitude - radius,
        $lte: latitude + radius
      },
      'deliveryLocation.longitude': {
        $gte: longitude - radius,
        $lte: longitude + radius
      }
    })
      .populate('user', 'name address')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Accept Order
const acceptOrder = async (req, res) => {
  try {
    const { partnerId, orderId } = req.body;

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner || partner.approval.status !== 'approved') {
      return res.status(400).json({ message: 'Delivery partner not approved' });
    }

    if (partner.activeOrder) {
      return res.status(400).json({ message: 'Delivery partner already has an active order' });
    }

    const order = await Order.findById(orderId);
    if (!order || order.status !== 'placed') {
      return res.status(400).json({ message: 'Order not available' });
    }

    order.deliveryPartner = partnerId;
    order.status = 'accepted';
    order.statusHistory.push({
      status: 'accepted',
      timestamp: new Date(),
      notes: `Accepted by ${partner.name}`
    });
    order.contactVisibility.dpPhoneVisible = true;
    order.contactVisibility.userPhoneVisible = true;
    order.contactVisibility.revealedAt = new Date();
    await order.save();

    partner.activeOrder = orderId;
    await partner.save();

    res.status(200).json({ message: 'Order accepted', order });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting order', error: error.message });
  }
};

// Update Live Location
const updateLiveLocation = async (req, res) => {
  try {
    const { partnerId, orderId, latitude, longitude, accuracy, speed, heading } = req.body;

    const liveLocation = new LiveLocation({
      deliveryPartner: partnerId,
      order: orderId,
      latitude,
      longitude,
      accuracy,
      speed,
      heading
    });

    await liveLocation.save();

    // Update partner's location
    await DeliveryPartner.findByIdAndUpdate(partnerId, {
      'location.latitude': latitude,
      'location.longitude': longitude,
      'location.lastUpdated': new Date()
    });

    res.status(201).json({ message: 'Location updated', liveLocation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// Mark Order as Delivered
const completeDelivery = async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'delivered';
    order.actualDeliveryTime = new Date();
    order.statusHistory.push({
      status: 'delivered',
      timestamp: new Date(),
      notes: 'Order delivered'
    });
    await order.save();

    const partner = await DeliveryPartner.findById(partnerId);
    partner.activeOrder = null;
    partner.completedDeliveries += 1;
    await partner.save();

    res.status(200).json({ message: 'Order marked as delivered', order });
  } catch (error) {
    res.status(500).json({ message: 'Error completing delivery', error: error.message });
  }
};

// Get Partner Profile
const getPartnerProfile = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const partner = await DeliveryPartner.findById(partnerId)
      .select('-documents');

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partner profile', error: error.message });
  }
};

module.exports = {
  registerDeliveryPartner,
  getPendingOrders,
  acceptOrder,
  updateLiveLocation,
  completeDelivery,
  getPartnerProfile
};
