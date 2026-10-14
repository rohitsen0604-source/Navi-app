import type { ZoneItem, BoardingPoint, GhatDesk } from '../types';

export const zonesData: ZoneItem[] = [
  {
    zoneNumber: 1,
    name: 'Zone 1 – Assi Southern Sector',
    code: 'ZN-01',
    adjacentZoneNumbers: [2],
    primaryGhat: 'Assi Ghat',
    image: '/images/zone_assi.jpg',
    isPopular: true,
    description: 'The southern anchor of the holy city where River Assi meets the Ganges. Famous for Subah-e-Banaras morning rituals, yogic gatherings, and student culture.',
    ghats: ['Assi Ghat', 'Ganga Mahal Ghat', 'Riva Ghat'],
    highlights: ['Subah-e-Banaras cultural stage', 'Wide stepped amphitheater', 'Major boat boarding jetty']
  },
  {
    zoneNumber: 2,
    name: 'Zone 2 – Tulsi & Shivala Sector',
    code: 'ZN-02',
    adjacentZoneNumbers: [1, 3],
    primaryGhat: 'Tulsi Ghat',
    image: '/images/zone_assi.jpg',
    isPopular: true,
    description: 'Named after Goswami Tulsidas who composed the Ramcharitmanas here. Bordering historic 19th-century Maratha stone palaces and wrestling akharas.',
    ghats: ['Tulsi Ghat', 'Shivala Ghat', 'Bhadaini Ghat', 'Janki Ghat'],
    highlights: ['Tulsidas ancient samadhi house', 'Traditional wrestling akharas', 'Scenic palace facades']
  },
  {
    zoneNumber: 3,
    name: 'Zone 3 – Harishchandra Ghat Sector',
    code: 'ZN-03',
    adjacentZoneNumbers: [2, 4],
    primaryGhat: 'Harishchandra Ghat',
    image: '/images/zone_dashashwamedh.jpg',
    isPopular: true,
    description: 'One of the two sacred cremation ghats of Kashi, named after King Harishchandra who served as a keeper of the cremation grounds to uphold truth.',
    ghats: ['Harishchandra Ghat', 'Hanuman Ghat', 'Lali Ghat'],
    highlights: ['Ancient sacred cremation heritage', 'Electric crematorium facility', 'Deep historical resonance']
  },
  {
    zoneNumber: 4,
    name: 'Zone 4 – Kedar & Mansarovar Sector',
    code: 'ZN-04',
    adjacentZoneNumbers: [3, 5],
    primaryGhat: 'Kedar Ghat',
    image: '/images/zone_dashashwamedh.jpg',
    isPopular: true,
    description: 'Distinctive red-and-white striped temple facade modeled after Kedarnath. Attracts South Indian pilgrims and visitors to the revered Gauri Kund well.',
    ghats: ['Kedar Ghat', 'Chauki Ghat', 'Mansarovar Ghat'],
    highlights: ['Red-striped temple architecture', 'Gauri Kund sacred water source', 'Traditional pilgrimage stop']
  },
  {
    zoneNumber: 5,
    name: 'Zone 5 – Dashashwamedh Main Sector',
    code: 'ZN-05',
    adjacentZoneNumbers: [4, 6],
    primaryGhat: 'Dashashwamedh Ghat',
    image: '/images/zone_dashashwamedh.jpg',
    isPopular: true,
    description: 'The vibrant heart and epicenter of Varanasi river life. Site of Brahma’s Ten Horse Sacrifice and the world-famous nightly Maha Ganga Aarti.',
    ghats: ['Dashashwamedh Ghat', 'Dr. Rajendra Prasad Ghat', 'Prayag Ghat', 'Ahilyabai Ghat'],
    highlights: ['Grand Evening Maha Ganga Aarti', 'Main riverfront boat embarkation hub', '24/7 Naavi Ghat Support Desk']
  },
  {
    zoneNumber: 6,
    name: 'Zone 6 – Man Mandir & Meer Ghat Sector',
    code: 'ZN-06',
    adjacentZoneNumbers: [5, 7],
    primaryGhat: 'Man Mandir Ghat',
    image: '/images/zone_dashashwamedh.jpg',
    isPopular: false,
    description: 'Features the magnificent stone astronomical observatory built by Maharaja Jai Singh II of Jaipur atop the Rajasthani palace.',
    ghats: ['Man Mandir Ghat', 'Meer Ghat', 'Tripura Bhairavi Ghat'],
    highlights: ['18th-century stone Jantar Mantar instruments', 'Intricate Rajput stone balconies', 'Heritage walking corridor']
  },
  {
    zoneNumber: 7,
    name: 'Zone 7 – Manikarnika Sector',
    code: 'ZN-07',
    adjacentZoneNumbers: [6, 8],
    primaryGhat: 'Manikarnika Ghat',
    image: '/images/zone_manikarnika.jpg',
    isPopular: true,
    description: 'The Mahashmashan (the Great Cremation Ground), believed to grant instantaneous Moksha. The sacred Manikarnika Kund is older than the Ganges itself.',
    ghats: ['Manikarnika Ghat', 'Jalasen Ghat', 'Chakrapushkarini Kund'],
    highlights: ['Eternal sacred cremation fires', 'Sacred Manikarnika holy pool', 'Highest spiritual reverence']
  },
  {
    zoneNumber: 8,
    name: 'Zone 8 – Scindia & Ram Ghat Sector',
    code: 'ZN-08',
    adjacentZoneNumbers: [7, 9],
    primaryGhat: 'Scindia Ghat',
    image: '/images/zone_manikarnika.jpg',
    isPopular: false,
    description: 'Renowned for the picturesque partially submerged Shiva Temple that leaned into the riverbed during construction in 1830.',
    ghats: ['Scindia Ghat', 'Ram Ghat', 'Sankatha Ghat'],
    highlights: ['Submerged leaning Shiva temple', 'Birthplace of Agni according to lore', 'Serene uncrowded waters']
  },
  {
    zoneNumber: 9,
    name: 'Zone 9 – Panchganga Heritage Sector',
    code: 'ZN-09',
    adjacentZoneNumbers: [8, 10],
    primaryGhat: 'Panchganga Ghat',
    image: '/images/zone_dashashwamedh.jpg',
    isPopular: true,
    description: 'The mythical confluence of five holy rivers (Ganga, Yamuna, Saraswati, Kirana, and Dhutpapa). Dominated by the soaring minarets of Alamgir Mosque.',
    ghats: ['Panchganga Ghat', 'Durga Ghat', 'Brahma Ghat'],
    highlights: ['Five-river sacred confluence point', 'Alamgir Mosque skyline view', 'Autumn Kartik month sky-lamp festival']
  },
  {
    zoneNumber: 10,
    name: 'Zone 10 – Trilochan Ghat Sector',
    code: 'ZN-10',
    adjacentZoneNumbers: [9, 11],
    primaryGhat: 'Trilochan Ghat',
    image: '/images/zone_rajghat.jpg',
    isPopular: false,
    description: 'Named after Lord Shiva’s three eyes (Trilochan). Known for deep spiritual tranquility away from the tourist crowd.',
    ghats: ['Trilochan Ghat', 'Gola Ghat', 'Naya Ghat'],
    highlights: ['Ancient Shiva shrine', 'Tranquil authentic neighborhood life', 'Wide bathing stone platforms']
  },
  {
    zoneNumber: 11,
    name: 'Zone 11 – Gaay & Badri Ghat Sector',
    code: 'ZN-11',
    adjacentZoneNumbers: [10, 12],
    primaryGhat: 'Gaay Ghat',
    image: '/images/zone_rajghat.jpg',
    isPopular: false,
    description: 'Features a massive stone sculpture of a cow (Gaay) overlooking the steps. A traditional trading and residential ghat.',
    ghats: ['Gaay Ghat', 'Badri Ghat', 'Bundi Parikota Ghat'],
    highlights: ['Stone cow deity sculpture', 'Historic Rajasthani fortress wall', 'Authentic river crafts']
  },
  {
    zoneNumber: 12,
    name: 'Zone 12 – Raj Ghat Northern Sector',
    code: 'ZN-12',
    adjacentZoneNumbers: [11, 13],
    primaryGhat: 'Raj Ghat',
    image: '/images/zone_rajghat.jpg',
    isPopular: true,
    description: 'The ancient northern entry to Kashi near the double-deck Malviya Rail-Road Bridge. Site of extensive archaeological excavations dating back to 800 BCE.',
    ghats: ['Raj Ghat', 'Prahlad Ghat', 'Nishadraj Ghat'],
    highlights: ['Malviya Bridge architectural backdrop', 'Archaeological settlement excavations', 'Naavi Heritage Pier Desk']
  },
  {
    zoneNumber: 13,
    name: 'Zone 13 – Namo Ghat Modern Terminal',
    code: 'ZN-13',
    adjacentZoneNumbers: [12, 14],
    primaryGhat: 'Namo Ghat (Khidkiya)',
    image: '/images/zone_rajghat.jpg',
    isPopular: true,
    description: 'The state-of-the-art modern river terminal featuring the iconic giant Namaste sculptures, helipad, EV charging stations, and food court.',
    ghats: ['Namo Ghat Modern Terminal', 'Govardhan Ghat'],
    highlights: ['Iconic Namaste bronze folded hands sculptures', 'EV boat solar charging hub', 'Modern wheelchair-accessible promenades']
  },
  {
    zoneNumber: 14,
    name: 'Zone 14 – Adi Keshav Sangam Sector',
    code: 'ZN-14',
    adjacentZoneNumbers: [13, 15],
    primaryGhat: 'Adi Keshav Ghat',
    image: '/images/zone_rajghat.jpg',
    isPopular: false,
    description: 'Located at the sacred Sangam where River Varuna joins the Ganges. The original spot where Lord Vishnu first stepped when arriving in Varanasi.',
    ghats: ['Adi Keshav Ghat', 'Varuna Sangam Point'],
    highlights: ['Varuna-Ganga river confluence', 'Ancient Vishnu temple complex', 'Pristine quiet river boundary']
  },
  {
    zoneNumber: 15,
    name: 'Zone 15 – Sant Ravidas Smarak Sector',
    code: 'ZN-15',
    adjacentZoneNumbers: [1, 14],
    primaryGhat: 'Sant Ravidas Ghat',
    image: '/images/zone_assi.jpg',
    isPopular: true,
    description: 'The southernmost terminal opposite Nagwa, equipped with a sprawling memorial park and broad stone ghat dedicated to the medieval Bhakti saint.',
    ghats: ['Sant Ravidas Ghat', 'Nagwa Ghat'],
    highlights: ['Sant Ravidas Memorial Park', 'Spacious vehicle parking area', 'Southern boat launching slipway']
  }
];

