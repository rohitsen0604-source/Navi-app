const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getCustomerBookings,
  cancelBooking,
  triggerSOS,
  rateRide
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getCustomerBookings);
router.get('/:id', protect, getBookingById);
router.post('/:id/cancel', protect, cancelBooking);
router.post('/:id/sos', protect, triggerSOS);
router.post('/:id/rate', protect, rateRide);

module.exports = router;
