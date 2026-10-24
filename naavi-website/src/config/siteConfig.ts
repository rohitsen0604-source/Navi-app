/**
 * Naavi Official Boat Booking App Configuration
 * Universal configuration for brand, store links, contacts, and navigation.
 */

export const siteConfig = {
  brand: {
    name: 'Naavi',
    tagline: 'On-Demand River & Lake Boat Booking App',
    mission: 'Booking boats easily with transparent fares, verified boat drivers, and 100% passenger life-jacket safety.',
    flagshipLocation: 'Rivers & Lakes Across India',
    logo: '/images/naavi_logo.png',
    logoTransparent: '/images/naavi_logo_transparent.png',
    logoWhite: '/images/naavi_logo_white.png',
    logoCircle: '/images/boat_circle_logo.png',
    favicon: '/favicon.svg',
    foundedYear: 2026,
  },

  // Store download links and states
  appStores: {
    android: {
      isAvailable: false,
      url: 'https://play.google.com/store/apps/details?id=com.naavi.customer',
      badgeLabel: 'Get it on Google Play',
      statusNotice: 'Currently in active rollout. APK preview available for registered test users.',
    },
    ios: {
      isAvailable: false,
      url: 'https://apps.apple.com/app/naavi-boat-booking/id6400000000',
      badgeLabel: 'Download on App Store',
      statusNotice: 'Apple App Store release scheduled for next milestone.',
    },
    driverApp: {
      name: 'Naavi Boat Driver Partner App',
      statusNotice: 'Exclusive platform for registered boat drivers & boat operators.',
    }
  },

  // Verified official contact channels
  contact: {
    hotlines: {
      tollFree: '1800-102-NAAVI (62284)',
      emergencyPolice: '112',
      waterPolice: '1800-425-2424',
      whatsappSupport: '+91 98765 00000',
      supportEmail: 'support@naavi.in',
      grievanceEmail: 'grievance@naavi.in',
    },
    operatingHours: {
      riverBoating: '05:30 AM – 10:30 PM (Daily)',
      districtAdvisory: 'Operating hours governed by River Safety protocols.',
      supportDesk: '24/7 Boat Pier Helpdesks at Major Points',
    },
    centralOffice: {
      address: 'Naavi River Technologies, Riverfront Hub, India',
      city: 'National Operations',
      state: 'India',
      country: 'India',
    }
  },

  // Navigation Links
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Boat Points & Piers', path: '/zones' },
    { label: 'Safety', path: '/safety' },
    { label: 'FAQ', path: '/faq' },
    { label: 'About', path: '/about' },
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
