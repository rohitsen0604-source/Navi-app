require('dotenv').config();
const mongoose = require('mongoose');
const RiverLake = require('../models/RiverLake');
const Zone = require('../models/Zone');
const BoardingPoint = require('../models/BoardingPoint');
const Boat = require('../models/Boat');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { ROLES, BOAT_CATEGORIES } = require('../config/constants');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naavi_db';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing master data
    await RiverLake.deleteMany({});
    await Zone.deleteMany({});
    await BoardingPoint.deleteMany({});
    await Boat.deleteMany({});
    await Driver.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Cleared existing collections');

    // 1. Create River Ganges (Varanasi)
    const gangaRiver = await RiverLake.create({
      name: 'Ganges River',
      city: 'Varanasi',
      state: 'Uttar Pradesh'
    });

    // 2. Create 15 Varanasi Zones
    const zonesData = [
      { num: 1, name: 'Zone 1 - Assi Southern Sector', adj: [2] },
      { num: 2, name: 'Zone 2 - Tulsi & Shivala Sector', adj: [1, 3] },
      { num: 3, name: 'Zone 3 - Harishchandra Ghat Sector', adj: [2, 4] },
      { num: 4, name: 'Zone 4 - Kedar & Mansarovar Sector', adj: [3, 5] },
      { num: 5, name: 'Zone 5 - Dashashwamedh Main Sector', adj: [4, 6] },
      { num: 6, name: 'Zone 6 - Man Mandir & Meer Ghat Sector', adj: [5, 7] },
      { num: 7, name: 'Zone 7 - Manikarnika Sector', adj: [6, 8] },
      { num: 8, name: 'Zone 8 - Scindia & Ram Ghat Sector', adj: [7, 9] },
      { num: 9, name: 'Zone 9 - Panchganga Heritage Sector', adj: [8, 10] },
      { num: 10, name: 'Zone 10 - Trilochan Ghat Sector', adj: [9, 11] },
      { num: 11, name: 'Zone 11 - Gaay & Badri Ghat Sector', adj: [10, 12] },
      { num: 12, name: 'Zone 12 - Raj Ghat Northern Sector', adj: [11, 13] },
      { num: 13, name: 'Zone 13 - Namo Ghat Modern Terminal', adj: [12, 14] },
      { num: 14, name: 'Zone 14 - Adi Keshav Sangam Sector', adj: [13, 15] },
      { num: 15, name: 'Zone 15 - Sant Ravidas Smarak Sector', adj: [1, 14] }
    ];

    const createdZones = [];
    for (const z of zonesData) {
      const zoneDoc = await Zone.create({
        riverLakeId: gangaRiver._id,
        zoneNumber: z.num,
        name: z.name,
        code: `ZN-${z.num.toString().padStart(2, '0')}`,
        adjacentZoneNumbers: z.adj
      });
      createdZones.push(zoneDoc);
    }
    console.log(`[Seed] Created ${createdZones.length} Zones for Varanasi`);

    // 3. Create prominent Ghats / Boarding Points
    const ghats = [
      { name: 'Assi Ghat', zoneNum: 1, lat: 25.2891, lng: 83.0069, isPop: true },
      { name: 'Ganga Mahal Ghat', zoneNum: 1, lat: 25.2902, lng: 83.0071, isPop: false },
      { name: 'Tulsi Ghat', zoneNum: 2, lat: 25.2922, lng: 83.0075, isPop: true },
      { name: 'Shivala Ghat', zoneNum: 2, lat: 25.2941, lng: 83.0081, isPop: false },
      { name: 'Harishchandra Ghat', zoneNum: 3, lat: 25.2988, lng: 83.0093, isPop: true },
      { name: 'Kedar Ghat', zoneNum: 4, lat: 25.3021, lng: 83.0102, isPop: true },
      { name: 'Dashashwamedh Ghat', zoneNum: 5, lat: 25.3072, lng: 83.0105, isPop: true },
      { name: 'Dr. Rajendra Prasad Ghat', zoneNum: 5, lat: 25.3082, lng: 83.0108, isPop: false },
      { name: 'Manikarnika Ghat', zoneNum: 7, lat: 25.3108, lng: 83.0135, isPop: true },
      { name: 'Scindia Ghat', zoneNum: 8, lat: 25.3125, lng: 83.0142, isPop: false },
      { name: 'Panchganga Ghat', zoneNum: 9, lat: 25.3155, lng: 83.0162, isPop: true },
      { name: 'Raj Ghat', zoneNum: 12, lat: 25.3255, lng: 83.0312, isPop: true },
      { name: 'Namo Ghat (Khidkiya)', zoneNum: 13, lat: 25.3340, lng: 83.0380, isPop: true },
      { name: 'Sant Ravidas Ghat', zoneNum: 15, lat: 25.2842, lng: 83.0051, isPop: true }
    ];

    for (const g of ghats) {
      const parentZone = createdZones.find(z => z.zoneNumber === g.zoneNum);
      await BoardingPoint.create({
        zoneId: parentZone._id,
        zoneNumber: g.zoneNum,
        name: g.name,
        coordinates: { latitude: g.lat, longitude: g.lng },
        isPopular: g.isPop
      });
    }
    console.log(`[Seed] Created ${ghats.length} Ghats across zones`);

    // 4. Create Platform Admin and Call Center Staff
    const adminUser = await User.create({
      phone: '9876543210',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@naavi.com',
      role: ROLES.ADMIN,
      isVerified: true
    });

    const opsUser = await User.create({
      phone: '9876543211',
      firstName: 'Call Center',
      lastName: 'Executive',
      email: 'ops@naavi.com',
      role: ROLES.CALL_CENTER,
      isVerified: true
    });

    // 5. Create Test Customer
    const testCustomer = await User.create({
      phone: '9876543212',
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      role: ROLES.CUSTOMER,
      isVerified: true
    });

    // 6. Create Test Drivers and Boats in Zone 1 (Assi) and Zone 5 (Dashashwamedh)
    const driver1User = await User.create({
      phone: '9876543220',
      firstName: 'Ram',
      lastName: 'Manjhi',
      role: ROLES.DRIVER,
      isVerified: true
    });

    const boat1 = await Boat.create({
      customBoatId: 'BOAT-Z1-001',
      governmentRegNumber: 'UP-65-NV-1001',
      name: 'Ganga Vihar Motor Boat',
      category: BOAT_CATEGORIES.MOTOR_BOAT,
      capacity: 10,
      zoneId: createdZones[0]._id, // Zone 1
      zoneNumber: 1,
      riverLakeId: gangaRiver._id,
      status: 'AVAILABLE'
    });

    const driver1 = await Driver.create({
      userId: driver1User._id,
      driverCode: 'DRV-1001',
      name: 'Ram Manjhi',
      phone: driver1User.phone,
      licenseNumber: 'UP65-DL-2022-0988',
      zoneId: createdZones[0]._id,
      operationalZoneNumber: 1,
      assignedBoatId: boat1._id,
      isDutyOn: true,
      approvalStatus: 'APPROVED'
    });

    boat1.assignedDriverId = driver1._id;
    await boat1.save();

    // Driver 2 in Zone 5 (Dashashwamedh)
    const driver2User = await User.create({
      phone: '9876543221',
      firstName: 'Shyam',
      lastName: 'Nishad',
      role: ROLES.DRIVER,
      isVerified: true
    });

    const boat2 = await Boat.create({
      customBoatId: 'BOAT-Z5-002',
      governmentRegNumber: 'UP-65-NV-2002',
      name: 'Royal Heritage Bajra',
      category: BOAT_CATEGORIES.LUXURY_BAJRA,
      capacity: 25,
      zoneId: createdZones[4]._id, // Zone 5
      zoneNumber: 5,
      riverLakeId: gangaRiver._id,
      status: 'AVAILABLE'
    });

    const driver2 = await Driver.create({
      userId: driver2User._id,
      driverCode: 'DRV-1002',
      name: 'Shyam Nishad',
      phone: driver2User.phone,
      licenseNumber: 'UP65-DL-2023-1122',
      zoneId: createdZones[4]._id,
      operationalZoneNumber: 5,
      assignedBoatId: boat2._id,
      isDutyOn: true,
      approvalStatus: 'APPROVED'
    });

    boat2.assignedDriverId = driver2._id;
    await boat2.save();

    console.log('[Seed] Database populated successfully with full Varanasi master data, test boats, and drivers!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
