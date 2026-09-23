import { Flight } from '../types/travel';

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'fl-indigo-6e1453',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-1453',
    aircraft: 'Airbus A321neo • Economy Direct',
    cabinClass: 'Economy',
    badge: 'Best Value',
    pricePerAdult: 19200,
    totalTaxes: 0,
    totalPrice: 38400, // 2 travellers
    refundable: true,
    carbonScore: '142 kg CO₂ (-12% vs avg)',
    seatPitch: '30-31 inches',
    onTimeRate: '94.2%',
    amenities: ['Free Meal Included', '20kg Checked Baggage', 'Standard USB Power'],
    outbound: {
      flightNumber: '6E-1453',
      airline: 'IndiGo',
      airlineCode: '6E',
      departureTime: '08:30',
      departureAirport: 'DEL',
      departureTerminal: 'Terminal 3',
      arrivalTime: '11:15',
      arrivalAirport: 'DXB',
      arrivalTerminal: 'Terminal 1',
      duration: '3h 45m',
      stops: 'Non-stop',
      aircraft: 'A321neo',
      cabinClass: 'Economy',
      baggage: '20kg Check-in + 7kg Cabin',
      meal: 'Complimentary Snack & Drink',
    },
    inbound: {
      flightNumber: '6E-1454',
      airline: 'IndiGo',
      airlineCode: '6E',
      departureTime: '19:40',
      departureAirport: 'DXB',
      departureTerminal: 'Terminal 1',
      arrivalTime: '00:30',
      arrivalAirport: 'DEL',
      arrivalTerminal: 'Terminal 3',
      duration: '3h 20m',
      stops: 'Non-stop',
      aircraft: 'A321neo',
      cabinClass: 'Economy',
      baggage: '20kg Check-in + 7kg Cabin',
      meal: 'Complimentary Hot Meal',
      isReturn: true,
      returnDate: '16 Nov',
      nextDay: '+1d',
    },
  },
  {
    id: 'fl-airindia-ai995',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-995',
    aircraft: 'Boeing 787-8 Dreamliner • Full Service',
    cabinClass: 'Economy Direct',
    pricePerAdult: 21500,
    totalTaxes: 0,
    totalPrice: 43000,
    refundable: true,
    carbonScore: '158 kg CO₂ (Avg)',
    seatPitch: '32 inches wide',
    onTimeRate: '91.8%',
    amenities: ['Complimentary Hot Meal', '25kg Baggage Allowance', 'Seatback Screens'],
    outbound: {
      flightNumber: 'AI-995',
      airline: 'Air India',
      airlineCode: 'AI',
      departureTime: '13:00',
      departureAirport: 'DEL',
      departureTerminal: 'Terminal 3',
      arrivalTime: '15:40',
      arrivalAirport: 'DXB',
      arrivalTerminal: 'Terminal 1',
      duration: '3h 40m',
      stops: 'Non-stop',
      aircraft: 'Boeing 787-8',
      cabinClass: 'Economy',
      baggage: '25kg Check-in + 8kg Cabin',
      meal: 'Indian & Continental Multi-course Meal',
    },
    inbound: {
      flightNumber: 'AI-996',
      airline: 'Air India',
      airlineCode: 'AI',
      departureTime: '22:15',
      departureAirport: 'DXB',
      departureTerminal: 'Terminal 1',
      arrivalTime: '03:00',
      arrivalAirport: 'DEL',
      arrivalTerminal: 'Terminal 3',
      duration: '3h 15m',
      stops: 'Non-stop',
      aircraft: 'Boeing 787-8',
      cabinClass: 'Economy',
      baggage: '25kg Check-in + 8kg Cabin',
      meal: 'Midnight Refreshment & Hot Beverage',
      isReturn: true,
      returnDate: '16 Nov',
      nextDay: '+1d',
    },
  },
  {
    id: 'fl-emirates-ek511',
    airline: 'Emirates',
    airlineCode: 'EK',
    flightNumber: 'EK-511',
    aircraft: 'Boeing 777-300ER • ICE Entertainment System',
    cabinClass: 'Premium Flagship',
    badge: 'Premium Flagship',
    pricePerAdult: 28400,
    totalTaxes: 0,
    totalPrice: 56800,
    refundable: true,
    carbonScore: '165 kg CO₂ (Wide-body Comfort)',
    seatPitch: '33 inches Luxury Pitch',
    onTimeRate: '97.5%',
    amenities: ['Multi-course Gourmet Dining', '30kg Check-in', '5,000 Channels ICE Entertainment', 'Complimentary Wine & Beverages'],
    outbound: {
      flightNumber: 'EK-511',
      airline: 'Emirates',
      airlineCode: 'EK',
      departureTime: '10:45',
      departureAirport: 'DEL',
      departureTerminal: 'Terminal 3',
      arrivalTime: '13:10',
      arrivalAirport: 'DXB',
      arrivalTerminal: 'Terminal 3',
      duration: '3h 55m',
      stops: 'Non-stop',
      aircraft: 'Boeing 777-300ER',
      cabinClass: 'Economy Premium',
      baggage: '30kg Check-in + 7kg Cabin',
      meal: 'Chef-prepared 3-course Lunch with Wine/Beverages',
    },
    inbound: {
      flightNumber: 'EK-512',
      airline: 'Emirates',
      airlineCode: 'EK',
      departureTime: '21:00',
      departureAirport: 'DXB',
      departureTerminal: 'Terminal 3',
      arrivalTime: '01:55',
      arrivalAirport: 'DEL',
      arrivalTerminal: 'Terminal 3',
      duration: '3h 25m',
      stops: 'Non-stop',
      aircraft: 'Boeing 777-300ER',
      cabinClass: 'Economy Premium',
      baggage: '30kg Check-in + 7kg Cabin',
      meal: 'Late Night Arabic Gourmet Dinner',
      isReturn: true,
      returnDate: '16 Nov',
      nextDay: '+1d',
    },
  },
  {
    id: 'fl-spicejet-sg11',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNumber: 'SG-11',
    aircraft: 'Boeing 737 Max 8 • Low-Cost Special',
    cabinClass: 'SpiceMax',
    pricePerAdult: 18900,
    totalTaxes: 0,
    totalPrice: 37800,
    refundable: false,
    carbonScore: '138 kg CO₂ (-15%)',
    seatPitch: '29 inches',
    onTimeRate: '88.1%',
    amenities: ['20kg Checked Baggage', 'Buy-on-board Snacks'],
    outbound: {
      flightNumber: 'SG-11',
      airline: 'SpiceJet',
      airlineCode: 'SG',
      departureTime: '06:15',
      departureAirport: 'DEL',
      departureTerminal: 'Terminal 3',
      arrivalTime: '09:00',
      arrivalAirport: 'DXB',
      arrivalTerminal: 'Terminal 1',
      duration: '3h 45m',
      stops: 'Non-stop',
      aircraft: 'Boeing 737 Max 8',
      cabinClass: 'Economy',
      baggage: '20kg Check-in + 7kg Cabin',
      meal: 'Available for Purchase',
    },
    inbound: {
      flightNumber: 'SG-12',
      airline: 'SpiceJet',
      airlineCode: 'SG',
      departureTime: '18:15',
      departureAirport: 'DXB',
      departureTerminal: 'Terminal 1',
      arrivalTime: '23:05',
      arrivalAirport: 'DEL',
      arrivalTerminal: 'Terminal 3',
      duration: '3h 20m',
      stops: 'Non-stop',
      aircraft: 'Boeing 737 Max 8',
      cabinClass: 'Economy',
      baggage: '20kg Check-in + 7kg Cabin',
      meal: 'Available for Purchase',
      isReturn: true,
      returnDate: '16 Nov',
    },
  },
];

