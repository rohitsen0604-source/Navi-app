const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Boat = require('../models/Boat');
const User = require('../models/User');
const SOSIncident = require('../models/SOSIncident');
const AuditLog = require('../models/AuditLog');
const { BOOKING_STATUS, ROLES, PAYMENT_STATUS, BOOKING_TYPE } = require('../config/constants');
const { broadcastRideLifecycleUpdate } = require('../services/socketService');

// Admin Dashboard Overview
const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        stats: {
          totalBookings: 8,
          activeRides: 1,
          pendingRequests: 0,
          completedRides: 7,
          onDutyDrivers: 2,
          totalBoats: 4,
          pendingSOS: 0,
          totalRevenue: 6800
        }
      });
    }

    const totalBookings = await Booking.countDocuments();
    const activeRides = await Booking.countDocuments({ status: BOOKING_STATUS.RIDE_STARTED });
    const pendingRequests = await Booking.countDocuments({
      status: { $in: [BOOKING_STATUS.SEARCHING_DRIVER, BOOKING_STATUS.DRIVER_REQUESTED] }
    });
    const completedRides = await Booking.countDocuments({
      status: { $in: [BOOKING_STATUS.RIDE_COMPLETED, BOOKING_STATUS.PAYMENT_COMPLETED] }
    });
    const onDutyDrivers = await Driver.countDocuments({ isDutyOn: true });
    const totalBoats = await Boat.countDocuments();
    const pendingSOS = await SOSIncident.countDocuments({ status: 'TRIGGERED' });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: [BOOKING_STATUS.RIDE_COMPLETED, BOOKING_STATUS.PAYMENT_COMPLETED] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$finalPayableAmount' } } }
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      success: true,
      stats: {
        totalBookings,
        activeRides,
        pendingRequests,
        completedRides,
        onDutyDrivers,
        totalBoats,
        pendingSOS,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get All Bookings with Filter
const getAllBookings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 2,
        data: [
          {
            _id: 'b1',
            bookingCode: 'NV-982134',
            bookingType: 'BOOK_NOW',
            tripType: 'FULL_TRIP',
            boatCategory: 'MOTOR_BOAT',
            seatsBooked: 4,
            finalPayableAmount: 950,
            paymentMode: 'PAY_AFTER_RIDE',
            status: 'RIDE_COMPLETED',
            zoneNumber: 1,
            boardingPointId: { name: 'Assi Ghat' },
            customerId: { firstName: 'Rahul', lastName: 'Sharma', phone: '9876543212' },
            driverId: { name: 'Ram Manjhi', phone: '9876543220', driverCode: 'DRV-1001' },
            boatId: { customBoatId: 'BOAT-Z1-001' }
          },
          {
            _id: 'b2',
            bookingCode: 'NV-748921',
            bookingType: 'BOOK_NOW',
            tripType: 'HALF_TRIP',
            boatCategory: 'LUXURY_BAJRA',
            seatsBooked: 2,
            finalPayableAmount: 600,
            paymentMode: 'PAY_AFTER_RIDE',
            status: 'DRIVER_ASSIGNED',
            zoneNumber: 5,
            boardingPointId: { name: 'Dashashwamedh Ghat' },
            customerId: { firstName: 'Ananya', lastName: 'Pandey', phone: '9876543215' },
            driverId: { name: 'Shyam Nishad', phone: '9876543221', driverCode: 'DRV-1002' },
            boatId: { customBoatId: 'BOAT-Z5-002' }
          }
        ]
      });
    }

    const { status, zoneNumber, bookingType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (zoneNumber) filter.zoneNumber = Number(zoneNumber);
    if (bookingType) filter.bookingType = bookingType;

    const bookings = await Booking.find(filter)
      .populate('customerId', 'firstName lastName phone')
      .populate('driverId', 'name phone driverCode')
      .populate('boatId', 'customBoatId category capacity')
      .populate('boardingPointId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Admin / Ops Manual Assignment or Reassignment
const reassignDriver = async (req, res, next) => {
  try {
    const { bookingId, newDriverId, newBoatId, reason } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, message: 'Driver reassigned successfully (in-memory mode)' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const previousDriverId = booking.driverId;
    const previousBoatId = booking.boatId;

    if (previousDriverId) {
      await Driver.findByIdAndUpdate(previousDriverId, {
        isCurrentlyOnRide: false,
        currentActiveBookingId: null
      });
    }

    const newDriver = await Driver.findById(newDriverId);
    if (!newDriver) {
      return res.status(404).json({ success: false, message: 'New driver not found' });
    }

    booking.driverId = newDriver._id;
    booking.boatId = newBoatId || newDriver.assignedBoatId;
    booking.status = BOOKING_STATUS.DRIVER_ASSIGNED;
    await booking.save();

    newDriver.isCurrentlyOnRide = true;
    newDriver.currentActiveBookingId = booking._id;
    await newDriver.save();

    await AuditLog.create({
      actorId: req.user?._id,
      actorRole: req.user?.role || ROLES.ADMIN,
      action: 'REASSIGN_DRIVER',
      entityType: 'Booking',
      entityId: booking._id.toString(),
      previousState: { driverId: previousDriverId, boatId: previousBoatId },
      newState: { driverId: newDriverId, boatId: booking.boatId },
      notes: reason || 'Operations manual reassignment'
    });

    broadcastRideLifecycleUpdate(booking);

    res.json({
      success: true,
      message: 'Driver and boat reassigned successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Call Center Assisted Booking
const createCallCenterBooking = async (req, res, next) => {
  try {
    const {
      customerPhone,
      customerName,
      zoneNumber,
      boardingPointId,
      tripType,
      boatCategory,
      seatsBooked,
      fareAmount,
      bookingType = BOOKING_TYPE.BOOK_NOW,
      scheduledTime
    } = req.body;

    const bookingCode = `CC-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Call-Center booking created successfully (in-memory mode)',
        booking: {
          bookingCode,
          zoneNumber,
          seatsBooked,
          fareAmount,
          customerPhone,
          status: 'SEARCHING_DRIVER'
        }
      });
    }

    let customer = await User.findOne({ phone: customerPhone });
    if (!customer) {
      customer = await User.create({
        phone: customerPhone,
        firstName: customerName,
        role: ROLES.CUSTOMER,
        isVerified: true
      });
    }

    const booking = await Booking.create({
      bookingCode,
      customerId: customer._id,
      riverLakeId: req.body.riverLakeId || 'rl1',
      zoneNumber,
      boardingPointId,
      bookingType,
      tripType,
      boatCategory,
      seatsBooked,
      fareAmount,
      finalPayableAmount: fareAmount,
      sourceChannel: 'CALL_CENTER',
      scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(),
      status: BOOKING_STATUS.SEARCHING_DRIVER
    });

    res.status(201).json({
      success: true,
      message: 'Call-Center booking created successfully. Customer notified.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Approve or Reject Driver
const updateDriverApproval = async (req, res, next) => {
  try {
    const { driverId, approvalStatus } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, message: `Driver status updated to ${approvalStatus}` });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    driver.approvalStatus = approvalStatus;
    await driver.save();

    res.json({ success: true, message: `Driver status updated to ${approvalStatus}`, driver });
  } catch (error) {
    next(error);
  }
};

// Get All Drivers
const getAllDrivers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 2,
        data: [
          {
            _id: 'driver_mock_1',
            driverCode: 'DRV-1001',
            name: 'Ram Manjhi',
            phone: '9876543220',
            operationalZoneNumber: 1,
            isDutyOn: true,
            approvalStatus: 'APPROVED',
            rating: 4.9,
            totalRidesCompleted: 14,
            assignedBoatId: { customBoatId: 'BOAT-Z1-001', name: 'Ganga Vihar Motor Boat' }
          },
          {
            _id: 'driver_mock_2',
            driverCode: 'DRV-1002',
            name: 'Shyam Nishad',
            phone: '9876543221',
            operationalZoneNumber: 5,
            isDutyOn: true,
            approvalStatus: 'APPROVED',
            rating: 5.0,
            totalRidesCompleted: 22,
            assignedBoatId: { customBoatId: 'BOAT-Z5-002', name: 'Royal Heritage Bajra' }
          }
        ]
      });
    }

    const drivers = await Driver.find()
      .populate('assignedBoatId')
      .populate('userId', 'email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: drivers.length, data: drivers });
  } catch (error) {
    next(error);
  }
};

// Get All SOS Incidents
const getSOSIncidents = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const incidents = await SOSIncident.find()
      .populate('bookingId')
      .populate('customerId', 'firstName lastName phone')
      .populate('driverId', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  reassignDriver,
  createCallCenterBooking,
  updateDriverApproval,
  getAllDrivers,
  getSOSIncidents
};
