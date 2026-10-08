const { BOOKING_TYPE, CANCELLATION_REFUND_SLABS } = require('../config/constants');
const Payment = require('../models/Payment');

/**
 * Calculates refund amount according to Naavi Cancellation Policy
 * Book Now: Cancellation not allowed (0% refund)
 * Book Later:
 *   > 12 hours: 80% refund
 *   6 - 12 hours: 70% refund
 *   3 - 6 hours: 50% refund
 *   < 3 hours: 0% refund
 */
const calculateRefund = (booking) => {
  if (booking.bookingType === BOOKING_TYPE.BOOK_NOW) {
    return {
      isAllowed: false,
      refundPercent: 0,
      refundAmount: 0,
      reason: 'Instant Book Now rides are non-cancellable once confirmed.'
    };
  }

  const now = new Date().getTime();
  const scheduledTime = new Date(booking.scheduledTime).getTime();
  const diffHours = (scheduledTime - now) / (1000 * 60 * 60);

  let refundPercent = 0;
  if (diffHours >= 12) {
    refundPercent = CANCELLATION_REFUND_SLABS.BEFORE_12_HOURS;
  } else if (diffHours >= 6) {
    refundPercent = CANCELLATION_REFUND_SLABS.BEFORE_6_HOURS;
  } else if (diffHours >= 3) {
    refundPercent = CANCELLATION_REFUND_SLABS.BEFORE_3_HOURS;
  } else {
    refundPercent = CANCELLATION_REFUND_SLABS.LESS_THAN_3_HOURS;
  }

  const refundAmount = Math.round(booking.finalPayableAmount * refundPercent);

  return {
    isAllowed: true,
    hoursRemaining: Math.round(diffHours * 10) / 10,
    refundPercent: refundPercent * 100,
    refundAmount
  };
};

const createMockRazorpayOrder = async (booking) => {
  const orderId = `order_nv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    orderId,
    amount: booking.finalPayableAmount * 100, // paise
    currency: 'INR',
    receipt: booking.bookingCode
  };
};

module.exports = {
  calculateRefund,
  createMockRazorpayOrder
};
