import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { MOCK_HOTELS } from '../services/hotelService';
import { Hotel } from '../types/travel';

export const HotelsView: React.FC = () => {
  const { formatPrice, openModal, showToast } = useTravel();

  const [destinationCity, setDestinationCity] = useState('Dubai');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedStars, setSelectedStars] = useState<number[]>([3, 4, 5]);
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);

  const filteredHotels = MOCK_HOTELS.filter((h) => {
    if (minRating > 0 && h.ratingScore < minRating) return false;
    if (selectedStars.length > 0 && !selectedStars.includes(h.starRating)) return false;
    if (breakfastOnly && !h.breakfastIncluded) return false;
    if (freeCancelOnly && !h.freeCancellation) return false;
    return true;
  });

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  return (
    <div className="w-full min-h-screen pt-20 px-gutter max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="py-8 border-b border-[#2d3449] mb-8">
        <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
          Verified Accommodations
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold text-[#dae2fd] mt-2">
          Hotels & Boutique Stays
        </h1>
        <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1 max-w-2xl">
          Compare 4-star and 5-star properties with instant AI room matching, complimentary breakfast perks, and zero hidden resort fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-4 space-y-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd] pb-2 border-b border-[#2d3449]">
              Filter Properties
            </h3>

            {/* Star Rating */}
            <div>
              <span className="text-xs font-bold text-[#dae2fd] block mb-2">Star Rating</span>
              <div className="space-y-1.5 text-xs text-[#bfc7d2]">
                {[5, 4, 3].map((star) => (
                  <label key={star} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStars.includes(star)}
                      onChange={() => toggleStar(star)}
                      className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                    />
                    <span>{star}-Star ({star === 5 ? 'Luxury' : star === 4 ? 'Premium' : 'Boutique'})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div>
              <span className="text-xs font-bold text-[#dae2fd] block mb-2">Perks & Policies</span>
              <div className="space-y-2 text-xs text-[#bfc7d2]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeCancelOnly}
                    onChange={(e) => setFreeCancelOnly(e.target.checked)}
                    className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                  />
                  <span>Free Cancellation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={breakfastOnly}
                    onChange={(e) => setBreakfastOnly(e.target.checked)}
                    className="rounded border-[#2d3449] text-[#3198dc] focus:ring-0"
                  />
                  <span>Breakfast Included</span>
                </label>
              </div>
            </div>

            {/* Guest Rating Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#dae2fd] mb-1">
                <span>Min Guest Score</span>
                <span className="text-[#7bd0ff]">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="9.5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-[#3198dc] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#bfc7d2] px-1">
            <span>Showing {filteredHotels.length} verified stays in {destinationCity}</span>
            <span className="text-emerald-400 font-bold">All rates include local tourism dirham taxes</span>
          </div>

          <div className="space-y-4">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col md:flex-row hover:border-[#3198dc]/50 transition-all shadow-lg group"
              >
                {/* Photo */}
                <div className="md:w-72 h-56 md:h-auto bg-[#131b2e] relative overflow-hidden shrink-0">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                    {hotel.badge}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.2 rounded bg-[#3198dc]/20 text-[#93ccff] text-[10px] font-bold">
                            {hotel.starRating} Stars
                          </span>
                          <span className="text-xs text-[#bfc7d2]">• {hotel.location}</span>
                        </div>
                        <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dae2fd]">
                          {hotel.name}
                        </h3>
                        <p className="text-xs text-[#7bd0ff] mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">near_me</span>
                          {hotel.distanceFromKeyAttraction}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="px-2.5 py-1 rounded-lg bg-[#222a3d] text-[#dae2fd] text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#ffb3b0]">star</span>
                          <span>{hotel.ratingScore}</span>
                          <span className="text-[10px] text-[#89929b]">({hotel.ratingLabel})</span>
                        </div>
                        <span className="text-[10px] text-[#89929b] block mt-1">
                          {hotel.reviewsCount} reviews
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#bfc7d2] mt-3 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hotel.amenities.map((am, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#131b2e] text-[10px] text-[#bfc7d2]">
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Pricing */}
                  <div className="pt-4 border-t border-[#2d3449]/60 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#7bd0ff]">
                          {formatPrice(hotel.pricePerNight)}
                        </span>
                        <span className="text-xs text-[#89929b]">/ night</span>
                      </div>
                      <span className="text-[10px] text-[#89929b] block">
                        Total {formatPrice(hotel.pricePerNight * 4)} for 4 nights
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('hotel_detail', hotel)}
                        className="px-4 py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-bold text-[#dae2fd] transition-colors cursor-pointer"
                      >
                        View Property
                      </button>
                      <button
                        onClick={() => {
                          openModal('booking', {
                            type: 'hotel',
                            title: `${hotel.name} (4 Nights)`,
                            totalPaid: hotel.pricePerNight * 4,
                            destination: hotel.city,
                            hotelDetails: {
                              hotelName: hotel.name,
                              roomType: hotel.roomType,
                              checkIn: '12 Nov 2025',
                              checkOut: '16 Nov 2025',
                              voucherCode: `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
                            },
                          });
                        }}
                        className="px-5 py-2 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold shadow-md transition-colors cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
