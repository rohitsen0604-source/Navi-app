const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const SOSIncident = require('../models/SOSIncident');
const { BOOKING_STATUS, BOOKING_TYPE, PAYMENT_MODES, PAYMENT_STATUS } = require('../config/constants');
const { findAndAssignDriver } = require('../services/allocationService');
const { calculateRefund, createMockRazorpayOrder } = require('../services/paymentService');
const { emitToAdminOps, broadcastRideLifecycleUpdate } = require('../services/socketService');

// In-memory store when MongoDB is offline
const inMemoryBookings = new Map();

// Seed realistic ride history matching customer journey
const seedBookings = [
  {
    _id: 'b_hist_1',
    bookingCode: 'NV-991201',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MOTOR_BOAT',
    boatName: 'Motor Boat',
    boatNumber: 'UPB-1024',
    boatImage: 'assets/images/boat_motor_fresh.jpg',
    ghatName: 'Dashashwamedh Ghat',
    zoneNumber: 1,
    dateTimeText: '25 Feb 2026 | 02:00 PM',
    passengers: 2,
    passengersText: '2 Passengers | Full Trip (2 hrs)',
    tripDuration: 'Full Trip (2 hrs)',
    fareAmount: 1150,
    driverName: 'Ramesh Yadav',
    driverPhone: '+91 98765 43220',
    boardingPointId: { name: 'Dashashwamedh Ghat' },
    createdAt: new Date('2026-02-25T14:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_2',
    bookingCode: 'NV-700184',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MANUAL_ROW_BOAT',
    boatName: 'Row Boat',
    boatNumber: 'UPB-0412',
    boatImage: 'assets/images/boat_history_fresh.jpg',
    ghatName: 'Assi Ghat',
    zoneNumber: 2,
    dateTimeText: '18 Feb 2026 | 04:00 PM',
    passengers: 3,
    passengersText: '3 Passengers | Half Trip (1 hr)',
    tripDuration: 'Half Trip (1 hr)',
    fareAmount: 700,
    driverName: 'Suresh Manjhi',
    driverPhone: '+91 98765 22114',
    boardingPointId: { name: 'Assi Ghat' },
    createdAt: new Date('2026-02-18T16:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_3',
    bookingCode: 'NV-180010',
    status: 'CANCELLED',
    boatCategory: 'LUXURY_BAJRA',
    boatName: 'Premium Boat',
    boatNumber: 'UPB-0881',
    boatImage: 'assets/images/boat_premium.jpg',
    ghatName: 'Namo Ghat',
    zoneNumber: 3,
    dateTimeText: '10 Feb 2026 | 11:00 AM',
    passengers: 4,
    passengersText: '4 Passengers | Full Trip (2 hrs)',
    tripDuration: 'Full Trip (2 hrs)',
    fareAmount: 1800,
    cancellationReason: 'High river current safety advisory by Water Police',
    refundAmount: 1800,
    refundStatus: 'REFUNDED_TO_SOURCE',
    boardingPointId: { name: 'Namo Ghat' },
    createdAt: new Date('2026-02-10T11:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_4',
    bookingCode: 'NV-600052',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MOTOR_BOAT',
    boatName: 'Motor Boat',
    boatNumber: 'UPB-1099',
    boatImage: 'assets/images/boat_motor_fresh.jpg',
    ghatName: 'Rajghat',
    zoneNumber: 3,
    dateTimeText: '05 Feb 2026 | 03:00 PM',
    passengers: 2,
    passengersText: '2 Passengers | Cross Trip',
    tripDuration: 'Cross Trip (15 mins)',
    fareAmount: 600,
    driverName: 'Vikas Sahani',
    driverPhone: '+91 98765 77665',
    boardingPointId: { name: 'Rajghat' },
    createdAt: new Date('2026-02-05T15:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_5',
    bookingCode: 'NV-150028',
    status: 'DRIVER_ASSIGNED',
    boatCategory: 'EV_BOAT',
    boatName: 'Solar EV Eco Boat',
    boatNumber: 'UPB-0012',
    boatImage: 'assets/images/boat_solar.jpg',
    ghatName: 'Assi Ghat',
    zoneNumber: 2,
    dateTimeText: 'Tomorrow, 28 Feb 2026 | 06:00 AM',
    passengers: 2,
    passengersText: '2 Passengers | Sunrise Tour (2 hrs)',
    tripDuration: 'Full Trip (2 hrs)',
    fareAmount: 1500,
    driverName: 'Anand Kumar',
    driverPhone: '+91 98765 33441',
    boardingPointId: { name: 'Assi Ghat' },
    createdAt: new Date('2026-02-27T10:00:00.000Z').toISOString()
  }
];

seedBookings.forEach(b => inMemoryBookings.set(b._id, b));

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
        boardingPointId: { _id: boardingPointId, name: 'Dashashwamedh Ghat' },
        ghatName: 'Dashashwamedh Ghat',
        boatName: boatCategory === 'MANUAL_ROW_BOAT' ? 'Row Boat' : boatCategory === 'LUXURY_BAJRA' ? 'Premium Boat' : 'Motor Boat',
        boatImage: boatCategory === 'MANUAL_ROW_BOAT' ? 'assets/images/boat_row.jpg' : boatCategory === 'LUXURY_BAJRA' ? 'assets/images/boat_premium.jpg' : 'assets/images/boat_motor.jpg',
        dateTimeText: 'Today | Just Now',
        passengers: seatsBooked || 2,
        passengersText: `${seatsBooked || 2} Passengers | ${tripType === 'HALF_TRIP' ? 'Half Trip (1 hr)' : 'Full Trip (2 hrs)'}`,
        tripDuration: tripType === 'HALF_TRIP' ? 'Half Trip (1 hr)' : 'Full Trip (2 hrs)',
        bookingType,
        tripType: tripType || 'FULL_TRIP',
        boatCategory: boatCategory || 'MOTOR_BOAT',
        seatsBooked: seatsBooked || 2,
        fareAmount,
        finalPayableAmount,
        paymentMode,
        paymentStatus: paymentMode === PAYMENT_MODES.ONLINE_PREPAID ? 'PAID' : 'PENDING',
        status: BOOKING_STATUS.DRIVER_ASSIGNED,
        driverId: {
          _id: 'driver_mock_ramesh',
          name: 'Ramesh Yadav',
          phone: '+91 98765 43220',
          rating: 4.8,
          totalRides: '320+',
          avatar: 'assets/images/driver_avatar.jpg'
        },
        driverName: 'Ramesh Yadav',
        driverPhone: '+91 98765 43220',
        boatId: {
          _id: 'boat_mock_upb1024',
          name: 'Motor Boat',
          customBoatId: 'UPB-1024',
          zoneNumber: 1
        },
        boatNumber: 'UPB-1024',
        chatMessages: [
          { sender: 'DRIVER', text: 'Namaste! Main Dashashwamedh Ghat ki taraf aa raha hoon. 3 minutes me pahunch raha hoon.', timestamp: new Date().toISOString() }
        ],
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

// Customer Ride History with filter support
const getCustomerBookings = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = Array.from(inMemoryBookings.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (status && status !== 'ALL') {
        const sUpper = status.toUpperCase();
        if (sUpper === 'COMPLETED') {
          list = list.filter(b => b.status === 'RIDE_COMPLETED' || b.status === 'COMPLETED');
        } else if (sUpper === 'UPCOMING') {
          list = list.filter(b => ['SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'RIDE_STARTED', 'UPCOMING'].includes(b.status));
        } else if (sUpper === 'CANCELLED') {
          list = list.filter(b => b.status === 'CANCELLED');
        }
      }

      return res.json({ success: true, count: list.length, data: list });
    }

    let filter = { customerId: req.user._id };
    if (status && status !== 'ALL') {
      const sUpper = status.toUpperCase();
      if (sUpper === 'COMPLETED') filter.status = BOOKING_STATUS.RIDE_COMPLETED;
      else if (sUpper === 'UPCOMING') filter.status = { $in: [BOOKING_STATUS.SEARCHING_DRIVER, BOOKING_STATUS.DRIVER_ASSIGNED, BOOKING_STATUS.DRIVER_ARRIVED, BOOKING_STATUS.RIDE_STARTED] };
      else if (sUpper === 'CANCELLED') filter.status = BOOKING_STATUS.CANCELLED;
    }

    const bookings = await Booking.find(filter)
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

// Submit Rating & Review (Screen 11)
const rateRide = async (req, res, next) => {
  try {
    const { rating = 5, review = '', feedbackTags = [] } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id) || { _id: req.params.id };
      mockBooking.rating = rating;
      mockBooking.review = review;
      mockBooking.feedbackTags = feedbackTags;
      mockBooking.status = 'RIDE_COMPLETED';
      inMemoryBookings.set(req.params.id, mockBooking);
      return res.json({
        success: true,
        message: 'Thank you! Feedback recorded successfully.',
        data: mockBooking
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.rating = rating;
    booking.review = review;
    booking.status = BOOKING_STATUS.RIDE_COMPLETED;
    await booking.save();

    res.json({ success: true, message: 'Thank you! Feedback recorded successfully.', data: booking });
  } catch (error) {
    next(error);
  }
};

// Update Ride Lifecycle Status (Simulate or Driver App Action)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id) || { _id: req.params.id };
      mockBooking.status = status;
      inMemoryBookings.set(req.params.id, mockBooking);
      return res.json({ success: true, message: `Status updated to ${status}`, data: mockBooking });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = status;
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// Send Chat Message
const sendChatMessage = async (req, res, next) => {
  try {
    const { text, sender = 'CUSTOMER' } = req.body;
    const msg = { sender, text, timestamp: new Date().toISOString() };

    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id) || { _id: req.params.id, chatMessages: [] };
      mockBooking.chatMessages = mockBooking.chatMessages || [];
      mockBooking.chatMessages.push(msg);
      inMemoryBookings.set(req.params.id, mockBooking);
      return res.json({ success: true, data: msg });
    }

    res.json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

// Get Chat Messages
const getChatMessages = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id);
      return res.json({ success: true, data: mockBooking?.chatMessages || [] });
    }
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

// Get Live Ride Telemetry (Screen 10)
const getLiveTelemetry = async (req, res, next) => {
  try {
    const defaultTelemetry = {
      bookingId: req.params.id,
      status: 'RIDE_STARTED',
      distanceCoveredKm: 1.2,
      timeElapsedMinutes: 28,
      timeRemainingMinutes: 92,
      startedAtText: '02:05 PM, 25 Feb 2026',
      startPoint: { name: 'Assi Ghat', lat: 25.2891, lng: 83.0069 },
      destinationPoint: { name: 'Dashashwamedh Ghat', lat: 25.3072, lng: 83.0105 },
      currentBoatGps: { lat: 25.2985, lng: 83.0091, speedKnots: 5.4, heading: 45 },
      driver: {
        name: 'Ramesh Yadav',
        phone: '+91 98765 43220',
        rating: 4.8,
        avatar: 'assets/images/driver_avatar.jpg'
      },
      boat: {
        name: 'Motor Boat',
        customBoatId: 'UPB-1024',
        zoneNumber: 1,
        passengers: 2,
        durationText: 'Full Trip (2 hrs)',
        image: 'assets/images/live_boat_cruise.jpg'
      }
    };

    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id);
      if (mockBooking) {
        defaultTelemetry.bookingCode = mockBooking.bookingCode;
        defaultTelemetry.status = mockBooking.status || 'RIDE_STARTED';
      }
      return res.json({ success: true, data: defaultTelemetry });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('driverId')
      .populate('boatId')
      .populate('boardingPointId')
      .populate('destinationPointId');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    res.json({ success: true, data: defaultTelemetry });
  } catch (error) {
    next(error);
  }
};

// Complete Trip
const completeTrip = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id) || { _id: req.params.id };
      mockBooking.status = 'RIDE_COMPLETED';
      inMemoryBookings.set(req.params.id, mockBooking);
      return res.json({ success: true, message: 'Trip marked as completed', data: mockBooking });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'RIDE_COMPLETED';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// Generate / Fetch Trip Invoice (Screen 11)
const getInvoice = async (req, res, next) => {
  try {
    const defaultInvoice = {
      invoiceNumber: `INV-NV-${Date.now().toString().slice(-6)}`,
      bookingCode: 'NV-9912',
      date: 'Today, 25 Feb 2026',
      time: '02:00 PM - 04:00 PM',
      boat: {
        name: 'Motor Boat',
        customBoatId: 'UPB-1024',
        zoneNumber: 1
      },
      driver: {
        name: 'Ramesh Yadav',
        phone: '+91 98765 43220'
      },
      passengerCount: 2,
      pickupGhat: 'Assi Ghat',
      destinationGhat: 'Dashashwamedh Ghat',
      fareBreakdown: {
        baseFare: 1200,
        platformFee: 50,
        couponDiscount: 100,
        gstAmount: 0,
        totalPaid: 1150
      },
      paymentStatus: 'PAID',
      paymentMode: 'ONLINE_PREPAID',
      downloadUrl: `/api/bookings/${req.params.id}/invoice.pdf`
    };

    if (mongoose.connection.readyState !== 1) {
      const mockBooking = inMemoryBookings.get(req.params.id);
      if (mockBooking) {
        defaultInvoice.bookingCode = mockBooking.bookingCode || defaultInvoice.bookingCode;
        if (mockBooking.fareAmount) defaultInvoice.fareBreakdown.totalPaid = mockBooking.fareAmount;
      }
      return res.json({ success: true, data: defaultInvoice });
    }

    res.json({ success: true, data: defaultInvoice });
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
  rateRide,
  updateBookingStatus,
  sendChatMessage,
  getChatMessages,
  getLiveTelemetry,
  completeTrip,
  getInvoice
};
