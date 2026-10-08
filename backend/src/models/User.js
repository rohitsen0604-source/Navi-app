const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.CUSTOMER
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emergencyContact: {
    name: String,
    phone: String
  },
  currentCity: {
    type: String,
    default: 'Varanasi'
  },
  currentState: {
    type: String,
    default: 'Uttar Pradesh'
  },
  fcmToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