export const boardingPointsData: BoardingPoint[] = [
  { name: 'Assi Ghat Jetty #1', zoneNumber: 1, lat: 25.2891, lng: 83.0069, isPopular: true, nearbyLandmark: 'Opposite Subah-e-Banaras amphitheater' },
  { name: 'Tulsi Ghat Pier', zoneNumber: 2, lat: 25.2922, lng: 83.0075, isPopular: true, nearbyLandmark: 'Below Akhara Swaminath' },
  { name: 'Harishchandra Steps', zoneNumber: 3, lat: 25.2988, lng: 83.0093, isPopular: true, nearbyLandmark: 'Adjacent to electric crematorium' },
  { name: 'Kedar Ghat Red Pier', zoneNumber: 4, lat: 25.3021, lng: 83.0102, isPopular: true, nearbyLandmark: 'Directly below Kedareswar Temple' },
  { name: 'Dashashwamedh Main Platform #2', zoneNumber: 5, lat: 25.3072, lng: 83.0105, isPopular: true, nearbyLandmark: 'Main Aarti steps command center' },
  { name: 'Dr. Rajendra Prasad Ghat Slipway', zoneNumber: 5, lat: 25.3082, lng: 83.0108, isPopular: false, nearbyLandmark: 'Near Ganga Seva Nidhi pavilion' },
  { name: 'Manikarnika North Jetty', zoneNumber: 7, lat: 25.3108, lng: 83.0135, isPopular: true, nearbyLandmark: 'North of sacred kund' },
  { name: 'Panchganga Heritage Point', zoneNumber: 9, lat: 25.3155, lng: 83.0162, isPopular: true, nearbyLandmark: 'Below Alamgir Mosque' },
  { name: 'Raj Ghat Ferry Landing', zoneNumber: 12, lat: 25.3255, lng: 83.0312, isPopular: true, nearbyLandmark: 'Adjacent Malviya Bridge approach' },
  { name: 'Namo Ghat EV Terminal', zoneNumber: 13, lat: 25.3340, lng: 83.0380, isPopular: true, nearbyLandmark: 'Beside giant folded-hands sculptures' },
  { name: 'Sant Ravidas Terminal', zoneNumber: 15, lat: 25.2842, lng: 83.0051, isPopular: true, nearbyLandmark: 'Near vehicle parking plaza' }
];