export interface FlightFilterParams {
  origin?: string;
  destination?: string;
  maxPrice?: number;
  stops?: string[]; // 'Non-stop', '1 Stop'
  airlines?: string[];
  departureSlot?: 'all' | 'morning' | 'afternoon' | 'night';
  baggageIncluded?: boolean;
  sortBy?: 'recommended' | 'price' | 'duration';
}

export function searchFlights(filters?: FlightFilterParams): Flight[] {
  let results = [...MOCK_FLIGHTS];

  if (!filters) return results;

  if (filters.maxPrice) {
    results = results.filter((f) => f.pricePerAdult <= (filters.maxPrice || 50000));
  }

  if (filters.airlines && filters.airlines.length > 0) {
    results = results.filter((f) => filters.airlines!.includes(f.airline));
  }

  if (filters.departureSlot && filters.departureSlot !== 'all') {
    results = results.filter((f) => {
      const depHour = parseInt(f.outbound.departureTime.split(':')[0], 10);
      if (filters.departureSlot === 'morning') return depHour >= 6 && depHour < 12;
      if (filters.departureSlot === 'afternoon') return depHour >= 12 && depHour < 18;
      if (filters.departureSlot === 'night') return depHour >= 18 || depHour < 6;
      return true;
    });
  }

  if (filters.sortBy === 'price') {
    results.sort((a, b) => a.pricePerAdult - b.pricePerAdult);
  } else if (filters.sortBy === 'duration') {
    results.sort((a, b) => a.outbound.duration.localeCompare(b.outbound.duration));
  }

  return results;
}
