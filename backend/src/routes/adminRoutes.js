const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
  reassignDriver,
  createCallCenterBooking,
  updateDriverApproval,
  getAllDrivers,
  getSOSIncidents
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN, ROLES.OPERATIONS, ROLES.CALL_CENTER));

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);
router.post('/reassign', reassignDriver);
router.post('/call-center-booking', createCallCenterBooking);
router.post('/driver-approval', updateDriverApproval);
router.get('/drivers', getAllDrivers);
router.get('/sos-incidents', getSOSIncidents);

module.exports = router;
