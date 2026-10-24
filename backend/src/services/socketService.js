let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Customer Room
    socket.on('join_customer_room', (customerIdOrBookingId) => {
      if (!customerIdOrBookingId) return;
      const idStr = customerIdOrBookingId.toString();
      socket.join(`customer_${idStr}`);
      // Also join booking room if it's a booking ID
      socket.join(`booking_${idStr}`);
      console.log(`[Socket.io] Customer joined rooms: customer_${idStr} & booking_${idStr}`);
    });

    // Specific Booking Room
    socket.on('join_booking_room', (bookingId) => {
      if (!bookingId) return;
      const idStr = bookingId.toString();
      socket.join(`booking_${idStr}`);
      socket.join(`customer_${idStr}`);
      console.log(`[Socket.io] Client joined booking room: booking_${idStr}`);
    });

    // Driver Room & Fleet Room
    socket.on('join_driver_room', (driverId) => {
      if (!driverId) return;
      const idStr = driverId.toString();
      socket.join(`driver_${idStr}`);
      socket.join('drivers_fleet'); // Join general fleet for incoming booking requests
      console.log(`[Socket.io] Driver joined room: driver_${idStr} and drivers_fleet`);
    });

    // Admin Operations Room
    socket.on('join_admin_room', () => {
      socket.join('admin_operations');
      console.log(`[Socket.io] Admin/Ops joined operations room`);
    });

    // Driver Live Telemetry / Location Update
    socket.on('DRIVER_LOCATION_UPDATE', (data) => {
      if (!data) return;
      const { bookingId, latitude, longitude, speed, heading, distanceCoveredKm, timeElapsedMinutes, timeRemainingMinutes } = data;
      const payload = {
        bookingId,
        latitude,
        longitude,
        speed: speed || 8.5,
        heading: heading || 0,
        distanceCoveredKm: distanceCoveredKm || 0.4,
        timeElapsedMinutes: timeElapsedMinutes || 5,
        timeRemainingMinutes: timeRemainingMinutes || 15,
        timestamp: new Date()
      };

      if (bookingId) {
        io.to(`booking_${bookingId.toString()}`).emit('TELEMETRY_UPDATE', payload);
        io.to(`customer_${bookingId.toString()}`).emit('TELEMETRY_UPDATE', payload);
      }
      io.to('admin_operations').emit('TELEMETRY_UPDATE', payload);
    });

    // In-Ride Chat Messaging
    socket.on('SEND_CHAT_MESSAGE', (messageData) => {
      if (!messageData) return;
      const { bookingId, sender, text, senderName } = messageData;
      const chatPayload = {
        bookingId,
        sender: sender || 'USER',
        senderName: senderName || (sender === 'DRIVER' ? 'Captain' : 'Passenger'),
        text,
        timestamp: new Date().toISOString()
      };

      if (bookingId) {
        io.to(`booking_${bookingId.toString()}`).emit('CHAT_MESSAGE', chatPayload);
        io.to(`customer_${bookingId.toString()}`).emit('CHAT_MESSAGE', chatPayload);
      }
      io.to('admin_operations').emit('CHAT_MESSAGE', chatPayload);
    });

    // Direct SOS Alert Trigger
    socket.on('TRIGGER_SOS', (sosData) => {
      console.warn(`[Socket.io SOS ALERT] Emergency triggered:`, sosData);
      io.to('admin_operations').emit('SOS_EMERGENCY_ALERT', {
        ...sosData,
        timestamp: new Date()
      });
      io.emit('SOS_EMERGENCY_ALERT', sosData);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!ioInstance) {
    console.warn('[Socket Warning] IO instance requested before initialization');
  }
  return ioInstance;
};

// Dispatchers
const emitToCustomer = (customerId, event, payload) => {
  if (ioInstance && customerId) {
    ioInstance.to(`customer_${customerId.toString()}`).emit(event, payload);
    ioInstance.to(`booking_${customerId.toString()}`).emit(event, payload);
  }
};

const emitToDriver = (driverId, event, payload) => {
  if (ioInstance && driverId) {
    ioInstance.to(`driver_${driverId.toString()}`).emit(event, payload);
  }
};

