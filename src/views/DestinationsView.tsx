import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { MOCK_DESTINATIONS } from '../services/destinationService';
import { Destination } from '../types/travel';
import { synthesizeItinerary } from '../services/aiTravelService';

export const DestinationsView: React.FC = () => {
  const { formatPrice, setCurrentItinerary, setCurrentView, showToast } = useTravel();

  // Primary curated category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Scope filter: all / domestic / international
  const [scopeFilter, setScopeFilter] = useState<'all' | 'domestic' | 'international'>('all');
  // Secondary theme filter
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  // Sorting filter
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  // Search text
  const [searchWord, setSearchWord] = useState('');
  // Selected destination modal for deep dive
  const [inspectingDest, setInspectingDest] = useState<Destination | null>(null);

  const curatedCategories = [
    {
      id: 'all',
      label: 'All Destinations',
      icon: 'public',
      count: MOCK_DESTINATIONS.length,
      desc: 'Explore all 46 handpicked destinations worldwide',
    },
    {
      id: 'Hidden Gems',
      label: '💎 Hidden Gems',
      icon: 'diamond',
      count: MOCK_DESTINATIONS.filter((d) => d.category === 'Hidden Gems').length,
      desc: 'Untouched paradises, living root bridges, salt deserts & cave suites',
    },
    {
      id: 'European Wonders',
      label: '🏰 European Wonders',
      icon: 'castle',
      count: MOCK_DESTINATIONS.filter((d) => d.category === 'European Wonders').length,
      desc: 'Swiss alpine peaks, Parisian boulevards, Greek calderas & fjords',
    },
    {
      id: 'South East Asian Escapes',
      label: '🌴 South East Asian Escapes',
      icon: 'palm_tree',
      count: MOCK_DESTINATIONS.filter((d) => d.category === 'South East Asian Escapes').length,
      desc: 'Bali private villas, Thai islands, Vietnam karst bays & overwater bliss',
    },
    {
      id: 'Domestic Havens',
      label: '🇮🇳 Domestic Havens',
      icon: 'temple_hindu',
      count: MOCK_DESTINATIONS.filter((d) => d.category === 'Domestic Havens').length,
      desc: 'Kashmir shikaras, Goa beach shacks, Kerala backwaters & royal forts',
    },
    {
      id: 'International Icons',
      label: '✈️ International Icons',
      icon: 'flight',
      count: MOCK_DESTINATIONS.filter((d) => d.category === 'International Icons').length,
      desc: 'Dubai skyscrapers, Japan bullet trains, USA megacities & Kiwi fiords',
    },
  ];

  const themes = [
    { id: 'all', label: 'All Themes' },
    { id: 'beaches', label: '🏖️ Beaches & Islands', keyword: ['beach', 'island', 'coastal', 'lagoon', 'scuba', 'atoll'] },
    { id: 'mountains', label: '🏔️ Hills & Mountains', keyword: ['mountain', 'snow', 'alps', 'himalayan', 'hill', 'valley', 'fjord', 'altitude'] },
    { id: 'heritage', label: '👑 Heritage & Royal', keyword: ['palace', 'heritage', 'unesco', 'ancient', 'fort', 'history', 'ruins'] },
    { id: 'spirituality', label: '🧘 Spirituality & Peace', keyword: ['spirituality', 'ghats', 'temple', 'buddhist', 'yoga', 'sacred'] },
    { id: 'adventure', label: '⚡ Adventure & Nature', keyword: ['adventure', 'trek', 'scuba', 'balloon', 'safari', 'rafting', 'biking'] },
    { id: 'budget_under_25k', label: '💰 Under ₹25,000', maxPrice: 25000 },
    { id: 'budget_under_50k', label: '💎 Under ₹50,000', maxPrice: 50000 },
    { id: 'luxury_over_100k', label: '👑 Luxury (₹1L+)', minPrice: 100000 },
  ];

  let filtered = MOCK_DESTINATIONS.filter((dest) => {
    // 1. Curated Category filter
    if (selectedCategory !== 'all' && dest.category !== selectedCategory) {
      return false;
    }

    // 2. Scope filter (all / domestic / international)
    if (scopeFilter === 'domestic' && dest.isInternational) return false;
    if (scopeFilter === 'international' && !dest.isInternational) return false;

    // 3. Theme filter
    if (selectedTheme !== 'all') {
      const themeObj = themes.find((t) => t.id === selectedTheme);
      if (themeObj?.maxPrice && dest.startingPrice > themeObj.maxPrice) {
        return false;
      }
      if (themeObj?.minPrice && dest.startingPrice < themeObj.minPrice) {
        return false;
      }
      if (themeObj?.keyword) {
        const matchesKeyword = themeObj.keyword.some(
          (k) =>
            dest.tagline.toLowerCase().includes(k) ||
            dest.description.toLowerCase().includes(k) ||
            dest.tags.some((t) => t.toLowerCase().includes(k))
        );
        if (!matchesKeyword) return false;
      }
    }

    // 4. Search keyword filter
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase();
      const match =
        dest.name.toLowerCase().includes(q) ||
        dest.stateOrCountry.toLowerCase().includes(q) ||
        dest.tagline.toLowerCase().includes(q) ||
        (dest.category && dest.category.toLowerCase().includes(q)) ||
        dest.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  if (sortBy === 'price_low') {
    filtered.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (sortBy === 'price_high') {
    filtered.sort((a, b) => b.startingPrice - a.startingPrice);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const handlePlanTrip = (destName: string) => {
    const matched = MOCK_DESTINATIONS.find((d) => d.name === destName);
    const isDomestic = matched?.isInternational === false;
    const generated = synthesizeItinerary({
      origin: isDomestic ? 'Delhi' : 'Delhi (DEL)',
      destination: destName,
      durationDays: 5,
      travellersCount: 2,
      travellerType: '2 Travellers, Economy',
      budgetCap: matched ? matched.startingPrice * 2 : 100000,
      style: 'Luxury on Budget',
    });
    setCurrentItinerary(generated);
    showToast(`✨ Generated itinerary for ${destName}!`);
    setCurrentView('ai-trip-planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'Hidden Gems':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'European Wonders':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'South East Asian Escapes':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Domestic Havens':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'International Icons':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-[#3198dc]/20 text-[#93ccff] border-[#3198dc]/40';
    }
  };

  return (
    <div className="w-full min-h-screen pt-20 px-gutter max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="py-8 border-b border-[#2d3449] mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
                Global Travel Intelligence Matrix
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                {MOCK_DESTINATIONS.length} Curated Destinations Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold">
                10 Hidden Gems
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                10 European Wonders
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                9 South East Asian Escapes
              </span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#dae2fd]">
              Discover Domestic & International Destinations
            </h1>
            <p className="text-xs sm:text-sm text-[#bfc7d2] mt-2 max-w-3xl leading-relaxed">
              From Kashmir snow peaks and Meghalaya living root bridges to Swiss Alps, Santorini calderas, and Tokyo skylines. Explore live seasonal forecasts, visa guidelines, currency conversions, and instant AI trip synthesis.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#89929b] whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#171f33] border border-[#2d3449] rounded-xl px-3 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#3198dc] focus:outline-none cursor-pointer"
            >
              <option value="recommended">AI Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated (★)</option>
            </select>
          </div>
        </div>

        {/* 1. CURATED CATEGORY TABS (Hidden Gems, European Wonders, SE Asian Escapes, etc.) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#89929b]">
              Curated Collections:
            </span>
            <span className="text-[11px] text-[#7bd0ff]">
              Click any category to filter
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {curatedCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1b263e] border-[#3198dc] shadow-lg shadow-[#3198dc]/10 ring-1 ring-[#3198dc]'
                      : 'bg-[#171f33] border-[#2d3449] hover:border-[#3198dc]/50 hover:bg-[#1a2338]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd] truncate">
                      {cat.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#3198dc] text-[#002c47]'
                          : 'bg-[#131b2e] text-[#89929b]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#89929b] line-clamp-2 leading-tight">
                    {cat.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. REGION SCOPE TABS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-[#2d3449]/70">
          {/* Domestic vs International Filter */}
          <div className="flex items-center gap-1.5 bg-[#171f33] p-1 rounded-xl border border-[#2d3449] overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: `All Regions (${MOCK_DESTINATIONS.length})` },
              { id: 'domestic', label: `🇮🇳 Domestic India (${MOCK_DESTINATIONS.filter((d) => !d.isInternational).length})` },
              { id: 'international', label: `✈️ International (${MOCK_DESTINATIONS.filter((d) => d.isInternational).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setScopeFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  scopeFilter === tab.id
                    ? 'bg-[#3198dc] text-[#002c47] shadow-sm'
                    : 'text-[#bfc7d2] hover:text-white hover:bg-[#222a3d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80 shrink-0">
            <span className="material-symbols-outlined text-[#89929b] text-[18px] absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Search by city, country, or tag (e.g. Spiti, Bali, Paris)..."
              className="w-full bg-[#171f33] border border-[#2d3449] rounded-xl pl-9 pr-8 py-2 text-xs text-[#dae2fd] placeholder:text-[#89929b] focus:border-[#3198dc] focus:outline-none"
            />
            {searchWord && (
              <button
                onClick={() => setSearchWord('')}
                className="absolute right-2.5 top-2.5 text-[#89929b] hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. QUICK THEME FILTER CHIPS */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto scrollbar-none pb-1">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => setSelectedTheme(th.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedTheme === th.id
                  ? 'bg-[#222a3d] text-[#93ccff] border border-[#3198dc]'
                  : 'bg-[#131b2e] text-[#89929b] hover:text-[#dae2fd] border border-[#2d3449]/60'
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Status Banner */}
      <div className="flex items-center justify-between text-xs text-[#bfc7d2] mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#93ccff] text-sm">{filtered.length}</strong> destinations
          </span>
          {selectedCategory !== 'all' && (
            <span className="px-2 py-0.5 rounded-md bg-[#3198dc]/20 text-[#93ccff] text-[10px] font-bold">
              {selectedCategory}
            </span>
          )}
          {scopeFilter !== 'all' && (
            <span className="px-2 py-0.5 rounded-md bg-[#222a3d] text-[#dae2fd] text-[10px]">
              {scopeFilter === 'domestic' ? 'India' : 'International'}
            </span>
          )}
          {selectedTheme !== 'all' && (
            <span className="px-2 py-0.5 rounded-md bg-[#222a3d] text-[#dae2fd] text-[10px]">
              {themes.find((t) => t.id === selectedTheme)?.label}
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#89929b]">
          Click card for full details • Click <strong className="text-[#93ccff]">Plan AI Trip</strong> to synthesize
        </div>
      </div>

      {/* Destination Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-[#171f33] rounded-2xl border border-[#2d3449] p-8">
          <span className="material-symbols-outlined text-4xl text-[#89929b] mb-2">travel_explore</span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
            No destinations found matching your filters
          </h3>
          <p className="text-xs text-[#bfc7d2] mt-1 mb-4">
            Try resetting your search query or selecting a broader category.
          </p>
          <button
            onClick={() => {
              setSearchWord('');
              setSelectedCategory('all');
              setSelectedTheme('all');
              setScopeFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#3198dc] text-[#002c47] font-bold text-xs cursor-pointer hover:bg-[#93ccff]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-[#171f33] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col hover:border-[#3198dc]/50 transition-all shadow-xl group hover:shadow-2xl"
            >
              {/* Image & Header Overlay */}
              <div
                className="relative h-56 bg-[#131b2e] overflow-hidden cursor-pointer"
                onClick={() => setInspectingDest(dest)}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] via-transparent to-black/40"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[70%]">
                  {dest.category && (
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryBadgeColor(
                        dest.category
                      )}`}
                    >
                      {dest.category}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      dest.isInternational
                        ? 'bg-blue-600/80 text-white'
                        : 'bg-emerald-600/80 text-white'
                    }`}
                  >
                    {dest.isInternational ? 'International' : 'Domestic'}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#3198dc] text-[10px] font-bold text-[#002c47] flex items-center gap-1 shadow-md">
                  <span>★ {dest.rating}</span>
                  <span className="text-[9px] opacity-80">({dest.reviewsCount})</span>
                </div>

                {/* Bottom Overlay Info (Weather & Currency) */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px] text-amber-300">
                      {dest.weather.icon || 'wb_sunny'}
                    </span>
                    <span className="font-semibold">{dest.weather.temp}</span>
                    <span className="text-[10px] text-[#bfc7d2] hidden sm:inline">
                      ({dest.weather.condition})
                    </span>
                  </span>
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[10px] text-[#93ccff]">
                    {dest.currencyInfo.rateText}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div
                    className="cursor-pointer"
                    onClick={() => setInspectingDest(dest)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#dae2fd] group-hover:text-[#93ccff] transition-colors">
                          {dest.name}
                        </h3>
                        <span className="text-xs text-[#7bd0ff] font-semibold block">
                          {dest.stateOrCountry} • {dest.avgDuration}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#bfc7d2] leading-relaxed line-clamp-2 mt-1">
                      {dest.tagline}
                    </p>
                  </div>

                  {/* Highlights / Activities */}
                  <div className="mt-3.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#89929b] block">
                      Top Experiences:
                    </span>
                    <ul className="text-[11px] text-[#dae2fd] space-y-0.5">
                      {dest.popularActivities.slice(0, 2).map((act, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[14px] text-[#7bd0ff] shrink-0">
                            check_circle
                          </span>
                          <span className="truncate">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {dest.tags.slice(0, 3).map((tg, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#131b2e] text-[10px] text-[#bfc7d2]">
                        #{tg}
                      </span>
                    ))}
                  </div>

                  {/* Seasonality & Visa */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-[#2d3449]/60 text-[10px]">
                    <div>
                      <span className="text-[#89929b] block">Best Season</span>
                      <span className="font-semibold text-[#dae2fd] truncate block">
                        {dest.bestTimeToVisit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#89929b] block">Visa / ID</span>
                      <span className="font-semibold text-emerald-400 truncate block">
                        {dest.visaProtocol.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Plan Action */}
                <div className="pt-4 border-t border-[#2d3449]/60 mt-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#89929b] block">Est. budget from</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#7bd0ff]">
                        {formatPrice(dest.startingPrice)}
                      </span>
                      <span className="text-[10px] text-[#89929b]">/ person</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setInspectingDest(dest)}
                      className="px-2.5 py-2 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] transition-colors cursor-pointer"
                      title="View destination insights"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handlePlanTrip(dest.name)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3198dc] to-[#00a6e0] hover:from-[#93ccff] hover:to-[#3198dc] text-[#002c47] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                      <span>Plan Trip</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED DESTINATION MODAL */}
      {inspectingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Image Header */}
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img
                src={inspectingDest.image}
                alt={inspectingDest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] via-black/30 to-black/60"></div>

              <button
                onClick={() => setInspectingDest(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  {inspectingDest.category && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryBadgeColor(
                        inspectingDest.category
                      )}`}
                    >
                      {inspectingDest.category}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white">
                    {inspectingDest.isInternational ? 'International' : 'Domestic India'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3198dc] text-[#002c47]">
                    ★ {inspectingDest.rating} ({inspectingDest.reviewsCount} reviews)
                  </span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-white">
                  {inspectingDest.name}
                </h2>
                <p className="text-xs text-[#7bd0ff] font-semibold">
                  {inspectingDest.stateOrCountry} • Recommended Stay: {inspectingDest.avgDuration}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-[#bfc7d2] leading-relaxed">
                {inspectingDest.description}
              </p>

              {/* Weather & Currency Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#2d3449]">
                  <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#dae2fd]">
                    <span className="material-symbols-outlined text-amber-300 text-[18px]">
                      {inspectingDest.weather.icon || 'wb_sunny'}
                    </span>
                    <span>Live Seasonal Weather</span>
                  </div>
                  <p className="text-sm font-extrabold text-[#7bd0ff]">
                    {inspectingDest.weather.temp} • {inspectingDest.weather.condition}
                  </p>
                  <p className="text-[11px] text-[#89929b] mt-0.5">
                    UV Index: {inspectingDest.weather.uvIndex}
                    {inspectingDest.weather.seaTemp && ` • Water: ${inspectingDest.weather.seaTemp}`}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#2d3449]">
                  <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#dae2fd]">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                      currency_exchange
                    </span>
                    <span>Currency & Payments</span>
                  </div>
                  <p className="text-sm font-extrabold text-emerald-400">
                    {inspectingDest.currencyInfo.rateText}
                  </p>
                  <p className="text-[11px] text-[#89929b] mt-0.5">
                    {inspectingDest.currencyInfo.note}
                  </p>
                </div>
              </div>

              {/* Visa Protocol */}
              <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#2d3449]">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#dae2fd]">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">
                    fact_check
                  </span>
                  <span>Visa & Entry Advisory ({inspectingDest.visaProtocol.title})</span>
                </div>
                <p className="text-xs text-[#bfc7d2] leading-relaxed">
                  {inspectingDest.visaProtocol.summary}
                </p>
              </div>

              {/* Popular Activities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#89929b] mb-2">
                  Must-Experience Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inspectingDest.popularActivities.map((act, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#131b2e] border border-[#2d3449]/70 flex items-center gap-2 text-xs text-[#dae2fd]"
                    >
                      <span className="material-symbols-outlined text-[#7bd0ff] text-[16px] shrink-0">
                        verified
                      </span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#2d3449] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#89929b] block">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#7bd0ff]">
                      {formatPrice(inspectingDest.startingPrice)}
                    </span>
                    <span className="text-xs text-[#89929b]">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectingDest(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-xs font-bold text-[#dae2fd] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const name = inspectingDest.name;
                      setInspectingDest(null);
                      handlePlanTrip(name);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3198dc] to-[#00a6e0] hover:from-[#93ccff] hover:to-[#3198dc] text-[#002c47] font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>Synthesize AI Itinerary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
