let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room based on role & ID
    socket.on('join_customer_room', (customerId) => {
      socket.join(`customer_${customerId}`);
      console.log(`[Socket] Customer joined room: customer_${customerId}`);
    });

    socket.on('join_driver_room', (driverId) => {
      socket.join(`driver_${driverId}`);
      console.log(`[Socket] Driver joined room: driver_${driverId}`);
    });

    socket.on('join_admin_room', () => {
      socket.join('admin_operations');
      console.log(`[Socket] Admin/Ops joined operations room`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!ioInstance) {
    console.warn('[Socket Warning] IO instance requested before initialization');
  }
  return ioInstance;
};

// Real-Time Interconnection Event Dispatchers
const emitToCustomer = (customerId, event, payload) => {
  if (ioInstance) {
    ioInstance.to(`customer_${customerId}`).emit(event, payload);
  }
};

const emitToDriver = (driverId, event, payload) => {
  if (ioInstance) {
    ioInstance.to(`driver_${driverId}`).emit(event, payload);
  }
};

const emitToAdminOps = (event, payload) => {
  if (ioInstance) {
    ioInstance.to('admin_operations').emit(event, payload);
  }
};

const broadcastRideLifecycleUpdate = (booking) => {
  if (!ioInstance) return;
  const payload = {
    bookingId: booking._id,
    bookingCode: booking.bookingCode,
    status: booking.status,
    driverId: booking.driverId,
    boatId: booking.boatId,
    updatedAt: new Date()
  };

  // 95% Interconnection: notify customer, driver and admin simultaneously
  if (booking.customerId) {
    emitToCustomer(booking.customerId.toString(), 'BOOKING_UPDATE', payload);
  }
  if (booking.driverId) {
    emitToDriver(booking.driverId.toString(), 'BOOKING_UPDATE', payload);
  }
  emitToAdminOps('BOOKING_UPDATE', payload);
};

module.exports = {
  initSocket,
  getIO,
  emitToCustomer,
  emitToDriver,
  emitToAdminOps,
  broadcastRideLifecycleUpdate
};
