const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  riverLakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RiverLake',
    required: true
  },
  zoneNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true // e.g. "Zone 1 - Assi Sector"
  },
  code: {
    type: String,
    uppercase: true,
    trim: true // e.g. "ZN-01"
  },
  adjacentZoneNumbers: [{
    type: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Zone', zoneSchema);
