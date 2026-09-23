import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';

export const MyTripsView: React.FC = () => {
  const { savedBookings, formatPrice, showToast, setCurrentView } = useTravel();
  const [selectedTripId, setSelectedTripId] = useState<string>(savedBookings[0]?.id || '');
  const [checklist, setChecklist] = useState(() => {
    return savedBookings[0]?.checklist || [];
  });

  const activeTrip = savedBookings.find((b) => b.id === selectedTripId) || savedBookings[0];

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
    showToast('Checklist updated.');
  };

  if (!activeTrip) {
    return (
      <div className="w-full min-h-screen pt-24 px-gutter max-w-4xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#171f33] text-[#7bd0ff] mx-auto flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">luggage</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#dae2fd]">
          No Saved Trips Yet
        </h2>
        <p className="text-xs text-[#bfc7d2] mt-2 mb-6">
          Plan your first journey using our autonomous travel copilot.
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 rounded-xl bg-[#3198dc] text-[#002c47] font-bold text-xs"
        >
          Discover Trips
        </button>
      </div>
    );
  }

  const completedCount = checklist.filter((c) => c.done).length;

  return (
    <div className="w-full min-h-screen pt-20 px-gutter max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="py-8 border-b border-[#2d3449] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
            Personal Itinerary Vault
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold text-[#dae2fd] mt-2">
            My Trips & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1">
            Access offline flight boarding passes, hotel confirmation vouchers, and AI readiness checklists.
          </p>
        </div>

        {/* Trip Selector Dropdown if multiple */}
        {savedBookings.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#89929b]">Select Trip:</span>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="bg-[#171f33] border border-[#2d3449] rounded-xl px-3 py-1.5 text-xs text-[#dae2fd] font-bold focus:outline-none"
            >
              {savedBookings.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#171f33]">
                  {b.title} ({b.bookingRef})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Trip Overview Card & Countdown */}
        <div className="lg:col-span-1 space-y-5">
          {/* Main Card */}
          <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                {activeTrip.status}
              </span>
              <span className="font-mono text-xs font-bold text-[#93ccff]">
                Ref: {activeTrip.bookingRef}
              </span>
            </div>

            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dae2fd]">
                {activeTrip.title}
              </h2>
              <p className="text-xs text-[#7bd0ff] mt-0.5">{activeTrip.dates}</p>
            </div>

            {/* Countdown Banner */}
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#2d3449]/60 text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#89929b] block">
                Departure Countdown
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#dae2fd] mt-1">
                48 Days • 14 Hours
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                Flight Schedule Status: On Time
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-[#2d3449]/60 pt-3">
              <div className="flex justify-between">
                <span className="text-[#89929b]">Destination:</span>
                <span className="text-[#dae2fd] font-semibold">{activeTrip.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#89929b]">Total Charged:</span>
                <span className="text-[#7bd0ff] font-bold">{formatPrice(activeTrip.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#89929b]">Passengers:</span>
                <span className="text-[#dae2fd] font-semibold">{activeTrip.passengers} Adults</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#89929b]">Booked On:</span>
                <span className="text-[#dae2fd] font-semibold">{activeTrip.bookedAt}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('📥 Offline PDF tickets & vouchers downloaded.')}
                className="w-full py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-bold text-[#dae2fd] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download All Tickets (PDF)</span>
              </button>
            </div>
          </div>

          {/* Destination Live Weather & Currency status */}
          <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-4 space-y-3">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#93ccff]">
              Live Destination Intelligence (Dubai)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#131b2e]">
                <span className="text-[10px] text-[#89929b] block">Forecast</span>
                <span className="font-bold text-[#dae2fd]">28°C Sunny</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#131b2e]">
                <span className="text-[10px] text-[#89929b] block">Currency</span>
                <span className="font-bold text-[#7bd0ff]">1 AED = ₹22.65</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Boarding Pass, Voucher, Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Ticket Visual */}
          {activeTrip.flightDetails && (
            <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden shadow-xl">
              <div className="p-4 bg-[#131b2e] border-b border-[#2d3449] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">flight</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd]">
                    Electronic Flight Boarding Pass
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  PNR: {activeTrip.flightDetails.pnr}
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#89929b] block">Airline & Flight</span>
                  <span className="font-bold text-[#dae2fd] text-sm">{activeTrip.flightDetails.airline}</span>
                  <span className="text-[11px] text-[#bfc7d2] block">{activeTrip.flightDetails.flightNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#89929b] block">Route</span>
                  <span className="font-bold text-[#dae2fd] text-sm">DEL ⇄ DXB</span>
                  <span className="text-[11px] text-[#bfc7d2] block">Non-stop Direct</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#89929b] block">Assigned Seats</span>
                  <span className="font-bold text-[#7bd0ff] text-sm">{activeTrip.flightDetails.seat}</span>
                  <span className="text-[11px] text-[#bfc7d2] block">Cabin Class: Economy</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#89929b] block">Terminal & Gate</span>
                  <span className="font-bold text-[#dae2fd] text-sm">{activeTrip.flightDetails.gate}</span>
                  <span className="text-[11px] text-emerald-400 block">Boarding 07:45 AM</span>
                </div>
              </div>

              {/* Barcode Mock Visual */}
              <div className="px-5 py-3 bg-[#0e172a] border-t border-[#2d3449]/50 flex items-center justify-between text-[11px] text-[#89929b]">
                <span>Scan at e-Gate Reader</span>
                <span className="font-mono tracking-widest text-[#dae2fd] font-bold">
                  ||||| | |||| ||| ||||||| | ||||| |||| ||||
                </span>
              </div>
            </div>
          )}

          {/* Hotel Confirmation Voucher */}
          {activeTrip.hotelDetails && (
            <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">hotel</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd]">
                    Hotel Accommodation Voucher
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#93ccff]">
                  {activeTrip.hotelDetails.voucherCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#89929b] block">Property</span>
                  <span className="font-bold text-[#dae2fd] text-sm">{activeTrip.hotelDetails.hotelName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#89929b] block">Room Type</span>
                  <span className="text-[#bfc7d2]">{activeTrip.hotelDetails.roomType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#89929b] block">Stay Window</span>
                  <span className="text-[#dae2fd] font-semibold">
                    {activeTrip.hotelDetails.checkIn} — {activeTrip.hotelDetails.checkOut}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Pre-Travel Checklist */}
          <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">checklist</span>
                <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd]">
                  AI Pre-Departure Readiness Checklist
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                {completedCount} of {checklist.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${
                    item.done
                      ? 'bg-[#131b2e]/80 border-[#2d3449]/50 text-[#bfc7d2] line-through'
                      : 'bg-[#222a3d] border-[#3198dc]/50 text-[#dae2fd] font-semibold'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#89929b]'
                    }`}
                  >
                    {item.done && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
