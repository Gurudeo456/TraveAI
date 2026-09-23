export type Currency = 'INR' | 'USD' | 'AED' | 'EUR';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rateToINR: number; // 1 unit in INR, e.g. USD = 86.5, AED = 23.5, EUR = 93.2, INR = 1
  label: string;
}

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departureTime: string;
  departureAirport: string;
  departureTerminal: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  duration: string;
  stops: 'Non-stop' | '1 Stop' | '2 Stops';
  aircraft: string;
  cabinClass: string;
  baggage: string;
  meal: string;
  isReturn?: boolean;
  returnDate?: string;
  nextDay?: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
  cabinClass: string;
  outbound: FlightSegment;
  inbound: FlightSegment;
  pricePerAdult: number; // in INR
  totalTaxes: number;
  totalPrice: number;
  badge?: string;
  amenities: string[];
  refundable: boolean;
  carbonScore: string;
  seatPitch: string;
  onTimeRate: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  location: string;
  distanceFromKeyAttraction: string;
  starRating: number;
  ratingScore: number;
  ratingLabel: string;
  reviewsCount: number;
  pricePerNight: number; // in INR
  taxesPerNight: number;
  image: string;
  additionalImages?: string[];
  amenities: string[];
  roomType: string;
  badge?: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  description: string;
  nearbyAttractions: string[];
}

export interface HolidayPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number; // in INR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inclusions: string[];
  highlights: string[];
  category: 'domestic' | 'international' | 'honeymoon' | 'family' | 'luxury' | 'budget';
  tags: string[];
  hotelCategory: string;
  featured?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  stateOrCountry: string;
  isInternational: boolean;
  tagline: string;
  image: string;
  startingPrice: number; // in INR
  bestTimeToVisit: string;
  avgDuration: string;
  rating: number;
  reviewsCount: number;
  popularActivities: string[];
  description: string;
  weather: {
    temp: string;
    condition: string;
    icon: string;
    uvIndex: string;
    seaTemp?: string;
  };
  currencyInfo: {
    currencyName: string;
    rateText: string;
    note: string;
  };
  visaProtocol: {
    title: string;
    summary: string;
  };
  tags: string[];
  category?: 'Hidden Gems' | 'European Wonders' | 'South East Asian Escapes' | 'Domestic Havens' | 'International Icons' | 'Island Retreats' | string;
  curatedCollections?: string[];
}

export interface Attraction {
  id: string;
  name: string;
  city: string;
  tag: string;
  description: string;
  startingPrice: number; // in INR
  image: string;
  duration: string;
  openingHours: string;
  category: string;
  fastTrackAvailable: boolean;
}

export interface TimelineActivity {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  time: string;
  title: string;
  description: string;
  location: string;
  cost: number;
  category: 'sightseeing' | 'food' | 'transport' | 'leisure' | 'flight' | 'hotel';
  icon: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  summary: string;
  activities: TimelineActivity[];
  estimatedCost: number;
  recommendations: {
    restaurants: string[];
    travelTip: string;
  };
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  origin: string;
  destination: string;
  travelDates: string;
  nightsCount: number;
  travellersCount: number;
  travellersType: string;
  budgetGoal: number;
  totalEstimatedCost: number;
  originalEstimatedCost?: number;
  savingsEstimated?: number;
  confidenceScore: number;
  flightCost: number;
  hotelCost: number;
  activitiesCost: number;
  foodCost: number;
  transfersCost: number;
  travelStyle: string;
  days: ItineraryDay[];
  aiReasoning: string;
  selectedHotel?: Hotel;
  selectedFlight?: Flight;
}

export interface TripBooking {
  id: string;
  bookingRef: string;
  title: string;
  type: 'full_itinerary' | 'flight' | 'hotel' | 'package';
  destination: string;
  dates: string;
  passengers: number;
  totalPaid: number;
  status: 'Confirmed' | 'Planning' | 'Completed';
  bookedAt: string;
  flightDetails?: {
    airline: string;
    flightNumber: string;
    seat: string;
    pnr: string;
    gate: string;
  };
  hotelDetails?: {
    hotelName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    voucherCode: string;
  };
  checklist: { id: string; text: string; done: boolean; category: string }[];
}
