const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'naavi_super_secret_jwt_key_2026');

      // Offline In-memory fallback if MongoDB is not connected
      if (mongoose.connection.readyState !== 1) {
        req.user = {
          _id: decoded.id || 'mock_user_1',
          firstName: 'Ram',
          lastName: 'Manjhi',
          role: ROLES.DRIVER,
          phone: '9876543220',
          isVerified: true
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role ${req.user ? req.user.role : 'GUEST'} is not authorized for this resource`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles
};
