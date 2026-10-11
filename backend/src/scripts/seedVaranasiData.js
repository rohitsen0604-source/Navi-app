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
      state: 'Uttar Pradesh',
      image: 'assets/images/river_ganga.jpg',
      isPopular: true,
      totalZones: 15
    });

    // 2. Create 15 Varanasi Zones
    const zonesData = [
      { num: 1, name: 'Zone 1 - Assi Southern Sector', adj: [2], ghat: 'Assi Ghat', img: 'assets/images/zone_assi.jpg' },
      { num: 2, name: 'Zone 2 - Tulsi & Shivala Sector', adj: [1, 3], ghat: 'Tulsi Ghat', img: 'assets/images/zone_assi.jpg' },
      { num: 3, name: 'Zone 3 - Harishchandra Ghat Sector', adj: [2, 4], ghat: 'Harishchandra', img: 'assets/images/zone_dashashwamedh.jpg' },
      { num: 4, name: 'Zone 4 - Kedar & Mansarovar Sector', adj: [3, 5], ghat: 'Kedar Ghat', img: 'assets/images/zone_dashashwamedh.jpg' },
      { num: 5, name: 'Zone 5 - Dashashwamedh Main Sector', adj: [4, 6], ghat: 'Dashashwamedh', img: 'assets/images/zone_dashashwamedh.jpg' },
      { num: 6, name: 'Zone 6 - Man Mandir & Meer Ghat Sector', adj: [5, 7], ghat: 'Meer Ghat', img: 'assets/images/zone_dashashwamedh.jpg' },
      { num: 7, name: 'Zone 7 - Manikarnika Sector', adj: [6, 8], ghat: 'Manikarnika', img: 'assets/images/zone_manikarnika.jpg' },
      { num: 8, name: 'Zone 8 - Scindia & Ram Ghat Sector', adj: [7, 9], ghat: 'Scindia Ghat', img: 'assets/images/zone_manikarnika.jpg' },
      { num: 9, name: 'Zone 9 - Panchganga Heritage Sector', adj: [8, 10], ghat: 'Panchganga', img: 'assets/images/zone_dashashwamedh.jpg' },
      { num: 10, name: 'Zone 10 - Trilochan Ghat Sector', adj: [9, 11], ghat: 'Trilochan', img: 'assets/images/zone_rajghat.jpg' },
      { num: 11, name: 'Zone 11 - Gaay & Badri Ghat Sector', adj: [10, 12], ghat: 'Gaay Ghat', img: 'assets/images/zone_rajghat.jpg' },
      { num: 12, name: 'Zone 12 - Raj Ghat Northern Sector', adj: [11, 13], ghat: 'Rajghat', img: 'assets/images/zone_rajghat.jpg' },
      { num: 13, name: 'Zone 13 - Namo Ghat Modern Terminal', adj: [12, 14], ghat: 'Namo Ghat', img: 'assets/images/zone_rajghat.jpg' },
      { num: 14, name: 'Zone 14 - Adi Keshav Sangam Sector', adj: [13, 15], ghat: 'Adi Keshav', img: 'assets/images/zone_rajghat.jpg' },
      { num: 15, name: 'Zone 15 - Sant Ravidas Smarak Sector', adj: [1, 14], ghat: 'Sant Ravidas', img: 'assets/images/zone_assi.jpg' }
    ];

    const createdZones = [];
    for (const z of zonesData) {
      const zoneDoc = await Zone.create({
        riverLakeId: gangaRiver._id,
        zoneNumber: z.num,
        name: z.name,
        code: `ZN-${z.num.toString().padStart(2, '0')}`,
        adjacentZoneNumbers: z.adj,
        primaryGhat: z.ghat,
        image: z.img,
        isActive: true
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
      { name: 'Man Mandir Ghat', zoneNum: 6, lat: 25.3095, lng: 83.0118, isPop: false },
      { name: 'Manikarnika Ghat', zoneNum: 7, lat: 25.3108, lng: 83.0135, isPop: true },
      { name: 'Scindia Ghat', zoneNum: 8, lat: 25.3125, lng: 83.0142, isPop: false },
      { name: 'Panchganga Ghat', zoneNum: 9, lat: 25.3155, lng: 83.0162, isPop: true },
      { name: 'Trilochan Ghat', zoneNum: 10, lat: 25.3195, lng: 83.0210, isPop: false },
      { name: 'Gaay Ghat', zoneNum: 11, lat: 25.3220, lng: 83.0250, isPop: false },
      { name: 'Raj Ghat', zoneNum: 12, lat: 25.3255, lng: 83.0312, isPop: true },
      { name: 'Namo Ghat (Khidkiya)', zoneNum: 13, lat: 25.3340, lng: 83.0380, isPop: true },
      { name: 'Adi Keshav Ghat', zoneNum: 14, lat: 25.3410, lng: 83.0420, isPop: false },
      { name: 'Sant Ravidas Ghat', zoneNum: 15, lat: 25.2842, lng: 83.0051, isPop: true }
    ];

    for (const g of ghats) {
      const parentZone = createdZones.find(z => z.zoneNumber === g.zoneNum);
      await BoardingPoint.create({
        zoneId: parentZone._id,
        zoneNumber: g.zoneNum,
        name: g.name,
        coordinates: { latitude: g.lat, longitude: g.lng },
        isPopular: g.isPop,
        isActive: true
      });
    }
    console.log(`[Seed] Created ${ghats.length} Ghats across zones`);

    // 4. Create Platform Admin and Call Center Staff
    const adminUser = await User.create({
      phone: '9876543210',
      firstName: 'Super',
      lastName: 'Admin',
      role: ROLES.ADMIN,
      isVerified: true
    });

    const callCenterUser = await User.create({
      phone: '9876543211',
      firstName: 'Pooja',
      lastName: 'Tiwari',
      role: ROLES.ADMIN,
      isVerified: true
    });

    // 5. Create Demo Customers
    const customer1 = await User.create({
      phone: '9876543212',
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@gmail.com',
      role: ROLES.CUSTOMER,
      isVerified: true
    });

    // 6. Comprehensive Fleet of Boats & Drivers
    const boatTemplates = [
      {
        cat: BOAT_CATEGORIES.MOTOR_BOAT,
        name: 'Ganga Vihar Motor Boat',
        filterTag: 'Motor Boat',
        cap: 10,
        price: 1200,
        rating: 4.9,
        img: 'assets/images/boat_motor.jpg',
        duration: 'Full Trip (2 hrs)',
        desc: 'High-power modern 4-stroke quiet motor boat with canopy shade.'
      },
      {
        cat: BOAT_CATEGORIES.MANUAL_ROW_BOAT,
        name: 'Standard Hand-Row Boat',
        filterTag: 'Row Boat',
        cap: 4,
        price: 800,
        rating: 4.8,
        img: 'assets/images/boat_row.jpg',
        duration: 'Full Trip (2 hrs)',
        desc: 'Traditional handcrafted wooden rowing boat with serene silent glide.'
      },
      {
        cat: BOAT_CATEGORIES.LUXURY_BAJRA,
        name: 'Royal Heritage Bajra',
        filterTag: 'Premium',
        cap: 25,
        price: 2000,
        rating: 5.0,
        img: 'assets/images/boat_premium.jpg',
        duration: 'Full Trip (2 hrs)',
        desc: 'Heritage double-deck lounge Bajra with plush seating and Aarti viewing deck.'
      },
      {
        cat: BOAT_CATEGORIES.EV_BOAT,
        name: 'Solar EV Eco Boat',
        filterTag: 'Premium',
        cap: 12,
        price: 1500,
        rating: 4.9,
        img: 'assets/images/boat_solar.jpg',
        duration: 'Full Trip (2 hrs)',
        desc: 'Clean eco-friendly solar catamaran craft with zero emissions.'
      },
      {
        cat: BOAT_CATEGORIES.SPEED_BOAT,
        name: 'VIP Power Speed Boat',
        filterTag: 'Premium',
        cap: 6,
        price: 2500,
        rating: 4.9,
        img: 'assets/images/boat_speed.jpg',
        duration: 'Full Trip (2 hrs)',
        desc: 'High agility twin-hull power craft with high-speed river traversal.'
      }
    ];

    let boatSeq = 1;
    let driverSeq = 1;

    // Seed boat options across all zones
    for (const z of createdZones) {
      const zNum = z.zoneNumber;
      const templatesToSeed = (zNum === 1 || zNum === 5 || zNum === 13) 
        ? boatTemplates 
        : [boatTemplates[0], boatTemplates[1], boatTemplates[zNum % 5]];

      for (const t of templatesToSeed) {
        const boatCustomId = `BOAT-Z${zNum}-${String(boatSeq).padStart(3, '0')}`;
        const driverCode = `DRV-${String(driverSeq).padStart(4, '0')}`;
        const driverPhone = `987654${String(3000 + driverSeq).slice(-4)}`;

        const driverUser = await User.create({
          phone: driverPhone,
          firstName: ['Ram', 'Shyam', 'Suresh', 'Ramesh', 'Vikas', 'Anand', 'Gopal', 'Kishan'][driverSeq % 8],
          lastName: ['Manjhi', 'Nishad', 'Sahani', 'Yadav', 'Pandey', 'Kashyap'][driverSeq % 6],
          role: ROLES.DRIVER,
          isVerified: true
        });

        const boat = await Boat.create({
          customBoatId: boatCustomId,
          governmentRegNumber: `UP-65-NV-${2000 + boatSeq}`,
          name: `${t.name} (Z${zNum})`,
          category: t.cat,
          filterTag: t.filterTag,
          capacity: t.cap,
          price: t.price,
          rating: t.rating,
          image: t.img,
          durationText: t.duration,
          passengersText: `Up to ${t.cap} passengers`,
          description: t.desc,
          zoneId: z._id,
          zoneNumber: zNum,
          riverLakeId: gangaRiver._id,
          status: 'AVAILABLE',
          isActive: true
        });

        const driver = await Driver.create({
          userId: driverUser._id,
          driverCode,
          name: `${driverUser.firstName} ${driverUser.lastName}`,
          phone: driverUser.phone,
          licenseNumber: `UP65-DL-${2020 + (driverSeq % 5)}-${1000 + driverSeq}`,
          zoneId: z._id,
          operationalZoneNumber: zNum,
          assignedBoatId: boat._id,
          isDutyOn: true,
          isCurrentlyOnRide: false,
          approvalStatus: 'APPROVED'
        });

        boat.assignedDriverId = driver._id;
        await boat.save();

        boatSeq++;
        driverSeq++;
      }
    }

    console.log(`[Seed] Successfully created ${boatSeq - 1} Boats and Drivers across all 15 Varanasi zones!`);
    console.log('[Seed] Database ready.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
