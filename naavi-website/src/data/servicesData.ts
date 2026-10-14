import type { BoatService } from '../types';

export const servicesData: BoatService[] = [
  {
    id: 'ganga-aarti-cruise',
    title: 'Ganga Evening Aarti Darshan',
    subtitle: 'Prime front-row riverfront viewing of world-renowned Dashashwamedh Aarti',
    category: 'SPIRITUAL_AARTI',
    categoryLabel: 'Spiritual Aarti',
    description: 'Experience the mystical evening Aarti from the serene waters of the Ganges. Anchored safely in the regulated viewing corridor opposite Dashashwamedh Ghat with clear panoramic views of the priests and sacred rituals.',
    vesselType: 'Motor Boat / Bajra Lounge',
    capacity: '10 to 25 Passengers',
    duration: '2 Hours (06:00 PM – 08:00 PM)',
    estimatedPrice: '₹1,200 – ₹2,000 / trip',
    isPriceFixed: true,
    popularGhats: ['Dashashwamedh Ghat', 'Assi Ghat', 'Rajendra Prasad Ghat'],
    image: '/images/live_boat_cruise.jpg',
    badge: 'Most Popular',
    features: [
      'Front-row regulated Aarti river corridor anchoring',
      'Certified life jackets provided to all passengers',
      'Traditional diya offering ceremony on water included',
      'Professional verified local Manjhi guide'
    ]
  },
  {
    id: 'subah-e-banaras-sunrise',
    title: 'Subah-e-Banaras Sunrise Heritage Tour',
    subtitle: 'Golden hour spiritual glide past all 84 ancient stone ghats',
    category: 'SUNRISE_CRUISE',
    categoryLabel: 'Sunrise Glide',
    description: 'Witness the morning sun rising over the eastern riverbank as chants, temple bells, and morning rituals come alive across the ghats. Covers the legendary 6.8 km stretch from Assi Ghat to Manikarnika and Panchganga.',
    vesselType: 'Traditional Hand-Row Boat or EV Boat',
    capacity: '4 to 12 Passengers',
    duration: '2 Hours (05:30 AM – 07:30 AM)',
    estimatedPrice: '₹800 – ₹1,500 / trip',
    isPriceFixed: true,
    popularGhats: ['Assi Ghat', 'Tulsi Ghat', 'Kedar Ghat', 'Manikarnika Ghat'],
    image: '/images/varanasi_sunrise_bg.jpg',
    badge: 'Soulful Experience',
    features: [
      'Gentle, peaceful ride during early morning quiet hours',
      'Stunning photography viewpoints for golden hour light',
      'Historical narration of ghat foundations and palaces',
      'Zero engine noise option with Hand-Row or EV Catamaran'
    ]
  },
  {
    id: 'royal-heritage-bajra',
    title: 'Royal Heritage Bajra Private Charter',
    subtitle: 'Exclusive double-deck wooden lounge for families and groups',
    category: 'PRIVATE_CHARTER',
    categoryLabel: 'Luxury Charter',
    description: 'The pinnacle of river hospitality. A handcrafted double-deck traditional wooden Bajra outfitted with plush carpeted seating, shade canopies, open rooftop deck, and personalized hospitality for private celebrations or family tours.',
    vesselType: 'Luxury Royal Bajra',
    capacity: 'Up to 25 Guests',
    duration: '2 to 4 Hours Flexible',
    estimatedPrice: '₹2,000 / hour',
    isPriceFixed: true,
    popularGhats: ['Assi Ghat', 'Dashashwamedh Ghat', 'Rajghat'],
    image: '/images/boat_premium.jpg',
    badge: 'Luxury Class',
    features: [
      'Upper open viewing deck and shaded lower lounge',
      'Dedicated two-person veteran boat crew',
      'Complimentary bottled water and sanitized seating',
      'Ideal for family gatherings, rituals, and private sunset tours'
    ]
  },
  {
    id: 'eco-solar-tour',
    title: 'Clean Ganga Solar EV Eco Cruise',
    subtitle: 'Zero-emission quiet catamaran cruising for an eco-friendly voyage',
    category: 'ECO_SOLAR',
    categoryLabel: 'Eco Green',
    description: 'Cruise the holy river with zero fossil-fuel exhaust, zero oil spills, and near-silent operation. Powered by clean solar battery technology aligned with National Green Tribunal standards for Ganga conservation.',
    vesselType: 'Solar Electric Catamaran',
    capacity: 'Up to 12 Passengers',
    duration: '1.5 to 2 Hours',
    estimatedPrice: '₹1,500 / trip',
    isPriceFixed: true,
    popularGhats: ['Namo Ghat Modern Terminal', 'Assi Ghat', 'Rajghat'],
    image: '/images/boat_solar.jpg',
    badge: 'Green Energy',
    features: [
      '100% emission-free solar and electric propulsion',
      'Whisper-quiet navigation for pristine wildlife and river sounds',
      'Modern ergonomic fiber-reinforced hull with sunshade canopy',
      'Fitted with telemetry GPS and automatic battery monitor'
    ]
  },
  {
    id: 'cross-ghat-commuter',
    title: 'Swift Cross-Ghat River Shuttle',
    subtitle: 'Skip crowded alleyways with direct river-based transit between ghats',
    category: 'DAILY_TRANSIT',
    categoryLabel: 'Quick Transit',
    description: 'The fastest, most scenic way to travel between northern and southern Varanasi sectors. Beat congested land streets by hopping on point-to-point boat transit between Assi, Dashashwamedh, and Namo Ghat terminals.',
    vesselType: 'Motor Boat / Rapid Ferry',
    capacity: '6 to 10 Passengers',
    duration: '20 to 35 Minutes',
    estimatedPrice: 'Government-ratified distance tariff',
    isPriceFixed: true,
    popularGhats: ['Assi Ghat', 'Dashashwamedh', 'Rajghat', 'Namo Ghat'],
    image: '/images/boat_motor_fresh.jpg',
    badge: 'Daily Commute',
    features: [
      'Direct rapid transit without land traffic jams',
      'Immediate boarding point matching at 15 zones',
      'Scheduled departure frequencies throughout the day',
      'Fixed tariff per passenger or full boat rental'
    ]
  },
  {
    id: 'vip-speed-patrol',
    title: 'VIP High-Agility Speed Craft',
    subtitle: 'Twin-hull power boat for rapid traversal and time-critical transit',
    category: 'PRIVATE_CHARTER',
    categoryLabel: 'Express Class',
    description: 'For travelers on tight schedules or seeking premium power boating, our high-agility speed boats navigate upstream currents effortlessly, connecting southern Assi to northern Namo Ghat in under 18 minutes.',
    vesselType: 'Twin-Hull Speed Boat',
    capacity: 'Up to 6 Passengers',
    duration: '1 Hour Rapid Tour',
    estimatedPrice: '₹2,500 / hour',
    isPriceFixed: true,
    popularGhats: ['Namo Ghat Modern Terminal', 'Assi Ghat', 'Rajghat'],
    image: '/images/boat_speed.jpg',
    badge: 'Express',
    features: [
      'Twin four-stroke marine propulsion engines',
      'Deep cushioned sports bucket seats with grip handles',
      'Rapid upstream transit against monsoon currents',
      'USCG certified commercial life jackets'
    ]
  }
];
