import { GeneratedItinerary, ItineraryDay } from '../types/travel';
import { MOCK_HOTELS } from './hotelService';
import { MOCK_FLIGHTS } from './flightService';
import { MOCK_DESTINATIONS } from './destinationService';

export interface ParsedTripQuery {
  origin: string;
  destination: string;
  durationDays: number;
  travellersCount: number;
  travellerType: string;
  budgetCap: number;
  style: string;
}

export function parseNaturalPrompt(prompt: string): ParsedTripQuery {
  const lower = prompt.toLowerCase();

  // Match destination from prompt
  let destination = 'Dubai';
  for (const dest of MOCK_DESTINATIONS) {
    const cleanName = dest.name.toLowerCase().split('(')[0].trim();
    if (lower.includes(cleanName) || lower.includes(dest.id.replace('dest-', ''))) {
      destination = dest.name;
      break;
    }
  }

  // Common aliases
  if (lower.includes('kashmir')) destination = 'Kashmir (Srinagar & Gulmarg)';
  else if (lower.includes('rajasthan') || lower.includes('jaipur') || lower.includes('udaipur')) destination = 'Jaipur & Udaipur (Rajasthan)';
  else if (lower.includes('andaman')) destination = 'Andaman & Nicobar Islands';
  else if (lower.includes('manali') || lower.includes('shimla') || lower.includes('himachal')) destination = 'Manali & Shimla (Himachal)';
  else if (lower.includes('ladakh') || lower.includes('leh')) destination = 'Leh & Ladakh';
  else if (lower.includes('thailand') || lower.includes('phuket') || lower.includes('bangkok')) destination = 'Thailand (Bangkok & Phuket)';
  else if (lower.includes('maldives')) destination = 'Maldives';
  else if (lower.includes('switzerland') || lower.includes('swiss')) destination = 'Switzerland (Zurich & Interlaken)';
  else if (lower.includes('paris') || lower.includes('france')) destination = 'Paris & France';
  else if (lower.includes('italy') || lower.includes('rome') || lower.includes('venice')) destination = 'Italy (Rome, Florence & Venice)';
  else if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('kyoto')) destination = 'Japan (Tokyo, Kyoto & Osaka)';
  else if (lower.includes('vietnam') || lower.includes('danang') || lower.includes('hanoi')) destination = 'Vietnam (Hanoi, Da Nang & Ha Long)';
  else if (lower.includes('turkey') || lower.includes('cappadocia') || lower.includes('istanbul')) destination = 'Turkey (Istanbul & Cappadocia)';
  else if (lower.includes('london') || lower.includes('uk') || lower.includes('scotland')) destination = 'United Kingdom (London & Scotland)';

  let origin = 'Delhi (DEL)';
  if (lower.includes('mumbai') || lower.includes('bom')) origin = 'Mumbai (BOM)';
  else if (lower.includes('bangalore') || lower.includes('bengaluru') || lower.includes('blr')) origin = 'Bangalore (BLR)';
  else if (lower.includes('chennai') || lower.includes('maa')) origin = 'Chennai (MAA)';
  else if (lower.includes('kolkata') || lower.includes('ccu')) origin = 'Kolkata (CCU)';
  else if (lower.includes('hyderabad') || lower.includes('hyd')) origin = 'Hyderabad (HYD)';

  let durationDays = 5;
  const daysMatch = lower.match(/(\d+)\s*(day|days|d|nights)/);
  if (daysMatch) {
    durationDays = Math.min(Math.max(parseInt(daysMatch[1], 10), 3), 10);
  }

  let travellersCount = 2;
  let travellerType = 'Couple / Partner';
  if (lower.includes('family')) {
    travellersCount = 4;
    travellerType = 'Family (2 Adults, 2 Kids)';
  } else if (lower.includes('solo')) {
    travellersCount = 1;
    travellerType = 'Solo Nomad';
  } else if (lower.includes('friends') || lower.includes('group')) {
    travellersCount = 4;
    travellerType = 'Group of Friends';
  }

  let budgetCap = 100000;
  if (lower.includes('20,000') || lower.includes('20k')) budgetCap = 20000;
  else if (lower.includes('30,000') || lower.includes('30k')) budgetCap = 30000;
  else if (lower.includes('50,000') || lower.includes('50k')) budgetCap = 50000;
  else if (lower.includes('80,000') || lower.includes('80k')) budgetCap = 80000;
  else if (lower.includes('1 lakh') || lower.includes('1,00,000') || lower.includes('100k')) budgetCap = 100000;
  else if (lower.includes('1.5 lakh') || lower.includes('1,50,000')) budgetCap = 150000;
  else if (lower.includes('2 lakh') || lower.includes('2,00,000')) budgetCap = 200000;

  let style = 'Luxury on Budget';
  if (lower.includes('luxury')) style = 'Ultra Luxury 5-Star';
  else if (lower.includes('budget') || lower.includes('cheap')) style = 'Smart Budget';
  else if (lower.includes('romantic')) style = 'Romantic Honeymoon';
  else if (lower.includes('adventure')) style = 'Adventure & Discovery';

  return {
    origin,
    destination,
    durationDays,
    travellersCount,
    travellerType,
    budgetCap,
    style,
  };
}

