const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const SOSIncident = require('../models/SOSIncident');
const { BOOKING_STATUS, BOOKING_TYPE, PAYMENT_MODES, PAYMENT_STATUS } = require('../config/constants');
const { findAndAssignDriver } = require('../services/allocationService');
const { calculateRefund, createMockRazorpayOrder } = require('../services/paymentService');
const { emitToAdminOps, broadcastRideLifecycleUpdate } = require('../services/socketService');

// In-memory store when MongoDB is offline
const inMemoryBookings = new Map();

// Create a new Booking
const createBooking = async (req, res, next) => {
  try {
    const {
      riverLakeId,
      zoneNumber,
      boardingPointId,
      destinationPointId,
      bookingType = BOOKING_TYPE.BOOK_NOW,
      tripType,
      boatCategory,
      seatsBooked,
      fareAmount,
      paymentMode = PAYMENT_MODES.PAY_AFTER_RIDE,
      scheduledTime
    } = req.body;

    const bookingCode = `NV-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
    const finalPayableAmount = fareAmount;

    if (mongoose.connection.readyState !== 1) {
      const mockBooking = {
        _id: `b_${Date.now()}`,
        bookingCode,
        customerId: req.user?._id || 'mock_customer_id',
        zoneNumber: zoneNumber || 1,
        boardingPointId: { _id: boardingPointId, name: 'Assi Ghat' },
        bookingType,
        tripType: tripType || 'FULL_TRIP',
        boatCategory: boatCategory || 'MOTOR_BOAT',
        seatsBooked: seatsBooked || 2,
        fareAmount,
        finalPayableAmount,
        paymentMode,
        paymentStatus: 'PENDING',
        status: BOOKING_STATUS.DRIVER_ASSIGNED,
        driverId: {
          _id: 'driver_mock_1',
          name: 'Ram Manjhi',
          phone: '9876543220',
          rating: 4.9
        },
        boatId: {
          _id: 'boat_mock_1',
          name: 'Ganga Vihar Motor Boat',
          customBoatId: 'BOAT-Z1-001'
        },
        createdAt: new Date().toISOString()
      };
      inMemoryBookings.set(mockBooking._id, mockBooking);

      return res.status(201).json({
        success: true,
        message: 'Booking created (in-memory mode)',
        data: mockBooking
      });
    }

    const booking = await Booking.create({
      bookingCode,
      customerId: req.user._id,
      riverLakeId,
      zoneNumber,
      boardingPointId,
      destinationPointId,
      bookingType,
      tripType,
      boatCategory,
      seatsBooked,
      fareAmount,
      finalPayableAmount,
      paymentMode,
      paymentStatus: paymentMode === PAYMENT_MODES.ONLINE_PREPAID ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PENDING,
      scheduledTime: bookingType === BOOKING_TYPE.BOOK_LATER && scheduledTime ? new Date(scheduledTime) : new Date(),
      status: BOOKING_STATUS.SEARCHING_DRIVER,
      sourceChannel: 'CUSTOMER_APP'
    });

    let paymentOrder = null;
    if (paymentMode === PAYMENT_MODES.ONLINE_PREPAID) {
      paymentOrder = await createMockRazorpayOrder(booking);
    }

    if (bookingType === BOOKING_TYPE.BOOK_NOW) {
      findAndAssignDriver(booking._id).catch(err => {
        console.error('[Allocation Async Error]:', err.message);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
      paymentOrder
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Booking Details
const getBookingById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id) || {
        _id: req.params.id,
        bookingCode: 'NV-982134',
        status: BOOKING_STATUS.DRIVER_ASSIGNED,
        boardingPointId: { name: 'Assi Ghat' },
        driverId: { name: 'Ram Manjhi', phone: '9876543220', rating: 4.9 },
        boatId: { name: 'Ganga Vihar Motor Boat', customBoatId: 'BOAT-Z1-001' }
      };
      return res.json({ success: true, data: mockBooking });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'firstName lastName phone')
      .populate('driverId')
      .populate('boatId')
      .populate('boardingPointId')
      .populate('destinationPointId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// Customer Ride History
const getCustomerBookings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: inMemoryBookings.size, data: Array.from(inMemoryBookings.values()) });
    }

    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('boardingPointId')
      .populate('driverId', 'name phone rating')
      .populate('boatId', 'name category customBoatId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Cancel Booking
const cancelBooking = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, message: 'Booking cancelled (mock mode)' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if ([BOOKING_STATUS.RIDE_STARTED, BOOKING_STATUS.RIDE_COMPLETED, BOOKING_STATUS.CANCELLED].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel booking in ${booking.status} state` });
    }

    const refundCalc = calculateRefund(booking);
    if (!refundCalc.isAllowed) {
      return res.status(400).json({
        success: false,
        message: refundCalc.reason
      });
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by customer';
    booking.refundAmount = refundCalc.refundAmount;
    await booking.save();

    broadcastRideLifecycleUpdate(booking);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      refundDetails: refundCalc,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Trigger SOS
const triggerSOS = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    if (mongoose.connection.readyState !== 1) {
      console.log(`[Emergency SOS Mock Alert] Lat: ${latitude}, Lng: ${longitude}`);
      return res.json({
        success: true,
        message: 'SOS Alert routed to emergency operations team (in-memory mode)'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.sosTriggered = true;
    booking.sosTriggeredAt = new Date();
    await booking.save();

    const incident = await SOSIncident.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      driverId: booking.driverId,
      coordinates: { latitude, longitude },
      status: 'TRIGGERED'
    });

    emitToAdminOps('SOS_EMERGENCY_ALERT', {
      incidentId: incident._id,
      bookingCode: booking.bookingCode,
      customerId: booking.customerId,
      coordinates: { latitude, longitude },
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'SOS Alert triggered and routed to emergency operations team',
      incident
    });
  } catch (error) {
    next(error);
  }
};

// Submit Rating & Review
const rateRide = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, message: 'Feedback recorded successfully' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.rating = rating;
    booking.review = review;
    booking.status = BOOKING_STATUS.RIDE_COMPLETED;
    await booking.save();

    res.json({ success: true, message: 'Feedback recorded successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getCustomerBookings,
  cancelBooking,
  triggerSOS,
  rateRide
};
