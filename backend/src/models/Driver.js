const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverCode: {
    type: String,
    unique: true,
    required: true // e.g. "DRV-1001"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    default: ''
  },
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  },
  operationalZoneNumber: {
    type: Number,
    required: true
  },
  assignedBoatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boat',
    default: null
  },
  isDutyOn: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
    default: 'PENDING'
  },
  isCurrentlyOnRide: {
    type: Boolean,
    default: false
  },
  currentActiveBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  rating: {
    type: Number,
    default: 5.0
  },
  totalRidesCompleted: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  documents: {
    licenseUrl: { type: String, default: '' },
    aadhaarUrl: { type: String, default: '' },
    policeVerificationUrl: { type: String, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
