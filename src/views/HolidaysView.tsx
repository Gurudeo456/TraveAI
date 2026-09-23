import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { MOCK_HOLIDAY_PACKAGES } from '../services/holidayService';

export const HolidaysView: React.FC = () => {
  const { formatPrice, openModal, showToast } = useTravel();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(150000);

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'domestic', label: 'Domestic (India)' },
    { id: 'international', label: 'International' },
    { id: 'honeymoon', label: 'Honeymoon & Couples' },
    { id: 'family', label: 'Family Vacation' },
    { id: 'luxury', label: 'Pure Luxury' },
  ];

  const filtered = MOCK_HOLIDAY_PACKAGES.filter((pkg) => {
    if (selectedCategory !== 'all' && pkg.category !== selectedCategory) return false;
    if (pkg.pricePerPerson > maxBudget) return false;
    return true;
  });

  return (
    <div className="w-full min-h-screen pt-20 px-gutter max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="py-8 border-b border-[#2d3449] mb-8">
        <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
          All-Inclusive Bundles
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold text-[#dae2fd] mt-2">
          Curated Holiday Packages
        </h1>
        <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1 max-w-2xl">
          Complete holiday bundles including roundtrip flights, hand-picked 4-star and 5-star accommodations, daily breakfast, and guaranteed VIP attraction skip-the-line admissions.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#3198dc] text-[#002c47] shadow-md'
                  : 'bg-[#171f33] text-[#bfc7d2] hover:bg-[#222a3d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col hover:border-[#3198dc]/50 transition-all shadow-xl group"
          >
            {/* Image Banner */}
            <div className="relative h-60 overflow-hidden bg-[#131b2e]">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                {pkg.durationDays}D / {pkg.durationNights}N
              </span>
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-[#3198dc] text-[10px] font-bold text-[#002c47] flex items-center gap-1 shadow-md">
                <span>★ {pkg.rating}</span>
                <span className="text-[9px] opacity-80">({pkg.reviewsCount})</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#7bd0ff]">{pkg.destination}</span>
                  <span className="text-xs text-[#89929b]">• {pkg.country}</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dae2fd]">
                  {pkg.title}
                </h3>
                <p className="text-xs text-[#bfc7d2] mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Key Inclusions */}
                <div className="mt-4 pt-3 border-t border-[#2d3449]/60">
                  <span className="text-[10px] font-bold text-[#89929b] uppercase tracking-wider block mb-2">
                    Inclusions:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#dae2fd]">
                    {pkg.inclusions.slice(0, 3).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-emerald-400 text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span className="text-[11px] leading-tight text-[#bfc7d2]">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-[#2d3449]/60 mt-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-[#89929b] block">Total per adult</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#7bd0ff]">
                        {formatPrice(pkg.pricePerPerson)}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs line-through text-[#89929b]">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Save ₹{(pkg.originalPrice ? pkg.originalPrice - pkg.pricePerPerson : 5000).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openModal('customize_ai', { packageId: pkg.id })}
                    className="py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">auto_fix_high</span>
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={() => {
                      openModal('booking', {
                        type: 'package',
                        title: `${pkg.title} (${pkg.durationDays}D/${pkg.durationNights}N)`,
                        totalPaid: pkg.pricePerPerson * 2,
                        destination: pkg.destination,
                        dates: 'Flexible dates in next 60 days',
                      });
                    }}
                    className="py-2.5 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold text-center shadow-md transition-colors cursor-pointer"
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
  );
};
