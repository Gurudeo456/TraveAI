import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { getHolidayPackages } from '../services/holidayService';
import { parseNaturalPrompt, synthesizeItinerary } from '../services/aiTravelService';
import { MOCK_DESTINATIONS } from '../services/destinationService';

export const HomeView: React.FC = () => {
  const {
    formatPrice,
    setCurrentView,
    currentItinerary,
    setCurrentItinerary,
    openModal,
    showToast,
    searchQuery,
    setSearchQuery,
    sendChatMessage,
    setIsAIChatOpen,
  } = useTravel();

  const [searchTab, setSearchTab] = useState<'flights' | 'hotels' | 'holidays' | 'transfers'>('flights');
  const [naturalPrompt, setNaturalPrompt] = useState('');
  const [holidayCategory, setHolidayCategory] = useState('All Destinations');
  const [homeDestFilter, setHomeDestFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Form states for search hub
  const [flightFrom, setFlightFrom] = useState('New Delhi (DEL)');
  const [flightTo, setFlightTo] = useState('Dubai (DXB)');
  const [flightDepart, setFlightDepart] = useState('2025-11-12');
  const [flightReturn, setFlightReturn] = useState('2025-11-16');
  const [flightTravellers, setFlightTravellers] = useState('2 Travellers');
  const [flightClass, setFlightClass] = useState('Economy');

  const [hotelCity, setHotelCity] = useState('Dubai, UAE');
  const [hotelCheckIn, setHotelCheckIn] = useState('2025-11-12');
  const [hotelCheckOut, setHotelCheckOut] = useState('2025-11-16');
  const [hotelGuests, setHotelGuests] = useState('2 Adults');
  const [hotelRooms, setHotelRooms] = useState('1 Room');

  const [holidayDest, setHolidayDest] = useState('Dubai & Emirates');
  const [holidayBudget, setHolidayBudget] = useState('Under ₹1,00,000');

  const quickChips = [
    { label: '✨ Dubai under ₹1 Lakh', query: 'Plan a 5-day Dubai trip from Delhi for 2 people under ₹1 lakh' },
    { label: '🏔️ Family India in Dec', query: 'Best family destinations in India for December under ₹60k' },
    { label: '🏝️ Romantic Bali for 2', query: 'Plan a romantic Bali trip for 2 people with private villa' },
    { label: '⚡ Delhi Weekend under ₹20k', query: 'Weekend roadtrip getaway from Delhi under ₹20,000' },
  ];

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalPrompt.trim()) return;

    setIsSynthesizing(true);
    showToast('🧠 Synthesizing live GDS flights, 4-star hotels & attractions...');

    setTimeout(() => {
      const parsed = parseNaturalPrompt(naturalPrompt);
      const generated = synthesizeItinerary(parsed);
      setCurrentItinerary(generated);
      setIsSynthesizing(false);
      showToast(`✨ Generated itinerary for ${generated.destination}!`);

      // Scroll smoothly to preview card
      const el = document.getElementById('ai-preview-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  const handleSearchHubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery({
      origin: flightFrom,
      destination: flightTo,
      dates: 'Nov 12 — Nov 16',
      travellers: 2,
      cabinClass: flightClass,
    });

    if (searchTab === 'flights') {
      setCurrentView('flights');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (searchTab === 'hotels') {
      setCurrentView('hotels');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (searchTab === 'holidays') {
      setCurrentView('holidays');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Transfers module: Tesla airport sedan reserved.');
    }
  };

  const holidayPackages = getHolidayPackages(holidayCategory);

  return (
    <div className="w-full min-h-screen pt-20">
      {/* 1. Atmospheric Hero Section */}
      <section className="relative w-full px-gutter py-12 lg:py-20 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#3198dc]/15 via-[#00a6e0]/10 to-transparent blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#7bd0ff]/10 rounded-full blur-[90px] pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171f33]/90 border border-[#2d3449] shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-['Inter'] text-[11px] font-semibold text-[#dae2fd] tracking-wide">
              Next-Gen Autonomous Travel Copilot • Model v4.8 Active
            </span>
          </div>

          {/* Headlines */}
          <div className="space-y-3">
            <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#dae2fd] tracking-tight leading-[1.15]">
              Where will <span className="bg-gradient-to-r from-[#93ccff] via-[#7bd0ff] to-[#00a6e0] bg-clip-text text-transparent">AI</span> take you?
            </h1>
            <p className="font-['Inter'] text-base sm:text-lg text-[#bfc7d2] max-w-2xl mx-auto font-normal leading-relaxed">
              Plan smarter trips, discover amazing destinations and create personalized journeys with AI.
            </p>
          </div>

          {/* Natural Language Search Box */}
          <form onSubmit={handleNaturalSubmit} className="max-w-3xl mx-auto mt-4">
            <div className="relative p-2 bg-[#171f33]/90 backdrop-blur-xl rounded-2xl border border-[#2d3449] shadow-[0_12px_36px_rgba(2,6,23,0.6)] focus-within:border-[#3198dc] transition-all flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 pl-3 w-full sm:w-auto flex-1">
                <span className="material-symbols-outlined text-[#7bd0ff] text-[24px]">travel_explore</span>
                <input
                  type="text"
                  value={naturalPrompt}
                  onChange={(e) => setNaturalPrompt(e.target.value)}
                  placeholder="Tell us about your dream trip... (e.g. 5 days in Dubai with my wife under ₹1 Lakh)"
                  className="w-full bg-transparent font-['Inter'] text-sm sm:text-[15px] text-[#dae2fd] placeholder:text-[#89929b] focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                disabled={isSynthesizing}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3198dc] to-[#00a6e0] hover:from-[#93ccff] hover:to-[#3198dc] text-[#002c47] font-bold text-sm shadow-lg flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSynthesizing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#002c47] border-t-transparent rounded-full animate-spin"></span>
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span>Plan My Trip with AI</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNaturalPrompt(chip.query);
                  const parsed = parseNaturalPrompt(chip.query);
                  const generated = synthesizeItinerary(parsed);
                  setCurrentItinerary(generated);
                  showToast(`Loaded: ${chip.label}`);
                  const el = document.getElementById('ai-preview-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#171f33]/80 hover:bg-[#222a3d] border border-[#2d3449]/60 text-xs text-[#bfc7d2] hover:text-[#93ccff] transition-all cursor-pointer backdrop-blur-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Multi-Modal Search Hub Module */}
      <section className="w-full px-gutter max-w-6xl mx-auto -mt-4 mb-16">
        <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] shadow-2xl p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#2d3449] pb-4 mb-5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSearchTab('flights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                searchTab === 'flights'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#222a3d]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">flight</span>
              <span>Flights</span>
            </button>

            <button
              onClick={() => setSearchTab('hotels')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                searchTab === 'hotels'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#222a3d]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">hotel</span>
              <span>Hotels</span>
            </button>

            <button
              onClick={() => setSearchTab('holidays')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                searchTab === 'holidays'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#222a3d]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">beach_access</span>
              <span>Holidays & Packages</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#fb575c] text-white text-[10px] font-extrabold uppercase">
                Offer
              </span>
            </button>

            <button
              onClick={() => setSearchTab('transfers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                searchTab === 'transfers'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#222a3d]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
              <span>Transfers</span>
            </button>
          </div>

          {/* Tab Form Content */}
          <form onSubmit={handleSearchHubSubmit}>
            {searchTab === 'flights' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    From
                  </label>
                  <input
                    type="text"
                    value={flightFrom}
                    onChange={(e) => setFlightFrom(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#dae2fd] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#7bd0ff]">Indira Gandhi Intl</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    To
                  </label>
                  <input
                    type="text"
                    value={flightTo}
                    onChange={(e) => setFlightTo(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#dae2fd] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#7bd0ff]">Dubai International</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Departure
                  </label>
                  <input
                    type="date"
                    value={flightDepart}
                    onChange={(e) => setFlightDepart(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-[#bfc7d2]">Wednesday</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Return
                  </label>
                  <input
                    type="date"
                    value={flightReturn}
                    onChange={(e) => setFlightReturn(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-[#bfc7d2]">Sunday (4 Nights)</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Travellers & Class
                  </label>
                  <select
                    value={flightClass}
                    onChange={(e) => setFlightClass(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none cursor-pointer"
                  >
                    <option className="bg-[#171f33]" value="Economy">2 Adults • Economy</option>
                    <option className="bg-[#171f33]" value="Premium Economy">2 Adults • Prem Economy</option>
                    <option className="bg-[#171f33]" value="Business">2 Adults • Business</option>
                  </select>
                  <span className="text-[10px] text-[#7bd0ff]">Lowest Fare Guarantee</span>
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[52px] bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Search Flights</span>
                  </button>
                </div>
              </div>
            )}

            {searchTab === 'hotels' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Destination / Property
                  </label>
                  <input
                    type="text"
                    value={hotelCity}
                    onChange={(e) => setHotelCity(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#dae2fd] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#7bd0ff]">Marina, Downtown, Palm</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={hotelCheckIn}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-[#bfc7d2]">Nov 12, 2025</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={hotelCheckOut}
                    onChange={(e) => setHotelCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-[#bfc7d2]">Nov 16, 2025 (4 Nights)</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Guests & Rooms
                  </label>
                  <select
                    value={hotelGuests}
                    onChange={(e) => setHotelGuests(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none cursor-pointer"
                  >
                    <option className="bg-[#171f33]" value="2 Adults">2 Adults, 1 Room</option>
                    <option className="bg-[#171f33]" value="Family (4)">4 Guests (2 Rooms)</option>
                    <option className="bg-[#171f33]" value="1 Solo">1 Adult (Solo)</option>
                  </select>
                  <span className="text-[10px] text-[#7bd0ff]">4 & 5-Star Filtered</span>
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[52px] bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Search Hotels</span>
                  </button>
                </div>
              </div>
            )}

            {searchTab === 'holidays' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Destination Region
                  </label>
                  <input
                    type="text"
                    value={holidayDest}
                    onChange={(e) => setHolidayDest(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#dae2fd] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#7bd0ff]">International / Domestic</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Target Budget
                  </label>
                  <input
                    type="text"
                    value={holidayBudget}
                    onChange={(e) => setHolidayBudget(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-400">All Inclusions Covered</span>
                </div>

                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Package Duration
                  </label>
                  <div className="text-xs font-bold text-[#dae2fd] py-0.5">5 Nights / 6 Days</div>
                  <span className="text-[10px] text-[#bfc7d2]">Customizable with AI</span>
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[52px] bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">explore</span>
                    <span>Explore Holidays</span>
                  </button>
                </div>
              </div>
            )}

            {searchTab === 'transfers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    defaultValue="DXB Airport Terminal 1"
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none"
                  />
                </div>
                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Drop-off Destination
                  </label>
                  <input
                    type="text"
                    defaultValue="Millennium Place Marina"
                    className="w-full bg-transparent text-xs font-bold text-[#dae2fd] focus:outline-none"
                  />
                </div>
                <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/60">
                  <label className="text-[10px] font-semibold text-[#89929b] uppercase tracking-wider block mb-0.5">
                    Vehicle Type
                  </label>
                  <div className="text-xs font-bold text-[#dae2fd]">Private Tesla Model Y Sedan</div>
                  <span className="text-[10px] text-[#7bd0ff]">Meet & Greet Included</span>
                </div>
                <div className="flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[52px] bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Book Transfer</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* 3. Interactive 4-Step Diagram */}
      <section className="w-full px-gutter max-w-6xl mx-auto mb-16">
        <div className="text-center mb-10">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#dae2fd]">
            How Autonomous Travel Orchestration Works
          </h2>
          <p className="font-['Inter'] text-sm text-[#bfc7d2] mt-1.5">
            Tell us where you want to go. The AI plans, optimizes, and prepares the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449]/60 relative overflow-hidden group hover:border-[#3198dc]/50 transition-all">
            <span className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-[#222a3d] absolute top-3 right-4">
              01
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#3198dc]/20 text-[#93ccff] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">lightbulb</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] mb-1">
              1. Dream
            </h3>
            <p className="font-['Inter'] text-xs text-[#bfc7d2] leading-relaxed">
              Express your travel intent in natural language without dealing with complex filter forms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449]/60 relative overflow-hidden group hover:border-[#3198dc]/50 transition-all">
            <span className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-[#222a3d] absolute top-3 right-4">
              02
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#00a6e0]/20 text-[#7bd0ff] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] mb-1">
              2. Discover
            </h3>
            <p className="font-['Inter'] text-xs text-[#bfc7d2] leading-relaxed">
              Live GDS flight inventory and curated 4/5-star properties indexed in sub-second latency.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449]/60 relative overflow-hidden group hover:border-[#3198dc]/50 transition-all">
            <span className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-[#222a3d] absolute top-3 right-4">
              03
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#ffb3b0]/20 text-[#ffb3b0] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] mb-1">
              3. Plan & Optimize
            </h3>
            <p className="font-['Inter'] text-xs text-[#bfc7d2] leading-relaxed">
              Autonomous fare arbitrage identifies mid-week cost reductions and clusters attractions by proximity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449]/60 relative overflow-hidden group hover:border-[#3198dc]/50 transition-all">
            <span className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-[#222a3d] absolute top-3 right-4">
              04
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] mb-1">
              4. Book Seamlessly
            </h3>
            <p className="font-['Inter'] text-xs text-[#bfc7d2] leading-relaxed">
              Instant PNR issuance, verified hotel vouchers, offline travel documents, and 24/7 AI concierge.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Live Interactive AI Result Preview Card (Matches Image 3) */}
      <section id="ai-preview-card" className="w-full px-gutter max-w-6xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
                Synthesized Autonomous Plan
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                98.4% Confidence Score
              </span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#dae2fd]">
              {currentItinerary.title}
            </h2>
            <p className="text-xs text-[#bfc7d2] mt-0.5">
              {currentItinerary.travelDates} • {currentItinerary.travellersType}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('customize_ai')}
              className="px-3.5 py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">auto_fix_high</span>
              <span>Customize with AI</span>
            </button>
            <button
              onClick={() => showToast('📥 Itinerary synced to My Trips & PDF generated!')}
              className="px-3.5 py-2 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-semibold text-[#bfc7d2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">ios_share</span>
              <span>Export & Sync</span>
            </button>
          </div>
        </div>

        {/* Itinerary Preview & Cost Breakdown Card Grid */}
        <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          {/* Left 2 Cols: Day-by-Day Timeline Nodes */}
          <div className="lg:col-span-2 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#2d3449]">
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
              {currentItinerary.days.map((day, idx) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeDayIndex === idx
                      ? 'bg-[#3198dc] text-[#002c47] shadow-sm'
                      : 'bg-[#131b2e] text-[#bfc7d2] hover:bg-[#222a3d]'
                  }`}
                >
                  Day {day.dayNumber}
                </button>
              ))}
            </div>

            {/* Selected Day Content */}
            {currentItinerary.days[activeDayIndex] && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                    Day {currentItinerary.days[activeDayIndex].dayNumber}: {currentItinerary.days[activeDayIndex].title}
                  </h3>
                  <span className="text-xs font-bold text-[#7bd0ff]">
                    Est. Cost: {formatPrice(currentItinerary.days[activeDayIndex].estimatedCost)}
                  </span>
                </div>
                <p className="text-xs text-[#bfc7d2]">
                  {currentItinerary.days[activeDayIndex].summary}
                </p>

                {/* Activities Timeline */}
                <div className="space-y-3 pt-2">
                  {currentItinerary.days[activeDayIndex].activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-[#131b2e] border border-[#2d3449]/50 flex items-start gap-3 hover:border-[#3198dc]/30 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#222a3d] text-[#93ccff] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd] truncate">
                            {act.title}
                          </span>
                          <span className="text-[11px] text-[#7bd0ff] font-semibold shrink-0">
                            {act.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#bfc7d2] mt-1 leading-relaxed">
                          {act.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-[#89929b]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#7bd0ff]">location_on</span>
                            {act.location}
                          </span>
                          {act.cost > 0 && (
                            <span className="text-[#dae2fd] font-semibold">
                              Cost: {formatPrice(act.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Tip */}
                <div className="p-3 rounded-xl bg-[#222a3d]/50 border border-[#2d3449]/40 flex items-center gap-2.5 text-xs text-[#bfc7d2]">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">lightbulb</span>
                  <span>
                    <strong>Copilot Travel Tip:</strong> {currentItinerary.days[activeDayIndex].recommendations.travelTip}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: AI Cost Optimization Breakdown */}
          <div className="p-5 sm:p-6 bg-[#131b2e]/60 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd] uppercase tracking-wider">
                    AI Cost Optimization
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px]">
                    16% Cheaper
                  </span>
                </div>
                <p className="text-[11px] text-[#bfc7d2]">
                  Estimated saving: <strong className="text-emerald-400">{formatPrice(currentItinerary.savingsEstimated || 15500)}</strong> compared to peak unbundled rates.
                </p>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#2d3449]/40">
                  <span className="text-[#bfc7d2] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">flight</span>
                    Flights (2 Pax Return)
                  </span>
                  <span className="font-bold text-[#dae2fd]">
                    {formatPrice(currentItinerary.flightCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#2d3449]/40">
                  <span className="text-[#bfc7d2] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">hotel</span>
                    4-Star Stay (5 Nights)
                  </span>
                  <span className="font-bold text-[#dae2fd]">
                    {formatPrice(currentItinerary.hotelCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#2d3449]/40">
                  <span className="text-[#bfc7d2] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">local_activity</span>
                    Experiences & Transfers
                  </span>
                  <span className="font-bold text-[#dae2fd]">
                    {formatPrice(currentItinerary.activitiesCost + currentItinerary.transfersCost)}
                  </span>
                </div>

                {/* Total */}
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#89929b] uppercase tracking-wider block">
                      Total Package Price
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#7bd0ff]">
                      {formatPrice(currentItinerary.totalEstimatedCost)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#89929b] text-right">
                    Taxes & service fees<br />included
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-6 space-y-2">
              <button
                onClick={() => {
                  openModal('booking', {
                    type: 'full_itinerary',
                    title: currentItinerary.title,
                    totalPaid: currentItinerary.totalEstimatedCost,
                    destination: currentItinerary.destination,
                    dates: currentItinerary.travelDates,
                    flightDetails: {
                      airline: 'IndiGo (6E-1453)',
                      flightNumber: '6E-1453',
                      seat: '12A, 12B',
                      pnr: 'Q8K4M9',
                      gate: 'Terminal 3, Gate 18',
                    },
                    hotelDetails: {
                      hotelName: 'Millennium Place Marina',
                      roomType: 'Superior King Room with Marina Skyline View',
                      checkIn: '12 Nov 2025',
                      checkOut: '16 Nov 2025',
                      voucherCode: 'VCH-MPM-8891',
                    },
                  });
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3198dc] to-[#00a6e0] hover:from-[#93ccff] hover:to-[#3198dc] text-[#002c47] font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Reserve Dubai Itinerary</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <p className="text-[10px] text-center text-[#89929b]">
                Protected by TRAVELAI Price Match & Autonomous Fare Lock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. Explore Domestic & International Destinations Matrix */}
      <section className="w-full px-gutter max-w-6xl mx-auto mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
                Global & Domestic Matrix
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                {MOCK_DESTINATIONS.length} Destinations Active
              </span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#dae2fd]">
              Explore Top Domestic & International Havens
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#bfc7d2]">
              From the snow peaks of Kashmir and beaches of Goa to the skyscrapers of Dubai and alpine slopes of Switzerland.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#171f33] p-1 rounded-xl border border-[#2d3449]">
            {[
              { id: 'all', label: `All (${MOCK_DESTINATIONS.length})` },
              { id: 'domestic', label: `🇮🇳 Domestic (${MOCK_DESTINATIONS.filter((d) => !d.isInternational).length})` },
              { id: 'international', label: `✈️ International (${MOCK_DESTINATIONS.filter((d) => d.isInternational).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setHomeDestFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  homeDestFilter === tab.id
                    ? 'bg-[#222a3d] text-[#93ccff] shadow-sm'
                    : 'text-[#bfc7d2] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_DESTINATIONS.filter((dest) => {
            if (homeDestFilter === 'domestic') return !dest.isInternational;
            if (homeDestFilter === 'international') return dest.isInternational;
            return true;
          })
            .slice(0, 8)
            .map((dest) => (
              <div
                key={dest.id}
                className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col hover:border-[#3198dc]/50 transition-all group shadow-lg"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-[#131b2e]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] via-transparent to-black/20"></div>

                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      dest.isInternational ? 'bg-blue-600/80 text-white' : 'bg-emerald-600/80 text-white'
                    }`}
                  >
                    {dest.isInternational ? 'International' : 'Domestic India'}
                  </span>

                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#3198dc] text-[10px] font-bold text-[#002c47]">
                    ★ {dest.rating}
                  </span>

                  <span className="absolute bottom-2 left-2.5 text-[10px] text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-amber-300">
                      {dest.weather.icon || 'wb_sunny'}
                    </span>
                    <span>{dest.weather.temp}</span>
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] group-hover:text-[#93ccff] transition-colors truncate">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[#7bd0ff] font-semibold">{dest.stateOrCountry}</p>
                    <p className="text-[11px] text-[#bfc7d2] mt-1.5 line-clamp-2 leading-relaxed">
                      {dest.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#2d3449]/60 mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#89929b] block">Starts from</span>
                      <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#7bd0ff]">
                        {formatPrice(dest.startingPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const generated = synthesizeItinerary({
                          origin: dest.isInternational ? 'Delhi (DEL)' : 'Delhi',
                          destination: dest.name,
                          durationDays: 5,
                          travellersCount: 2,
                          travellerType: '2 Travellers, Economy',
                          budgetCap: dest.isInternational ? 100000 : 50000,
                          style: 'Luxury on Budget',
                        });
                        setCurrentItinerary(generated);
                        showToast(`✨ Generated itinerary for ${dest.name}!`);
                        setCurrentView('ai-trip-planner');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-[1.02]"
                    >
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      <span>Plan</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Link to All 44 Destinations */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setCurrentView('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] border border-[#2d3449] text-xs font-bold text-[#93ccff] inline-flex items-center gap-2 transition-all cursor-pointer hover:border-[#3198dc]"
          >
            <span>View All {MOCK_DESTINATIONS.length} Destinations (Domestic & International)</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* 5. Trending Holiday Packages (Matches Image 3) */}
      <section className="w-full px-gutter max-w-6xl mx-auto mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
              Autonomous Travel Curation
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#dae2fd] mt-1">
              Trending Holiday Packages
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#bfc7d2]">
              All-inclusive flight + luxury resort bundles dynamically priced with live GDS feeds.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#171f33] p-1 rounded-xl border border-[#2d3449] overflow-x-auto scrollbar-none pb-1">
            {['All Destinations', 'Domestic India', 'International', 'Top Rated', 'Under ₹50k'].map((cat) => (
              <button
                key={cat}
                onClick={() => setHolidayCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  holidayCategory === cat
                    ? 'bg-[#222a3d] text-[#93ccff] shadow-sm'
                    : 'text-[#bfc7d2] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4 High Fidelity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {holidayPackages.slice(0, 4).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col hover:border-[#3198dc]/50 transition-all group shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-[#131b2e]">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {pkg.durationDays}D / {pkg.durationNights}N
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#3198dc] text-[10px] font-bold text-[#002c47]">
                  ★ {pkg.rating}
                </span>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#7bd0ff] mt-0.5">{pkg.destination} • {pkg.hotelCategory}</p>
                  <p className="text-[11px] text-[#bfc7d2] mt-2 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2d3449]/60 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[10px] text-[#89929b] block">Starting from</span>
                      <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#7bd0ff]">
                        {formatPrice(pkg.pricePerPerson)}
                      </span>
                      <span className="text-[10px] text-[#89929b]"> / person</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setCurrentView('holidays');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] text-center transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openModal('customize_ai')}
                      className="py-2 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold text-center transition-colors cursor-pointer"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Production Engine Architecture Certification Badge */}
      <section className="w-full px-gutter max-w-6xl mx-auto mb-12">
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#2d3449]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#dae2fd]">
                  Production Engine Architecture
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  GDS SYNC 99.98%
                </span>
              </div>
              <p className="text-[11px] text-[#bfc7d2]">
                Zero-delay Amadeus & Sabre flight scrapers with 1.4s AI synthesis latency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-xs font-bold text-[#93ccff] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Open Travel Consultant</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
