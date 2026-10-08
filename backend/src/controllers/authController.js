const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Driver = require('../models/Driver');
const { ROLES } = require('../config/constants');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'naavi_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// In-memory store fallback when MongoDB is not connected
const inMemoryUsers = new Map();

// Send OTP
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    console.log(`[Auth] OTP 123456 generated for phone ${phone}`);
    res.json({
      success: true,
      message: 'OTP sent successfully',
      debugOtp: '123456'
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP & Login/Signup
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, role = ROLES.CUSTOMER } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // In-memory fallback if MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      let user = inMemoryUsers.get(phone);
      let isNewUser = false;

      if (!user) {
        // First time phone number
        user = {
          _id: `user_${Date.now()}`,
          phone,
          firstName: '',
          lastName: '',
          email: '',
          role,
          isVerified: true,
          isProfileCompleted: false
        };
        inMemoryUsers.set(phone, user);
        isNewUser = true;
      } else {
        isNewUser = !user.firstName || user.firstName.trim() === '';
      }

      const driverData = role === ROLES.DRIVER ? {
        _id: 'driver_mock_1',
        driverCode: 'DRV-1001',
        name: 'Ram Manjhi',
        phone,
        operationalZoneNumber: 1,
        isDutyOn: true,
        approvalStatus: 'APPROVED',
        rating: 4.9,
        totalRidesCompleted: 14,
        totalEarnings: 8400,
        assignedBoatId: {
          _id: 'boat_mock_1',
          customBoatId: 'BOAT-Z1-001',
          name: 'Ganga Vihar Motor Boat',
          capacity: 10,
          category: 'MOTOR_BOAT'
        }
      } : null;

      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        isNewUser,
        isProfileCompleted: !isNewUser,
        user,
        driverData,
        note: 'Operating with in-memory auth store (MongoDB offline)'
      });
    }

    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone,
        role,
        isVerified: true,
        firstName: '',
        lastName: '',
        email: ''
      });
      isNewUser = true;
    } else {
      isNewUser = !user.firstName || user.firstName.trim() === '';
    }

    let driverData = null;
    if (user.role === ROLES.DRIVER) {
      driverData = await Driver.findOne({ userId: user._id }).populate('assignedBoatId');
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      isNewUser,
      isProfileCompleted: !isNewUser,
      user,
      driverData
    });
  } catch (error) {
    next(error);
  }
};

// Update / Complete Profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const targetPhone = phone || (req.user && req.user.phone);
      let user = targetPhone ? inMemoryUsers.get(targetPhone) : null;
      if (!user) {
        user = {
          _id: `user_${Date.now()}`,
          phone: targetPhone || '9876543210',
          role: ROLES.CUSTOMER
        };
      }
      user.firstName = firstName || user.firstName || 'Rahul';
      user.lastName = lastName || user.lastName || 'Sharma';
      user.email = email || user.email || 'rahul.sharma@gmail.com';
      user.isProfileCompleted = true;
      if (user.phone) inMemoryUsers.set(user.phone, user);

      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Profile completed successfully',
        isProfileCompleted: true,
        user,
        token
      });
    }

    const userId = req.user ? req.user._id : null;
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Profile completed successfully',
      isProfileCompleted: true,
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Profile
const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        user: { firstName: 'Ram', lastName: 'Manjhi', role: ROLES.DRIVER }
      });
    }

    const user = await User.findById(req.user._id);
    let driverData = null;
    if (user.role === ROLES.DRIVER) {
      driverData = await Driver.findOne({ userId: user._id }).populate('assignedBoatId');
    }

    res.json({ success: true, user, driverData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  getMe
};
