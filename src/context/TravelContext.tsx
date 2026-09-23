import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, GeneratedItinerary, TripBooking } from '../types/travel';
import { formatCurrency } from '../services/currencyService';
import { synthesizeItinerary } from '../services/aiTravelService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  card?: {
    title: string;
    subtitle: string;
    price: string;
    actionLabel: string;
    actionType: 'load_route' | 'view_hotel' | 'view_flight';
  };
}

export interface ModalState {
  type: 'flight_compare' | 'hotel_detail' | 'booking' | 'customize_ai' | 'attraction_detail' | null;
  data?: any;
}

interface TravelContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInINR: number) => string;
  currentItinerary: GeneratedItinerary;
  setCurrentItinerary: React.Dispatch<React.SetStateAction<GeneratedItinerary>>;
  savedBookings: TripBooking[];
  addBooking: (booking: Partial<TripBooking>) => string;
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: string) => void;
  searchQuery: {
    origin: string;
    destination: string;
    dates: string;
    travellers: number;
    cabinClass: string;
  };
  setSearchQuery: React.Dispatch<React.SetStateAction<any>>;
  activeModal: ModalState;
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currency, setCurrency] = useState<Currency>('INR');

  const [searchQuery, setSearchQuery] = useState({
    origin: 'New Delhi (DEL)',
    destination: 'Dubai (DXB)',
    dates: 'Nov 12 — Nov 16',
    travellers: 2,
    cabinClass: 'Economy',
  });

  // Default Synthesized Itinerary matching Image 3 & Image 1
  const [currentItinerary, setCurrentItinerary] = useState<GeneratedItinerary>(() => {
    return synthesizeItinerary({
      origin: 'Delhi',
      destination: 'Dubai',
      durationDays: 5,
      travellersCount: 2,
      travellerType: '2 Travellers, Economy',
      budgetCap: 100000,
      style: 'Luxury on Budget',
    });
  });

  // Pre-seed 1 confirmed booking so "My Trips" is rich and full of life
  const [savedBookings, setSavedBookings] = useState<TripBooking[]>([
    {
      id: 'bk-dxb-9821',
      bookingRef: 'TRV-DXB-98218',
      title: 'Delhi → Dubai 5-Day Luxury on Budget',
      type: 'full_itinerary',
      destination: 'Dubai, UAE',
      dates: 'Nov 12 — Nov 16, 2025',
      passengers: 2,
      totalPaid: 98000,
      status: 'Confirmed',
      bookedAt: '2025-10-28',
      flightDetails: {
        airline: 'IndiGo (6E-1453)',
        flightNumber: '6E-1453 / 6E-1454',
        seat: '12A, 12B',
        pnr: 'Q8K4M9',
        gate: 'Terminal 3, Gate 18',
      },
      hotelDetails: {
        hotelName: 'Millennium Place Marina',
        roomType: 'Superior King Room with Marina Skyline View',
        checkIn: '12 Nov 2025 (14:00)',
        checkOut: '16 Nov 2025 (12:00)',
        voucherCode: 'VCH-MPM-8891',
      },
      checklist: [
        { id: 'c1', text: 'Valid Passport (6+ months remaining)', done: true, category: 'Docs' },
        { id: 'c2', text: 'Apply 30-Day UAE Tourist eVisa', done: true, category: 'Docs' },
        { id: 'c3', text: 'Travel Insurance with Medical Cover', done: true, category: 'Health' },
        { id: 'c4', text: 'Download Dubai Metro Nol Card app', done: false, category: 'Transit' },
        { id: 'c5', text: 'Pack International Type G Power Adapter', done: false, category: 'Essentials' },
        { id: 'c6', text: 'Exchange ₹15,000 to AED Dirham or load Forex Card', done: false, category: 'Finance' },
      ],
    },
  ]);

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'I have ₹80,000 and want to travel internationally for 5 days with my partner. We love coastal cafes, pleasant weather, and need flights from Mumbai or Delhi.',
      time: '10:42 AM',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: "Found the ideal balance for ₹80,000! I've curated a high-value 5-Day escape to Dubai & Sharjah Coast flying non-stop from Mumbai.",
      time: '10:42 AM',
      card: {
        title: 'Rove Dubai Marina',
        subtitle: 'Flights + 4N Stay: ₹72,400 Total',
        price: '₹72,400',
        actionLabel: 'Load Route',
        actionType: 'load_route',
      },
    },
  ]);

  const [activeModal, setActiveModal] = useState<ModalState>({ type: null });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const formatPrice = (amountInINR: number): string => {
    return formatCurrency(amountInINR, currency);
  };

  const addBooking = (bookingData: Partial<TripBooking>): string => {
    const ref = `TRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: TripBooking = {
      id: `bk-${Date.now()}`,
      bookingRef: ref,
      title: bookingData.title || 'Dubai Travel Package',
      type: bookingData.type || 'full_itinerary',
      destination: bookingData.destination || 'Dubai, UAE',
      dates: bookingData.dates || 'Nov 12 — Nov 16, 2025',
      passengers: bookingData.passengers || 2,
      totalPaid: bookingData.totalPaid || 98000,
      status: 'Confirmed',
      bookedAt: new Date().toISOString().split('T')[0],
      flightDetails: bookingData.flightDetails || {
        airline: 'IndiGo 6E-1453',
        flightNumber: '6E-1453',
        seat: '14C, 14D',
        pnr: 'W9X2R1',
        gate: 'T3, G22',
      },
      hotelDetails: bookingData.hotelDetails || {
        hotelName: 'Millennium Place Marina',
        roomType: 'Deluxe Room with Breakfast',
        checkIn: '12 Nov 2025',
        checkOut: '16 Nov 2025',
        voucherCode: `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      checklist: [
        { id: '1', text: 'Passport with 6 months validity', done: true, category: 'Docs' },
        { id: '2', text: 'Tourist Visa approval downloaded', done: true, category: 'Docs' },
        { id: '3', text: 'Boarding passes downloaded to phone', done: false, category: 'Flight' },
        { id: '4', text: 'Hotel reservation voucher saved offline', done: true, category: 'Hotel' },
      ],
    };

    setSavedBookings((prev) => [newBooking, ...prev]);
    showToast(`🎉 Reservation confirmed! Booking reference: ${ref}`);
    return ref;
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // AI smart response simulation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiText = "I've synthesized your travel inquiry using live GDS and hotel telemetry.";
      let card: ChatMessage['card'] | undefined = undefined;

      if (lower.includes('abu dhabi') || lower.includes('day trip')) {
        aiText = "Adding a 1-day Abu Dhabi day trip is effortless! You can take a 1h 15m private Tesla transfer to Sheikh Zayed Grand Mosque and Louvre Abu Dhabi for approximately ₹6,400 for 2.";
        card = {
          title: 'Abu Dhabi Grand Mosque & Louvre Express',
          subtitle: 'Private Sedan + Louvre Admission: ₹6,400',
          price: '₹6,400',
          actionLabel: 'Load Route',
          actionType: 'load_route',
        };
      } else if (lower.includes('cheaper') || lower.includes('reduce') || lower.includes('budget') || lower.includes('save')) {
        aiText = "Here are 3 concrete optimizations: 1) Switch departure to Tuesday DEL-DXB saves ₹3,400. 2) Selecting Rove Downtown over Millennium Place Marina saves ₹10,400 over 4 nights. 3) Bundling the desert safari with group transport saves ₹2,200. Total savings: ₹16,000!";
      } else if (lower.includes('family') || lower.includes('kids')) {
        aiText = "For families, Dubai and Singapore offer the world's highest safety indexes. In Dubai, Atlantis Aquaventure Waterpark and Dubai Miracle Garden are top rated for children.";
        card = {
          title: 'Dubai Family Adventure Bundle',
          subtitle: 'Aquaventure + Miracle Garden + Lost Chambers: ₹12,800',
          price: '₹12,800',
          actionLabel: 'Load Route',
          actionType: 'load_route',
        };
      } else if (lower.includes('bali')) {
        aiText = "Bali is fantastic! For ₹54,000/person you can get a 6N/7D private pool villa in Seminyak, day trips to Ubud waterfalls, and romantic clifftop dinners at Uluwatu.";
        card = {
          title: 'Bali Romantic Escape (6N/7D)',
          subtitle: 'Private Pool Villa + Ubud Tour: ₹54,000/person',
          price: '₹54,000',
          actionLabel: 'Load Route',
          actionType: 'load_route',
        };
      } else {
        aiText = `Analyzing real-time routes for "${text}". I have mapped the flight schedules, 4-star hotels, and optimal sightseeing sequence with price match guarantee!`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const openModal = (type: ModalState['type'], data?: any) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    setActiveModal({ type: null });
  };

  return (
    <TravelContext.Provider
      value={{
        currentView,
        setCurrentView,
        currency,
        setCurrency,
        formatPrice,
        currentItinerary,
        setCurrentItinerary,
        savedBookings,
        addBooking,
        isAIChatOpen,
        setIsAIChatOpen,
        chatMessages,
        sendChatMessage,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
}
