const express = require('express');
const router = express.Router();
const { getCoupons, applyCoupon } = require('../controllers/couponController');

router.get('/', getCoupons);
router.post('/apply', applyCoupon);
router.post('/validate', applyCoupon);

module.exports = router;
