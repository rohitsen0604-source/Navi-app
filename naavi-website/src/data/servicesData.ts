import type { BoatService } from '../types';

export const servicesData: BoatService[] = [
  {
    id: 'on-demand-motor-boat',
    title: 'Fast Motor Boat Ride',
    subtitle: 'Point-to-point swift passenger boat ride to cross rivers and lakes without traffic',
    category: 'DAILY_TRANSIT',
    categoryLabel: 'Motor Boat',
    description: 'The fastest, cleanest way to travel across riverfront points and lake destinations. Tap your app, get picked up at the nearest pier, and reach your destination with zero traffic delays.',
    vesselType: 'Speed Motor Boat',
    capacity: '6 to 12 Passengers',
    duration: '15 to 30 Mins (Point to Point)',
    estimatedPrice: '₹250 – ₹450 / seat',
    isPriceFixed: true,
    popularGhats: ['Central River Pier', 'Sunset Lake Pier', 'Harbor Point'],
    popularPiers: ['Central River Pier', 'Sunset Lake Pier', 'Harbor Point'],
    image: '/images/boat_motor.jpg',
    badge: 'Fast Ride',
    features: [
      'Rapid boat arrival in under 5 minutes from booking',
      'Certified life jacket provided for each passenger',
      'Real-time GPS boat tracking & transparent fixed fares',
      'Professional licensed boat drivers with zero haggling'
    ]
  },
  {
    id: 'scenic-sunset-boat',
    title: 'Scenic Sunset River Boat Ride',
    subtitle: 'Panoramic evening boat tour with open rooftop seating and refreshing views',
    category: 'SCENIC_RIDE',
    categoryLabel: 'Scenic Boat Ride',
    description: 'Enjoy refreshing sunset views over calm waters. Relax on comfortable cushioned seats, feel the cool river breeze, and take great photos with family and friends.',
    vesselType: 'Twin-Deck Passenger Boat',
    capacity: '15 to 30 Passengers',
    duration: '1.5 Hours (Sunset & Evening)',
    estimatedPrice: '₹400 – ₹700 / person',
    isPriceFixed: true,
    popularGhats: ['Main Ferry Pier', 'Sunset Lake Pier', 'Heritage River Point'],
    popularPiers: ['Main Ferry Pier', 'Sunset Lake Pier', 'Heritage River Point'],
    image: '/images/hero_boat_bg.jpg',
    badge: 'Most Popular',
    features: [
      'Upper open viewing deck & shaded lower seating',
      'Complimentary bottled water and sanitized seats',
      'Experienced boat driver and guide on board',
      'Safe, stable wide wooden hull boat'
    ]
  },
  {
    id: 'private-family-boat',
    title: 'Private Family Boat Booking',
    subtitle: 'Exclusive boat hire for families, celebrations & private groups',
    category: 'PRIVATE_CHARTER',
    categoryLabel: 'Private Boat',
    description: 'Reserve the entire boat for your family and friends. Enjoy personalized routes, complete privacy, cushioned seating, and flexible ride duration.',
    vesselType: 'Luxury Wooden Lounge Boat',
    capacity: 'Up to 15 Guests',
    duration: '1 to 3 Hours (Flexible)',
    estimatedPrice: '₹1,500 / hour',
    isPriceFixed: true,
    popularGhats: ['Central River Pier', 'Grand Boardwalk', 'Island Cleat'],
    popularPiers: ['Central River Pier', 'Grand Boardwalk', 'Island Cleat'],
    image: '/images/piers_boat_bg.jpg',
    badge: 'Private Hire',
    features: [
      'Entire boat private booking with customized route',
      'Comfortable cushioned seating & sunshade canopy',
      'Dedicated licensed boat driver on duty',
      'Ideal for family outings, birthdays, and private leisure'
    ]
  },
  {
    id: 'eco-solar-green-boat',
    title: 'Eco-Solar Electric Boat',
    subtitle: '100% emission-free quiet electric boat ride on clean lakes and rivers',
    category: 'ECO_SOLAR',
    categoryLabel: 'Electric Boat',
    description: 'Glide peacefully across calm waters with zero fuel smoke, zero engine noise, and zero vibrations. Powered by clean rooftop solar panels and battery electric propulsion.',
    vesselType: 'Solar Electric Boat',
    capacity: 'Up to 12 Passengers',
    duration: '1 Hour',
    estimatedPrice: '₹500 / seat',
    isPriceFixed: true,
    popularGhats: ['Green Eco Pier', 'Botanical Lake Dock'],
    popularPiers: ['Green Eco Pier', 'Botanical Lake Dock'],
    image: '/images/water_taxi_modern.jpg',
    badge: 'Zero Emission',
    features: [
      '100% silent solar electric boat - hear only the peaceful waves',
      'Eco-friendly ride with zero petrol or diesel smoke',
      'Modern ergonomic stable catamaran hull with sunshade',
      'Live battery monitoring and GPS location tracking'
    ]
  },
  {
    id: 'classic-wooden-row-boat',
    title: 'Classic Handcrafted Row Boat',
    subtitle: 'Traditional wooden boat ride for quiet, peaceful mornings',
    category: 'DAILY_TRANSIT',
    categoryLabel: 'Row Boat',
    description: 'Experience timeless water travel on an authentic handcrafted wooden rowing boat. Perfect for quiet morning photography, gentle river glides, and couples.',
    vesselType: 'Handcrafted Wooden Boat',
    capacity: '2 to 5 Passengers',
    duration: '1 Hour',
    estimatedPrice: '₹250 – ₹450 / trip',
    isPriceFixed: true,
    popularGhats: ['Old River Steps', 'Heritage Cleats'],
    popularPiers: ['Old River Steps', 'Heritage Cleats'],
    image: '/images/boat_row.jpg',
    badge: 'Peaceful Glide',
    features: [
      'Authentic quiet oar rowing without motorized engine noise',
      'Comfortable cushioned bench seats close to the water',
      'Certified life jackets provided for all passengers',
      'Manned by experienced hereditary boat rowers'
    ]
  }
];
