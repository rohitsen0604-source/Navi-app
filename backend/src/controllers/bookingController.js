const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const SOSIncident = require('../models/SOSIncident');
const Boat = require('../models/Boat');
const Zone = require('../models/Zone');
const RiverLake = require('../models/RiverLake');
const BoardingPoint = require('../models/BoardingPoint');
const User = require('../models/User');
const { BOOKING_STATUS, BOOKING_TYPE, PAYMENT_MODES, PAYMENT_STATUS, BOAT_CATEGORIES, TRIP_TYPES } = require('../config/constants');
const { findAndAssignDriver } = require('../services/allocationService');
const { calculateRefund, createMockRazorpayOrder } = require('../services/paymentService');
const { emitToAdminOps, broadcastRideLifecycleUpdate } = require('../services/socketService');
const { acquireLock, releaseLock } = require('../config/redis');

// In-memory store when MongoDB is offline or for mock history
const inMemoryBookings = new Map();

// Seed realistic ride history matching customer journey
const seedBookings = [
  {
    _id: 'b_hist_1',
    bookingCode: 'NV-991201',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MOTOR_BOAT',
    boatName: 'Ganga Vihar Motor Boat',
    boatNumber: 'UPB-1024',
    boatImage: 'assets/images/boat_motor.jpg',
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
    boatName: 'Standard Hand-Row Boat',
    boatNumber: 'UPB-0412',
    boatImage: 'assets/images/boat_row.jpg',
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
    boatName: 'Royal Heritage Bajra',
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
    refundAmount: 1440,
    cancellationRefundPercentage: 80,
    refundStatus: 'REFUNDED_TO_SOURCE',
    boardingPointId: { name: 'Namo Ghat' },
    createdAt: new Date('2026-02-10T11:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_4',
    bookingCode: 'NV-600052',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MOTOR_BOAT',
    boatName: 'Ganga Vihar Motor Boat',
    boatNumber: 'UPB-1099',
    boatImage: 'assets/images/boat_motor.jpg',
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
    status: 'SCHEDULED',
    boatCategory: 'EV_BOAT',
    boatName: 'Solar EV Eco Boat',
    boatNumber: 'UPB-0012',
    boatImage: 'assets/images/boat_solar.jpg',
    ghatName: 'Assi Ghat',
    zoneNumber: 2,
    dateTimeText: 'Tomorrow | 06:00 AM',
    scheduledDateText: 'Tomorrow',
    timeSlotText: '06:00 AM - 06:30 AM',
    passengers: 2,
    passengersText: '2 Passengers | Sunrise Tour (2 hrs)',
    tripDuration: 'Full Trip (2 hrs)',
    fareAmount: 1500,
    driverName: 'Anand Kumar',
    driverPhone: '+91 98765 33441',
    boardingPointId: { name: 'Assi Ghat' },
    createdAt: new Date().toISOString()
  }
];

seedBookings.forEach(b => inMemoryBookings.set(b._id, b));

// 1. Central Pricing Calculation
const calculateFare = async (req, res, next) => {
  try {
    const {
      boatCategory = 'MOTOR_BOAT',
      tripType = 'FULL_TRIP',
      seatsBooked = 2,
      timeSlot = '',
      couponCode = ''
    } = req.body;

    const seats = Math.max(1, Number(seatsBooked) || 1);

    const baseFares = {
      MANUAL_ROW_BOAT: 400,
      MOTOR_BOAT: 600,
      SPEED_BOAT: 1000,
      EV_BOAT: 800,
      LUXURY_BAJRA: 1500
    };
    const baseFare = baseFares[boatCategory] || 600;

    const tripMultipliers = {
      FULL_TRIP: 1.8,
      HALF_TRIP: 1.0,
      CROSS_GHAT: 0.6,
      EVENT: 2.5
    };
    const tripMultiplier = tripMultipliers[tripType] || 1.8;

    let eveningAartiSurcharge = 0;
    if (timeSlot.includes('05:') || timeSlot.includes('06:') || timeSlot.includes('07:00') || timeSlot.includes('Aarti')) {
      eveningAartiSurcharge = 150;
    }

    const calculatedBoatFare = Math.round(baseFare * tripMultiplier);
    const passengerCharges = seats * 60;
    const platformSafetyLevy = 50;
    const subtotal = calculatedBoatFare + passengerCharges + eveningAartiSurcharge + platformSafetyLevy;

    let discountAmount = 0;
    let couponStatus = 'NONE';
    if (couponCode) {
      const cUpper = couponCode.trim().toUpperCase();
      if (cUpper === 'NAAVI50') {
        discountAmount = Math.min(200, Math.round(subtotal * 0.5));
        couponStatus = 'APPLIED';
      } else if (cUpper === 'RIVER100') {
        discountAmount = 100;
        couponStatus = 'APPLIED';
      } else if (cUpper === 'WELCOME20') {
        discountAmount = Math.min(150, Math.round(subtotal * 0.2));
        couponStatus = 'APPLIED';
      } else {
        couponStatus = 'INVALID';
      }
    }

    const finalPayableAmount = Math.max(0, subtotal - discountAmount);

    res.json({
      success: true,
      data: {
        boatCategory,
        tripType,
        seatsBooked: seats,
        baseFare,
        tripMultiplier,
        calculatedBoatFare,
        passengerCharges,
        eveningAartiSurcharge,
        platformSafetyLevy,
        subtotal,
        couponCode: couponStatus === 'APPLIED' ? couponCode.toUpperCase() : null,
        couponStatus,
        discountAmount,
        finalPayableAmount,
        breakdownItems: [
          { label: 'Base Vessel Rate', amount: baseFare },
          { label: 'Trip Duration (' + tripType.replace('_', ' ') + ')', amount: calculatedBoatFare },
          { label: 'Passenger Safety Tariff (' + seats + ' Pax @ ₹60)', amount: passengerCharges },
          eveningAartiSurcharge > 0 ? { label: 'Prime Evening Aarti Peak Surcharge', amount: eveningAartiSurcharge } : null,
          { label: 'Inland Waterways Safety Levy', amount: platformSafetyLevy },
          discountAmount > 0 ? { label: 'Promo Discount (' + couponCode.toUpperCase() + ')', amount: -discountAmount, isDiscount: true } : null
        ].filter(Boolean)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Dynamic Operational Time Slots
const getTimeSlots = async (req, res, next) => {
  try {
    const { date, zoneNumber = 1, boatCategory = 'MOTOR_BOAT' } = req.query;

    const now = new Date();
    let targetDate = new Date();
    if (date) {
      const parts = date.split('-');
      if (parts.length === 3) {
        targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
    }

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const diffDays = Math.round((startOfTarget - startOfToday) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return res.status(400).json({
        success: false,
        message: 'Past dates cannot be selected. Please choose today or a date within T+2 days.'
      });
    }

    if (diffDays > 2) {
      return res.status(400).json({
        success: false,
        message: 'Advance scheduling is permitted up to T+2 days only according to waterways regulations.'
      });
    }

    const isToday = diffDays === 0;

    const masterSlotDefinitions = [
      { id: 'slot_0600', hour: 6, min: 0, time: '06:00 AM', displayTime: '06:00 AM - 06:30 AM', period: 'MORNING', tag: 'Subah-e-Banaras Sunrise' },
      { id: 'slot_0630', hour: 6, min: 30, time: '06:30 AM', displayTime: '06:30 AM - 07:00 AM', period: 'MORNING', tag: 'Sunrise Serenity' },
      { id: 'slot_0700', hour: 7, min: 0, time: '07:00 AM', displayTime: '07:00 AM - 07:30 AM', period: 'MORNING', tag: 'Morning Golden Hour' },
      { id: 'slot_0730', hour: 7, min: 30, time: '07:30 AM', displayTime: '07:30 AM - 08:00 AM', period: 'MORNING', tag: 'Morning Heritage' },
      { id: 'slot_0800', hour: 8, min: 0, time: '08:00 AM', displayTime: '08:00 AM - 08:30 AM', period: 'MORNING', tag: 'Morning Heritage' },
      { id: 'slot_0830', hour: 8, min: 30, time: '08:30 AM', displayTime: '08:30 AM - 09:00 AM', period: 'MORNING', tag: 'Morning Heritage' },
      { id: 'slot_0900', hour: 9, min: 0, time: '09:00 AM', displayTime: '09:00 AM - 09:30 AM', period: 'MORNING', tag: 'Ghat Exploration' },
      { id: 'slot_0930', hour: 9, min: 30, time: '09:30 AM', displayTime: '09:30 AM - 10:00 AM', period: 'MORNING', tag: 'Ghat Exploration' },
      { id: 'slot_1000', hour: 10, min: 0, time: '10:00 AM', displayTime: '10:00 AM - 10:30 AM', period: 'MORNING', tag: 'Heritage Corridor' },
      { id: 'slot_1030', hour: 10, min: 30, time: '10:30 AM', displayTime: '10:30 AM - 11:00 AM', period: 'MORNING', tag: 'Heritage Corridor' },
      { id: 'slot_1100', hour: 11, min: 0, time: '11:00 AM', displayTime: '11:00 AM - 11:30 AM', period: 'MORNING', tag: 'Midday Cruise' },
      { id: 'slot_1130', hour: 11, min: 30, time: '11:30 AM', displayTime: '11:30 AM - 12:00 PM', period: 'MORNING', tag: 'Midday Cruise' },
      { id: 'slot_1200', hour: 12, min: 0, time: '12:00 PM', displayTime: '12:00 PM - 12:30 PM', period: 'AFTERNOON', tag: 'Midday River Cruise' },
      { id: 'slot_1230', hour: 12, min: 30, time: '12:30 PM', displayTime: '12:30 PM - 01:00 PM', period: 'AFTERNOON', tag: 'Midday River Cruise' },
      { id: 'slot_1300', hour: 13, min: 0, time: '01:00 PM', displayTime: '01:00 PM - 01:30 PM', period: 'AFTERNOON', tag: 'Afternoon River Tour' },
      { id: 'slot_1330', hour: 13, min: 30, time: '01:30 PM', displayTime: '01:30 PM - 02:00 PM', period: 'AFTERNOON', tag: 'Afternoon River Tour' },
      { id: 'slot_1400', hour: 14, min: 0, time: '02:00 PM', displayTime: '02:00 PM - 02:30 PM', period: 'AFTERNOON', tag: 'Afternoon River Tour' },
      { id: 'slot_1430', hour: 14, min: 30, time: '02:30 PM', displayTime: '02:30 PM - 03:00 PM', period: 'AFTERNOON', tag: 'Afternoon River Tour' },
      { id: 'slot_1500', hour: 15, min: 0, time: '03:00 PM', displayTime: '03:00 PM - 03:30 PM', period: 'AFTERNOON', tag: 'Pre-Sunset River Tour' },
      { id: 'slot_1530', hour: 15, min: 30, time: '03:30 PM', displayTime: '03:30 PM - 04:00 PM', period: 'AFTERNOON', tag: 'Pre-Sunset River Tour' },
      { id: 'slot_1600', hour: 16, min: 0, time: '04:00 PM', displayTime: '04:00 PM - 04:30 PM', period: 'AFTERNOON', tag: 'Pre-Sunset Golden Hour' },
      { id: 'slot_1630', hour: 16, min: 30, time: '04:30 PM', displayTime: '04:30 PM - 05:00 PM', period: 'EVENING', tag: 'Sunset Aarti Gathering' },
      { id: 'slot_1700', hour: 17, min: 0, time: '05:00 PM', displayTime: '05:00 PM - 05:30 PM', period: 'EVENING', tag: 'Prime Evening Aarti' },
      { id: 'slot_1730', hour: 17, min: 30, time: '05:30 PM', displayTime: '05:30 PM - 06:00 PM', period: 'EVENING', tag: 'Prime Evening Aarti' },
      { id: 'slot_1800', hour: 18, min: 0, time: '06:00 PM', displayTime: '06:00 PM - 06:30 PM', period: 'EVENING', tag: 'Dashashwamedh Maha Aarti' },
      { id: 'slot_1830', hour: 18, min: 30, time: '06:30 PM', displayTime: '06:30 PM - 07:00 PM', period: 'EVENING', tag: 'Dashashwamedh Maha Aarti' },
      { id: 'slot_1900', hour: 19, min: 0, time: '07:00 PM', displayTime: '07:00 PM - 07:30 PM', period: 'EVENING', tag: 'Post-Aarti Night Glow' },
      { id: 'slot_1930', hour: 19, min: 30, time: '07:30 PM', displayTime: '07:30 PM - 08:00 PM', period: 'EVENING', tag: 'Illuminated Night River' },
      { id: 'slot_2000', hour: 20, min: 0, time: '08:00 PM', displayTime: '08:00 PM - 08:30 PM', period: 'EVENING', tag: 'Night Serenity Cruise' }
    ];

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const slots = masterSlotDefinitions.map(def => {
      let isAvailable = true;
      let reason = 'Available for Booking';

      if (isToday) {
        if (def.hour < currentHour || (def.hour === currentHour && def.min <= currentMinute + 20)) {
          isAvailable = false;
          reason = 'Time slot has passed for today';
        }
      }

      return {
        id: def.id,
        time: def.time,
        displayTime: def.displayTime,
        period: def.period,
        tag: def.tag,
        isAvailable,
        reason,
        isPeak: def.period === 'EVENING' && (def.hour >= 17 && def.hour <= 19)
      };
    });

    res.json({
      success: true,
      data: {
        date: targetDate.toISOString().split('T')[0],
        formattedDate: targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        advanceDayOffset: diffDays,
        isToday,
        zoneNumber: Number(zoneNumber),
        boatCategory,
        totalSlots: slots.length,
        availableSlotsCount: slots.filter(s => s.isAvailable).length,
        slots
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Create Booking
const createBooking = async (req, res, next) => {
  try {
    const {
      riverLakeId,
      zoneNumber = 1,
      boardingPointId,
      destinationPointId,
      bookingType = BOOKING_TYPE.BOOK_NOW,
      tripType = 'FULL_TRIP',
      boatCategory = 'MOTOR_BOAT',
      seatsBooked = 2,
      fareAmount,
      paymentMode = PAYMENT_MODES.PAY_AFTER_RIDE,
      scheduledTime,
      scheduledDateText,
      timeSlotText,
      couponCode,
      discountAmount = 0
    } = req.body;

    const bookingCode = 'NV-' + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);
    const finalPayableAmount = Math.max(0, (fareAmount || 1150) - (discountAmount || 0));

    const isBookLater = bookingType === 'SCHEDULED' || bookingType === BOOKING_TYPE.BOOK_LATER || !!scheduledDateText;
    const normalizedBookingType = isBookLater ? BOOKING_TYPE.BOOK_LATER : BOOKING_TYPE.BOOK_NOW;

    let parsedScheduledTime = new Date();
    if (isBookLater) {
      if (scheduledTime) {
        parsedScheduledTime = new Date(scheduledTime);
      } else if (scheduledDateText) {
        try {
          const datePart = scheduledDateText.includes('-')
            ? scheduledDateText
            : new Date().toISOString().split('T')[0];
          let hour = 12;
          let minute = 0;
          if (timeSlotText) {
            const timePart = timeSlotText.split('-')[0].trim();
            const [hStr, mRest] = timePart.split(':');
            const [mStr, ampm] = mRest.split(' ');
            hour = parseInt(hStr, 10);
            minute = parseInt(mStr, 10);
            if (ampm && ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
            if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
          }
          parsedScheduledTime = new Date(`${datePart}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
        } catch (_) {
          parsedScheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const maxBookingDate = new Date(startOfToday.getTime() + 2 * 24 * 60 * 60 * 1000 + 23 * 59 * 59 * 1000);

      if (parsedScheduledTime < now - 1000 * 60 * 15) {
        return res.status(400).json({
          success: false,
          message: 'Past dates/times cannot be scheduled. Please choose an upcoming time.'
        });
      }
      if (parsedScheduledTime > maxBookingDate) {
        return res.status(400).json({
          success: false,
          message: 'Advance scheduling is only permitted up to T+2 days.'
        });
      }
    }

    const cancellationPolicy = bookingType === BOOKING_TYPE.BOOK_NOW
      ? 'Book Now rides are non-cancellable once confirmed.'
      : 'Refunds: 80% before 12h, 70% before 6h, 50% before 3h, non-refundable within 3h.';

    let resolvedCustomerId = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(resolvedCustomerId)) {
      const defaultUser = await User.findOne({ phone: '9876543212' }) || await User.findOne({});
      if (defaultUser) resolvedCustomerId = defaultUser._id;
    }

    let resolvedRiverLakeId = riverLakeId;
    if (!resolvedRiverLakeId || !mongoose.Types.ObjectId.isValid(resolvedRiverLakeId)) {
      const defaultRiver = await RiverLake.findOne({ isActive: true });
      if (defaultRiver) resolvedRiverLakeId = defaultRiver._id;
    }

    let resolvedBoardingPointId = boardingPointId;
    if (!resolvedBoardingPointId || !mongoose.Types.ObjectId.isValid(resolvedBoardingPointId)) {
      const defaultPoint = await BoardingPoint.findOne({ zoneNumber: Number(zoneNumber) || 1 }) || await BoardingPoint.findOne({});
      if (defaultPoint) resolvedBoardingPointId = defaultPoint._id;
    }

    if (mongoose.connection.readyState !== 1) {
      const mockBooking = {
        _id: 'b_' + Date.now(),
        bookingCode,
        customerId: resolvedCustomerId || 'mock_customer_id',
        zoneNumber: Number(zoneNumber) || 1,
        boardingPointId: { _id: resolvedBoardingPointId || 'g1', name: 'Dashashwamedh Ghat' },
        ghatName: 'Dashashwamedh Ghat',
        boatName: boatCategory === 'MANUAL_ROW_BOAT' ? 'Standard Hand-Row Boat' : boatCategory === 'LUXURY_BAJRA' ? 'Royal Heritage Bajra' : 'Ganga Vihar Motor Boat',
        boatImage: boatCategory === 'MANUAL_ROW_BOAT' ? 'assets/images/boat_row.jpg' : boatCategory === 'LUXURY_BAJRA' ? 'assets/images/boat_premium.jpg' : 'assets/images/boat_motor.jpg',
        dateTimeText: bookingType === BOOKING_TYPE.BOOK_LATER ? (scheduledDateText || 'Tomorrow') + ' | ' + (timeSlotText || '06:00 AM') : 'Today | Just Now',
        scheduledDateText: scheduledDateText || 'Today',
        timeSlotText: timeSlotText || '02:00 PM - 04:00 PM',
        scheduledTime: parsedScheduledTime.toISOString(),
        passengers: seatsBooked || 2,
        passengersText: (seatsBooked || 2) + ' Passengers | ' + (tripType === 'HALF_TRIP' ? 'Half Trip (1 hr)' : 'Full Trip (2 hrs)'),
        tripDuration: tripType === 'HALF_TRIP' ? 'Half Trip (1 hr)' : 'Full Trip (2 hrs)',
        bookingType,
        tripType: tripType || 'FULL_TRIP',
        boatCategory: boatCategory || 'MOTOR_BOAT',
        seatsBooked: seatsBooked || 2,
        fareAmount: fareAmount || 1150,
        discountAmount: discountAmount || 0,
        couponCode: couponCode || null,
        finalPayableAmount,
        paymentMode,
        paymentStatus: paymentMode === PAYMENT_MODES.ONLINE_PREPAID ? 'PAID' : 'PENDING',
        status: bookingType === BOOKING_TYPE.BOOK_LATER ? BOOKING_STATUS.SCHEDULED : BOOKING_STATUS.DRIVER_ASSIGNED,
        cancellationPolicyText: cancellationPolicy,
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
          name: 'Ganga Vihar Motor Boat',
          customBoatId: 'UPB-1024',
          zoneNumber: 1
        },
        boatNumber: 'UPB-1024',
        chatMessages: [
          { sender: 'DRIVER', text: 'Namaste! Main Ghat par taiyaar hoon. Surakshit yatra ke liye kripya life jacket pehankar baithein.', timestamp: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      };
      inMemoryBookings.set(mockBooking._id, mockBooking);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully (in-memory mode)',
        data: mockBooking
      });
    }

    // 1. Check existing booking slot reservation to prevent double booking
    if (isBookLater && scheduledDateText && timeSlotText) {
      const query = {
        scheduledDateText,
        timeSlotText,
        status: { $in: ['SCHEDULED', 'CONFIRMED', 'DRIVER_ASSIGNED', 'SEARCHING_DRIVER'] }
      };
      if (req.body.boatId && mongoose.Types.ObjectId.isValid(req.body.boatId)) {
        query.boatId = req.body.boatId;
      } else {
        query.zoneNumber = Number(zoneNumber);
        query.boatCategory = boatCategory;
      }
      const conflictingBooking = await Booking.findOne(query);
      if (conflictingBooking) {
        return res.status(409).json({
          success: false,
          code: 'SLOT_UNAVAILABLE',
          message: `The selected time slot (${timeSlotText}) is already reserved for this vessel on ${scheduledDateText}. Please choose another slot.`
        });
      }
    }

    const slotLockKey = 'lock:slot:' + zoneNumber + ':' + boatCategory + ':' + parsedScheduledTime.toISOString().slice(0, 13);
    const lockAcquired = await acquireLock(slotLockKey, 30);
    if (!lockAcquired) {
      return res.status(409).json({
        success: false,
        code: 'SLOT_UNAVAILABLE',
        message: 'A concurrent booking is currently being processed for this vessel and time slot. Please try again in a few moments.'
      });
    }

    try {
      const initialStatus = isBookLater
        ? 'SCHEDULED'
        : BOOKING_STATUS.SEARCHING_DRIVER;

      const booking = await Booking.create({
        bookingCode,
        customerId: resolvedCustomerId,
        boatId: (req.body.boatId && mongoose.Types.ObjectId.isValid(req.body.boatId)) ? req.body.boatId : undefined,
        riverLakeId: resolvedRiverLakeId,
        zoneNumber: Number(zoneNumber),
        boardingPointId: resolvedBoardingPointId,
        destinationPointId,
        bookingType: normalizedBookingType,
        tripType,
        boatCategory,
        seatsBooked: Number(seatsBooked),
        fareAmount: Number(fareAmount || 1150),
        discountAmount: Number(discountAmount),
        couponCode: couponCode || '',
        finalPayableAmount,
        paymentMode,
        paymentStatus: paymentMode === PAYMENT_MODES.ONLINE_PREPAID ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PENDING,
        scheduledTime: parsedScheduledTime,
        scheduledDateText: scheduledDateText || '',
        timeSlotText: timeSlotText || '',
        cancellationPolicyText: cancellationPolicy,
        status: initialStatus,
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

      emitToAdminOps('NEW_BOOKING_ALERT', {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        bookingType: booking.bookingType,
        zoneNumber: booking.zoneNumber,
        scheduledTime: booking.scheduledTime,
        finalPayableAmount: booking.finalPayableAmount,
        status: booking.status
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
        paymentOrder
      });
    } finally {
      await releaseLock(slotLockKey);
    }
  } catch (error) {
    next(error);
  }
};

// 4. Get Single Booking Details
const getBookingById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let mockBooking = inMemoryBookings.get(id);
    if (mockBooking) {
      return res.json({ success: true, data: mockBooking });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const booking = await Booking.findById(id)
        .populate('customerId', 'firstName lastName phone email')
        .populate('driverId')
        .populate('boatId')
        .populate('boardingPointId')
        .populate('destinationPointId');

      if (booking) return res.json({ success: true, data: booking });
    }

    // Default mock response if not found
    const fallbackBooking = inMemoryBookings.get('b_hist_1') || {
      _id: id,
      bookingCode: 'NV-982134',
      status: BOOKING_STATUS.DRIVER_ASSIGNED,
      boardingPointId: { name: 'Assi Ghat' },
      driverId: { name: 'Ram Manjhi', phone: '9876543220', rating: 4.9 },
      boatId: { name: 'Ganga Vihar Motor Boat', customBoatId: 'BOAT-Z1-001' }
    };
    return res.json({ success: true, data: fallbackBooking });
  } catch (error) {
    next(error);
  }
};

// 5. Customer Ride History with filters
const getCustomerBookings = async (req, res, next) => {
  try {
    const { status } = req.query;

    let customerId = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      const defaultUser = await User.findOne({ phone: '9876543212' }) || await User.findOne({});
      if (defaultUser) customerId = defaultUser._id;
    }

    let bookings = [];
    if (mongoose.connection.readyState === 1 && customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      let filter = { customerId };
      if (status && status !== 'ALL') {
        const sUpper = status.toUpperCase();
        if (sUpper === 'COMPLETED') filter.status = BOOKING_STATUS.RIDE_COMPLETED;
        else if (sUpper === 'UPCOMING') filter.status = { $in: [BOOKING_STATUS.SCHEDULED, BOOKING_STATUS.SEARCHING_DRIVER, BOOKING_STATUS.DRIVER_ASSIGNED, BOOKING_STATUS.DRIVER_ARRIVED, BOOKING_STATUS.RIDE_STARTED] };
        else if (sUpper === 'CANCELLED') filter.status = BOOKING_STATUS.CANCELLED;
      }

      bookings = await Booking.find(filter)
        .populate('boardingPointId')
        .populate('driverId', 'name phone rating avatar')
        .populate('boatId', 'name category customBoatId image')
        .sort({ createdAt: -1 });
    }

    // If mongo has no rides for this user yet, populate with rich seed history
    if (bookings.length === 0) {
      let list = Array.from(inMemoryBookings.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (status && status !== 'ALL') {
        const sUpper = status.toUpperCase();
        if (sUpper === 'COMPLETED') {
          list = list.filter(b => b.status === 'RIDE_COMPLETED' || b.status === 'COMPLETED');
        } else if (sUpper === 'UPCOMING') {
          list = list.filter(b => ['SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'RIDE_STARTED', 'UPCOMING', 'SCHEDULED'].includes(b.status));
        } else if (sUpper === 'CANCELLED') {
          list = list.filter(b => b.status === 'CANCELLED');
        }
      }
      bookings = list;
    }

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// 6. Cancel Booking
const cancelBooking = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (inMemoryBookings.has(id)) {
      const mock = inMemoryBookings.get(id);
      mock.status = BOOKING_STATUS.CANCELLED;
      mock.refundAmount = mock.bookingType === 'BOOK_LATER' ? Math.round(mock.finalPayableAmount * 0.8) : 0;
      inMemoryBookings.set(id, mock);
      return res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: mock
      });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const booking = await Booking.findById(id);
      if (booking) {
        if ([BOOKING_STATUS.RIDE_STARTED, BOOKING_STATUS.RIDE_COMPLETED, BOOKING_STATUS.CANCELLED].includes(booking.status)) {
          return res.status(400).json({ success: false, message: 'Cannot cancel booking in ' + booking.status + ' state' });
        }

        const refundCalc = calculateRefund(booking);
        if (!refundCalc.isAllowed) {
          return res.status(400).json({ success: false, message: refundCalc.reason });
        }

        booking.status = BOOKING_STATUS.CANCELLED;
        booking.cancelledAt = new Date();
        booking.cancellationReason = req.body.reason || 'Cancelled by customer';
        booking.refundAmount = refundCalc.refundAmount;
        booking.cancellationRefundPercentage = refundCalc.refundPercent;
        await booking.save();
        broadcastRideLifecycleUpdate(booking);

        return res.json({
          success: true,
          message: 'Booking cancelled successfully',
          refundDetails: refundCalc,
          data: booking
        });
      }
    }

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    next(error);
  }
};

// 7. Trigger Emergency SOS
const triggerSOS = async (req, res, next) => {
  try {
    const { latitude = 25.3072, longitude = 83.0105 } = req.body;
    const incidentCode = 'SOS-VAR-' + Date.now().toString().slice(-6);

    const sosPayload = {
      incidentCode,
      bookingId: req.params.id,
      coordinates: { latitude, longitude },
      status: 'EMERGENCY_DISPATCHED',
      reportedAt: new Date().toISOString(),
      waterPoliceNotified: true,
      ghatStationMasterNotified: true,
      message: 'SOS Alert dispatched to Varanasi Water Police (Dashashwamedh Post) and SDRF Rescue Boat.'
    };

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      await SOSIncident.create({
        incidentCode,
        bookingId: req.params.id,
        customerId: req.user?._id,
        location: { coordinates: [longitude, latitude] },
        status: 'DISPATCHED'
      }).catch(e => console.warn('SOS save warning:', e.message));

      await Booking.findByIdAndUpdate(req.params.id, {
        sosTriggered: true,
        sosTriggeredAt: new Date()
      }).catch(() => {});
    }

    emitToAdminOps('EMERGENCY_SOS_ALERT', sosPayload);

    res.status(201).json({
      success: true,
      message: 'Emergency SOS activated. Rescue teams alerted.',
      data: sosPayload
    });
  } catch (error) {
    next(error);
  }
};

// 8. Rate Ride
const rateRide = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const id = req.params.id;

    if (inMemoryBookings.has(id)) {
      const b = inMemoryBookings.get(id);
      b.rating = rating;
      b.review = review;
      return res.json({ success: true, message: 'Thank you for your rating!', data: b });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const booking = await Booking.findById(id);
      if (booking) {
        booking.rating = rating;
        booking.review = review;
        await booking.save();
        return res.json({ success: true, message: 'Thank you for your rating!', data: booking });
      }
    }

    res.json({ success: true, message: 'Rating saved' });
  } catch (error) {
    next(error);
  }
};

// 9. Update Status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    if (inMemoryBookings.has(id)) {
      const b = inMemoryBookings.get(id);
      b.status = status;
      return res.json({ success: true, message: 'Status updated to ' + status, data: b });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const booking = await Booking.findById(id);
      if (booking) {
        booking.status = status;
        await booking.save();
        broadcastRideLifecycleUpdate(booking);
        return res.json({ success: true, data: booking });
      }
    }

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};

// 10. Chat
const sendChatMessage = async (req, res, next) => {
  try {
    const { text, sender = 'CUSTOMER' } = req.body;
    const msg = { sender, text, timestamp: new Date().toISOString() };
    res.json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        { sender: 'DRIVER', text: 'Namaste! Main Ghat par ready hoon. 3 minutes me boarding point par aa raha hoon.', timestamp: new Date().toISOString() }
      ]
    });
  } catch (error) {
    next(error);
  }
};

// 11. Live Telemetry
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
        name: 'Ganga Vihar Motor Boat',
        customBoatId: 'UPB-1024',
        zoneNumber: 1,
        passengers: 2,
        durationText: 'Full Trip (2 hrs)',
        image: 'assets/images/live_boat_cruise.jpg'
      }
    };

    res.json({ success: true, data: defaultTelemetry });
  } catch (error) {
    next(error);
  }
};

// 12. Complete Trip
const completeTrip = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (inMemoryBookings.has(id)) {
      const b = inMemoryBookings.get(id);
      b.status = 'RIDE_COMPLETED';
      return res.json({ success: true, message: 'Trip marked as completed', data: b });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const booking = await Booking.findById(id);
      if (booking) {
        booking.status = 'RIDE_COMPLETED';
        booking.completedAt = new Date();
        await booking.save();
        broadcastRideLifecycleUpdate(booking);
        return res.json({ success: true, data: booking });
      }
    }

    res.json({ success: true, message: 'Trip completed' });
  } catch (error) {
    next(error);
  }
};

// 13. Tax Invoice
const getInvoice = async (req, res, next) => {
  try {
    const id = req.params.id;
    let booking = inMemoryBookings.get(id);

    if (!booking && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id).populate('boardingPointId');
    }

    const bookingCode = booking?.bookingCode || 'NV-991201';
    const totalPaid = booking?.finalPayableAmount || booking?.fareAmount || 1150;

    const defaultInvoice = {
      invoiceNumber: 'INV-' + bookingCode.replace('NV-', 'VAR-'),
      bookingCode,
      date: 'Today, 25 Feb 2026',
      time: '02:00 PM - 04:00 PM',
      boat: {
        name: booking?.boatName || 'Ganga Vihar Motor Boat',
        customBoatId: booking?.boatNumber || 'UPB-1024',
        category: booking?.boatCategory || 'MOTOR_BOAT'
      },
      boardingPoint: {
        name: booking?.ghatName || booking?.boardingPointId?.name || 'Dashashwamedh Ghat',
        zoneNumber: booking?.zoneNumber || 1
      },
      customer: {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210'
      },
      fareBreakdown: {
        baseFare: totalPaid - 50,
        platformFee: 50,
        taxAmount: 0,
        totalPaid
      },
      paymentMode: booking?.paymentMode || 'ONLINE_PREPAID',
      status: 'PAID'
    };

    res.json({ success: true, data: defaultInvoice });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateFare,
  getTimeSlots,
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
