const inMemoryTickets = new Map();

// Initial demo ticket
inMemoryTickets.set('TKT-VAR-10021', {
  ticketId: 'TKT-VAR-10021',
  category: 'PAYMENT_REFUND',
  categoryTitle: 'Payment & Fare Inquiry',
  bookingCode: 'NV-9912',
  description: 'Inquiry regarding promo code application on full trip bajra ride.',
  status: 'RESOLVED',
  resolutionNotes: 'Coupon discount of ₹100 was successfully credited back to wallet.',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 3600000).toISOString()
});

// 1. Get 24/7 Helpline & Ghat Support Desks
const getHelplineInfo = async (req, res, next) => {
  try {
    const helplineData = {
      hotlines: {
        tollFree: '1800-102-NAAVI (62284)',
        emergencyPolice: '112',
        waterPolice: '+91 542 2221234',
        whatsappSupport: '+91 98765 00000',
        supportEmail: 'support@naavi.in'
      },
      ghatDesks: [
        {
          id: 'gd_1',
          ghatName: 'Dashashwamedh Main Ghat',
          zone: 'Zone 1 Corridor',
          location: 'Adjacent to Main Aarti Steps, Platform #2',
          supervisor: 'Vikas Mishra (Station Officer)',
          phone: '+91 542 2221101',
          timing: '24 Hours (7 Days)',
          availableServices: ['Instant Boat Booking', 'Life Jacket Inspection', 'Lost & Found', 'Dispute Resolution']
        },
        {
          id: 'gd_2',
          ghatName: 'Assi Ghat Operations Desk',
          zone: 'Zone 2 Corridor',
          location: 'South Riverfront Terminal',
          supervisor: 'Sunil Pandey (Shift Incharge)',
          phone: '+91 542 2221102',
          timing: '04:00 AM - 11:30 PM',
          availableServices: ['Morning Aarti Coordination', 'EV Boat Charging Point', 'Passenger Assistance']
        },
        {
          id: 'gd_3',
          ghatName: 'Rajghat Heritage Pier Desk',
          zone: 'Zone 3 Corridor',
          location: 'Near Malviya Bridge Ferry Point',
          supervisor: 'Rajesh Kumar (Harbor Master)',
          phone: '+91 542 2221103',
          timing: '05:00 AM - 10:00 PM',
          availableServices: ['Long-Distance Cruise Information', 'Group Bajra Reservations', 'Safety Check']
        }
      ],
      faqs: [
        {
          q: 'What are the official boating hours on River Ganga in Varanasi?',
          a: 'Standard passenger boating is permitted from 05:00 AM to 09:30 PM under Varanasi District Administration and Water Police guidelines.'
        },
        {
          q: 'Is wearing a life jacket mandatory on all Naavi rides?',
          a: 'Yes, 100% life jacket compliance is strictly enforced across all row boats, motor boats, and luxury bajras.'
        },
        {
          q: 'How can I get an invoice or refund for a cancelled ride?',
          a: 'Invoices can be downloaded instantly from the Ride Completed screen or My Rides history. Refunds for rides cancelled 30 mins prior to departure are processed instantly to your original payment mode.'
        }
      ]
    };

    res.json({
      success: true,
      data: helplineData
    });
  } catch (error) {
    next(error);
  }
};

// 2. Create Support Ticket
const createSupportTicket = async (req, res, next) => {
  try {
    const { category = 'GENERAL', description, bookingCode } = req.body;
    if (!description || description.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide issue description' });
    }

    const ticketId = `TKT-VAR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      ticketId,
      category,
      categoryTitle: getCategoryTitle(category),
      bookingCode: bookingCode || 'GENERAL',
      description,
      status: 'OPEN_IN_PROGRESS',
      createdAt: new Date().toISOString(),
      estimatedResponseTime: 'Within 15 minutes'
    };

    inMemoryTickets.set(ticketId, newTicket);

    res.status(201).json({
      success: true,
      message: `Support ticket ${ticketId} created successfully. Our Ghat Support Desk is reviewing it.`,
      data: newTicket
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get User Support Tickets
const getUserTickets = async (req, res, next) => {
  try {
    const tickets = Array.from(inMemoryTickets.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get Legal Terms & Privacy Policy
const getLegalTerms = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        lastUpdated: 'February 2026',
        termsOfService: [
          {
            title: '1. Booking & Fair Fare Standards',
            content: 'All rides booked via Naavi adhere strictly to government-ratified tariff charts across Varanasi Ghat corridors. No operator may demand unmetered surcharges.'
          },
          {
            title: '2. Inland Waterways Safety Standards',
            content: 'Passengers must wear certified life jackets at all times aboard. Alcohol consumption, hazardous cargo, and vessel overloading are strictly prohibited under Uttar Pradesh Inland Vessels Rules.'
          },
          {
            title: '3. Cancellation & Refund Policy',
            content: 'Cancellations initiated up to 30 minutes before scheduled boarding receive 100% refund without penalty. Weather-related suspensions by Water Police receive full automatic refund.'
          }
        ],
        privacyPolicy: [
          {
            title: '1. Information We Collect',
            content: 'We collect customer contact information (phone, name, email) for booking verification, and live GPS coordinates during active rides for river navigation and emergency rescue dispatch.'
          },
          {
            title: '2. Safety & Water Police Telemetry Sharing',
            content: 'Live vessel and passenger GPS telemetry is shared only with certified rescue teams, Ghat Station Masters, and the Varanasi Water Police in the event of an SOS trigger.'
          },
          {
            title: '3. Data Security & Storage',
            content: 'All payment data is encrypted with 256-bit SSL protocols. We do not store raw UPI PINs or card CVV details.'
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

function getCategoryTitle(cat) {
  switch (cat) {
    case 'BOAT_DELAY': return 'Boat Delay & Timing';
    case 'DRIVER_BEHAVIOR': return 'Driver / Sailor Grievance';
    case 'PAYMENT_REFUND': return 'Payment & Refund';
    case 'LOST_ITEM': return 'Lost & Found on Boat';
    case 'SAFETY_INQUIRY': return 'Safety & Life Jacket Concern';
    default: return 'General Support & Inquiry';
  }
}

module.exports = {
  getHelplineInfo,
  createSupportTicket,
  getUserTickets,
  getLegalTerms
};
