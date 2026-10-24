const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../config/constants');

// Central In-Memory Store synchronized across bookingController, driverController, and adminController
const sharedBookings = new Map();

// Initialize initial seed bookings for seamless demo & testing
const initialFixtures = [
  {
    _id: 'b_hist_1',
    bookingCode: 'NV-991201',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MOTOR_BOAT',
    boatName: 'Ganga Vihar Motor Boat',
    boatNumber: 'UPB-1024',
    boatImage: 'assets/images/boat_motor.jpg',
    ghatName: 'Dashashwamedh Ghat',
    boardingGhat: 'Dashashwamedh Ghat',
    destinationGhat: 'Assi Ghat',
    zoneNumber: 1,
    dateTimeText: '25 Feb 2026 | 02:00 PM',
    passengers: 2,
    seatsBooked: 2,
    passengersText: '2 Passengers | Full Trip (2 hrs)',
    tripDuration: 'Full Trip (2 hrs)',
    tripType: 'FULL_TRIP',
    fareAmount: 1150,
    finalPayableAmount: 1150,
    paymentMode: 'ONLINE_PREPAID',
    paymentStatus: 'PAID',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    driverName: 'Ram Manjhi',
    driverPhone: '+91 98765 43220',
    driverId: 'drv_1',
    boatId: 'boat_1',
    startRideOtp: '4921',
    boardingPointId: { _id: 'g1', name: 'Dashashwamedh Ghat' },
    createdAt: new Date('2026-02-25T14:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_2',
    bookingCode: 'NV-700184',
    status: 'RIDE_COMPLETED',
    boatCategory: 'MANUAL_ROW_BOAT',
    boatName: 'Standard Hand-Row Boat',
    boatNumber: 'UPB-0412',
    boatImage: 'assets/images/boat_row.jpg',
    ghatName: 'Assi Ghat',
    boardingGhat: 'Assi Ghat',
    destinationGhat: 'Manikarnika Ghat',
    zoneNumber: 2,
    dateTimeText: '18 Feb 2026 | 04:00 PM',
    passengers: 3,
    seatsBooked: 3,
    passengersText: '3 Passengers | Half Trip (1 hr)',
    tripDuration: 'Half Trip (1 hr)',
    tripType: 'HALF_TRIP',
    fareAmount: 700,
    finalPayableAmount: 700,
    paymentMode: 'PAY_AFTER_RIDE',
    paymentStatus: 'CASH_COLLECTED',
    customerName: 'Ananya Pandey',
    customerPhone: '+91 98765 43215',
    driverName: 'Suresh Manjhi',
    driverPhone: '+91 98765 22114',
    driverId: 'drv_4',
    boatId: 'boat_4',
    startRideOtp: '7182',
    boardingPointId: { _id: 'g2', name: 'Assi Ghat' },
    createdAt: new Date('2026-02-18T16:00:00.000Z').toISOString()
  },
  {
    _id: 'b_hist_3',
    bookingCode: 'NV-180010',
    status: 'CANCELLED',
    boatCategory: 'LUXURY_BAJRA',
    boatName: 'Royal Heritage Bajra',
    boatNumber: 'UPB-0881',
    boatImage: 'assets/images/boat_premium.jpg',
    ghatName: 'Namo Ghat',
    boardingGhat: 'Namo Ghat',
    destinationGhat: 'Dashashwamedh Ghat',
    zoneNumber: 3,
    dateTimeText: '10 Feb 2026 | 11:00 AM',
    passengers: 4,
    seatsBooked: 4,
    passengersText: '4 Passengers | Full Trip (2 hrs)',
    tripDuration: 'Full Trip (2 hrs)',
    tripType: 'FULL_TRIP',
    fareAmount: 1800,
    finalPayableAmount: 1800,
    paymentMode: 'ONLINE_PREPAID',
    paymentStatus: 'REFUNDED',
    refundAmount: 1440,
    cancellationReason: 'High river current safety advisory by Water Police',
    customerName: 'Vikram Singh',
    customerPhone: '+91 98765 43216',
    driverName: 'Vikas Sahani',
    driverPhone: '+91 98765 77665',
    startRideOtp: '3310',
    boardingPointId: { _id: 'g3', name: 'Namo Ghat' },
    createdAt: new Date('2026-02-10T11:00:00.000Z').toISOString()
  }
];

initialFixtures.forEach(b => sharedBookings.set(b._id, b));

const getAllSharedBookings = () => {
  return Array.from(sharedBookings.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getSharedBookingById = (id) => {
  if (!id) return null;
  const idStr = id.toString();
  if (sharedBookings.has(idStr)) return sharedBookings.get(idStr);
  for (const b of sharedBookings.values()) {
    if (b.bookingCode === idStr || b._id === idStr) return b;
  }
  return null;
};

const saveSharedBooking = (booking) => {
  if (!booking) return;
  const id = (booking._id || `b_${Date.now()}`).toString();
  const formatted = {
    ...booking,
    _id: id,
    updatedAt: new Date().toISOString()
  };
  sharedBookings.set(id, formatted);
  return formatted;
};

const updateSharedBooking = (id, updates) => {
  const existing = getSharedBookingById(id);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  sharedBookings.set(existing._id, updated);
  return updated;
};

module.exports = {
  sharedBookings,
  getAllSharedBookings,
  getSharedBookingById,
  saveSharedBooking,
  updateSharedBooking
};
