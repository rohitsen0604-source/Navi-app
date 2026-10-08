const express = require('express');
const router = express.Router();
const {
  getRiverLakes,
  getZones,
  getBoardingPoints,
  getAvailableBoats,
  createRiverLake,
  createZone,
  createBoardingPoint,
  createBoat
} = require('../controllers/masterDataController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../config/constants');

// Public lookup endpoints for apps
router.get('/river-lakes', getRiverLakes);
router.get('/rivers', getRiverLakes);
router.get('/zones', getZones);
router.get('/boarding-points', getBoardingPoints);
router.get('/available-boats', getAvailableBoats);

// Admin CRUD endpoints
router.post('/river-lakes', protect, authorizeRoles(ROLES.ADMIN), createRiverLake);
router.post('/zones', protect, authorizeRoles(ROLES.ADMIN), createZone);
router.post('/boarding-points', protect, authorizeRoles(ROLES.ADMIN), createBoardingPoint);
router.post('/boats', protect, authorizeRoles(ROLES.ADMIN), createBoat);

module.exports = router;
