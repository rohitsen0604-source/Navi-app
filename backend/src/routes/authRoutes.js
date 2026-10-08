const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, updateProfile, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/complete-profile', updateProfile);

module.exports = router;
