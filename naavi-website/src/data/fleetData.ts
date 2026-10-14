import type { BoatFleetItem } from '../types';

export const fleetData: BoatFleetItem[] = [
  {
    id: 'ganga-vihar-motor',
    name: 'Ganga Vihar Motor Boat',
    category: 'MOTOR_BOAT',
    categoryLabel: 'Motor Boat',
    capacity: 10,
    propulsion: 'Quiet 4-Stroke Marine Engine',
    pricePerTrip: '₹1,200',
    duration: 'Full Trip (2 hrs)',
    rating: 4.9,
    reviewCount: 342,
    image: '/images/boat_motor.jpg',
    regPrefix: 'UP-65-NV-2001',
    description: 'High-power modern 4-stroke quiet motor boat equipped with a full sun canopy, anti-slip flooring, and stable deep keel ideal for family touring and Aarti darshan.',
    recommendedFor: 'Families & small groups wanting dependable comfort and shade',
    amenities: [
      'Full protective sun canopy',
      'Individual safety life vests for all 10 seats',
      'Stable wide wooden hull',
      'Noise-dampened outboard motor',
      'Waterproof phone charging ports'
    ]
  },
  {
    id: 'standard-hand-row',
    name: 'Standard Hand-Row Boat (Shikara Style)',
    category: 'MANUAL_ROW_BOAT',
    categoryLabel: 'Row Boat',
    capacity: 4,
    propulsion: 'Traditional Oar Rowing (Silent)',
    pricePerTrip: '₹800',
    duration: 'Full Trip (2 hrs)',
    rating: 4.8,
    reviewCount: 521,
    image: '/images/boat_row.jpg',
    regPrefix: 'UP-65-NV-2002',
    description: 'Traditional handcrafted wooden rowing boat hand-carved by Varanasi artisans. Offers a peaceful, contemplative glide along the stone ghats without engine disturbance.',
    recommendedFor: 'Spiritual seekers, couples, and photography lovers',
    amenities: [
      '100% silent rowing experience',
      'Padded cushioned bench seating',
      'Close-to-water perspective for photography',
      'Type II life jackets for all 4 passengers',
      'Operated by multi-generation hereditary Manjhi'
    ]
  },
  {
    id: 'royal-heritage-bajra',
    name: 'Royal Heritage Bajra',
    category: 'LUXURY_BAJRA',
    categoryLabel: 'Luxury Bajra',
    capacity: 25,
    propulsion: 'Heavy Duty Dual Marine Engine',
    pricePerTrip: '₹2,000',
    duration: 'Full Trip (2 hrs)',
    rating: 5.0,
    reviewCount: 189,
    image: '/images/boat_premium.jpg',
    regPrefix: 'UP-65-NV-2003',
    description: 'Heritage double-deck lounge Bajra inspired by the royal barges of the Kashi Naresh. Features plush carpeted seating, upper observation terrace, and cultural ceremony space.',
    recommendedFor: 'Group celebrations, wedding parties, and premium VIP tours',
    amenities: [
      'Two-tiered layout (Upper view deck & lower lounge)',
      'Traditional handloom upholstery and bolsters',
      'Onboard emergency life raft & 25 life vests',
      'Two certified navigators & attendant on duty',
      'Sound system for devotional chants / music'
    ]
  },
  {
    id: 'solar-ev-eco-boat',
    name: 'Solar EV Eco Boat',
    category: 'EV_BOAT',
    categoryLabel: 'Solar EV Eco',
    capacity: 12,
    propulsion: 'Electric Twin Motors + Solar Array',
    pricePerTrip: '₹1,500',
    duration: 'Full Trip (2 hrs)',
    rating: 4.9,
    reviewCount: 215,
    image: '/images/boat_solar.jpg',
    regPrefix: 'UP-65-NV-2004',
    description: 'Clean eco-friendly solar catamaran craft built under inland waterway green mobility guidelines. Zero smoke, zero fuel emissions, and zero engine vibration.',
    recommendedFor: 'Eco-conscious travelers and comfortable family cruising',
    amenities: [
      'Rooftop high-efficiency solar panel canopy',
      'Lithium-ion marine battery bank with telemetry',
      'Ultra-smooth silent acceleration',
      'Wide twin-hull anti-roll stability',
      '12 certified adult & child life jackets'
    ]
  },
  {
    id: 'vip-speed-boat',
    name: 'VIP Power Speed Boat',
    category: 'SPEED_BOAT',
    categoryLabel: 'Speed Boat',
    capacity: 6,
    propulsion: 'Twin 60HP High-Output Marine Outboards',
    pricePerTrip: '₹2,500',
    duration: 'Full Trip (2 hrs)',
    rating: 4.9,
    reviewCount: 94,
    image: '/images/boat_speed.jpg',
    regPrefix: 'UP-65-NV-2005',
    description: 'High agility twin-hull power craft capable of high-speed river traversal. Designed for rapid emergency coordination, protocol escort, and VIP express transit across Varanasi.',
    recommendedFor: 'Urgent transit, VIP delegations, and thrilling river rides',
    amenities: [
      'High-speed twin outboard propulsion',
      'Ergonomic marine impact-absorbing bucket seats',
      'Automated GPS tracking beacon',
      'Waterproof equipment dry storage locker',
      'Direct radio connection to Varanasi Water Police'
    ]
  }
];
