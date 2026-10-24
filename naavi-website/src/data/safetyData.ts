import type { SafetyProtocol } from '../types';

export const safetyProtocols: SafetyProtocol[] = [
  {
    id: 'life-jackets',
    title: '100% Mandatory Life Jacket Compliance',
    tagline: 'Zero compromise on safety flotation gear for every single passenger',
    icon: 'ShieldCheck',
    description: 'Every passenger boarding a Naavi boat must wear an ISI certified safety life jacket before the boat leaves the pier. Children and adult sizes are inspected daily at all boarding terminals.',
    enforcement: 'Boat drivers are strictly forbidden from initiating rides without passenger life jackets fastened. Violations lead to immediate suspension from the platform.'
  },
  {
    id: 'water-police-telemetry',
    title: 'Live GPS Telemetry & SOS Emergency Dispatch',
    tagline: 'Real-time telemetry linked directly to River Patrol & National Emergency 112',
    icon: 'Radio',
    description: 'In the event of distress or medical need, one tap on the Naavi Customer App or Driver App broadcasts instant high-precision GPS coordinates to River patrol rescue boats and our 24/7 Boat Command Center.',
    enforcement: 'Dedicated patrol rescue boats stationed along high-density river and lake routes maintain an emergency response window under 5 minutes.'
  },
  {
    id: 'anti-overcrowding',
    title: 'Strict Boat Capacity & Overload Prevention',
    tagline: 'Rigid regulatory boat capacity limits registered on digital trip manifest',
    icon: 'Users',
    description: 'Every boat on Naavi is licensed with an immutable maximum passenger limit under Inland Waterways Authority regulations. The booking system rejects adding any passenger beyond the boat’s certified safety rating.',
    enforcement: 'Digital boarding passes verify manifest headcount against the boat certificate before embarkation.'
  },
  {
    id: 'regulated-hours',
    title: 'Real-Time Weather Advisories & Water Current Monitoring',
    tagline: 'Automated storm, surge, and water current safety trip holds',
    icon: 'Clock',
    description: 'Waterway velocity and meteorological radar are tracked round the clock. If adverse conditions or storm warnings are declared, the platform automatically pauses boat departures and issues 100% automated refunds.',
    enforcement: 'Automated weather geofencing prevents ride requests whenever wave height or wind velocity breaches river & lake safety thresholds.'
  },
  {
    id: 'verified-captains',
    title: 'Verified & Certified Professional Boat Drivers',
    tagline: 'Licensed boat operators with comprehensive background verification',
    icon: 'UserCheck',
    description: 'All boat drivers operating on Naavi hold valid commercial boat licenses, undergo background checks, periodic medical evaluations, and water-rescue training.',
    enforcement: 'Driver credentials, boat safety registration, and passenger ratings are transparently displayed before every ride.'
  },
  {
    id: 'automatic-insurance',
    title: 'Comprehensive Digital Ride Transit Insurance',
    tagline: 'Full insurance coverage activated at departure and concluded at destination pier',
    icon: 'HeartHandshake',
    description: 'Every passenger booking via Naavi is protected under digital inland river & lake transit insurance from the moment of boarding the pier until safe step-off at the arrival dock.',
    enforcement: 'Policy event hooks activate automatically via central backend telemetry upon OTP ride verification.'
  }
];

export const passengerSafetyGuidelines = [
  'Keep your safety life jacket securely buckled throughout the trip until you disembark onto the dry pier.',
  'Remain seated while the boat is moving; avoid leaning over the sides or standing abruptly.',
  'Board and disembark only after the boat is securely moored to dock cleats and the driver signals safe entry.',
  'No smoking, alcohol consumption, or carrying hazardous flammable materials aboard.',
  'Supervise children at all times and verify that child-rated life jackets are snug and properly fitted.',
  'In the rare event of sudden weather shifts, follow your boat driver’s instructions calmly.'
];
