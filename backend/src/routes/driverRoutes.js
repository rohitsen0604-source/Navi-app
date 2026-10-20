const express = require('express');
const router = express.Router();
const {
  toggleDuty,
  acceptBooking,
  rejectBooking,
  startRide,
  completeRide,
  getDriverDashboard,
  getAvailableRides,
  getDriverOnboardingConfig,
  saveDriverProfile,
  saveBoatDetails,
  submitDriverKyc,
  getDriverKycStatus
} = require('../controllers/driverController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../config/constants');

// Public onboarding config, profile creation, boat details, KYC & available rides lookup
router.get('/onboarding', getDriverOnboardingConfig);
router.get('/available-rides', getAvailableRides);
router.post('/profile', saveDriverProfile);
router.post('/boat-details', saveBoatDetails);
router.post('/kyc-submit', submitDriverKyc);
router.get('/kyc-status', getDriverKycStatus);


router.use(protect);
router.use(authorizeRoles(ROLES.DRIVER, ROLES.ADMIN));

router.post('/toggle-duty', toggleDuty);
router.post('/accept', acceptBooking);
router.post('/reject', rejectBooking);
router.post('/start-ride', startRide);
router.post('/complete-ride', completeRide);
router.get('/dashboard', getDriverDashboard);

module.exports = router;
