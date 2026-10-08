const mongoose = require('mongoose');
const { PAYMENT_MODES, PAYMENT_STATUS } = require('../config/constants');

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: Object.values(PAYMENT_MODES),
    required: true
  },
  gateway: {
    type: String,
    default: 'RAZORPAY' // or 'CASH_ON_GHAT'
  },
  gatewayOrderId: String,
  gatewayPaymentId: String,
  gatewaySignature: String,
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  refundStatus: {
    type: String,
    enum: ['NONE', 'INITIATED', 'COMPLETED', 'FAILED'],
    default: 'NONE'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundTransactionId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
