const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name mobile address')
      .populate('deliveryPartner', 'name mobile location rating');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['placed', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (order.statusHistory) {
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        notes
      });
      await order.save();
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

// Cancel order
router.post('/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      notes: 'Order cancelled by user'
    });

    await order.save();
    res.status(200).json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
});

module.exports = router;
