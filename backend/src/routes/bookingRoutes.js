const express = require('express');
const router = express.Router();
const {
  calculateFare,
  getTimeSlots,
  createBooking,
  getBookingById,
  getCustomerBookings,
  cancelBooking,
  triggerSOS,
  rateRide,
  updateBookingStatus,
  sendChatMessage,
  getChatMessages,
  getLiveTelemetry,
  completeTrip,
  getInvoice
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  req.user = { _id: 'mock_customer_id', firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210' };
  next();
};

// Scheduler & Pricing endpoints
router.get('/time-slots', optionalAuth, getTimeSlots);
router.post('/calculate-fare', optionalAuth, calculateFare);

// Booking Core Endpoints
router.post('/', optionalAuth, createBooking);
router.get('/my-bookings', optionalAuth, getCustomerBookings);
router.get('/my-rides', optionalAuth, getCustomerBookings);
router.get('/:id', optionalAuth, getBookingById);
router.get('/:id/telemetry', optionalAuth, getLiveTelemetry);
router.get('/:id/invoice', optionalAuth, getInvoice);
router.patch('/:id/status', optionalAuth, updateBookingStatus);
router.post('/:id/complete', optionalAuth, completeTrip);
router.post('/:id/cancel', optionalAuth, cancelBooking);
router.post('/:id/sos', optionalAuth, triggerSOS);
router.post('/:id/rate', optionalAuth, rateRide);
router.post('/:id/chat', optionalAuth, sendChatMessage);
router.get('/:id/chat', optionalAuth, getChatMessages);

module.exports = router;