export const ghatDesksData: GhatDesk[] = [
  {
    id: 'gd_1',
    ghatName: 'Dashashwamedh Main Ghat Desk',
    zone: 'Zone 5 Central Corridor',
    location: 'Adjacent to Main Aarti Steps, Platform #2, Varanasi',
    supervisor: 'Vikas Mishra (Station Officer)',
    phone: '+91 542 2221101',
    timing: '24 Hours (7 Days a Week)',
    availableServices: [
      'Instant Boat Verification & Boarding',
      'Life Jacket Safety Inspection',
      'Lost & Found On-River Desk',
      'Dispute & Fare Grievance Redressal',
      'Emergency Water Police Liaison'
    ]
  },
  {
    id: 'gd_2',
    ghatName: 'Assi Ghat Operations Desk',
    zone: 'Zone 1 Southern Corridor',
    location: 'South Riverfront Terminal, Assi Ghat, Varanasi',
    supervisor: 'Sunil Pandey (Shift Incharge)',
    phone: '+91 542 2221102',
    timing: '04:00 AM – 11:30 PM (Daily)',
    availableServices: [
      'Subah-e-Banaras Morning Aarti Boat Coordination',
      'EV Boat Charging & Inspection Point',
      'Senior Citizen & Passenger Assistance',
      'Baggage Storage & Life Vest Check'
    ]
  },
  {
    id: 'gd_3',
    ghatName: 'Rajghat Heritage Pier Desk',
    zone: 'Zone 12 Northern Corridor',
    location: 'Near Malviya Bridge Ferry Point, Rajghat, Varanasi',
    supervisor: 'Rajesh Kumar (Harbor Master)',
    phone: '+91 542 2221103',
    timing: '05:00 AM – 10:00 PM (Daily)',
    availableServices: [
      'Long-Distance Upstream Cruise Information',
      'Group Royal Bajra Reservations',
      'Vessel Seaworthiness Certification Check',
      'Waterway Current Advisory Station'
    ]
  }
];
