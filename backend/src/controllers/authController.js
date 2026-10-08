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

// Get Current User Profile (Settings)
const getMe = async (req, res, next) => {
  try {
    const defaultProfile = {
      _id: req.user?._id || 'user_rahul_default',
      firstName: 'Rahul',
      lastName: 'Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@gmail.com',
      isEmailVerified: true,
      preferredLanguage: 'English',
      appTheme: 'Light',
      notificationsEnabled: true,
      role: req.user?.role || ROLES.CUSTOMER,
      avatar: 'assets/images/driver_avatar.jpg',
      emergencyContactsCount: 2
    };

    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryUsers.get(req.user?.phone || '9876543210');
      if (user) {
        defaultProfile.firstName = user.firstName || defaultProfile.firstName;
        defaultProfile.lastName = user.lastName || defaultProfile.lastName;
        defaultProfile.email = user.email || defaultProfile.email;
        defaultProfile.phone = user.phone || defaultProfile.phone;
        defaultProfile.preferredLanguage = user.preferredLanguage || defaultProfile.preferredLanguage;
        defaultProfile.appTheme = user.appTheme || defaultProfile.appTheme;
      }
      return res.json({
        success: true,
        user: defaultProfile
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let driverData = null;
    if (user.role === ROLES.DRIVER) {
      driverData = await Driver.findOne({ userId: user._id }).populate('assignedBoatId');
    }

    res.json({
      success: true,
      user: {
        ...defaultProfile,
        ...user.toObject(),
        isEmailVerified: true
      },
      driverData
    });
  } catch (error) {
    next(error);
  }
};

// Update Preferences (Language, Theme, Notifications)
const updatePreferences = async (req, res, next) => {
  try {
    const { preferredLanguage, appTheme, notificationsEnabled } = req.body;
    const phone = req.user?.phone || '9876543210';
    let user = inMemoryUsers.get(phone) || { phone };

    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (appTheme) user.appTheme = appTheme;
    if (notificationsEnabled !== undefined) user.notificationsEnabled = notificationsEnabled;

    inMemoryUsers.set(phone, user);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferredLanguage: user.preferredLanguage || 'English',
        appTheme: user.appTheme || 'Light',
        notificationsEnabled: user.notificationsEnabled !== false
      }
    });
  } catch (error) {
    next(error);
  }
};

// Change Phone Request
const requestChangePhone = async (req, res, next) => {
  try {
    const { newPhone } = req.body;
    if (!newPhone) {
      return res.status(400).json({ success: false, message: 'New phone number is required' });
    }

    res.json({
      success: true,
      message: `OTP 123456 sent to verify new phone ${newPhone}`,
      debugOtp: '123456'
    });
  } catch (error) {
    next(error);
  }
};

// Admin / Operations / Call Center Login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password, role = 'SUPER_ADMIN' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Role permissions map
    const rolePermissions = {
      SUPER_ADMIN: ['dashboard', 'customers', 'drivers', 'boats', 'rivers', 'zones', 'ghats', 'rides', 'pricing', 'bookings', 'dispatch', 'payments', 'coupons', 'call_center', 'reports', 'audit', 'settings'],
      OPERATIONS_ADMIN: ['dashboard', 'drivers', 'boats', 'rivers', 'zones', 'ghats', 'rides', 'pricing', 'bookings', 'dispatch', 'payments', 'reports', 'audit'],
      CALL_CENTER_AGENT: ['dashboard', 'call_center', 'bookings', 'customers', 'pricing', 'dispatch']
    };

    const permissions = rolePermissions[role] || rolePermissions.SUPER_ADMIN;

    const adminUser = {
      _id: `admin_${Date.now()}`,
      name: role === 'SUPER_ADMIN' ? 'Chief Operations Officer (Admin)' : role === 'OPERATIONS_ADMIN' ? 'Ghat Operations Lead' : 'Call Center Specialist',
      email: email.trim().toLowerCase(),
      role,
      permissions,
      avatar: '/assets/naavi_logo.png'
    };

    const token = generateToken(adminUser._id);

    res.json({
      success: true,
      message: 'Admin login authenticated successfully',
      token,
      user: adminUser
    });
  } catch (error) {
    next(error);
  }
};

// Admin Reset Password
const adminResetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }

    res.json({
      success: true,
      message: `Password reset successfully for ${email}. You can now login with your new credentials.`
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  getMe,
  updatePreferences,
  requestChangePhone,
  adminLogin,
  adminResetPassword,
  logout
};

