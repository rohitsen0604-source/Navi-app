const express = require('express');
const router = express.Router();
const {
  getHelplineInfo,
  createSupportTicket,
  getUserTickets,
  getLegalTerms
} = require('../controllers/supportController');
const { protect } = require('../middlewares/authMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  req.user = { _id: 'guest_user', firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210' };
  next();
};

router.get('/helpline-info', getHelplineInfo);
router.get('/legal', getLegalTerms);
router.post('/tickets', optionalAuth, createSupportTicket);
router.get('/tickets', optionalAuth, getUserTickets);

module.exports = router;

