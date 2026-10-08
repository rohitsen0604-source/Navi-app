const mongoose = require('mongoose');
const { BOAT_CATEGORIES } = require('../config/constants');

const boatSchema = new mongoose.Schema({
  customBoatId: {
    type: String,
    required: true,
    unique: true,
    trim: true // e.g. "BOAT-Z1-001"
  },
  governmentRegNumber: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    default: 'Naavi Vessel'
  },
  category: {
    type: String,
    enum: Object.values(BOAT_CATEGORIES),
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  },
  zoneNumber: {
    type: Number,
    required: true
  },
  riverLakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RiverLake'
  },
  assignedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  registrationDocumentUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'MAINTENANCE', 'DECOMMISSIONED'],
    default: 'AVAILABLE'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Boat', boatSchema);
