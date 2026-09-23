import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { searchFlights, MOCK_FLIGHTS } from '../services/flightService';
import { getHotels, MOCK_HOTELS } from '../services/hotelService';
import { DUBAI_ATTRACTIONS } from '../services/destinationService';

export const FlightsView: React.FC = () => {
  const {
    formatPrice,
    searchQuery,
    setSearchQuery,
    openModal,
    showToast,
    setCurrentView,
  } = useTravel();

  // Search Bar state
  const [origin, setOrigin] = useState('New Delhi DEL');
  const [destination, setDestination] = useState('Dubai DXB');
  const [dates, setDates] = useState('Nov 12 — Nov 16');
  const [travellers, setTravellers] = useState('2 Travellers');
  const [cabinClass, setCabinClass] = useState('Economy');

  // Sub-tabs
  const [activeSection, setActiveSection] = useState<'flights' | 'hotels' | 'attractions'>('flights');

  // Filters
  const [selectedStops, setSelectedStops] = useState<string[]>(['Non-stop']);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [departureSlot, setDepartureSlot] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [baggageOnly, setBaggageOnly] = useState(true);

  // Hotel filter pill
  const [hotelArea, setHotelArea] = useState('All Stays');

  const filteredFlights = searchFlights({
    maxPrice,
    airlines: selectedAirlines.length > 0 ? selectedAirlines : undefined,
    departureSlot,
    sortBy: 'recommended',
  });

  const filteredHotels = getHotels('Dubai', hotelArea);

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  const resetFilters = () => {
    setSelectedStops(['Non-stop']);
    setSelectedAirlines([]);
    setMaxPrice(50000);
    setDepartureSlot('all');
    setBaggageOnly(false);
    showToast('Filters reset to default.');
  };

  return (
    <div className="w-full min-h-screen pt-20">
      {/* 1. Dynamic Discovery Engine Header Bar */}
      <section className="w-full bg-[#131b2e] border-b border-[#2d3449]/60 px-gutter py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#dae2fd]">
              Dynamic Discovery Engine
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Amadeus & Sabre Synced (38ms)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#bfc7d2]">
            <span>Currency Reference: 1 AED = ₹22.65</span>
            <span className="text-[#89929b]">|</span>
            <span className="text-emerald-400 font-bold">Price Match Guaranteed</span>
          </div>
        </div>
      </section>

      {/* 2. Top Search Parameters Bar */}
      <section className="w-full bg-[#171f33] border-b border-[#2d3449] px-gutter py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Origin & Destination */}
          <div className="lg:col-span-2 bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/70 flex items-center justify-between">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-[#89929b] block">From</span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#dae2fd] focus:outline-none w-full"
              />
            </div>
            <button
              onClick={() => {
                const temp = origin;
                setOrigin(destination);
                setDestination(temp);
              }}
              className="p-1.5 rounded-lg bg-[#222a3d] text-[#93ccff] hover:bg-[#3198dc] hover:text-[#002c47] transition-colors mx-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            </button>
            <div className="flex-1 text-right">
              <span className="text-[10px] uppercase font-bold text-[#89929b] block">To</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#dae2fd] focus:outline-none w-full text-right"
              />
            </div>
          </div>

          {/* Travel Window */}
          <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/70">
            <span className="text-[10px] uppercase font-bold text-[#89929b] block">Travel Window</span>
            <div className="text-sm font-bold text-[#dae2fd]">{dates}</div>
            <span className="text-[10px] text-[#7bd0ff]">4 Nights Duration</span>
          </div>

          {/* Occupancy & Class */}
          <div className="bg-[#131b2e] p-2.5 rounded-xl border border-[#2d3449]/70">
            <span className="text-[10px] uppercase font-bold text-[#89929b] block">Occupancy & Class</span>
            <div className="text-sm font-bold text-[#dae2fd]">{travellers}, {cabinClass}</div>
            <span className="text-[10px] text-[#bfc7d2]">2 Checked Bags</span>
          </div>

          {/* Update Search Button */}
          <button
            onClick={() => showToast('Refreshed live GDS flight telemetry.')}
            className="w-full h-full min-h-[50px] bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Update Search</span>
          </button>
        </div>
      </section>

      {/* 3. Sub-tabs & Autonomous Arbitrage Banner */}
      <section className="w-full px-gutter max-w-7xl mx-auto mt-6">
        {/* Navigation Sub-tabs */}
        <div className="flex items-center justify-between border-b border-[#2d3449] pb-3 mb-5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('flights')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'flights'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#171f33]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">flight</span>
              <span>Flights Results ({MOCK_FLIGHTS.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('hotels')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'hotels'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#171f33]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">hotel</span>
              <span>Hotels in Dubai ({MOCK_HOTELS.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('attractions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'attractions'
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'text-[#bfc7d2] hover:bg-[#171f33]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Destination Guide & Attractions</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>PRICE MATCH GUARANTEED</span>
          </div>
        </div>

        {/* Autonomous Fare Arbitrage Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#171f33] via-[#131b2e] to-[#222a3d] border border-[#3198dc]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3198dc]/20 text-[#93ccff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] font-bold text-[#dae2fd]">
                AI Tip: Flying on Tuesday Nov 12 saves ₹3,400 vs weekend departure.
              </p>
              <p className="text-[11px] text-[#bfc7d2] mt-0.5">
                Return fares surge 18% after 22:00. Confidence Score: <strong className="text-emerald-400">98.4%</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => showToast('Applied Tuesday mid-week fare lock!')}
            className="px-3.5 py-1.5 rounded-lg bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs shrink-0 transition-colors cursor-pointer"
          >
            Apply Smart Lock
          </button>
        </div>
      </section>

      {/* 4. Main Content: Filter Sidebar + Flight Cards */}
      {activeSection === 'flights' && (
        <section className="w-full px-gutter max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Filter Panel */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-4 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
                <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd]">
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#7bd0ff] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Stops Filter */}
              <div>
                <span className="text-xs font-bold text-[#dae2fd] block mb-2">Stops</span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between text-[#bfc7d2] cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes('Non-stop')}
                        onChange={() => {}}
                        className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                      />
                      <span>Non-stop only</span>
                    </span>
                    <span className="text-[10px] text-[#89929b]">(3)</span>
                  </label>

                  <label className="flex items-center justify-between text-[#bfc7d2] cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes('1 Stop')}
                        onChange={() => {}}
                        className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                      />
                      <span>1 Stop</span>
                    </span>
                    <span className="text-[10px] text-[#89929b]">(7)</span>
                  </label>
                </div>
              </div>

              {/* Airlines */}
              <div>
                <span className="text-xs font-bold text-[#dae2fd] block mb-2">Airlines</span>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'IndiGo', price: 19200 },
                    { name: 'Air India', price: 21500 },
                    { name: 'Emirates', price: 28400 },
                    { name: 'SpiceJet', price: 18900 },
                  ].map((airline) => (
                    <label key={airline.name} className="flex items-center justify-between text-[#bfc7d2] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(airline.name)}
                          onChange={() => toggleAirline(airline.name)}
                          className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                        />
                        <span>{airline.name}</span>
                      </span>
                      <span className="text-[11px] font-bold text-[#7bd0ff]">
                        {formatPrice(airline.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#dae2fd] mb-1.5">
                  <span>Max Roundtrip Price</span>
                  <span className="text-[#7bd0ff]">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="50000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full accent-[#3198dc] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#89929b] mt-1">
                  <span>₹15,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              {/* Departure Time DEL */}
              <div>
                <span className="text-xs font-bold text-[#dae2fd] block mb-2">Departure Time (DEL)</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'morning', label: 'Morning', sub: '06-12' },
                    { id: 'afternoon', label: 'Afternoon', sub: '12-18' },
                    { id: 'night', label: 'Night', sub: '18-00' },
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setDepartureSlot(slot.id as any)}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        departureSlot === slot.id
                          ? 'bg-[#222a3d] border-[#3198dc] text-[#93ccff]'
                          : 'bg-[#131b2e] border-[#2d3449] text-[#bfc7d2]'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">{slot.label}</span>
                      <span className="text-[9px] text-[#89929b]">{slot.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Baggage Toggle */}
              <div className="pt-2 border-t border-[#2d3449]">
                <label className="flex items-center justify-between text-xs text-[#dae2fd] cursor-pointer">
                  <span>Baggage Included Only</span>
                  <input
                    type="checkbox"
                    checked={baggageOnly}
                    onChange={(e) => setBaggageOnly(e.target.checked)}
                    className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right 3 Cols: Flight Result Cards */}
          <div className="lg:col-span-3 space-y-4">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 hover:border-[#3198dc]/50 transition-all shadow-xl group"
              >
                {/* Top Airline Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#222a3d] text-[#dae2fd] font-bold text-xs flex items-center justify-center border border-[#2d3449]">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd]">
                          {flight.airline}
                        </h4>
                        <span className="text-xs text-[#89929b]">{flight.flightNumber}</span>
                        {flight.badge && (
                          <span className="px-2 py-0.5 rounded bg-[#3198dc]/20 text-[#93ccff] text-[10px] font-bold uppercase">
                            {flight.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#bfc7d2]">{flight.aircraft}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#89929b] block">Round-trip (2 Pax)</span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#7bd0ff]">
                      {formatPrice(flight.totalPrice)}
                    </span>
                    <span className="text-[10px] text-[#89929b] block">
                      ({formatPrice(flight.pricePerAdult)}/person)
                    </span>
                  </div>
                </div>

                {/* Outbound & Inbound Details */}
                <div className="py-4 space-y-3">
                  {/* Outbound */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#222a3d] text-[10px] font-bold text-[#93ccff] uppercase">
                        Outbound
                      </span>
                      <span className="text-[#dae2fd] font-bold">12 Nov</span>
                    </div>

                    <div className="flex items-center gap-4 flex-1 max-w-md mx-auto justify-between">
                      <div className="text-left">
                        <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                          {flight.outbound.departureTime}
                        </span>
                        <span className="text-[11px] text-[#bfc7d2] block">
                          {flight.outbound.departureAirport} ({flight.outbound.departureTerminal})
                        </span>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <span className="text-[10px] text-[#89929b]">{flight.outbound.duration}</span>
                        <div className="w-24 h-[2px] bg-[#2d3449] relative my-1">
                          <span className="w-2 h-2 rounded-full bg-[#3198dc] absolute -top-[3px] left-1/2 -translate-x-1/2"></span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">{flight.outbound.stops}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                          {flight.outbound.arrivalTime}
                        </span>
                        <span className="text-[11px] text-[#bfc7d2] block">
                          {flight.outbound.arrivalAirport} ({flight.outbound.arrivalTerminal})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inbound */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2 border-t border-[#2d3449]/30">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#222a3d] text-[10px] font-bold text-[#7bd0ff] uppercase">
                        Return
                      </span>
                      <span className="text-[#dae2fd] font-bold">{flight.inbound.returnDate}</span>
                    </div>

                    <div className="flex items-center gap-4 flex-1 max-w-md mx-auto justify-between">
                      <div className="text-left">
                        <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                          {flight.inbound.departureTime}
                        </span>
                        <span className="text-[11px] text-[#bfc7d2] block">
                          {flight.inbound.departureAirport} ({flight.inbound.departureTerminal})
                        </span>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <span className="text-[10px] text-[#89929b]">{flight.inbound.duration}</span>
                        <div className="w-24 h-[2px] bg-[#2d3449] relative my-1">
                          <span className="w-2 h-2 rounded-full bg-[#3198dc] absolute -top-[3px] left-1/2 -translate-x-1/2"></span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">{flight.inbound.stops}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                          {flight.inbound.arrivalTime}
                          {flight.inbound.nextDay && (
                            <span className="text-[#fb575c] text-[10px] ml-1">{flight.inbound.nextDay}</span>
                          )}
                        </span>
                        <span className="text-[11px] text-[#bfc7d2] block">
                          {flight.inbound.arrivalAirport} ({flight.inbound.arrivalTerminal})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Perks & Actions */}
                <div className="pt-3 border-t border-[#2d3449]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {flight.amenities.map((am, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#131b2e] text-[11px] text-[#bfc7d2]">
                        ✓ {am}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => openModal('flight_compare', { flightId: flight.id })}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] transition-colors cursor-pointer"
                    >
                      Compare with AI
                    </button>
                    <button
                      onClick={() => {
                        openModal('booking', {
                          type: 'flight',
                          title: `${flight.airline} (${flight.flightNumber}) Round-Trip DEL ⇄ DXB`,
                          totalPaid: flight.totalPrice,
                          destination: 'Dubai (DXB)',
                          flightDetails: {
                            airline: flight.airline,
                            flightNumber: flight.flightNumber,
                            seat: '12A, 12B',
                            pnr: 'Q8K4M9',
                            gate: 'Terminal 3, Gate 18',
                          },
                        });
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Hotels & Luxury Stays in Dubai Section */}
      <section className="w-full px-gutter max-w-7xl mx-auto mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#93ccff] uppercase tracking-wider block">
              Curated Accommodations
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#dae2fd]">
              Hotels & Luxury Stays in Dubai
            </h2>
            <p className="text-xs text-[#bfc7d2] mt-0.5">
              Hand-picked properties with guaranteed lowest rates, free cancellation, and AI room upgrades.
            </p>
          </div>

          {/* Area Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {['All Stays', 'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Deira'].map((area) => (
              <button
                key={area}
                onClick={() => setHotelArea(area)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  hotelArea === area
                    ? 'bg-[#3198dc] text-[#002c47] font-bold shadow-sm'
                    : 'bg-[#171f33] text-[#bfc7d2] hover:bg-[#222a3d]'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Luxury Stay Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredHotels.slice(0, 3).map((hotel) => (
            <div
              key={hotel.id}
              className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col hover:border-[#3198dc]/50 transition-all shadow-xl group"
            >
              <div className="relative h-52 overflow-hidden bg-[#131b2e]">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                  {hotel.badge}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#3198dc] text-[10px] font-bold text-[#002c47]">
                  ★ {hotel.ratingScore}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-[#7bd0ff] mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {hotel.location} • {hotel.distanceFromKeyAttraction}
                  </p>
                  <p className="text-[11px] text-[#bfc7d2] mt-2 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hotel.amenities.slice(0, 3).map((am, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#131b2e] text-[10px] text-[#bfc7d2]">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2d3449]/60 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-[#89929b] block">Price per night</span>
                      <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#7bd0ff]">
                        {formatPrice(hotel.pricePerNight)}
                      </span>
                      <span className="text-[10px] text-[#89929b]"> + taxes</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#89929b] block">4 Nights Total</span>
                      <span className="font-bold text-xs text-[#dae2fd]">
                        {formatPrice(hotel.pricePerNight * 4)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openModal('hotel_detail', hotel)}
                      className="py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] text-center transition-colors cursor-pointer"
                    >
                      View Hotel
                    </button>
                    <button
                      onClick={() => {
                        showToast(`Added ${hotel.name} to itinerary!`);
                      }}
                      className="py-2 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold text-center transition-colors cursor-pointer"
                    >
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Dubai Destination Matrix & Top Attractions */}
      <section className="w-full px-gutter max-w-7xl mx-auto mb-16">
        <div className="mb-6">
          <span className="text-[11px] font-bold text-[#93ccff] uppercase tracking-wider block">
            Destination Intelligence
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#dae2fd]">
            Dubai Destination Matrix & Highlights
          </h2>
          <p className="text-xs text-[#bfc7d2] mt-0.5">
            Key weather, currency index, and high-priority attractions synchronized for your travel window.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]">
            <span className="text-[10px] uppercase font-bold text-[#89929b] block mb-1">
              Best Time to Visit
            </span>
            <div className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
              Nov — Mar
            </div>
            <p className="text-[11px] text-[#bfc7d2] mt-1">
              Peak winter season with balmy daytime warmth and cool evenings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]">
            <span className="text-[10px] uppercase font-bold text-[#89929b] block mb-1">
              Currency Index
            </span>
            <div className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#7bd0ff]">
              1 AED = ₹22.65
            </div>
            <p className="text-[11px] text-[#bfc7d2] mt-1">
              Card payments widely accepted across malls, metro, and cabs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]">
            <span className="text-[10px] uppercase font-bold text-[#89929b] block mb-1">
              Visa Protocol
            </span>
            <div className="font-['Plus_Jakarta_Sans'] text-base font-bold text-emerald-400">
              30-Day Express eVisa
            </div>
            <p className="text-[11px] text-[#bfc7d2] mt-1">
              Instant 24-48h digital approval for Indian passport holders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]">
            <span className="text-[10px] uppercase font-bold text-[#89929b] block mb-1">
              Forecast Nov 12-16
            </span>
            <div className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
              28°C • Sunny
            </div>
            <p className="text-[11px] text-[#bfc7d2] mt-1">
              UV 5 Moderate • Sea temperature 26°C, ideal for beach & watersports.
            </p>
          </div>
        </div>

        {/* Attractions Grid (5 Items matching Image 1) */}
        <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dae2fd] mb-4">
          Top Attractions & Experiences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DUBAI_ATTRACTIONS.map((att) => (
            <div
              key={att.id}
              className="bg-[#171f33] rounded-xl border border-[#2d3449] overflow-hidden flex flex-col hover:border-[#3198dc]/40 transition-all shadow-md"
            >
              <div className="h-32 bg-[#131b2e] overflow-hidden relative">
                <img
                  src={att.image}
                  alt={att.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase">
                  {att.tag}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd]">
                    {att.name}
                  </h4>
                  <p className="text-[10px] text-[#bfc7d2] mt-1 line-clamp-2 leading-relaxed">
                    {att.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#2d3449]/40 mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7bd0ff]">
                    {att.startingPrice === 0 ? 'Free Access' : `From ${formatPrice(att.startingPrice)}`}
                  </span>
                  <button
                    onClick={() => showToast(`Added ticket to itinerary: ${att.name}`)}
                    className="p-1 rounded bg-[#222a3d] text-[#93ccff] hover:bg-[#3198dc] hover:text-[#002c47] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Architecture Status */}
      <section className="w-full px-gutter max-w-7xl mx-auto mb-12">
        <div className="p-3 bg-[#131b2e] rounded-xl border border-[#2d3449]/50 flex items-center justify-between text-[11px] text-[#bfc7d2]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Service Architecture: Latency 42ms • Amadeus GDS: OK • Sabre API: OK</span>
          </span>
          <span className="text-[#89929b]">Build v4.8.2-PROD</span>
        </div>
      </section>
    </div>
  );
};
