const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_MODES } = require('../config/constants');
const { driverAcceptsBooking, driverRejectsBooking } = require('../services/allocationService');
const { triggerRideStartInsurance, triggerRideCompleteInsurance } = require('../services/insuranceService');
const { broadcastRideLifecycleUpdate } = require('../services/socketService');

// In-memory driver fallback state when MongoDB is offline
let mockDutyOn = true;
let mockDriverEarnings = 8400;
let mockTripsCompleted = 14;

// Toggle Driver Duty
const toggleDuty = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockDutyOn = !mockDutyOn;
      return res.json({
        success: true,
        message: `Duty switched ${mockDutyOn ? 'ON' : 'OFF'}`,
        isDutyOn: mockDutyOn,
        driver: {
          name: 'Ram Manjhi',
          driverCode: 'DRV-1001',
          isDutyOn: mockDutyOn,
          operationalZoneNumber: 1
        }
      });
    }

    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    driver.isDutyOn = !driver.isDutyOn;
    await driver.save();

    res.json({
      success: true,
      message: `Duty switched ${driver.isDutyOn ? 'ON' : 'OFF'}`,
      isDutyOn: driver.isDutyOn,
      driver
    });
  } catch (error) {
    next(error);
  }
};

// Accept Incoming Booking Request
const acceptBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        message: 'Booking accepted (mock mode)',
        data: { _id: bookingId, status: BOOKING_STATUS.DRIVER_ASSIGNED }
      });
    }

    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const result = await driverAcceptsBooking(bookingId, driver._id);
    res.json({ success: true, message: 'Booking accepted', data: result.booking });
  } catch (error) {
    next(error);
  }
};

// Reject Incoming Booking Request
const rejectBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, message: 'Booking rejected' });
    }

    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    await driverRejectsBooking(bookingId, driver._id);
    res.json({ success: true, message: 'Booking rejected, released to next available driver' });
  } catch (error) {
    next(error);
  }
};

// Start Ride
const startRide = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        message: 'Ride started successfully',
        data: { _id: bookingId, status: BOOKING_STATUS.RIDE_STARTED }
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = BOOKING_STATUS.RIDE_STARTED;
    booking.startedAt = new Date();
    await booking.save();

    triggerRideStartInsurance(booking);
    broadcastRideLifecycleUpdate(booking);

    res.json({ success: true, message: 'Ride started successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

// Complete Ride
const completeRide = async (req, res, next) => {
  try {
    const { bookingId, cashCollected = 800 } = req.body;
    if (mongoose.connection.readyState !== 1) {
      mockDriverEarnings += cashCollected;
      mockTripsCompleted += 1;
      return res.json({
        success: true,
        message: 'Ride completed successfully',
        data: { _id: bookingId, status: BOOKING_STATUS.RIDE_COMPLETED }
      });
    }

    const booking = await Booking.findById(bookingId);
    const driver = await Driver.findOne({ userId: req.user._id });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = BOOKING_STATUS.RIDE_COMPLETED;
    booking.completedAt = new Date();

    if (booking.paymentMode === PAYMENT_MODES.PAY_AFTER_RIDE) {
      booking.paymentStatus = PAYMENT_STATUS.CASH_COLLECTED;
    }
    await booking.save();

    if (driver) {
      driver.isCurrentlyOnRide = false;
      driver.currentActiveBookingId = null;
      driver.totalRidesCompleted += 1;
      driver.totalEarnings += booking.finalPayableAmount;
      await driver.save();
    }

    triggerRideCompleteInsurance(booking, true);
    broadcastRideLifecycleUpdate(booking);

    res.json({ success: true, message: 'Ride completed successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

// Get Driver Dashboard & Earnings
const getDriverDashboard = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          driver: {
            _id: 'driver_mock_1',
            driverCode: 'DRV-1001',
            name: 'Ram Manjhi',
            phone: '9876543220',
            operationalZoneNumber: 1,
            isDutyOn: mockDutyOn,
            rating: 4.9,
            totalEarnings: mockDriverEarnings,
            totalRidesCompleted: mockTripsCompleted,
            assignedBoatId: {
              _id: 'boat_mock_1',
              name: 'Ganga Vihar Motor Boat',
              customBoatId: 'BOAT-Z1-001',
              governmentRegNumber: 'UP-65-NV-1001',
              capacity: 10,
              category: 'MOTOR_BOAT'
            }
          },
          activeBooking: null,
          recentTrips: [
            {
              bookingCode: 'NV-982134',
              tripType: 'FULL_TRIP',
              seatsBooked: 4,
              finalPayableAmount: 950,
              paymentMode: 'PAY_AFTER_RIDE',
              rating: 5,
              completedAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              bookingCode: 'NV-748921',
              tripType: 'HALF_TRIP',
              seatsBooked: 2,
              finalPayableAmount: 600,
              paymentMode: 'ONLINE_PREPAID',
              rating: 5,
              completedAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        }
      });
    }

    const driver = await Driver.findOne({ userId: req.user._id })
      .populate('assignedBoatId')
      .populate('zoneId');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const completedBookings = await Booking.find({
      driverId: driver._id,
      status: { $in: [BOOKING_STATUS.RIDE_COMPLETED, BOOKING_STATUS.PAYMENT_COMPLETED] }
    }).sort({ completedAt: -1 }).limit(15);

    let activeBooking = null;
    if (driver.currentActiveBookingId) {
      activeBooking = await Booking.findById(driver.currentActiveBookingId)
        .populate('customerId', 'firstName lastName phone')
        .populate('boardingPointId')
        .populate('destinationPointId');
    }

    res.json({
      success: true,
      data: {
        driver,
        activeBooking,
        recentTrips: completedBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleDuty,
  acceptBooking,
  rejectBooking,
  startRide,
  completeRide,
  getDriverDashboard
};
