import type { SafetyProtocol } from '../types';

export const safetyProtocols: SafetyProtocol[] = [
  {
    id: 'life-jackets',
    title: '100% Mandatory Life Jacket Compliance',
    tagline: 'Zero compromise on flotation gear for every single passenger',
    icon: 'ShieldCheck',
    description: 'Every passenger boarding a Naavi vessel must wear an ISI / USCG Type II marine life jacket before untying from the pier. Children and adult sizes are inspected daily at Ghat Desks.',
    enforcement: 'Boatmen cannot start trips without passenger life jackets fastened. Violations result in immediate suspension from platform.'
  },
  {
    id: 'water-police-telemetry',
    title: 'Direct Water Police & SOS Dispatch',
    tagline: 'Real-time GPS telemetry routed to Varanasi Water Police Headquarters',
    icon: 'Radio',
    description: 'In the event of an emergency or distress, one tap on the Naavi Customer App or Driver App triggers immediate GPS beacon telemetry to the Varanasi Water Police Control Desk (+91 542 2221234) and patrol speedboats.',
    enforcement: 'Active response boats stationed at Dashashwamedh and Rajghat with an average arrival window under 4 minutes.'
  },
  {
    id: 'anti-overcrowding',
    title: 'Strict Vessel Capacity & Overload Prevention',
    tagline: 'Rigid government capacity limits registered on vessel registration plate',
    icon: 'Users',
    description: 'Every boat on Naavi is registered under the Uttar Pradesh Inland Vessels Act with an unchangeable maximum seat capacity. The booking algorithm strictly forbids adding more passengers than the vessel license allows.',
    enforcement: 'Digital boarding passes verify passenger count against the vessel license plate UP-65-NV before launch.'
  },
  {
    id: 'regulated-hours',
    title: 'Regulated Boating Curfew & Weather Advisories',
    tagline: 'Boating permitted only between 05:00 AM and 09:30 PM',
    icon: 'Clock',
    description: 'Night boating on River Ganga is strictly prohibited for passenger safety under Varanasi District Administration directives. All Naavi rides automatically cease operations at 09:30 PM.',
    enforcement: 'During monsoon floods or high river discharge, the system automatically halts booking upon District Magistrate advisories.'
  },
  {
    id: 'verified-manjhis',
    title: 'Verified Traditional Boatmen (Manjhis)',
    tagline: 'Centuries of river knowledge backed by background verification',
    icon: 'UserCheck',
    description: 'Our navigators are drawn from the hereditary river community with generations of water navigation experience. All boatmen undergo police background verification, drug/alcohol checks, and marine first-aid training.',
    enforcement: 'Driver photo and government license are displayed transparently in the passenger app and booking voucher.'
  },
  {
    id: 'automatic-insurance',
    title: 'Comprehensive Ride Transit Insurance',
    tagline: 'Protection activated at ride start and concluded at destination pier',
    icon: 'HeartHandshake',
    description: 'Every passenger booking through Naavi is covered by digital inland transit insurance from the moment of boarding at the pier until safe disembarkation at the destination ghat.',
    enforcement: 'Policy event hooks trigger automatically via our central allocation engine upon ride start OTP verification.'
  }
];

export const passengerSafetyGuidelines = [
  'Always keep your life jacket securely buckled throughout the voyage until you step onto dry land.',
  'Remain seated while the boat is in motion; avoid leaning over the gunwale or standing abruptly.',
  'Board and disembark only when the vessel is completely tied to the jetty cleats and the boatman assists you.',
  'Do not consume alcohol or carry flammable hazardous materials aboard.',
  'Supervise children closely at all times and ensure their child-size life jackets are correctly fitted.',
  'In the unlikely event of sudden weather changes, follow your boatman’s instructions without panic.'
];
