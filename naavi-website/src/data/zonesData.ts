import type { ZoneItem, BoardingPoint, GhatDesk } from '../types';

export const zonesData: ZoneItem[] = [
  {
    zoneNumber: 1,
    name: 'Zone 1 – Central River Pier',
    code: 'HUB-01',
    adjacentZoneNumbers: [2],
    primaryGhat: 'Central River Pier',
    primaryPier: 'Central River Pier',
    image: '/images/water_taxi_modern.jpg',
    isPopular: true,
    description: 'The primary central river pier connecting city centers with waterfront destinations. Major boarding point for on-demand motor boats and private boat bookings.',
    ghats: ['Central River Pier', 'Bayfront Cleat #1', 'North Boardwalk Pier'],
    piers: ['Central River Pier', 'Bayfront Cleat #1', 'North Boardwalk Pier'],
    highlights: ['Multi-slip boarding pontoons', '24/7 Naavi Boat Support Desk', 'Direct road vehicle drop-off zone']
  },
  {
    zoneNumber: 2,
    name: 'Zone 2 – Sunset Promenade Pier',
    code: 'HUB-02',
    adjacentZoneNumbers: [1, 3],
    primaryGhat: 'Sunset Promenade Pier',
    primaryPier: 'Sunset Promenade Pier',
    image: '/images/boat_motor.jpg',
    isPopular: true,
    description: 'Scenic waterfront leisure zone popular for sunset boat rides, quiet evening lake trips, and panoramic waterfront views.',
    ghats: ['Sunset Promenade Pier', 'Lighthouse View Dock', 'South Sands Pier'],
    piers: ['Sunset Promenade Pier', 'Lighthouse View Dock', 'South Sands Pier'],
    highlights: ['Prime departure point for sunset boat rides', 'Expansive viewing deck with cafes', 'Dedicated passenger waiting area']
  },
  {
    zoneNumber: 3,
    name: 'Zone 3 – River Crossing Pier',
    code: 'HUB-03',
    adjacentZoneNumbers: [2, 4],
    primaryGhat: 'River Crossing Pier',
    primaryPier: 'River Crossing Pier',
    image: '/images/live_boat_scenic.jpg',
    isPopular: true,
    description: 'Frequent cross-river commuter terminal linking riverbanks and lake points with swift boat rides.',
    ghats: ['River Crossing Pier', 'Outer Island Cleat', 'Deep Water Pier'],
    piers: ['River Crossing Pier', 'Outer Island Cleat', 'Deep Water Pier'],
    highlights: ['Rapid turn-around boat slips', 'Boarding assistance & priority lanes', 'Secure boat docking facilities']
  },
  {
    zoneNumber: 4,
    name: 'Zone 4 – Heritage River Steps',
    code: 'HUB-04',
    adjacentZoneNumbers: [3, 5],
    primaryGhat: 'Heritage River Steps',
    primaryPier: 'Heritage River Steps',
    image: '/images/luxury_private_charter.jpg',
    isPopular: true,
    description: 'Historic architectural waterfront corridor with stone steps, classical wooden row boats, and gentle river glides.',
    ghats: ['Heritage River Steps', 'Grand Pier', 'Old Town Water Steps'],
    piers: ['Heritage River Steps', 'Grand Pier', 'Old Town Water Steps'],
    highlights: ['Traditional handcrafted boat departures', 'Architectural photo viewpoints', 'Sheltered tranquil docking area']
  },
  {
    zoneNumber: 5,
    name: 'Zone 5 – Lakefront Botanical Pier',
    code: 'HUB-05',
    adjacentZoneNumbers: [4, 6],
    primaryGhat: 'Botanical Lake Pier',
    primaryPier: 'Botanical Lake Pier',
    image: '/images/boat_solar.jpg',
    isPopular: false,
    description: 'Quiet nature reserve and lakefront promenade reserved for zero-emission solar electric boats and silent glides.',
    ghats: ['Botanical Lake Pier', 'Eco Sanctuary Dock', 'Lotus Lagoon Pier'],
    piers: ['Botanical Lake Pier', 'Eco Sanctuary Dock', 'Lotus Lagoon Pier'],
    highlights: ['Solar battery charging slips', 'Zero noise pollution zone', 'Protected wetland wildlife observation']
  },
  {
    zoneNumber: 6,
    name: 'Zone 6 – North Lake Motor Boat Pier',
    code: 'HUB-06',
    adjacentZoneNumbers: [5],
    primaryGhat: 'North Lake Pier',
    primaryPier: 'North Lake Pier',
    image: '/images/boat_speed.jpg',
    isPopular: true,
    description: 'High-speed boat transit node serving northern lake and river routes with quick departures.',
    ghats: ['North Lake Pier', 'Resort Point Slip', 'East Cleat'],
    piers: ['North Lake Pier', 'Resort Point Slip', 'East Cleat'],
    highlights: ['Fast motor boat boarding slips', 'Assisted boat boarding', 'Direct connection to road access']
  }
];

