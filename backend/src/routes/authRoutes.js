const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  updateProfile,
  getMe,
  updatePreferences,
  requestChangePhone,
  adminLogin,
  adminResetPassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/admin-login', adminLogin);
router.post('/admin-reset-password', adminResetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/complete-profile', updateProfile);
router.patch('/preferences', protect, updatePreferences);
router.post('/change-phone', protect, requestChangePhone);
router.post('/logout', protect, logout);

module.exports = router;

