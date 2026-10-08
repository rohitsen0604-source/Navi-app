const Driver = require('../models/Driver');
const Boat = require('../models/Boat');
const Zone = require('../models/Zone');
const Booking = require('../models/Booking');
const { BOOKING_STATUS } = require('../config/constants');
const { acquireLock, releaseLock } = require('../config/redis');
const { emitToDriver, broadcastRideLifecycleUpdate } = require('./socketService');

/**
 * Central Booking Allocation Engine
 * Rules:
 * 1. Driver must be Duty ON
 * 2. Driver must not have an active ride
 * 3. Associated Boat capacity must accommodate seatsBooked
 * 4. Associated Boat category must match requested boatCategory
 * 5. Primary preference: Same zone
 * 6. Fallback preference: Adjacent zones
 * 7. Redis atomic lock ensures no duplicate assignment
 */
const findAndAssignDriver = async (bookingId) => {
  const booking = await Booking.findById(bookingId).populate('boardingPointId');
  if (!booking || booking.status !== BOOKING_STATUS.SEARCHING_DRIVER) {
    return { success: false, message: 'Invalid booking state' };
  }

  // Fetch target zone and adjacent zones
  const zone = await Zone.findOne({ zoneNumber: booking.zoneNumber });
  const adjacentZoneNumbers = zone ? zone.adjacentZoneNumbers : [];
  const candidateZones = [booking.zoneNumber, ...adjacentZoneNumbers];

  console.log(`[Allocation Engine] Searching driver for Booking ${booking.bookingCode} in Zones:`, candidateZones);

  // Search candidate drivers
  for (const targetZoneNumber of candidateZones) {
    const candidateDrivers = await Driver.find({
      operationalZoneNumber: targetZoneNumber,
      isDutyOn: true,
      isCurrentlyOnRide: false,
      approvalStatus: 'APPROVED'
    }).populate('assignedBoatId');

    for (const driver of candidateDrivers) {
      const boat = driver.assignedBoatId;
      if (!boat || boat.status !== 'AVAILABLE') continue;

      // Boat category match & capacity check (accommodates booked seats)
      if (boat.category !== booking.boatCategory) continue;
      if (boat.capacity < booking.seatsBooked) continue;

      // Attempt atomic reservation lock on driver
      const lockKey = `lock:driver:${driver._id}`;
      const acquired = await acquireLock(lockKey, 45); // 45 seconds lock window

      if (acquired) {
        console.log(`[Allocation Engine] Candidate Driver matched: ${driver.name} (${driver.driverCode})`);

        // Send booking request to driver
        booking.driverId = driver._id;
        booking.boatId = boat._id;
        booking.status = BOOKING_STATUS.DRIVER_REQUESTED;
        await booking.save();

        emitToDriver(driver._id.toString(), 'NEW_BOOKING_REQUEST', {
          bookingId: booking._id,
          bookingCode: booking.bookingCode,
          boardingPoint: booking.boardingPointId?.name,
          zoneNumber: booking.zoneNumber,
          seats: booking.seatsBooked,
          tripType: booking.tripType,
          fareAmount: booking.finalPayableAmount,
          timeoutSeconds: 30
        });

        broadcastRideLifecycleUpdate(booking);
        return { success: true, driver, boat, booking };
      }
    }
  }

  console.log(`[Allocation Engine] No immediate driver available for Booking ${booking.bookingCode}`);
  return { success: false, message: 'No available drivers found in operational zone' };
};

/**
 * Driver accepts the booking request
 */
const driverAcceptsBooking = async (bookingId, driverId) => {
  const lockKey = `lock:driver:${driverId}`;
  const booking = await Booking.findById(bookingId);
  const driver = await Driver.findById(driverId);

  if (!booking || !driver) {
    await releaseLock(lockKey);
    throw new Error('Booking or driver not found');
  }

  if (booking.status !== BOOKING_STATUS.DRIVER_REQUESTED) {
    await releaseLock(lockKey);
    throw new Error('Booking is no longer awaiting acceptance');
  }

  // Update states atomically
  booking.status = BOOKING_STATUS.DRIVER_ASSIGNED;
  booking.driverId = driver._id;
  await booking.save();

  driver.isCurrentlyOnRide = true;
  driver.currentActiveBookingId = booking._id;
  await driver.save();

  await releaseLock(lockKey);

  broadcastRideLifecycleUpdate(booking);
  return { success: true, booking };
};

/**
 * Driver rejects or times out
 */
const driverRejectsBooking = async (bookingId, driverId) => {
  const lockKey = `lock:driver:${driverId}`;
  await releaseLock(lockKey);

  const booking = await Booking.findById(bookingId);
  if (booking && booking.status === BOOKING_STATUS.DRIVER_REQUESTED) {
    booking.driverId = null;
    booking.boatId = null;
    booking.status = BOOKING_STATUS.SEARCHING_DRIVER;
    await booking.save();

    broadcastRideLifecycleUpdate(booking);

    // Trigger next round of allocation
    setTimeout(() => {
      findAndAssignDriver(bookingId);
    }, 1000);
  }
};

module.exports = {
  findAndAssignDriver,
  driverAcceptsBooking,
  driverRejectsBooking
};
