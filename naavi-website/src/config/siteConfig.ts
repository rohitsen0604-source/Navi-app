/**
 * Naavi Official Information Website Configuration
 * Centralized configuration for brand, store links, contacts, and navigation.
 */

export const siteConfig = {
  brand: {
    name: 'Naavi',
    tagline: 'River & Lake Boat Booking & Operations Platform',
    mission: 'Digitalizing river waterways with fair tariffs, verified Manjhis, and 100% passenger safety compliance.',
    flagshipLocation: 'Varanasi, Uttar Pradesh (River Ganges)',
    logo: '/images/naavi_logo.png',
    logoTransparent: '/images/naavi_logo_transparent.png',
    logoWhite: '/images/naavi_logo_white.png',
    logoCircle: '/images/boat_circle_logo.png',
    favicon: '/favicon.svg',
    foundedYear: 2026,
  },

  // Store download links and states
  // As per guidelines: clearly identify editable config and show appropriate coming-soon state if not published
  appStores: {
    android: {
      isAvailable: false, // Set to true when published on Google Play
      url: 'https://play.google.com/store/apps/details?id=com.naavi.customer',
      badgeLabel: 'Get it on Google Play',
      statusNotice: 'Currently in Pilot Rollout across Varanasi Ghats. APK demo available for registered users.',
    },
    ios: {
      isAvailable: false, // Set to true when published on App Store
      url: 'https://apps.apple.com/app/naavi-river-boat-booking/id6400000000',
      badgeLabel: 'Download on App Store',
      statusNotice: 'Apple App Store release scheduled for next milestone.',
    },
    driverApp: {
      name: 'Naavi Driver & Boatman Partner App',
      statusNotice: 'Exclusive app for registered Varanasi Boatmen / Manjhi community.',
    }
  },

  // Verified official contact channels from backend supportController.js
  contact: {
    hotlines: {
      tollFree: '1800-102-NAAVI (62284)',
      emergencyPolice: '112',
      waterPolice: '+91 542 2221234',
      whatsappSupport: '+91 98765 00000',
      supportEmail: 'support@naavi.in',
      grievanceEmail: 'grievance@naavi.in',
    },
    operatingHours: {
      riverBoating: '05:00 AM – 09:30 PM (Daily)',
      districtAdvisory: 'Operating hours strictly governed by Varanasi District Administration & Water Police protocols.',
      supportDesk: '24/7 Ghat Helpdesks at Major Transit Points',
    },
    centralOffice: {
      address: 'Naavi River Operations Command Center, Dashashwamedh Riverfront Terminal, Varanasi, Uttar Pradesh 221001',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
    }
  },

  // Navigation Links
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: '15 Zones', path: '/zones' },
    { label: 'Our Fleet', path: '/fleet' },
    { label: 'Safety First', path: '/safety' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ],

  // Backend API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    endpoints: {
      helplineInfo: '/support/helpline-info',
      createTicket: '/support/tickets',
      legalTerms: '/support/legal',
      zones: '/master/zones',
      boardingPoints: '/master/boarding-points',
      boats: '/master/available-boats',
    }
  }
};
