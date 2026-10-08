const mongoose = require('mongoose');

const sosIncidentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['TRIGGERED', 'ACKNOWLEDGED_BY_OPS', 'RESOLVED'],
    default: 'TRIGGERED'
  },
  actionTakenNotes: String,
  resolvedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('SOSIncident', sosIncidentSchema);
