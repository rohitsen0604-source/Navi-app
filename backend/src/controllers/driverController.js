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
      const { inMemoryUsers } = require('./authController');
      const targetPhone = (req.user && req.user.phone) || '9876543220';
      const user = inMemoryUsers.get(targetPhone);
      const captainName = (user && user.firstName)
          ? `${user.firstName} ${user.lastName || ''}`.trim()
          : 'Rajesh Kumar';

      return res.json({
        success: true,
        data: {
          driver: {
            _id: 'driver_mock_1',
            driverCode: 'DRV-1001',
            name: captainName,
            roleTitle: 'Boat Operator',
            phone: targetPhone,
            operationalZoneNumber: 1,
            isDutyOn: mockDutyOn,
            rating: 4.8,
            totalEarnings: 2450,
            totalRidesCompleted: 120,
            todaysRides: 12,
            todaysEarnings: 2450,
            acceptanceRate: '96%',
            avatarUrl: 'assets/images/driver_avatar_profile.jpg',
            assignedBoatId: {
              _id: 'boat_mock_1',
              name: 'Naavi-01',
              customBoatId: 'BOAT-MP09AB1234',
              governmentRegNumber: 'MP-09-AB-1234',
              capacity: 10,
              category: 'MOTOR_BOAT'
            }
          },
          stats: {
            todaysRides: 12,
            todaysEarnings: 2450,
            acceptanceRate: '96%',
            rating: 4.8,
            totalRides: 120
          },
          upcomingBooking: {
            _id: 'booking_upcoming_1',
            timeText: 'Today, 11:30 AM',
            pickup: 'Vijay Nagar Jetty',
            destination: 'Lake View Point',
            passengers: 4,
            distanceText: '1.2 km away',
            status: 'Upcoming'
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

const getAvailableRides = async (req, res) => {
  try {
    const rides = await Booking.find({
      status: { $in: ['SEARCHING_DRIVER', 'SCHEDULED', 'DRIVER_REQUESTED'] }
    }).sort({ createdAt: -1 }).limit(10).lean();
    res.json({ success: true, count: rides.length, data: rides });
  } catch (e) {
    res.json({ success: true, count: 0, data: [] });
  }
};

const getDriverOnboardingConfig = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        appTitle: 'Naavi Boatman Partner',
        allowSkip: true,
        slides: [
          {
            id: 'slide_1',
            titlePrefix: 'Explore',
            highlightText: 'Rivers & Lakes',
            titleSuffix: 'with Naavi',
            description: 'Book boats, enjoy scenic rides and create unforgettable memories.',
            imageAsset: 'assets/images/driver_onboarding_hero.jpg',
            badge: 'NAAVI CAPTAIN FLEET'
          },
          {
            id: 'slide_2',
            type: 'how_it_works',
            titlePrefix: 'How Naavi',
            highlightText: 'Works?',
            titleSuffix: '',
            description: 'Simple steps to start earning with your boat.',
            imageAsset: 'assets/images/driver_river_waves.jpg',
            badge: 'HOW IT WORKS',
            steps: [
              {
                stepNumber: 1,
                title: '1. Register',
                description: 'Create your profile and add boat details.',
                icon: 'register'
              },
              {
                stepNumber: 2,
                title: '2. Receive Bookings',
                description: 'Get ride requests from nearby tourists.',
                icon: 'bookings'
              },
              {
                stepNumber: 3,
                title: '3. Earn Money',
                description: 'Complete rides and earn instantly.',
                icon: 'earnings'
              }
            ]
          },
          {
            id: 'slide_3',
            type: 'safe_reliable',
            titlePrefix: 'Safe, Secure',
            highlightText: '& Reliable',
            titleSuffix: '',
            description: 'Your safety and earnings are our priority.',
            imageAsset: 'assets/images/driver_safe_waterway.jpg',
            badge: 'SAFE & RELIABLE',
            features: [
              {
                id: 'verified_bookings',
                title: 'Verified\nBookings',
                icon: 'verified_user',
                badgeColor: '#DCFCE7',
                iconColor: '#16A34A'
              },
              {
                id: 'support_24_7',
                title: '24/7\nSupport',
                icon: 'support_agent',
                badgeColor: '#FFE4E6',
                iconColor: '#E11D48'
              },
              {
                id: 'secure_payments',
                title: 'Secure\nPayments',
                icon: 'credit_card',
                badgeColor: '#E0F2FE',
                iconColor: '#0284C7'
              },
              {
                id: 'ratings_reviews',
                title: 'Ratings &\nReviews',
                icon: 'star',
                badgeColor: '#FEF3C7',
                iconColor: '#D97706'
              }
            ]
          }
        ],
        theme: {
          primaryColor: '#EB4D37',
          accentColor: '#F97316',
          fontFamily: 'Inter'
        },
        contactSupport: {
          phone: '+91 9876543220',
          email: 'captain-support@naaviwaterways.com'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save / Complete Driver Profile (Screen 6: Create Your Profile - Personal Details)
const saveDriverProfile = async (req, res, next) => {
  try {
    const { fullName, phone, dob, gender, address, profilePhotoUrl } = req.body;
    const targetPhone = phone || (req.user && req.user.phone);

    if (!targetPhone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanName = (fullName || 'Captain Partner').trim();
    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || 'Captain';
    const lastName = nameParts.slice(1).join(' ') || '';

    // In-memory fallback
    if (mongoose.connection.readyState !== 1) {
      const { inMemoryUsers } = require('./authController');
      let user = inMemoryUsers.get(targetPhone) || {
        _id: `user_${Date.now()}`,
        phone: targetPhone,
        role: 'DRIVER',
        isVerified: true
      };

      user.firstName = firstName;
      user.lastName = lastName;
      user.dob = dob || '15 Mar 1990';
      user.gender = gender || 'Male';
      user.address = address || 'Vijay Nagar, Indore, Madhya Pradesh';
      user.isProfileCompleted = true;
      user.profilePhotoUrl = profilePhotoUrl || 'assets/images/driver_avatar_profile.jpg';
      inMemoryUsers.set(targetPhone, user);

      const driverData = {
        _id: `driver_${Date.now()}`,
        driverCode: `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanName,
        phone: targetPhone,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        operationalZoneNumber: 1,
        isDutyOn: false,
        approvalStatus: 'APPROVED',
        rating: 5.0,
        totalRidesCompleted: 0,
        totalEarnings: 0,
        isProfileCompleted: true
      };

      console.log(`[Driver] Profile completed for ${cleanName} (${targetPhone})`);
      return res.json({
        success: true,
        message: 'Driver profile saved successfully',
        isProfileCompleted: true,
        user,
        driverData,
        currentStep: 1,
        nextStep: 2
      });
    }

    // MongoDB
    const User = require('../models/User');
    let user = await User.findOne({ phone: targetPhone });
    if (!user) {
      user = await User.create({
        phone: targetPhone,
        role: 'DRIVER',
        firstName,
        lastName,
        isVerified: true
      });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();
    }

    let driver = await Driver.findOne({ phone: targetPhone });
    if (!driver) {
      driver = await Driver.create({
        userId: user._id,
        driverCode: `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanName,
        phone: targetPhone,
        operationalZoneNumber: 1,
        isDutyOn: false,
        approvalStatus: 'APPROVED'
      });
    } else {
      driver.name = cleanName;
      await driver.save();
    }

    res.json({
      success: true,
      message: 'Driver profile saved successfully',
      isProfileCompleted: true,
      user,
      driverData: driver,
      currentStep: 1,
      nextStep: 2
    });
  } catch (error) {
    next(error);
  }
};

// Save Boat Details (Screen 7: Boat Details - Step 2/3)
const saveBoatDetails = async (req, res, next) => {
  try {
    const {
      phone,
      boatName = 'Naavi-01',
      boatType = 'Motor Boat',
      seatingCapacity = 10,
      registrationNumber = 'MP-09-AB-1234',
      boatPhotos = ['assets/images/driver_boat_photo_1.jpg', 'assets/images/driver_boat_photo_2.jpg'],
      documents = {}
    } = req.body;

    const targetPhone = phone || (req.user && req.user.phone);

    if (!targetPhone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const boatData = {
      _id: `boat_${Date.now()}`,
      customBoatId: `BOAT-${registrationNumber ? registrationNumber.replace(/[^A-Za-z0-9]/g, '') : 'Z1-002'}`,
      name: boatName,
      category: boatType === 'Motor Boat' ? 'MOTOR_BOAT' : 'SHIKARA_ROW_BOAT',
      filterTag: boatType,
      capacity: Number(seatingCapacity) || 10,
      governmentRegNumber: registrationNumber,
      image: boatPhotos[0] || 'assets/images/driver_boat_photo_1.jpg',
      boatPhotos,
      documents: {
        registrationCertificate: documents.registrationCertificate || 'assets/images/driver_doc_certificate.jpg',
        insurance: documents.insurance || 'assets/images/driver_boat_photo_1.jpg',
        safetyEquipment: documents.safetyEquipment || 'assets/images/driver_boat_photo_2.jpg'
      },
      approvalStatus: 'VERIFIED',
      isActive: true
    };

    // In-memory fallback
    if (mongoose.connection.readyState !== 1) {
      const { inMemoryUsers } = require('./authController');
      let user = inMemoryUsers.get(targetPhone);
      if (user) {
        user.boatDetails = boatData;
        user.isBoatRegistered = true;
        inMemoryUsers.set(targetPhone, user);
      }

      console.log(`[Driver] Boat details saved for ${targetPhone}: ${boatName} (${registrationNumber})`);
      return res.json({
        success: true,
        message: 'Boat information and documents saved successfully',
        boat: boatData,
        currentStep: 2,
        nextStep: 3
      });
    }

    // MongoDB
    const Boat = require('../models/Boat');
    let boat = await Boat.findOne({ governmentRegNumber: registrationNumber });
    if (!boat) {
      boat = await Boat.create(boatData);
    } else {
      boat.name = boatName;
      boat.capacity = Number(seatingCapacity) || 10;
      await boat.save();
    }

    let driver = await Driver.findOne({ phone: targetPhone });
    if (driver) {
      driver.assignedBoatId = boat._id;
      await driver.save();
    }

    res.json({
      success: true,
      message: 'Boat information and documents saved successfully',
      boat,
      currentStep: 2,
      nextStep: 3
    });
  } catch (error) {
    next(error);
  }
};

// Submit KYC Verification (Screen 8: KYC Verification - Step 3/3)
const submitDriverKyc = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const targetPhone = phone || (req.user && req.user.phone);

    if (!targetPhone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const kycResult = {
      status: 'UNDER_VERIFICATION',
      message: 'KYC submitted successfully. Verification takes 24–48 hours.',
      submittedAt: new Date(),
      steps: {
        personalDetails: { status: 'SUBMITTED', completed: true },
        boatDetails: { status: 'SUBMITTED', completed: true },
        documents: { status: 'UPLOADED', completed: true },
        verification: { status: 'UNDER_VERIFICATION', estimatedHours: '24-48' }
      }
    };

    if (mongoose.connection.readyState !== 1) {
      const { inMemoryUsers } = require('./authController');
      let user = inMemoryUsers.get(targetPhone);
      if (user) {
        user.kycStatus = 'UNDER_VERIFICATION';
        inMemoryUsers.set(targetPhone, user);
      }

      console.log(`[Driver] KYC submitted for ${targetPhone}`);
      return res.json({
        success: true,
        message: 'KYC submitted successfully',
        data: kycResult
      });
    }

    const Driver = require('../models/Driver');
    let driver = await Driver.findOne({ phone: targetPhone });
    if (driver) {
      driver.approvalStatus = 'PENDING';
      await driver.save();
    }

    res.json({
      success: true,
      message: 'KYC submitted successfully',
      data: kycResult
    });
  } catch (error) {
    next(error);
  }
};

// Get KYC Status
const getDriverKycStatus = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        status: 'UNDER_VERIFICATION',
        personalDetailsSubmitted: true,
        boatDetailsSubmitted: true,
        documentsUploaded: true,
        verificationPending: true
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableRides,
  getDriverOnboardingConfig,
  saveDriverProfile,
  saveBoatDetails,
  submitDriverKyc,
  getDriverKycStatus,
  toggleDuty,
  acceptBooking,
  rejectBooking,
  startRide,
  completeRide,
  getDriverDashboard
};