export function synthesizeItinerary(query: ParsedTripQuery): GeneratedItinerary {
  const matchedDest = MOCK_DESTINATIONS.find(
    (d) => d.name.toLowerCase() === query.destination.toLowerCase()
  ) || MOCK_DESTINATIONS[0];

  const isDomestic = !matchedDest.isInternational;
  const hotel = MOCK_HOTELS[0];
  const flight = MOCK_FLIGHTS[0];

  const flightUnitCost = isDomestic ? 7800 : matchedDest.startingPrice > 80000 ? 44000 : 21000;
  const hotelNightly = isDomestic ? 4800 : matchedDest.startingPrice > 80000 ? 14000 : 7500;

  const flightCost = query.travellersCount * flightUnitCost;
  const hotelCost = Math.max(query.durationDays - 1, 1) * hotelNightly;
  const activitiesCost = query.travellersCount * (isDomestic ? 4200 : 9800);
  const foodCost = query.travellersCount * query.durationDays * (isDomestic ? 1200 : 2200);
  const transfersCost = isDomestic ? 3500 : 6500;

  const totalCalculated = flightCost + hotelCost + activitiesCost + foodCost + transfersCost;
  const originalEstimate = Math.round(totalCalculated * 1.16);
  const savings = originalEstimate - totalCalculated;

  const popularActs = matchedDest.popularActivities || ['Local Exploration & Sunset Walk', 'City Highlight Tour', 'Traditional Culinary Dinner'];

  const days: ItineraryDay[] = [];

  // Generate dynamic days up to durationDays
  for (let i = 1; i <= query.durationDays; i++) {
    if (i === 1) {
      days.push({
        dayNumber: 1,
        title: `Arrival in ${matchedDest.name} & Leisure Evening`,
        summary: `Direct transfer from ${query.origin} • Hotel check-in • Welcome orientation`,
        estimatedCost: Math.round(totalCalculated * 0.15),
        activities: [
          {
            id: 'd1-a1',
            timeSlot: 'Morning',
            time: '08:30 – 11:30',
            title: `Departure from ${query.origin}`,
            description: `Scenic journey & arrival at ${matchedDest.name}. Expedited baggage & private pickup.`,
            location: `${matchedDest.name} Airport / Terminal`,
            cost: 0,
            category: 'flight',
            icon: 'flight_takeoff',
          },
          {
            id: 'd1-a2',
            timeSlot: 'Afternoon',
            time: '13:00 – 15:30',
            title: 'Hotel Check-in & Relaxation',
            description: 'Unwind at premium accommodation, refresh, and enjoy resort facilities.',
            location: `${matchedDest.name} City Centre`,
            cost: 0,
            category: 'hotel',
            icon: 'hotel',
          },
          {
            id: 'd1-a3',
            timeSlot: 'Evening',
            time: '17:30 – 21:00',
            title: popularActs[0] || 'Sunset Promenade & Welcome Feast',
            description: 'Panoramic sunset views followed by an authentic regional dinner.',
            location: `${matchedDest.name} Scenic Promenade`,
            cost: 1800,
            category: 'sightseeing',
            icon: 'wb_twilight',
          },
        ],
        recommendations: {
          restaurants: ['Local Bistro or Hotel Lounge', 'Signature Waterfront or Heritage Restaurant'],
          travelTip: 'Keep local currency or UPI ready. Evening temperatures are optimal for walks.',
        },
      });
    } else if (i === query.durationDays) {
      days.push({
        dayNumber: i,
        title: 'Souvenir Markets & Return Journey',
        summary: `Farewell breakfast • Last-minute regional treasures • Return to ${query.origin}`,
        estimatedCost: Math.round(totalCalculated * 0.1),
        activities: [
          {
            id: `d${i}-a1`,
            timeSlot: 'Morning',
            time: '09:00 – 11:30',
            title: 'Artisan Bazaars & Local Souvenirs',
            description: 'Handicrafts, local spices, teas, and memorable keepsake shopping.',
            location: `${matchedDest.name} Old Quarter / Market`,
            cost: 1200,
            category: 'sightseeing',
            icon: 'shopping_bag',
          },
          {
            id: `d${i}-a2`,
            timeSlot: 'Afternoon',
            time: '14:00 – 17:30',
            title: `Airport Transfer & Return Flight`,
            description: `Private cab transfer to airport. Seamless departure back to ${query.origin}.`,
            location: `${matchedDest.name} Terminal`,
            cost: 0,
            category: 'flight',
            icon: 'flight_land',
          },
        ],
        recommendations: {
          restaurants: ['Lavish Buffet at Hotel', 'Airport Lounge / Cafe'],
          travelTip: 'Arrive 2.5 hours prior for domestic and 3.5 hours for international flights.',
        },
      });
    } else {
      const actIdx = (i - 1) % popularActs.length;
      const actTitle = popularActs[actIdx];
      days.push({
        dayNumber: i,
        title: `Explore ${actTitle}`,
        summary: `Full day immersion: ${actTitle} • Scenic landscapes • Regional dining`,
        estimatedCost: Math.round(totalCalculated * 0.22),
        activities: [
          {
            id: `d${i}-a1`,
            timeSlot: 'Morning',
            time: '09:00 – 12:30',
            title: actTitle,
            description: `Exclusive guided experience with pre-booked fast-track access and scenic views.`,
            location: `${matchedDest.name}`,
            cost: 2200,
            category: 'sightseeing',
            icon: 'explore',
          },
          {
            id: `d${i}-a2`,
            timeSlot: 'Afternoon',
            time: '13:30 – 16:30',
            title: 'Cultural Discovery & Photo Spots',
            description: 'Hidden gems, viewpoints, and serene natural settings recommended by AI.',
            location: `${matchedDest.name} Scenic Point`,
            cost: 1500,
            category: 'leisure',
            icon: 'photo_camera',
          },
          {
            id: `d${i}-a3`,
            timeSlot: 'Evening',
            time: '18:00 – 21:30',
            title: 'Evening Sunset & Culinary Walk',
            description: 'Savor regional specialties, street food highlights, or fine dining.',
            location: `${matchedDest.name} Food Street`,
            cost: 2000,
            category: 'food',
            icon: 'restaurant',
          },
        ],
        recommendations: {
          restaurants: ['Traditional Cafe & Local Delicacies', 'Rooftop Panoramic Restaurant'],
          travelTip: 'Pre-book fast-track slots through TRAVELAI to bypass visitor queues.',
        },
      });
    }
  }

  return {
    id: `itinerary-${Date.now()}`,
    title: `${query.durationDays}-Day ${matchedDest.name} Personalized Escape`,
    origin: query.origin,
    destination: matchedDest.name,
    travelDates: 'Nov 12 – Nov 16, 2025',
    nightsCount: query.durationDays - 1,
    travellersCount: query.travellersCount,
    travellersType: query.travellerType,
    budgetGoal: query.budgetCap,
    totalEstimatedCost: totalCalculated,
    originalEstimatedCost: originalEstimate,
    savingsEstimated: savings,
    confidenceScore: 98.6,
    flightCost,
    hotelCost,
    activitiesCost,
    foodCost,
    transfersCost,
    travelStyle: query.style,
    days,
    aiReasoning: `Autonomous Fare Arbitrage applied: Mid-week departure from ${query.origin} saves significant airfare. Dynamic ${matchedDest.name} hotel inventory discounted with proximity routing.`,
    selectedHotel: hotel,
    selectedFlight: flight,
  };
}
