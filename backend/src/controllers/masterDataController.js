const mongoose = require('mongoose');
const RiverLake = require('../models/RiverLake');
const Zone = require('../models/Zone');
const BoardingPoint = require('../models/BoardingPoint');
const Boat = require('../models/Boat');

// Static Varanasi fallback data if MongoDB is offline
const fallbackRivers = [
  {
    _id: 'rl1',
    name: 'Ganga River',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    image: 'assets/images/river_ganga.jpg',
    isPopular: true,
    totalZones: 15,
  },
  {
    _id: 'rl2',
    name: 'Assi Ghat',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    image: 'assets/images/river_assi.jpg',
    isPopular: true,
    totalZones: 5,
  },
  {
    _id: 'rl3',
    name: 'Naini',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    image: 'assets/images/river_naini.jpg',
    isPopular: false,
    totalZones: 8,
  },
];

const fallbackZones = [
  { _id: 'z1', zoneNumber: 1, name: 'Zone 1', primaryGhat: 'Dashashwamedh', code: 'ZN-01', riverLakeId: 'rl1', image: 'assets/images/zone_dashashwamedh.jpg' },
  { _id: 'z2', zoneNumber: 2, name: 'Zone 2', primaryGhat: 'Assi Ghat', code: 'ZN-02', riverLakeId: 'rl1', image: 'assets/images/zone_assi.jpg' },
  { _id: 'z3', zoneNumber: 3, name: 'Zone 3', primaryGhat: 'Rajghat', code: 'ZN-03', riverLakeId: 'rl1', image: 'assets/images/zone_rajghat.jpg' },
  { _id: 'z4', zoneNumber: 4, name: 'Zone 4', primaryGhat: 'Manikarnika', code: 'ZN-04', riverLakeId: 'rl1', image: 'assets/images/zone_manikarnika.jpg' },
  { _id: 'z5', zoneNumber: 5, name: 'Zone 5', primaryGhat: 'Panchganga', code: 'ZN-05', riverLakeId: 'rl1', image: 'assets/images/zone_dashashwamedh.jpg' },
  { _id: 'z6', zoneNumber: 6, name: 'Zone 6', primaryGhat: 'Kedar Ghat', code: 'ZN-06', riverLakeId: 'rl1', image: 'assets/images/zone_assi.jpg' },
  { _id: 'z7', zoneNumber: 7, name: 'Zone 7', primaryGhat: 'Namo Ghat', code: 'ZN-07', riverLakeId: 'rl1', image: 'assets/images/zone_rajghat.jpg' },
  { _id: 'z8', zoneNumber: 8, name: 'Zone 8', primaryGhat: 'Tulsi Ghat', code: 'ZN-08', riverLakeId: 'rl1', image: 'assets/images/zone_manikarnika.jpg' },
  { _id: 'z9', zoneNumber: 9, name: 'Zone 9', primaryGhat: 'Harishchandra', code: 'ZN-09', riverLakeId: 'rl1', image: 'assets/images/zone_dashashwamedh.jpg' },
  { _id: 'z10', zoneNumber: 10, name: 'Zone 10', primaryGhat: 'Trilochan Ghat', code: 'ZN-10', riverLakeId: 'rl1', image: 'assets/images/zone_assi.jpg' },
  { _id: 'z11', zoneNumber: 11, name: 'Zone 11', primaryGhat: 'Gaay Ghat', code: 'ZN-11', riverLakeId: 'rl1', image: 'assets/images/zone_rajghat.jpg' },
  { _id: 'z12', zoneNumber: 12, name: 'Zone 12', primaryGhat: 'Sant Ravidas', code: 'ZN-12', riverLakeId: 'rl1', image: 'assets/images/zone_manikarnika.jpg' },
];

