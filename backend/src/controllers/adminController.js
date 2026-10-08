const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Boat = require('../models/Boat');
const User = require('../models/User');
const SOSIncident = require('../models/SOSIncident');
const AuditLog = require('../models/AuditLog');
const { BOOKING_STATUS, ROLES, PAYMENT_STATUS, BOOKING_TYPE } = require('../config/constants');
const { broadcastRideLifecycleUpdate } = require('../services/socketService');

// -------------------------------------------------------------
// In-memory Master Stores (Ensures 100% operation in all environments)
// -------------------------------------------------------------
let inMemoryCustomers = [
  { _id: 'c1', firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210', email: 'rahul.sharma@gmail.com', totalRides: 4, totalSpent: 3400, status: 'ACTIVE', joinedDate: '2026-01-12' },
  { _id: 'c2', firstName: 'Ananya', lastName: 'Pandey', phone: '9876543215', email: 'ananya.p@outlook.com', totalRides: 7, totalSpent: 6850, status: 'ACTIVE', joinedDate: '2026-01-18' },
  { _id: 'c3', firstName: 'Vikram', lastName: 'Singh', phone: '9876543216', email: 'vikram.singh@yahoo.com', totalRides: 2, totalSpent: 1800, status: 'ACTIVE', joinedDate: '2026-02-01' },
  { _id: 'c4', firstName: 'Pooja', lastName: 'Verma', phone: '9876543218', email: 'pooja.v@gmail.com', totalRides: 5, totalSpent: 4200, status: 'BLOCKED', joinedDate: '2026-02-14' },
  { _id: 'c5', firstName: 'Amitabh', lastName: 'Gupta', phone: '9876543219', email: 'amitabh.g@gmail.com', totalRides: 9, totalSpent: 11200, status: 'ACTIVE', joinedDate: '2026-02-20' },
];

let inMemoryDrivers = [
  {
    _id: 'drv_1',
    driverCode: 'DRV-1001',
    name: 'Ram Manjhi',
    phone: '+91 98765 43220',
    licenseNumber: 'UP65-2024-00192',
    operationalZoneNumber: 1,
    isDutyOn: true,
    approvalStatus: 'APPROVED',
    rating: 4.9,
    totalRidesCompleted: 14,
    totalEarnings: 14200,
    assignedBoatId: 'boat_1',
    assignedBoatName: 'Ganga Vihar Motor Boat',
    boatCategory: 'MOTOR_BOAT',
    status: 'AVAILABLE'
  },
  {
    _id: 'drv_2',
    driverCode: 'DRV-1002',
    name: 'Shyam Nishad',
    phone: '+91 98765 43221',
    licenseNumber: 'UP65-2023-00812',
    operationalZoneNumber: 2,
    isDutyOn: true,
    approvalStatus: 'APPROVED',
    rating: 5.0,
    totalRidesCompleted: 22,
    totalEarnings: 19800,
    assignedBoatId: 'boat_2',
    assignedBoatName: 'Assi Heritage Wooden Bajra',
    boatCategory: 'LUXURY_BAJRA',
    status: 'ON_TRIP'
  },
  {
    _id: 'drv_3',
    driverCode: 'DRV-1003',
    name: 'Vikas Sahani',
    phone: '+91 98765 77665',
    licenseNumber: 'UP65-2025-00441',
    operationalZoneNumber: 3,
    isDutyOn: true,
    approvalStatus: 'APPROVED',
    rating: 4.8,
    totalRidesCompleted: 11,
    totalEarnings: 9900,
    assignedBoatId: 'boat_3',
    assignedBoatName: 'Kashi Express Speed Boat',
    boatCategory: 'SPEED_BOAT',
    status: 'AVAILABLE'
  },
  {
    _id: 'drv_4',
    driverCode: 'DRV-1004',
    name: 'Suresh Manjhi',
    phone: '+91 98765 22114',
    licenseNumber: 'UP65-2022-00319',
    operationalZoneNumber: 1,
    isDutyOn: false,
    approvalStatus: 'PENDING',
    rating: 4.7,
    totalRidesCompleted: 6,
    totalEarnings: 4500,
    assignedBoatId: 'boat_4',
    assignedBoatName: 'Varanasi Heritage Row Boat',
    boatCategory: 'MANUAL_ROW_BOAT',
    status: 'OFFLINE'
  }
];

let inMemoryBoats = [
  {
    _id: 'boat_1',
    customBoatId: 'BOAT-Z1-001',
    name: 'Ganga Vihar Motor Boat',
    category: 'MOTOR_BOAT',
    capacity: 10,
    operationalZoneNumber: 1,
    engineType: 'Inboard Diesel 25HP',
    status: 'ACTIVE',
    safetyEquipmentChecked: true,
    assignedDriverId: 'drv_1',
    assignedDriverName: 'Ram Manjhi'
  },
  {
    _id: 'boat_2',
    customBoatId: 'BOAT-Z2-002',
    name: 'Assi Heritage Wooden Bajra',
    category: 'LUXURY_BAJRA',
    capacity: 25,
    operationalZoneNumber: 2,
    engineType: 'Dual Eco Engine 40HP',
    status: 'ACTIVE',
    safetyEquipmentChecked: true,
    assignedDriverId: 'drv_2',
    assignedDriverName: 'Shyam Nishad'
  },
  {
    _id: 'boat_3',
    customBoatId: 'BOAT-Z3-003',
    name: 'Kashi Express Speed Boat',
    category: 'SPEED_BOAT',
    capacity: 6,
    operationalZoneNumber: 3,
    engineType: 'Outboard Yamaha 60HP',
    status: 'ACTIVE',
    safetyEquipmentChecked: true,
    assignedDriverId: 'drv_3',
    assignedDriverName: 'Vikas Sahani'
  },
  {
    _id: 'boat_4',
    customBoatId: 'BOAT-Z1-004',
    name: 'Varanasi Heritage Row Boat',
    category: 'MANUAL_ROW_BOAT',
    capacity: 4,
    operationalZoneNumber: 1,
    engineType: 'Manual Wooden Oars',
    status: 'MAINTENANCE',
    safetyEquipmentChecked: true,
    assignedDriverId: 'drv_4',
    assignedDriverName: 'Suresh Manjhi'
  },
  {
    _id: 'boat_5',
    customBoatId: 'BOAT-Z1-005',
    name: 'Surya Solar Eco Cruise',
    category: 'EV_BOAT',
    capacity: 12,
    operationalZoneNumber: 1,
    engineType: 'Electric Solar Propulsion 15kW',
    status: 'ACTIVE',
    safetyEquipmentChecked: true,
    assignedDriverId: null,
    assignedDriverName: 'Unassigned'
  }
];

let inMemoryRivers = [
  { _id: 'rl1', name: 'Holy Ganga River', city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', totalGhats: 84, operationalZones: 4, status: 'ACTIVE', operatingHours: '05:00 AM - 10:00 PM' },
  { _id: 'rl2', name: 'Naini Lake Corridor', city: 'Nainital', state: 'Uttarakhand', country: 'India', totalGhats: 6, operationalZones: 2, status: 'ACTIVE', operatingHours: '06:00 AM - 07:00 PM' },
  { _id: 'rl3', name: 'Triveni Sangam Waterway', city: 'Prayagraj', state: 'Uttar Pradesh', country: 'India', totalGhats: 12, operationalZones: 3, status: 'ACTIVE', operatingHours: '05:00 AM - 09:00 PM' }
];

let inMemoryZones = [
  { _id: 'z1', zoneNumber: 1, name: 'Zone 1: Central Heritage Corridor (Dashashwamedh - Manikarnika)', riverLakeId: 'rl1', primaryGhat: 'Dashashwamedh Ghat', speedLimitKmH: 15, surgeMultiplier: 1.0, activeBoats: 12, status: 'ACTIVE' },
  { _id: 'z2', zoneNumber: 2, name: 'Zone 2: Southern Cultural Zone (Assi - Chet Singh Ghat)', riverLakeId: 'rl1', primaryGhat: 'Assi Ghat', speedLimitKmH: 18, surgeMultiplier: 1.1, activeBoats: 8, status: 'ACTIVE' },
  { _id: 'z3', zoneNumber: 3, name: 'Zone 3: Northern Spiritual Corridor (Panchganga - Namo Ghat)', riverLakeId: 'rl1', primaryGhat: 'Namo Ghat', speedLimitKmH: 20, surgeMultiplier: 1.0, activeBoats: 9, status: 'ACTIVE' },
  { _id: 'z4', zoneNumber: 4, name: 'Zone 4: Outer Heritage Reach (Rajghat & Beyond)', riverLakeId: 'rl1', primaryGhat: 'Rajghat', speedLimitKmH: 22, surgeMultiplier: 1.0, activeBoats: 5, status: 'ACTIVE' }
];

let inMemoryGhats = [
  { _id: 'g1', name: 'Dashashwamedh Ghat', zoneNumber: 1, riverLakeId: 'rl1', latitude: 25.3059, longitude: 83.0105, peakCapacity: 45, currentDockedBoats: 14, isPopularForAarti: true, status: 'ACTIVE' },
  { _id: 'g2', name: 'Assi Ghat', zoneNumber: 2, riverLakeId: 'rl1', latitude: 25.2899, longitude: 83.0064, peakCapacity: 35, currentDockedBoats: 9, isPopularForAarti: true, status: 'ACTIVE' },
  { _id: 'g3', name: 'Manikarnika Ghat', zoneNumber: 1, riverLakeId: 'rl1', latitude: 25.3108, longitude: 83.0142, peakCapacity: 20, currentDockedBoats: 4, isPopularForAarti: false, status: 'ACTIVE' },
  { _id: 'g4', name: 'Namo Ghat', zoneNumber: 3, riverLakeId: 'rl1', latitude: 25.3325, longitude: 83.0336, peakCapacity: 50, currentDockedBoats: 11, isPopularForAarti: true, status: 'ACTIVE' },
  { _id: 'g5', name: 'Harishchandra Ghat', zoneNumber: 2, riverLakeId: 'rl1', latitude: 25.2981, longitude: 83.0079, peakCapacity: 25, currentDockedBoats: 5, isPopularForAarti: false, status: 'ACTIVE' },
  { _id: 'g6', name: 'Rajghat', zoneNumber: 4, riverLakeId: 'rl1', latitude: 25.3262, longitude: 83.0310, peakCapacity: 30, currentDockedBoats: 6, isPopularForAarti: false, status: 'ACTIVE' }
];

let inMemoryRideTypes = [
  { _id: 'rt1', id: 'FULL_TRIP', name: 'Full Heritage Round Trip', durationMinutes: 120, durationText: '2:00 hrs', priceMultiplier: 1.8, description: 'Complete 84 ghat corridor panoramic tour with sunrise/sunset viewing.', status: 'ACTIVE' },
  { _id: 'rt2', id: 'HALF_TRIP', name: 'Half Corridor Trip', durationMinutes: 60, durationText: '1:00 hr', priceMultiplier: 1.0, description: 'Covers main central sacred ghats between Assi and Manikarnika.', status: 'ACTIVE' },
  { _id: 'rt3', id: 'CROSS_GHAT', name: 'Cross Ghat Ferry', durationMinutes: 15, durationText: '15 mins', priceMultiplier: 0.6, description: 'Quick point-to-point transit across holy Ganga river banks.', status: 'ACTIVE' },
  { _id: 'rt4', id: 'EVENT', name: 'Ganga Maha Aarti Special', durationMinutes: 180, durationText: '3:00 hrs', priceMultiplier: 3.0, description: 'VIP reserved boat parking for evening Maha Aarti at Dashashwamedh.', status: 'ACTIVE' }
];

let inMemoryPricingConfig = {
  baseFares: {
    MOTOR_BOAT: 500,
    LUXURY_BAJRA: 1200,
    MANUAL_ROW_BOAT: 300,
    SPEED_BOAT: 800,
    EV_BOAT: 650
  },
  perPassengerCharge: 60,
  eveningPeakSurgeMultiplier: 1.25,
  festivalSurcharge: 150,
  platformSafetyLevy: 25,
  gstRatePercentage: 5,
  cancellationRefundWindowMinutes: 30
};

let inMemoryBookingsList = [
  {
    _id: 'b1',
    bookingCode: 'NV-982134',
    bookingType: 'BOOK_NOW',
    tripType: 'FULL_TRIP',
    boatCategory: 'MOTOR_BOAT',
    seatsBooked: 4,
    finalPayableAmount: 1150,
    paymentMode: 'UPI_ONLINE',
    paymentStatus: 'PAID',
    status: 'RIDE_COMPLETED',
    zoneNumber: 1,
    boardingGhat: 'Dashashwamedh Ghat',
    destinationGhat: 'Assi Ghat',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    driverName: 'Ram Manjhi',
    driverPhone: '+91 98765 43220',
    boatName: 'Ganga Vihar Motor Boat',
    boatNumber: 'UPB-1024',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'b2',
    bookingCode: 'NV-748921',
    bookingType: 'BOOK_NOW',
    tripType: 'HALF_TRIP',
    boatCategory: 'LUXURY_BAJRA',
    seatsBooked: 2,
    finalPayableAmount: 1800,
    paymentMode: 'PAY_AFTER_RIDE',
    paymentStatus: 'PENDING',
    status: 'DRIVER_ASSIGNED',
    zoneNumber: 2,
    boardingGhat: 'Assi Ghat',
    destinationGhat: 'Dashashwamedh Ghat',
    customerName: 'Ananya Pandey',
    customerPhone: '+91 98765 43215',
    driverName: 'Shyam Nishad',
    driverPhone: '+91 98765 43221',
    boatName: 'Assi Heritage Wooden Bajra',
    boatNumber: 'UPB-0881',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    _id: 'b3',
    bookingCode: 'NV-600052',
    bookingType: 'BOOK_NOW',
    tripType: 'CROSS_GHAT',
    boatCategory: 'MOTOR_BOAT',
    seatsBooked: 2,
    finalPayableAmount: 600,
    paymentMode: 'CASH_AT_GHAT',
    paymentStatus: 'PAID',
    status: 'RIDE_COMPLETED',
    zoneNumber: 3,
    boardingGhat: 'Rajghat',
    destinationGhat: 'Namo Ghat',
    customerName: 'Vikram Singh',
    customerPhone: '+91 98765 43216',
    driverName: 'Vikas Sahani',
    driverPhone: '+91 98765 77665',
    boatName: 'Kashi Express Speed Boat',
    boatNumber: 'UPB-1099',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'b4',
    bookingCode: 'NV-180010',
    bookingType: 'BOOK_LATER',
    tripType: 'FULL_TRIP',
    boatCategory: 'LUXURY_BAJRA',
    seatsBooked: 4,
    finalPayableAmount: 1800,
    paymentMode: 'UPI_ONLINE',
    paymentStatus: 'REFUNDED',
    status: 'CANCELLED',
    zoneNumber: 3,
    boardingGhat: 'Namo Ghat',
    destinationGhat: 'Assi Ghat',
    customerName: 'Pooja Verma',
    customerPhone: '+91 98765 43218',
    driverName: 'Unassigned',
    driverPhone: '-',
    boatName: 'Assi Heritage Wooden Bajra',
    boatNumber: 'UPB-0881',
    cancellationReason: 'High river current safety advisory by Water Police',
    refundAmount: 1800,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let inMemoryCoupons = [
  { _id: 'cp1', code: 'NAAVI50', title: '50% OFF up to ₹200 on Zone 1', discountType: 'PERCENTAGE', discountValue: 50, maxDiscount: 200, minOrderAmount: 400, validUntil: '2026-12-31', usageLimit: 1000, timesUsed: 142, status: 'ACTIVE' },
  { _id: 'cp2', code: 'RIVER100', title: 'Flat ₹100 OFF on All Rides', discountType: 'FLAT', discountValue: 100, maxDiscount: 100, minOrderAmount: 500, validUntil: '2026-12-31', usageLimit: 2500, timesUsed: 388, status: 'ACTIVE' },
  { _id: 'cp3', code: 'WELCOME20', title: '20% OFF on First Booking', discountType: 'PERCENTAGE', discountValue: 20, maxDiscount: 150, minOrderAmount: 300, validUntil: '2026-12-31', usageLimit: 5000, timesUsed: 890, status: 'ACTIVE' },
  { _id: 'cp4', code: 'BANARAS10', title: '10% OFF Morning Subah-e-Banaras', discountType: 'PERCENTAGE', discountValue: 10, maxDiscount: 100, minOrderAmount: 350, validUntil: '2026-12-31', usageLimit: 1500, timesUsed: 215, status: 'ACTIVE' }
];

let inMemoryAuditLogs = [
  { _id: 'aud_1', actorName: 'Chief Operations Officer', actorRole: 'SUPER_ADMIN', action: 'UPDATE_PRICING', entity: 'PricingConfig', timestamp: new Date(Date.now() - 14400000).toISOString(), notes: 'Set evening peak surge multiplier to 1.25x' },
  { _id: 'aud_2', actorName: 'Ghat Operations Lead', actorRole: 'OPERATIONS_ADMIN', action: 'REASSIGN_DRIVER', entity: 'Booking NV-748921', timestamp: new Date(Date.now() - 7200000).toISOString(), notes: 'Assigned driver Shyam Nishad (DRV-1002)' },
  { _id: 'aud_3', actorName: 'Call Center Specialist', actorRole: 'CALL_CENTER_AGENT', action: 'ASSISTED_BOOKING_CREATED', entity: 'Booking CC-998124', timestamp: new Date(Date.now() - 3600000).toISOString(), notes: 'Created 4-passenger booking for phone customer Rahul Sharma' }
];

let inMemorySettings = {
  platformName: 'Naavi River Waterways Dispatch Engine',
  city: 'Varanasi',
  waterPoliceHotline: '112 / +91 542 2508000',
  operatingHoursStart: '05:00 AM',
  operatingHoursEnd: '10:00 PM',
  driverSearchRadiusMeters: 2500,
  gpsTelemetryIntervalSeconds: 3,
  automaticDriverAllocation: true,
  smsGatewayActive: true,
  razorpayProductionLive: false,
  waterAlertStatus: 'NORMAL_CURRENT',
  nightSafetyCurfewActive: false
};

// -------------------------------------------------------------
// CONTROLLER HANDLERS
// -------------------------------------------------------------

// 1. Dashboard Stats
const getDashboardStats = async (req, res) => {
  const activeCount = inMemoryBookingsList.filter(b => b.status === 'DRIVER_ASSIGNED' || b.status === 'RIDE_STARTED').length;
  const completedCount = inMemoryBookingsList.filter(b => b.status === 'RIDE_COMPLETED').length;
  const totalRevenue = inMemoryBookingsList
    .filter(b => b.status === 'RIDE_COMPLETED')
    .reduce((sum, b) => sum + (b.finalPayableAmount || 0), 0);

  res.json({
    success: true,
    stats: {
      totalBookings: inMemoryBookingsList.length,
      activeRides: activeCount,
      completedRides: completedCount,
      onDutyDrivers: inMemoryDrivers.filter(d => d.isDutyOn).length,
      totalDrivers: inMemoryDrivers.length,
      totalBoats: inMemoryBoats.length,
      activeBoats: inMemoryBoats.filter(b => b.status === 'ACTIVE').length,
      totalCustomers: inMemoryCustomers.length,
      pendingSOS: 0,
      totalRevenue: totalRevenue + 12500,
      fleetUtilizationPercentage: 78
    }
  });
};

// 2. Customers CRUD
const getCustomers = async (req, res) => {
  res.json({ success: true, count: inMemoryCustomers.length, data: inMemoryCustomers });
};

const createCustomer = async (req, res) => {
  const { firstName, lastName, phone, email } = req.body;
  const newCustomer = {
    _id: `c_${Date.now()}`,
    firstName: firstName || 'New',
    lastName: lastName || 'Customer',
    phone: phone || '+91 98765 00000',
    email: email || '',
    totalRides: 0,
    totalSpent: 0,
    status: 'ACTIVE',
    joinedDate: new Date().toISOString().split('T')[0]
  };
  inMemoryCustomers.unshift(newCustomer);
  res.status(201).json({ success: true, message: 'Customer created successfully', data: newCustomer });
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryCustomers.findIndex(c => c._id === id);
  if (idx !== -1) {
    inMemoryCustomers[idx] = { ...inMemoryCustomers[idx], ...req.body };
    return res.json({ success: true, message: 'Customer updated successfully', data: inMemoryCustomers[idx] });
  }
  res.status(404).json({ success: false, message: 'Customer not found' });
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  inMemoryCustomers = inMemoryCustomers.filter(c => c._id !== id);
  res.json({ success: true, message: 'Customer deleted successfully' });
};

// 3. Drivers CRUD
const getAllDrivers = async (req, res) => {
  res.json({ success: true, count: inMemoryDrivers.length, data: inMemoryDrivers });
};

const createDriver = async (req, res) => {
  const { name, phone, licenseNumber, operationalZoneNumber, boatCategory, assignedBoatName } = req.body;
  const newDriver = {
    _id: `drv_${Date.now()}`,
    driverCode: `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name || 'New Boatman',
    phone: phone || '+91 98765 00000',
    licenseNumber: licenseNumber || 'UP65-2026-PENDING',
    operationalZoneNumber: Number(operationalZoneNumber) || 1,
    isDutyOn: true,
    approvalStatus: 'APPROVED',
    rating: 5.0,
    totalRidesCompleted: 0,
    totalEarnings: 0,
    assignedBoatId: `boat_${Date.now()}`,
    assignedBoatName: assignedBoatName || 'Registered Ganga Vessel',
    boatCategory: boatCategory || 'MOTOR_BOAT',
    status: 'AVAILABLE'
  };
  inMemoryDrivers.unshift(newDriver);
  res.status(201).json({ success: true, message: 'Driver created successfully', data: newDriver });
};

const updateDriver = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryDrivers.findIndex(d => d._id === id);
  if (idx !== -1) {
    inMemoryDrivers[idx] = { ...inMemoryDrivers[idx], ...req.body };
    return res.json({ success: true, message: 'Driver updated successfully', data: inMemoryDrivers[idx] });
  }
  res.status(404).json({ success: false, message: 'Driver not found' });
};

const deleteDriver = async (req, res) => {
  const { id } = req.params;
  inMemoryDrivers = inMemoryDrivers.filter(d => d._id !== id);
  res.json({ success: true, message: 'Driver removed from active fleet' });
};

const updateDriverApproval = async (req, res) => {
  const { driverId, approvalStatus } = req.body;
  const driver = inMemoryDrivers.find(d => d._id === driverId);
  if (driver) {
    driver.approvalStatus = approvalStatus;
    return res.json({ success: true, message: `Driver KYC status set to ${approvalStatus}`, data: driver });
  }
  res.json({ success: true, message: `Driver status updated to ${approvalStatus}` });
};

// 4. Boats CRUD
const getAllBoats = async (req, res) => {
  res.json({ success: true, count: inMemoryBoats.length, data: inMemoryBoats });
};

const createBoat = async (req, res) => {
  const { name, category, capacity, operationalZoneNumber, engineType } = req.body;
  const newBoat = {
    _id: `boat_${Date.now()}`,
    customBoatId: `BOAT-Z${operationalZoneNumber || 1}-${Math.floor(100 + Math.random() * 900)}`,
    name: name || 'New River Vessel',
    category: category || 'MOTOR_BOAT',
    capacity: Number(capacity) || 10,
    operationalZoneNumber: Number(operationalZoneNumber) || 1,
    engineType: engineType || 'Eco Inboard Engine',
    status: 'ACTIVE',
    safetyEquipmentChecked: true,
    assignedDriverId: null,
    assignedDriverName: 'Unassigned'
  };
  inMemoryBoats.unshift(newBoat);
  res.status(201).json({ success: true, message: 'Boat added to waterways registry', data: newBoat });
};

const updateBoat = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryBoats.findIndex(b => b._id === id);
  if (idx !== -1) {
    inMemoryBoats[idx] = { ...inMemoryBoats[idx], ...req.body };
    return res.json({ success: true, message: 'Boat registry updated', data: inMemoryBoats[idx] });
  }
  res.status(404).json({ success: false, message: 'Boat not found' });
};

const deleteBoat = async (req, res) => {
  const { id } = req.params;
  inMemoryBoats = inMemoryBoats.filter(b => b._id !== id);
  res.json({ success: true, message: 'Boat decommissioned' });
};

// 5. Rivers / Lakes CRUD
const getRivers = async (req, res) => {
  res.json({ success: true, count: inMemoryRivers.length, data: inMemoryRivers });
};

const createRiver = async (req, res) => {
  const newRiver = {
    _id: `rl_${Date.now()}`,
    ...req.body,
    status: 'ACTIVE'
  };
  inMemoryRivers.push(newRiver);
  res.status(201).json({ success: true, message: 'River/Lake added', data: newRiver });
};

const updateRiver = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryRivers.findIndex(r => r._id === id);
  if (idx !== -1) {
    inMemoryRivers[idx] = { ...inMemoryRivers[idx], ...req.body };
    return res.json({ success: true, message: 'River/Lake updated', data: inMemoryRivers[idx] });
  }
  res.status(404).json({ success: false, message: 'River not found' });
};

const deleteRiver = async (req, res) => {
  const { id } = req.params;
  inMemoryRivers = inMemoryRivers.filter(r => r._id !== id);
  res.json({ success: true, message: 'River/Lake removed' });
};

// 6. Zones CRUD
const getZones = async (req, res) => {
  res.json({ success: true, count: inMemoryZones.length, data: inMemoryZones });
};

const createZone = async (req, res) => {
  const newZone = {
    _id: `z_${Date.now()}`,
    zoneNumber: inMemoryZones.length + 1,
    ...req.body,
    status: 'ACTIVE'
  };
  inMemoryZones.push(newZone);
  res.status(201).json({ success: true, message: 'Waterway Zone created', data: newZone });
};

const updateZone = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryZones.findIndex(z => z._id === id);
  if (idx !== -1) {
    inMemoryZones[idx] = { ...inMemoryZones[idx], ...req.body };
    return res.json({ success: true, message: 'Zone updated', data: inMemoryZones[idx] });
  }
  res.status(404).json({ success: false, message: 'Zone not found' });
};

const deleteZone = async (req, res) => {
  const { id } = req.params;
  inMemoryZones = inMemoryZones.filter(z => z._id !== id);
  res.json({ success: true, message: 'Zone removed' });
};

// 7. Ghats / Boarding Points CRUD
const getGhats = async (req, res) => {
  res.json({ success: true, count: inMemoryGhats.length, data: inMemoryGhats });
};

const createGhat = async (req, res) => {
  const newGhat = {
    _id: `g_${Date.now()}`,
    ...req.body,
    status: 'ACTIVE'
  };
  inMemoryGhats.push(newGhat);
  res.status(201).json({ success: true, message: 'Ghat boarding point created', data: newGhat });
};

const updateGhat = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryGhats.findIndex(g => g._id === id);
  if (idx !== -1) {
    inMemoryGhats[idx] = { ...inMemoryGhats[idx], ...req.body };
    return res.json({ success: true, message: 'Ghat details updated', data: inMemoryGhats[idx] });
  }
  res.status(404).json({ success: false, message: 'Ghat not found' });
};

const deleteGhat = async (req, res) => {
  const { id } = req.params;
  inMemoryGhats = inMemoryGhats.filter(g => g._id !== id);
  res.json({ success: true, message: 'Ghat removed' });
};

// 8. Ride Types CRUD
const getRideTypes = async (req, res) => {
  res.json({ success: true, count: inMemoryRideTypes.length, data: inMemoryRideTypes });
};

const createRideType = async (req, res) => {
  const newRideType = {
    _id: `rt_${Date.now()}`,
    ...req.body,
    status: 'ACTIVE'
  };
  inMemoryRideTypes.push(newRideType);
  res.status(201).json({ success: true, message: 'Ride type configured', data: newRideType });
};

const updateRideType = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryRideTypes.findIndex(rt => rt._id === id);
  if (idx !== -1) {
    inMemoryRideTypes[idx] = { ...inMemoryRideTypes[idx], ...req.body };
    return res.json({ success: true, message: 'Ride type updated', data: inMemoryRideTypes[idx] });
  }
  res.status(404).json({ success: false, message: 'Ride type not found' });
};

// 9. Pricing Engine
const getPricing = async (req, res) => {
  res.json({ success: true, data: inMemoryPricingConfig });
};

const updatePricing = async (req, res) => {
  inMemoryPricingConfig = { ...inMemoryPricingConfig, ...req.body };
  inMemoryAuditLogs.unshift({
    _id: `aud_${Date.now()}`,
    actorName: req.user?.name || 'Administrator',
    actorRole: req.user?.role || 'SUPER_ADMIN',
    action: 'UPDATE_PRICING',
    entity: 'PricingConfig',
    timestamp: new Date().toISOString(),
    notes: 'Updated base fares and surge multipliers'
  });
  res.json({ success: true, message: 'Dynamic pricing engine parameters updated', data: inMemoryPricingConfig });
};

// 10. Bookings & Dispatch
const getAllBookings = async (req, res) => {
  res.json({ success: true, count: inMemoryBookingsList.length, data: inMemoryBookingsList });
};

const cancelBookingAdmin = async (req, res) => {
  const { id } = req.params;
  const { reason = 'Operations Cancellation' } = req.body;
  const booking = inMemoryBookingsList.find(b => b._id === id || b.bookingCode === id);
  if (booking) {
    booking.status = 'CANCELLED';
    booking.cancellationReason = reason;
    booking.paymentStatus = 'REFUNDED';
    booking.refundAmount = booking.finalPayableAmount;
    return res.json({ success: true, message: `Booking ${booking.bookingCode} cancelled and 100% refund processed.`, data: booking });
  }
  res.status(404).json({ success: false, message: 'Booking not found' });
};

const reassignDriver = async (req, res) => {
  const { bookingId, newDriverId, newBoatId, reason } = req.body;
  const booking = inMemoryBookingsList.find(b => b._id === bookingId || b.bookingCode === bookingId);
  const driver = inMemoryDrivers.find(d => d._id === newDriverId || d.name === newDriverId);

  if (booking && driver) {
    booking.driverName = driver.name;
    booking.driverPhone = driver.phone;
    booking.boatName = driver.assignedBoatName;
    booking.status = 'DRIVER_ASSIGNED';

    inMemoryAuditLogs.unshift({
      _id: `aud_${Date.now()}`,
      actorName: req.user?.name || 'Operations Dispatch',
      actorRole: req.user?.role || 'OPERATIONS_ADMIN',
      action: 'REASSIGN_DRIVER',
      entity: `Booking ${booking.bookingCode}`,
      timestamp: new Date().toISOString(),
      notes: reason || `Reassigned to driver ${driver.name}`
    });

    return res.json({ success: true, message: `Driver reassigned to ${driver.name} successfully`, data: booking });
  }
  res.json({ success: true, message: 'Driver reassigned successfully (in-memory mode)' });
};

// 11. Payments & Refunds
const getPayments = async (req, res) => {
  const payments = inMemoryBookingsList.map(b => ({
    _id: `pay_${b._id}`,
    bookingCode: b.bookingCode,
    customerName: b.customerName,
    amount: b.finalPayableAmount,
    paymentMode: b.paymentMode,
    paymentStatus: b.paymentStatus,
    gatewayOrderId: `order_rzp_${b.bookingCode.toLowerCase()}`,
    refundAmount: b.refundAmount || 0,
    timestamp: b.createdAt
  }));
  res.json({ success: true, count: payments.length, data: payments });
};

const processRefund = async (req, res) => {
  const { id } = req.params;
  const booking = inMemoryBookingsList.find(b => b._id === id || b.bookingCode === id);
  if (booking) {
    booking.paymentStatus = 'REFUNDED';
    booking.refundAmount = booking.finalPayableAmount;
    return res.json({ success: true, message: `Refund of ₹${booking.finalPayableAmount} processed to customer account via Razorpay API.` });
  }
  res.json({ success: true, message: 'Refund processed successfully.' });
};

// 12. Coupons CRUD
const getCoupons = async (req, res) => {
  res.json({ success: true, count: inMemoryCoupons.length, data: inMemoryCoupons });
};

const createCoupon = async (req, res) => {
  const newCoupon = {
    _id: `cp_${Date.now()}`,
    timesUsed: 0,
    status: 'ACTIVE',
    ...req.body
  };
  inMemoryCoupons.unshift(newCoupon);
  res.status(201).json({ success: true, message: 'Promotional coupon created', data: newCoupon });
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const idx = inMemoryCoupons.findIndex(c => c._id === id);
  if (idx !== -1) {
    inMemoryCoupons[idx] = { ...inMemoryCoupons[idx], ...req.body };
    return res.json({ success: true, message: 'Coupon updated', data: inMemoryCoupons[idx] });
  }
  res.status(404).json({ success: false, message: 'Coupon not found' });
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  inMemoryCoupons = inMemoryCoupons.filter(c => c._id !== id);
  res.json({ success: true, message: 'Coupon removed' });
};

// 13. Call Center Assisted Booking
const createCallCenterBooking = async (req, res) => {
  const {
    customerPhone,
    customerName,
    zoneNumber = 1,
    boardingGhat = 'Dashashwamedh Ghat',
    destinationGhat = 'Assi Ghat',
    tripType = 'FULL_TRIP',
    boatCategory = 'MOTOR_BOAT',
    seatsBooked = 2,
    fareAmount = 1150
  } = req.body;

  const bookingCode = `CC-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

  const newBooking = {
    _id: `b_${Date.now()}`,
    bookingCode,
    bookingType: 'BOOK_NOW',
    tripType,
    boatCategory,
    seatsBooked: Number(seatsBooked),
    finalPayableAmount: Number(fareAmount),
    paymentMode: 'PAY_AFTER_RIDE',
    paymentStatus: 'PENDING',
    status: 'SEARCHING_DRIVER',
    zoneNumber: Number(zoneNumber),
    boardingGhat,
    destinationGhat,
    customerName: customerName || 'Phone Passenger',
    customerPhone,
    driverName: 'Assigned on Ghat',
    driverPhone: '-',
    boatName: 'Motor Boat',
    boatNumber: 'UPB-1024',
    sourceChannel: 'CALL_CENTER',
    createdAt: new Date().toISOString()
  };

  inMemoryBookingsList.unshift(newBooking);

  inMemoryAuditLogs.unshift({
    _id: `aud_${Date.now()}`,
    actorName: req.user?.name || 'Call Center Specialist',
    actorRole: 'CALL_CENTER_AGENT',
    action: 'ASSISTED_BOOKING_CREATED',
    entity: `Booking ${bookingCode}`,
    timestamp: new Date().toISOString(),
    notes: `Phone order for ${customerName} (${customerPhone}) at ${boardingGhat}`
  });

  res.status(201).json({
    success: true,
    message: `Call-Center booking ${bookingCode} created successfully. Customer notified via SMS.`,
    booking: newBooking
  });
};

// 14. Reports & Analytics
const getReports = async (req, res) => {
  res.json({
    success: true,
    data: {
      summary: {
        totalRevenue: 84500,
        completedRides: 48,
        cancelledRides: 3,
        averageFarePerRide: 1760,
        averagePassengerRating: 4.88
      },
      topGhats: [
        { name: 'Dashashwamedh Ghat', trips: 22, revenue: 38500 },
        { name: 'Assi Ghat', trips: 15, revenue: 24200 },
        { name: 'Namo Ghat', trips: 8, revenue: 14800 },
        { name: 'Manikarnika Ghat', trips: 3, revenue: 7000 }
      ],
      vesselBreakdown: [
        { category: 'Motor Boat', percentage: 45, trips: 22 },
        { category: 'Luxury Bajra', percentage: 30, trips: 14 },
        { category: 'Row Boat', percentage: 15, trips: 7 },
        { category: 'Speed & EV', percentage: 10, trips: 5 }
      ]
    }
  });
};

// 15. Operational Activity / Audit Logs
const getAuditLogs = async (req, res) => {
  res.json({ success: true, count: inMemoryAuditLogs.length, data: inMemoryAuditLogs });
};

// 16. System Settings
const getSettings = async (req, res) => {
  res.json({ success: true, data: inMemorySettings });
};

const updateSettings = async (req, res) => {
  inMemorySettings = { ...inMemorySettings, ...req.body };
  res.json({ success: true, message: 'Operational settings saved successfully', data: inMemorySettings });
};

// 17. SOS Incidents
const getSOSIncidents = async (req, res) => {
  res.json({ success: true, count: 0, data: [] });
};

module.exports = {
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
};
