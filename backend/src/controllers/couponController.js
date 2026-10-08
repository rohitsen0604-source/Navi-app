// Available coupons database
const COUPONS_DATABASE = [
  {
    id: 'c_naavi50',
    code: 'NAAVI50',
    title: '50% OFF up to ₹200',
    description: 'Get 50% off up to ₹200 on boat rides in Zone 1',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    maxDiscount: 200,
    minBookingAmount: 300,
    applicableZone: 1,
    badgeText: '50% OFF',
    badgeColor: 'GREEN',
    validUntilText: 'Valid till 28 Feb 2026',
    expiryDate: '2026-02-28',
    isAvailable: true,
    termsAndConditions: [
      'Valid only on boat rides originating in Zone 1 (Dashashwamedh Corridor).',
      'Maximum discount capped at ₹200 per transaction.',
      'Minimum booking fare requirement is ₹300.',
      'Applicable on row boats, motor boats, and luxury bajras.'
    ]
  },
  {
    id: 'c_river100',
    code: 'RIVER100',
    title: 'Flat ₹100 OFF',
    description: 'Flat ₹100 off on all boat rides',
    discountType: 'FLAT',
    discountValue: 100,
    maxDiscount: 100,
    minBookingAmount: 500,
    applicableZone: null,
    badgeText: '₹100 OFF',
    badgeColor: 'GOLD',
    validUntilText: 'Valid till 15 Mar 2026',
    expiryDate: '2026-03-15',
    isAvailable: true,
    termsAndConditions: [
      'Flat ₹100 discount applied directly to final booking total.',
      'Minimum trip booking amount of ₹500 required.',
      'Valid across all 84 Varanasi ghats and all boat operators.'
    ]
  },
  {
    id: 'c_welcome20',
    code: 'WELCOME20',
    title: '20% OFF on First Ride',
    description: 'Flat 20% off on first booking',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxDiscount: 150,
    minBookingAmount: 200,
    applicableZone: null,
    badgeText: '20% OFF',
    badgeColor: 'BLUE',
    validUntilText: 'Valid till 30 Mar 2026',
    expiryDate: '2026-03-30',
    isAvailable: true,
    termsAndConditions: [
      'Special discount for new and returning passengers.',
      'Maximum savings of up to ₹150.',
      'No zone restrictions apply.'
    ]
  },
  {
    id: 'c_banaras10',
    code: 'BANARAS10',
    title: '10% OFF Morning Tour',
    description: 'Valid on Assi Ghat early morning boat trips',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    maxDiscount: 120,
    minBookingAmount: 400,
    applicableZone: 2,
    badgeText: '10% OFF',
    badgeColor: 'CORAL',
    validUntilText: 'Valid till 15 Apr 2026',
    expiryDate: '2026-04-15',
    isAvailable: true,
    termsAndConditions: [
      'Valid on morning Subah-e-Banaras slots (05:00 AM - 08:30 AM).',
      'Maximum discount ₹120.'
    ]
  }
];

// 1. Get all coupons
const getCoupons = async (req, res, next) => {
  try {
    const { zoneNumber, fareAmount } = req.query;
    
    const available = COUPONS_DATABASE.filter(c => c.isAvailable);

    res.json({
      success: true,
      count: available.length,
      data: available
    });
  } catch (error) {
    next(error);
  }
};

// 2. Validate & Apply Coupon Code
const applyCoupon = async (req, res, next) => {
  try {
    const { code, fareAmount = 950, zoneNumber = 1 } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS_DATABASE.find(c => c.code === cleanCode && c.isAvailable);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon code '${cleanCode}' is invalid or expired`
      });
    }

    // Check minimum booking amount
    if (fareAmount < coupon.minBookingAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum fare of ₹${coupon.minBookingAmount} required to use '${cleanCode}'`
      });
    }

    // Check zone restriction
    if (coupon.applicableZone && zoneNumber && Number(zoneNumber) !== coupon.applicableZone) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' is valid only in Zone ${coupon.applicableZone}`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'FLAT') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((fareAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    const finalAmount = Math.max(0, fareAmount - discountAmount);

    res.json({
      success: true,
      message: `Coupon '${cleanCode}' applied successfully! You saved ₹${discountAmount}.`,
      data: {
        code: coupon.code,
        discountAmount,
        originalFare: fareAmount,
        finalAmount,
        savingsText: `Saved ₹${discountAmount}`,
        coupon
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  applyCoupon
};