const fallbackGhats = [
  { _id: 'g1', zoneNumber: 1, name: 'Assi Ghat', isPopular: true, coordinates: { latitude: 25.2891, longitude: 83.0069 } },
  { _id: 'g2', zoneNumber: 1, name: 'Ganga Mahal Ghat', isPopular: false, coordinates: { latitude: 25.2902, longitude: 83.0071 } },
  { _id: 'g3', zoneNumber: 2, name: 'Tulsi Ghat', isPopular: true, coordinates: { latitude: 25.2922, longitude: 83.0075 } },
  { _id: 'g4', zoneNumber: 3, name: 'Harishchandra Ghat', isPopular: true, coordinates: { latitude: 25.2988, longitude: 83.0093 } },
  { _id: 'g5', zoneNumber: 4, name: 'Kedar Ghat', isPopular: true, coordinates: { latitude: 25.3021, longitude: 83.0102 } },
  { _id: 'g6', zoneNumber: 5, name: 'Dashashwamedh Ghat', isPopular: true, coordinates: { latitude: 25.3072, longitude: 83.0105 } },
  { _id: 'g7', zoneNumber: 5, name: 'Dr. Rajendra Prasad Ghat', isPopular: false, coordinates: { latitude: 25.3082, longitude: 83.0108 } },
  { _id: 'g8', zoneNumber: 7, name: 'Manikarnika Ghat', isPopular: true, coordinates: { latitude: 25.3108, longitude: 83.0135 } },
  { _id: 'g9', zoneNumber: 8, name: 'Scindia Ghat', isPopular: false, coordinates: { latitude: 25.3125, longitude: 83.0142 } },
  { _id: 'g10', zoneNumber: 9, name: 'Panchganga Ghat', isPopular: true, coordinates: { latitude: 25.3155, longitude: 83.0162 } },
  { _id: 'g11', zoneNumber: 12, name: 'Raj Ghat', isPopular: true, coordinates: { latitude: 25.3255, longitude: 83.0312 } },
  { _id: 'g12', zoneNumber: 13, name: 'Namo Ghat (Khidkiya)', isPopular: true, coordinates: { latitude: 25.3340, longitude: 83.0380 } },
  { _id: 'g13', zoneNumber: 15, name: 'Sant Ravidas Ghat', isPopular: true, coordinates: { latitude: 25.2842, longitude: 83.0051 } },
];

const fallbackBoats = [
  {
    _id: 'boat_row_1',
    customBoatId: 'ROW-Z1-01',
    name: 'Standard Row Boat',
    category: 'MANUAL_ROW_BOAT',
    filterTag: 'Row Boat',
    capacity: 4,
    passengersText: 'Up to 4 passengers',
    durationText: 'Full Trip (2 hrs)',
    price: 800,
    rating: 4.8,
    image: 'assets/images/boat_row.jpg',
    zoneNumber: 1,
    status: 'AVAILABLE',
    description: 'Traditional handcrafted wooden rowing boat with life jackets and serene silent glide.'
  },
  {
    _id: 'boat_motor_1',
    customBoatId: 'MTR-Z1-04',
    name: 'Motor Boat',
    category: 'MOTOR_BOAT',
    filterTag: 'Motor Boat',
    capacity: 8,
    passengersText: 'Up to 8 passengers',
    durationText: 'Full Trip (2 hrs)',
    price: 1200,
    rating: 4.9,
    image: 'assets/images/boat_motor.jpg',
    zoneNumber: 1,
    status: 'AVAILABLE',
    description: 'High-power modern 4-stroke quiet motor boat with canopy shade.'
  },
  {
    _id: 'boat_premium_1',
    customBoatId: 'BJR-Z1-08',
    name: 'Premium Boat',
    category: 'LUXURY_BAJRA',
    filterTag: 'Premium',
    capacity: 12,
    passengersText: 'Up to 12 passengers',
    durationText: 'Full Trip (2 hrs)',
    price: 2000,
    rating: 5.0,
    image: 'assets/images/boat_premium.jpg',
    zoneNumber: 1,
    status: 'AVAILABLE',
    description: 'Heritage double-deck lounge Bajra with plush seating and Aarti viewing deck.'
  },
  {
    _id: 'boat_solar_1',
    customBoatId: 'SOL-Z1-10',
    name: 'Solar EV Eco Boat',
    category: 'EV_BOAT',
    filterTag: 'Premium',
    capacity: 10,
    passengersText: 'Up to 10 passengers',
    durationText: 'Full Trip (2 hrs)',
    price: 1500,
    rating: 4.9,
    image: 'assets/images/boat_solar.jpg',
    zoneNumber: 1,
    status: 'AVAILABLE',
    description: 'Clean eco-friendly solar catamaran craft with zero emissions.'
  },
  {
    _id: 'boat_speed_1',
    customBoatId: 'SPD-Z1-12',
    name: 'VIP Speed Boat',
    category: 'SPEED_BOAT',
    filterTag: 'Premium',
    capacity: 6,
    passengersText: 'Up to 6 passengers',
    durationText: 'Full Trip (2 hrs)',
    price: 2500,
    rating: 4.9,
    image: 'assets/images/boat_speed.jpg',
    zoneNumber: 1,
    status: 'AVAILABLE',
    description: 'High agility twin-hull power craft with high-speed river traversal.'
  }
];

