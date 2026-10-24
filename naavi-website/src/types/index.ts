export type BoatCategory = 
  | 'MOTOR_BOAT'
  | 'MANUAL_ROW_BOAT'
  | 'LUXURY_BAJRA'
  | 'SPEED_BOAT'
  | 'EV_BOAT';

export type ServiceCategory = 
  | 'ALL'
  | 'WATER_TAXI'
  | 'SCENIC_RIDE'
  | 'PRIVATE_CHARTER'
  | 'ECO_SOLAR'
  | 'DAILY_TRANSIT'
  | 'SUNRISE_RIDE';

export interface BoatService {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  categoryLabel: string;
  description: string;
  vesselType: string;
  capacity: string;
  duration: string;
  estimatedPrice: string;
  isPriceFixed: boolean;
  popularGhats: string[];
  popularPiers?: string[];
  image: string;
  badge?: string;
  features: string[];
}


export interface BoardingPoint {
  name: string;
  zoneNumber: number;
  lat: number;
  lng: number;
  isPopular: boolean;
  nearbyLandmark?: string;
}

export interface ZoneItem {
  zoneNumber: number;
  name: string;
  code: string;
  adjacentZoneNumbers: number[];
  primaryGhat: string;
  primaryPier?: string;
  image: string;
  description: string;
  isPopular: boolean;
  ghats: string[];
  piers?: string[];
  highlights: string[];
}

export interface GhatDesk {
  id: string;
  ghatName: string;
  pierName?: string;
  zone: string;
  location: string;
  supervisor: string;
  phone: string;
  timing: string;
  availableServices: string[];
}

export type PierDesk = GhatDesk;

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'safety' | 'pricing' | 'ghats' | 'policy';
  categoryLabel: string;
}

export interface SafetyProtocol {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  description: string;
  enforcement: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  bookingCode?: string;
  message: string;
}

export interface SupportTicketResult {
  success: boolean;
  ticketId?: string;
  message: string;
  status?: string;
  estimatedResolution?: string;
  estimatedResponse?: string;
}
