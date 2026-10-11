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
  filterTag: {
    type: String,
    default: 'Motor Boat'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    default: 1200
  },
  rating: {
    type: Number,
    default: 4.8
  },
  image: {
    type: String,
    default: 'assets/images/boat_motor.jpg'
  },
  durationText: {
    type: String,
    default: 'Full Trip (2 hrs)'
  },
  passengersText: {
    type: String,
    default: 'Up to 8 passengers'
  },
  description: {
    type: String,
    default: 'Reliable Varanasi Ganges vessel.'
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
