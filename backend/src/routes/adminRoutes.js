const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  updateDriverApproval,
  getAllBoats,
  createBoat,
  updateBoat,
  deleteBoat,
  getRivers,
  createRiver,
  updateRiver,
  deleteRiver,
  getZones,
  createZone,
  updateZone,
  deleteZone,
  getGhats,
  createGhat,
  updateGhat,
  deleteGhat,
  getRideTypes,
  createRideType,
  updateRideType,
  getPricing,
  updatePricing,
  getAllBookings,
  cancelBookingAdmin,
  reassignDriver,
  getPayments,
  processRefund,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  createCallCenterBooking,
  getReports,
  getAuditLogs,
  getSettings,
  updateSettings,
  getSOSIncidents
} = require('../controllers/adminController');
const { optionalAuth } = require('../middlewares/authMiddleware');

// Apply optional auth for flexible, reliable operations
router.use(optionalAuth);

// 1. Dashboard
router.get('/stats', getDashboardStats);

// 2. Customers CRUD
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// 3. Drivers CRUD & Approvals
router.get('/drivers', getAllDrivers);
router.post('/drivers', createDriver);
router.put('/drivers/:id', updateDriver);
router.delete('/drivers/:id', deleteDriver);
router.post('/driver-approval', updateDriverApproval);

// 4. Boats CRUD
router.get('/boats', getAllBoats);
router.post('/boats', createBoat);
router.put('/boats/:id', updateBoat);
router.delete('/boats/:id', deleteBoat);

// 5. Rivers / Lakes
router.get('/rivers', getRivers);
router.post('/rivers', createRiver);
router.put('/rivers/:id', updateRiver);
router.delete('/rivers/:id', deleteRiver);

// 6. Zones
router.get('/zones', getZones);
router.post('/zones', createZone);
router.put('/zones/:id', updateZone);
router.delete('/zones/:id', deleteZone);

// 7. Ghats / Boarding Points
router.get('/ghats', getGhats);
router.post('/ghats', createGhat);
router.put('/ghats/:id', updateGhat);
router.delete('/ghats/:id', deleteGhat);

// 8. Ride Setup (Trip Types)
router.get('/ride-types', getRideTypes);
router.post('/ride-types', createRideType);
router.put('/ride-types/:id', updateRideType);

// 9. Pricing Configuration
router.get('/pricing', getPricing);
router.get('/pricing-config', getPricing);
router.put('/pricing', updatePricing);
router.put('/pricing-config', updatePricing);

// 10. Bookings & Dispatch
router.get('/bookings', getAllBookings);
router.post('/bookings/:id/cancel', cancelBookingAdmin);
router.post('/reassign', reassignDriver);

// 11. Payments & Refunds
router.get('/payments', getPayments);
router.post('/payments/:id/refund', processRefund);

// 12. Coupons CRUD
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// 13. Call Center Assisted Booking
router.post('/call-center-booking', createCallCenterBooking);

// 14. Reports & Analytics
router.get('/reports', getReports);

// 15. Operational Activity / Audit Logs
router.get('/audit-logs', getAuditLogs);

// 16. System Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// 17. SOS Incidents
router.get('/sos-incidents', getSOSIncidents);

module.exports = router;