export const boardingPointsData: BoardingPoint[] = [
  { name: 'Central River Pier (Platform 1)', zoneNumber: 1, lat: 18.922, lng: 72.834, isPopular: true, nearbyLandmark: 'Central Promenade Tower' },
  { name: 'Central River Pier (Platform 2)', zoneNumber: 1, lat: 18.923, lng: 72.835, isPopular: true, nearbyLandmark: 'River Gate Terminal' },
  { name: 'Sunset Promenade Pier', zoneNumber: 2, lat: 18.930, lng: 72.838, isPopular: true, nearbyLandmark: 'Sunset Amphitheater' },
  { name: 'River Crossing Pier', zoneNumber: 3, lat: 18.935, lng: 72.842, isPopular: true, nearbyLandmark: 'Grand River Gateway' },
  { name: 'Heritage River Steps', zoneNumber: 4, lat: 18.940, lng: 72.845, isPopular: true, nearbyLandmark: 'Historic River Steps' },
  { name: 'Botanical Lake Pier', zoneNumber: 5, lat: 18.948, lng: 72.850, isPopular: false, nearbyLandmark: 'Eco Conservatory Park' },
  { name: 'North Lake Motor Boat Pier', zoneNumber: 6, lat: 18.955, lng: 72.855, isPopular: true, nearbyLandmark: 'North Lake Boating Club' }
];

export const ghatDesksData: GhatDesk[] = [
  {
    id: 'desk-central-river',
    ghatName: 'Central River Pier Desk',
    pierName: 'Central River Pier Desk',
    zone: 'Zone 1 (Central River)',
    location: 'Pier 1, Slipway #4, Main Promenade',
    supervisor: 'Vikram Malhotra (Pier Manager)',
    phone: '+91 98765 11001',
    timing: '24 Hours Open (Continuous Dispatch)',
    availableServices: ['Instant Motor Boat', 'Private Boat Boarding', 'Safety Gear Inspection', 'Assisted Booking']
  },
  {
    id: 'desk-sunset-promenade',
    ghatName: 'Sunset Promenade Pier Desk',
    pierName: 'Sunset Promenade Pier Desk',
    zone: 'Zone 2 (Sunset Promenade)',
    location: 'Promenade Boardwalk, Pier Cleat #2',
    supervisor: 'Neha R. Joshi (Operations Lead)',
    phone: '+91 98765 11002',
    timing: '06:00 AM – 10:30 PM Daily',
    availableServices: ['Sunset Boat Ride Check-in', 'Private Boat Boarding', 'Guest Hospitality', 'Refund Support']
  },
  {
    id: 'desk-river-crossing',
    ghatName: 'River Crossing Hub Desk',
    pierName: 'River Crossing Hub Desk',
    zone: 'Zone 3 (River Crossing)',
    location: 'Crossing Terminal Cleats, Platform #1',
    supervisor: 'Tariq A. Khan (Senior Pier Officer)',
    phone: '+91 98765 11003',
    timing: '05:30 AM – 10:00 PM Daily',
    availableServices: ['Commuter Boat Tickets', 'Luggage Assistance', 'Child Life Jacket Fitting', 'First Aid Station']
  }
];
