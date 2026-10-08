const express = require('express');
const router = express.Router();
const {
  toggleDuty,
  acceptBooking,
  rejectBooking,
  startRide,
  completeRide,
  getDriverDashboard
} = require('../controllers/driverController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);
router.use(authorizeRoles(ROLES.DRIVER, ROLES.ADMIN));

router.post('/toggle-duty', toggleDuty);
router.post('/accept', acceptBooking);
router.post('/reject', rejectBooking);
router.post('/start-ride', startRide);
router.post('/complete-ride', completeRide);
router.get('/dashboard', getDriverDashboard);

module.exports = router;
