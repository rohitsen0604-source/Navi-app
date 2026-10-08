const mongoose = require('mongoose');

const boardingPointSchema = new mongoose.Schema({
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true
  },
  zoneNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true // e.g. "Assi Ghat", "Dashashwamedh Ghat"
  },
  coordinates: {
    latitude: {
      type: Number,
      default: 0.0
    },
    longitude: {
      type: Number,
      default: 0.0
    }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BoardingPoint', boardingPointSchema);