const emitToAllDrivers = (event, payload) => {
  if (ioInstance) {
    ioInstance.to('drivers_fleet').emit(event, payload);
    // Also emit globally for any connected drivers in development/testing
    ioInstance.emit(event, payload);
  }
};

const emitToBooking = (bookingId, event, payload) => {
  if (ioInstance && bookingId) {
    ioInstance.to(`booking_${bookingId.toString()}`).emit(event, payload);
    ioInstance.to(`customer_${bookingId.toString()}`).emit(event, payload);
  }
};

const emitToAdminOps = (event, payload) => {
  if (ioInstance) {
    ioInstance.to('admin_operations').emit(event, payload);
    // Also emit event globally so connected admin web clients receive it
    ioInstance.emit(event, payload);
  }
};

/**
 * Single Source of Truth Lifecycle Broadcaster:
 * Broadcasts updates simultaneously to Customer App, Driver App, and Admin Panel
 */
const broadcastRideLifecycleUpdate = (booking) => {
  if (!ioInstance || !booking) return;

  const driverObj = booking.driverId && typeof booking.driverId === 'object' ? booking.driverId : {};
  const boatObj = booking.boatId && typeof booking.boatId === 'object' ? booking.boatId : {};
  const boardingObj = booking.boardingPointId && typeof booking.boardingPointId === 'object' ? booking.boardingPointId : {};

  const payload = {
    bookingId: booking._id ? booking._id.toString() : '',
    bookingCode: booking.bookingCode || '',
    status: booking.status || 'SEARCHING_DRIVER',
    zoneNumber: booking.zoneNumber || 1,
    tripType: booking.tripType || 'FULL_TRIP',
    boatCategory: booking.boatCategory || 'MOTOR_BOAT',
    seatsBooked: booking.seatsBooked || 2,
    fareAmount: booking.finalPayableAmount || booking.fareAmount || 1150,
    paymentStatus: booking.paymentStatus || 'PENDING',
    paymentMode: booking.paymentMode || 'PAY_AFTER_RIDE',
    boardingGhat: boardingObj.name || booking.ghatName || booking.boardingGhat || 'Dashashwamedh Ghat',
    destinationGhat: booking.destinationGhat || 'Assi Ghat',
    // Driver Info
    driverId: driverObj._id ? driverObj._id.toString() : (booking.driverId ? booking.driverId.toString() : 'driver_mock_1'),
    driverName: booking.driverName || driverObj.name || 'Ram Manjhi',
    driverPhone: booking.driverPhone || driverObj.phone || '+91 98765 43220',
    driverRating: booking.driverRating || driverObj.rating || 4.9,
    // Boat Info
    boatId: boatObj._id ? boatObj._id.toString() : (booking.boatId ? booking.boatId.toString() : 'boat_1'),
    boatName: booking.boatName || boatObj.name || 'Ganga Vihar Motor Boat',
    boatNumber: booking.boatNumber || boatObj.customBoatId || boatObj.boatNumber || 'UPB-1024',
    // OTP & Security
    rideOtp: booking.startRideOtp || '4921',
    updatedAt: new Date().toISOString()
  };

  const bookingIdStr = booking._id ? booking._id.toString() : '';

  // 1. Emit to customer rooms
  if (booking.customerId) {
    const custId = booking.customerId._id ? booking.customerId._id.toString() : booking.customerId.toString();
    emitToCustomer(custId, 'BOOKING_UPDATE', payload);
  }
  if (bookingIdStr) {
    emitToBooking(bookingIdStr, 'BOOKING_UPDATE', payload);
  }

  // 2. Emit to driver room
  if (booking.driverId) {
    const drvId = driverObj._id ? driverObj._id.toString() : booking.driverId.toString();
    emitToDriver(drvId, 'BOOKING_UPDATE', payload);
  }

  // 3. Emit to Admin & Ops Console
  emitToAdminOps('BOOKING_UPDATE', payload);

  // 4. Global broadcast ensures 100% interconnected state across all clients
  ioInstance.emit('BOOKING_UPDATE', payload);
  ioInstance.emit('GLOBAL_BOOKING_UPDATE', payload);
};

module.exports = {
  initSocket,
  getIO,
  emitToCustomer,
  emitToDriver,
  emitToAllDrivers,
  emitToBooking,
  emitToAdminOps,
  broadcastRideLifecycleUpdate
};
