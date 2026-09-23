import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Hotel } from '../../types/travel';

export const HotelDetailsModal: React.FC = () => {
  const { activeModal, closeModal, formatPrice, openModal, showToast } = useTravel();
  const [selectedRoom, setSelectedRoom] = useState(0);

  if (activeModal.type !== 'hotel_detail' || !activeModal.data) return null;

  const hotel: Hotel = activeModal.data;

  const rooms = [
    { name: hotel.roomType, priceDelta: 0, view: 'City / Skyline View', perks: 'Free High Speed WiFi, King Bed' },
    { name: 'Executive Club Room (High Floor)', priceDelta: 2400, view: 'Panoramic Marina / Ocean View', perks: 'Club Lounge Access, Evening Cocktails' },
    { name: 'Presidential Suite with Balcony', priceDelta: 7500, view: 'Direct Waterfront Terrace', perks: 'Butler Service, Private Whirlpool Jacuzzi' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#171f33] rounded-2xl border border-[#2d3449] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2d3449]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
                {hotel.badge || `${hotel.starRating}-Star Luxury`}
              </span>
              <div className="flex items-center text-[#ffb3b0] text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] mr-1 text-[#ffb3b0]">star</span>
                {hotel.ratingScore} ({hotel.ratingLabel}) • {hotel.reviewsCount} verified reviews
              </div>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#dae2fd]">
              {hotel.name}
            </h2>
            <p className="text-xs text-[#bfc7d2] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-[#7bd0ff]">location_on</span>
              {hotel.location} • {hotel.distanceFromKeyAttraction}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#bfc7d2] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Main Photo Gallery */}
          <div className="relative rounded-xl overflow-hidden h-64 bg-[#131b2e]">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-semibold text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              Verified AI Studio Asset
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd] mb-2">
              About This Property
            </h4>
            <p className="font-['Inter'] text-xs text-[#bfc7d2] leading-relaxed">
              {hotel.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd] mb-2.5">
              Featured Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map((am, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#131b2e] border border-[#2d3449]/40 text-xs text-[#dae2fd]">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">check_circle</span>
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd] mb-2.5">
              Select Room Configuration
            </h4>
            <div className="space-y-2">
              {rooms.map((r, idx) => {
                const roomPrice = hotel.pricePerNight + r.priceDelta;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedRoom(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedRoom === idx
                        ? 'bg-[#222a3d] border-[#3198dc] shadow-md'
                        : 'bg-[#131b2e] border-[#2d3449]/50 hover:border-[#3198dc]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedRoom === idx ? 'border-[#3198dc] bg-[#3198dc]' : 'border-[#89929b]'}`}>
                          {selectedRoom === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#002c47]"></span>}
                        </span>
                        <span className="font-bold text-xs text-[#dae2fd]">{r.name}</span>
                      </div>
                      <p className="text-[11px] text-[#bfc7d2] pl-6 mt-0.5">{r.perks} • {r.view}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#7bd0ff]">
                        {formatPrice(roomPrice)}
                      </div>
                      <span className="text-[10px] text-[#89929b]">per night + taxes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nearby Highlights */}
          <div className="bg-[#131b2e] p-3.5 rounded-xl border border-[#2d3449]/50">
            <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#93ccff] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">explore</span>
              Nearby Walking Distance
            </h4>
            <div className="flex flex-wrap gap-2">
              {hotel.nearbyAttractions.map((na, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-[#222a3d] text-[11px] text-[#bfc7d2]">
                  {na}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#2d3449] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#89929b]">Total for 4 Nights:</div>
            <div className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#7bd0ff]">
              {formatPrice((hotel.pricePerNight + rooms[selectedRoom].priceDelta) * 4)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast(`Added ${hotel.name} to itinerary!`);
                closeModal();
              }}
              className="px-4 py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-bold text-[#dae2fd] transition-colors"
            >
              Add to Itinerary
            </button>
            <button
              onClick={() => {
                closeModal();
                openModal('booking', {
                  type: 'hotel',
                  title: `${hotel.name} (${rooms[selectedRoom].name})`,
                  totalPaid: (hotel.pricePerNight + rooms[selectedRoom].priceDelta) * 4,
                  destination: hotel.city,
                  hotelDetails: {
                    hotelName: hotel.name,
                    roomType: rooms[selectedRoom].name,
                    checkIn: '12 Nov 2025',
                    checkOut: '16 Nov 2025',
                    voucherCode: `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
                  },
                });
              }}
              className="px-5 py-2 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold shadow-md transition-colors"
            >
              Reserve Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
