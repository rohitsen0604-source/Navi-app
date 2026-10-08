const express = require('express');
const router = express.Router();
const {
  triggerSOSAlert,
  getEmergencyContacts,
  addEmergencyContact,
  cancelSOSAlert,
  shareRideDetails
} = require('../controllers/emergencyController');
const { protect } = require('../middlewares/authMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  req.user = { _id: 'guest_user', phone: '9876543210' };
  next();
};

// Public/Protected Emergency & Share Trigger
router.post('/sos', optionalAuth, triggerSOSAlert);
router.get('/contacts', optionalAuth, getEmergencyContacts);
router.post('/contacts', optionalAuth, addEmergencyContact);
router.post('/cancel', optionalAuth, cancelSOSAlert);
router.post('/share-ride', optionalAuth, shareRideDetails);

module.exports = router;