// Get Rivers & Lakes
const getRiverLakes = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: fallbackRivers.length, data: fallbackRivers });
    }
    const rivers = await RiverLake.find({ isActive: true });
    res.json({ success: true, count: rivers.length, data: rivers });
  } catch (error) {
    next(error);
  }
};

// Get Zones by River
const getZones = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: fallbackZones.length, data: fallbackZones });
    }
    const { riverLakeId } = req.query;
    const filter = { isActive: true };
    if (riverLakeId) filter.riverLakeId = riverLakeId;

    const zones = await Zone.find(filter).sort({ zoneNumber: 1 });
    res.json({ success: true, count: zones.length, data: zones });
  } catch (error) {
    next(error);
  }
};

// Get Boarding Points / Ghats by Zone
const getBoardingPoints = async (req, res, next) => {
  try {
    const { zoneNumber, zoneId } = req.query;
    if (mongoose.connection.readyState !== 1) {
      let filtered = fallbackGhats;
      if (zoneNumber) filtered = fallbackGhats.filter(g => g.zoneNumber === Number(zoneNumber));
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const filter = { isActive: true };
    if (zoneNumber) filter.zoneNumber = Number(zoneNumber);
    if (zoneId) filter.zoneId = zoneId;

    const points = await BoardingPoint.find(filter).sort({ name: 1 });
    res.json({ success: true, count: points.length, data: points });
  } catch (error) {
    next(error);
  }
};

// Get Available Boats by Zone and Category
const getAvailableBoats = async (req, res, next) => {
  try {
    const { zoneNumber, category, tag } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...fallbackBoats];
      if (category && category !== 'ALL') {
        filtered = filtered.filter(b => b.category === category);
      }
      if (tag && tag !== 'All') {
        filtered = filtered.filter(b => b.filterTag === tag);
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const filter = { status: 'AVAILABLE', isActive: true };
    if (zoneNumber) filter.zoneNumber = Number(zoneNumber);
    if (category) filter.category = category;

    const boats = await Boat.find(filter).populate('assignedDriverId', 'name phone rating');
    res.json({ success: true, count: boats.length, data: boats });
  } catch (error) {
    next(error);
  }
};

// Admin: Create RiverLake
const createRiverLake = async (req, res, next) => {
  try {
    const river = await RiverLake.create(req.body);
    res.status(201).json({ success: true, data: river });
  } catch (error) {
    next(error);
  }
};

// Admin: Create Zone
const createZone = async (req, res, next) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json({ success: true, data: zone });
  } catch (error) {
    next(error);
  }
};

// Admin: Create Boarding Point / Ghat
const createBoardingPoint = async (req, res, next) => {
  try {
    const point = await BoardingPoint.create(req.body);
    res.status(201).json({ success: true, data: point });
  } catch (error) {
    next(error);
  }
};

// Admin: Create Boat
const createBoat = async (req, res, next) => {
  try {
    const boat = await Boat.create(req.body);
    res.status(201).json({ success: true, data: boat });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRiverLakes,
  getZones,
  getBoardingPoints,
  getAvailableBoats,
  createRiverLake,
  createZone,
  createBoardingPoint,
  createBoat
};
