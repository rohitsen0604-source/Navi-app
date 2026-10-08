const mongoose = require('mongoose');
const { BOOKING_STATUS, BOOKING_TYPE, TRIP_TYPES, BOAT_CATEGORIES, PAYMENT_MODES, PAYMENT_STATUS } = require('../config/constants');

const bookingSchema = new mongoose.Schema({
  bookingCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  boatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boat',
    default: null
  },
  riverLakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RiverLake',
    required: true
  },
  zoneNumber: {
    type: Number,
    required: true
  },
  boardingPointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardingPoint',
    required: true
  },
  destinationPointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardingPoint',
    default: null
  },
  bookingType: {
    type: String,
    enum: Object.values(BOOKING_TYPE),
    default: BOOKING_TYPE.BOOK_NOW
  },
  tripType: {
    type: String,
    enum: Object.values(TRIP_TYPES),
    default: TRIP_TYPES.FULL_TRIP
  },
  boatCategory: {
    type: String,
    enum: Object.values(BOAT_CATEGORIES),
    required: true
  },
  seatsBooked: {
    type: Number,
    required: true,
    min: 1
  },
  scheduledTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.SEARCHING_DRIVER
  },
  fareAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalPayableAmount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: Object.values(PAYMENT_MODES),
    default: PAYMENT_MODES.PAY_AFTER_RIDE
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  sourceChannel: {
    type: String,
    enum: ['CUSTOMER_APP', 'CALL_CENTER', 'ADMIN_PANEL'],
    default: 'CUSTOMER_APP'
  },
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  sosTriggered: {
    type: Boolean,
    default: false
  },
  sosTriggeredAt: Date,
  insuranceStatus: {
    type: String,
    enum: ['NONE', 'START_TRIGGERED', 'COMPLETED_TRIGGERED', 'ALERT_TRIGGERED'],
    default: 'NONE'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
