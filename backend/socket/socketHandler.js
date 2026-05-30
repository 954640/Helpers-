const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join user room
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join delivery partner room
    socket.on('join_delivery_partner', (partnerId) => {
      socket.join(`partner_${partnerId}`);
      console.log(`Delivery Partner ${partnerId} joined their room`);
    });

    // Join order room for real-time tracking
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Socket ${socket.id} joined order room: ${orderId}`);
    });

    // Delivery partner sends live location
    socket.on('location_update', (data) => {
      const { orderId, partnerId, latitude, longitude, accuracy, speed } = data;

      // Emit to order room (all users tracking this order)
      io.to(`order_${orderId}`).emit('partner_location_updated', {
        partnerId,
        latitude,
        longitude,
        accuracy,
        speed,
        timestamp: new Date()
      });

      console.log(`Location update for order ${orderId}:`, { latitude, longitude });
    });

    // Order status change
    socket.on('order_status_changed', (data) => {
      const { orderId, status, partnerId } = data;

      // Emit to order room
      io.to(`order_${orderId}`).emit('status_updated', {
        orderId,
        status,
        partnerId,
        timestamp: new Date()
      });

      console.log(`Order ${orderId} status changed to: ${status}`);
    });

    // New order available (broadcast to available delivery partners)
    socket.on('new_order_available', (data) => {
      const { orderId, location, pickupAddress, deliveryAddress } = data;

      // Broadcast to all delivery partners
      io.emit('new_order_notification', {
        orderId,
        location,
        pickupAddress,
        deliveryAddress,
        timestamp: new Date()
      });

      console.log(`New order ${orderId} available`);
    });

    // Chat between user and delivery partner
    socket.on('send_message', (data) => {
      const { orderId, senderId, senderType, message } = data;

      // Emit to order room
      io.to(`order_${orderId}`).emit('receive_message', {
        orderId,
        senderId,
        senderType, // 'user' or 'delivery_partner'
        message,
        timestamp: new Date()
      });

      console.log(`Message in order ${orderId} from ${senderType}: ${message}`);
    });

    // Delivery partner goes online
    socket.on('partner_online', (partnerId) => {
      socket.broadcast.emit('partner_status_changed', {
        partnerId,
        status: 'online',
        timestamp: new Date()
      });

      console.log(`Delivery Partner ${partnerId} is online`);
    });

    // Delivery partner goes offline
    socket.on('partner_offline', (partnerId) => {
      socket.broadcast.emit('partner_status_changed', {
        partnerId,
        status: 'offline',
        timestamp: new Date()
      });

      console.log(`Delivery Partner ${partnerId} is offline`);
    });

    // Order estimated time update
    socket.on('update_estimated_time', (data) => {
      const { orderId, estimatedTime } = data;

      io.to(`order_${orderId}`).emit('estimated_time_updated', {
        orderId,
        estimatedTime,
        timestamp: new Date()
      });

      console.log(`Estimated time for order ${orderId} updated to: ${estimatedTime}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
};
