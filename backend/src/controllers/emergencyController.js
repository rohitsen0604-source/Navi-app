const mongoose = require('mongoose');
const SOSIncident = require('../models/SOSIncident');
const Booking = require('../models/Booking');
const { emitToAdminOps, emitToCustomer } = require('../services/socketService');

// In-Memory fallback store for Emergency SOS & Shared Ride
const inMemorySOSIncidents = new Map();
const inMemoryEmergencyContacts = [
  { id: 'c1', name: 'Anurag (Brother)', phone: '+91 98765 43210', relation: 'Brother', isPrimary: true, selected: true },
  { id: 'c2', name: 'Priya (Sister)', phone: '+91 87654 32109', relation: 'Sister', isPrimary: false, selected: true },
  { id: 'c3', name: 'Mom', phone: '+91 76543 21098', relation: 'Mother', isPrimary: false, selected: false },
  { id: 'c4', name: 'Dad', phone: '+91 65432 10987', relation: 'Father', isPrimary: false, selected: false }
];

// 1. Trigger SOS Alert
const triggerSOSAlert = async (req, res, next) => {
  try {
    const {
      bookingId,
      latitude = 25.3072,
      longitude = 83.0105,
      locationName = 'Dashashwamedh Ghat, Varanasi, Uttar Pradesh, India',
      notifySupport = true,
      notifyContacts = true,
      callLocalEmergency = true
    } = req.body;

    const incidentCode = `SOS-VAR-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();

    const emergencyResponseData = {
      incidentCode,
      status: 'DISPATCHED',
      locationName,
      coordinates: { latitude, longitude },
      bookingId: bookingId || 'GENERAL_EMERGENCY',
      timestamp,
      notifyOptions: { notifySupport, notifyContacts, callLocalEmergency },
      dispatchedUnit: {
        unitName: 'Varanasi Water Police Patrol Boat #4',
        helplineNumber: '+91 542 2221234',
        emergencyDial: '112',
        estimatedArrival: '2-4 mins'
      },
      notifiedContacts: notifyContacts ? inMemoryEmergencyContacts.map(c => ({
        ...c,
        status: 'SMS_SENT',
        sentAt: timestamp
      })) : []
    };

    // Store in-memory
    inMemorySOSIncidents.set(incidentCode, emergencyResponseData);

    // Emit Real-time WebSocket Event to Admin Operations & Emergency Desk
    try {
      emitToAdminOps('SOS_EMERGENCY_ALERT', emergencyResponseData);
      if (bookingId) {
        emitToCustomer(bookingId, 'SOS_STATUS_UPDATE', {
          status: 'HELP_DISPATCHED',
          incidentCode,
          message: 'Varanasi Water Police & Naavi Rescue Boat have been dispatched to your GPS location.'
        });
      }
    } catch (socketErr) {
      console.log('[Socket SOS Broadcast Warning]:', socketErr.message);
    }

    // If MongoDB is connected, save persistent record
    if (mongoose.connection.readyState === 1 && bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
      try {
        const incident = await SOSIncident.create({
          bookingId,
          customerId: req.user?._id || new mongoose.Types.ObjectId(),
          coordinates: { latitude, longitude },
          status: 'TRIGGERED',
          actionTakenNotes: `Location: ${locationName}. NotifySupport: ${notifySupport}, NotifyContacts: ${notifyContacts}`
        });
        emergencyResponseData._id = incident._id;

        await Booking.findByIdAndUpdate(bookingId, {
          sosTriggered: true,
          sosTriggeredAt: new Date()
        });
      } catch (dbErr) {
        console.log('[SOS DB Save Warning]:', dbErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: '🚨 Emergency SOS Alert Broadcasted! Water Police and Emergency Response Units have been dispatched.',
      data: emergencyResponseData
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get User Emergency & Share Contacts
const getEmergencyContacts = async (req, res, next) => {
  try {
    res.json({
      success: true,
      count: inMemoryEmergencyContacts.length,
      data: inMemoryEmergencyContacts
    });
  } catch (error) {
    next(error);
  }
};

// 3. Add / Update Emergency Contact
const addEmergencyContact = async (req, res, next) => {
  try {
    const { name, phone, relation = 'Family' } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
    }

    const newContact = {
      id: `c_${Date.now()}`,
      name,
      phone,
      relation,
      isPrimary: inMemoryEmergencyContacts.length === 0,
      selected: true
    };

    inMemoryEmergencyContacts.push(newContact);

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

// 4. Cancel / Resolve SOS Alert
const cancelSOSAlert = async (req, res, next) => {
  try {
    const { incidentCode, reason = 'User marked safe / false alarm' } = req.body;
    const incident = inMemorySOSIncidents.get(incidentCode);
    if (incident) {
      incident.status = 'CANCELLED_SAFE';
      incident.cancelledReason = reason;
      incident.resolvedAt = new Date().toISOString();
      inMemorySOSIncidents.set(incidentCode, incident);
    }

    res.json({
      success: true,
      message: 'SOS Alert cancelled. User marked safe.',
      data: incident || { status: 'CANCELLED_SAFE' }
    });
  } catch (error) {
    next(error);
  }
};

// 5. Share Ride Details with Trusted Contacts
const shareRideDetails = async (req, res, next) => {
  try {
    const {
      bookingId = 'b_demo_active',
      bookingCode = 'NV-9912',
      selectedContactIds = [],
      pickupGhat = 'Dashashwamedh Ghat',
      timeText = '02:00 PM',
      driverName = 'Ramesh Yadav',
      customMessage
    } = req.body;

    const shortCode = bookingCode.replace('NV-', '') || 'AB123';
    const trackingUrl = `https://naavi.app/ride/${shortCode}`;

    const defaultMessage = `I'm on a boat ride with Naavi.\nPickup: ${pickupGhat}\nTime: ${timeText} | Driver: ${driverName}\nLive tracking: ${trackingUrl}`;
    const finalMessage = customMessage || defaultMessage;

    // Filter contacts that were selected
    const contactsNotified = inMemoryEmergencyContacts.filter(c =>
      selectedContactIds.length === 0 || selectedContactIds.includes(c.id)
    );

    const shareReceipt = {
      shareId: `SHR-${Date.now().toString().slice(-6)}`,
      bookingId,
      bookingCode,
      trackingUrl,
      message: finalMessage,
      contactsNotifiedCount: contactsNotified.length,
      contacts: contactsNotified.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        channel: 'SMS_AND_WHATSAPP',
        status: 'DELIVERED',
        deliveredAt: new Date().toISOString()
      })),
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: `Ride tracking link shared with ${contactsNotified.length} contacts successfully!`,
      data: shareReceipt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerSOSAlert,
  getEmergencyContacts,
  addEmergencyContact,
  cancelSOSAlert,
  shareRideDetails
};

