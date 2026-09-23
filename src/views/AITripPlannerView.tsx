import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { synthesizeItinerary } from '../services/aiTravelService';
import { MOCK_DESTINATIONS } from '../services/destinationService';

export const AITripPlannerView: React.FC = () => {
  const {
    formatPrice,
    currentItinerary,
    setCurrentItinerary,
    openModal,
    showToast,
    setCurrentView,
  } = useTravel();

  // Generator inputs
  const [dest, setDest] = useState(currentItinerary.destination || 'Dubai');
  const [originCity, setOriginCity] = useState(currentItinerary.origin || 'Delhi');
  const [duration, setDuration] = useState(currentItinerary.days.length || 5);
  const [travellersCount, setTravellersCount] = useState(currentItinerary.travellersCount || 2);
  const [budgetCap, setBudgetCap] = useState(currentItinerary.budgetGoal || 100000);
  const [selectedStyle, setSelectedStyle] = useState('Luxury on Budget');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Sightseeing', 'Food', 'Beaches']);
  const [isGenerating, setIsGenerating] = useState(false);

  const travelStyles = [
    'Budget',
    'Luxury on Budget',
    'Ultra Luxury',
    'Adventure',
    'Family',
    'Romantic',
    'Relaxed',
    'Cultural',
  ];

  const interestOptions = [
    'Beaches',
    'Desert Safaris',
    'Fine Dining',
    'Shopping',
    'History & Culture',
    'Theme Parks',
    'Nightlife',
    'Nature & Hills',
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    showToast('🧠 Synthesizing route, GDS flights, and hotel availability...');

    setTimeout(() => {
      const generated = synthesizeItinerary({
        origin: originCity,
        destination: dest,
        durationDays: duration,
        travellersCount,
        travellerType: `${travellersCount} Travellers • ${selectedStyle}`,
        budgetCap,
        style: selectedStyle,
      });
      setCurrentItinerary(generated);
      setIsGenerating(false);
      showToast(`✨ Generated ${duration}-day travel plan for ${dest}!`);
    }, 1200);
  };

  // Day mutation actions
  const handleRegenerateDay = (dayNum: number) => {
    showToast(`🔄 Re-indexing Day ${dayNum} timeline with alternative attractions...`);
    setCurrentItinerary((prev) => {
      const updatedDays = [...prev.days];
      const targetIdx = updatedDays.findIndex((d) => d.dayNumber === dayNum);
      if (targetIdx !== -1) {
        updatedDays[targetIdx] = {
          ...updatedDays[targetIdx],
          title: `${updatedDays[targetIdx].title} (AI Optimized Alternative)`,
          estimatedCost: Math.round(updatedDays[targetIdx].estimatedCost * 0.9),
        };
      }
      return { ...prev, days: updatedDays };
    });
  };

  const handleMakeCheaper = () => {
    showToast('💡 Applied smart cost reductions: -₹8,500 saved!');
    setCurrentItinerary((prev) => ({
      ...prev,
      totalEstimatedCost: Math.max(30000, prev.totalEstimatedCost - 8500),
      savingsEstimated: (prev.savingsEstimated || 15500) + 8500,
      aiReasoning: 'Shifted to off-peak attraction slots and selected verified boutique hotel.',
    }));
  };

  const handleMakeRelaxed = () => {
    showToast('☕ Itinerary relaxed: Activities rescheduled to after 10:30 AM.');
    setCurrentItinerary((prev) => ({
      ...prev,
      aiReasoning: 'Extended morning breakfast and leisure windows, reduced transit hops.',
    }));
  };

  return (
    <div className="w-full min-h-screen pt-20 px-gutter max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="py-8 border-b border-[#2d3449] mb-8">
        <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
          Autonomous Copilot Studio
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold text-[#dae2fd] mt-2">
          AI Trip Planner & Cost Optimizer
        </h1>
        <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1 max-w-2xl">
          Enter your preferences below. Our artificial intelligence models synthesize full day-by-day itineraries with live cost arbitration and proximity sequencing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Form */}
        <div className="lg:col-span-1 space-y-5">
          <form onSubmit={handleSynthesize} className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 space-y-4 shadow-xl">
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] pb-2 border-b border-[#2d3449] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">tune</span>
              <span>Trip Configuration</span>
            </h3>

            {/* Destination & Origin */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#89929b] block mb-1">Destination</label>
                <input
                  type="text"
                  required
                  list="destination-options"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="e.g. Kashmir, Goa, Dubai..."
                  className="w-full bg-[#131b2e] border border-[#2d3449] rounded-xl px-3 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                />
                <datalist id="destination-options">
                  {MOCK_DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.stateOrCountry} ({d.isInternational ? 'International' : 'Domestic'})
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-[11px] text-[#89929b] block mb-1">Starting City</label>
                <input
                  type="text"
                  required
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full bg-[#131b2e] border border-[#2d3449] rounded-xl px-3 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Destination Chips */}
            <div>
              <span className="text-[10px] text-[#89929b] block mb-1">Popular Destinations:</span>
              <div className="flex flex-wrap gap-1">
                {['Goa', 'Kashmir', 'Kerala', 'Dubai', 'Bali', 'Switzerland', 'Thailand'].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => {
                      const matched = MOCK_DESTINATIONS.find((d) => d.name.toLowerCase().includes(quick.toLowerCase()));
                      if (matched) setDest(matched.name);
                      else setDest(quick);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                      dest.toLowerCase().includes(quick.toLowerCase())
                        ? 'bg-[#3198dc] text-[#002c47] font-bold'
                        : 'bg-[#131b2e] text-[#bfc7d2] hover:text-white border border-[#2d3449]'
                    }`}
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Travellers */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#89929b] block mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min="2"
                  max="14"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10) || 5)}
                  className="w-full bg-[#131b2e] border border-[#2d3449] rounded-xl px-3 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#89929b] block mb-1">Travellers</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={travellersCount}
                  onChange={(e) => setTravellersCount(parseInt(e.target.value, 10) || 2)}
                  className="w-full bg-[#131b2e] border border-[#2d3449] rounded-xl px-3 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                />
              </div>
            </div>

            {/* Target Budget Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#dae2fd] mb-1">
                <span>Budget Goal</span>
                <span className="text-[#7bd0ff]">{formatPrice(budgetCap)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={budgetCap}
                onChange={(e) => setBudgetCap(parseInt(e.target.value, 10))}
                className="w-full accent-[#3198dc] cursor-pointer"
              />
            </div>

            {/* Travel Style */}
            <div>
              <label className="text-[11px] text-[#89929b] block mb-1.5 font-bold">
                Travel Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {travelStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                      selectedStyle === style
                        ? 'bg-[#222a3d] border-[#3198dc] text-[#93ccff]'
                        : 'bg-[#131b2e] border-[#2d3449] text-[#bfc7d2]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Chips */}
            <div>
              <label className="text-[11px] text-[#89929b] block mb-1.5 font-bold">
                Key Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      selectedInterests.includes(item)
                        ? 'bg-[#3198dc] text-[#002c47] font-bold'
                        : 'bg-[#131b2e] text-[#bfc7d2] hover:bg-[#222a3d]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3198dc] to-[#00a6e0] hover:from-[#93ccff] hover:to-[#3198dc] text-[#002c47] font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#002c47] border-t-transparent rounded-full animate-spin"></span>
                  <span>Synthesizing Itinerary...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Synthesize Autonomous Itinerary</span>
                </>
              )}
            </button>
          </form>

          {/* AI Quick Tuning Controls Box */}
          <div className="bg-[#131b2e] p-4 rounded-2xl border border-[#2d3449] space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7bd0ff] block">
              Quick AI Itinerary Mutations
            </span>
            <button
              onClick={handleMakeCheaper}
              className="w-full py-2 px-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-semibold text-emerald-400 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">savings</span>
                <span>Make It Cheaper</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">-₹8,500</span>
            </button>

            <button
              onClick={handleMakeRelaxed}
              className="w-full py-2 px-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-semibold text-[#dae2fd] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">bedtime</span>
                <span>Make It More Relaxed</span>
              </span>
              <span className="text-[10px] text-[#89929b]">Late Starts</span>
            </button>

            <button
              onClick={() => openModal('customize_ai')}
              className="w-full py-2 px-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-semibold text-[#93ccff] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                <span>Custom Directives Prompt</span>
              </span>
              <span className="text-[10px] text-[#89929b]">Open Studio</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Full Generated Itinerary Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Summary Card */}
          <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d3449]">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
                  {currentItinerary.travelStyle}
                </span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#dae2fd] mt-1">
                  {currentItinerary.title}
                </h2>
                <p className="text-xs text-[#bfc7d2] mt-0.5">
                  {currentItinerary.travelDates} • {currentItinerary.travellersCount} Travellers
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#89929b] block">Total Estimated Cost</span>
                <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#7bd0ff]">
                  {formatPrice(currentItinerary.totalEstimatedCost)}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  ✓ Within your {formatPrice(currentItinerary.budgetGoal)} budget
                </span>
              </div>
            </div>

            {/* AI Reasoning Note */}
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#2d3449]/40 mt-4 flex items-center gap-2.5 text-xs text-[#bfc7d2]">
              <span className="material-symbols-outlined text-[#7bd0ff] text-[20px] shrink-0">
                psychology
              </span>
              <span>
                <strong>AI Reasoning:</strong> {currentItinerary.aiReasoning}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  openModal('booking', {
                    type: 'full_itinerary',
                    title: currentItinerary.title,
                    totalPaid: currentItinerary.totalEstimatedCost,
                    destination: currentItinerary.destination,
                    dates: currentItinerary.travelDates,
                  });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Reserve Entire Itinerary
              </button>
            </div>
          </div>

          {/* Day-by-Day Detailed Cards */}
          <div className="space-y-4">
            {currentItinerary.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-lg space-y-4"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#3198dc] text-[#002c47] font-bold text-xs flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                        {day.title}
                      </h3>
                      <p className="text-xs text-[#bfc7d2]">{day.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#7bd0ff] hidden sm:inline">
                      {formatPrice(day.estimatedCost)}
                    </span>
                    <button
                      onClick={() => handleRegenerateDay(day.dayNumber)}
                      title="Regenerate this day"
                      className="p-1.5 rounded-lg bg-[#222a3d] text-[#bfc7d2] hover:text-[#93ccff] hover:bg-[#2d3449] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">sync</span>
                      <span className="hidden sm:inline">Regenerate</span>
                    </button>
                  </div>
                </div>

                {/* Timeline Activities (Morning, Afternoon, Evening) */}
                <div className="space-y-2.5">
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-[#131b2e] rounded-xl border border-[#2d3449]/40 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#222a3d] text-[#93ccff] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#dae2fd]">{act.title}</span>
                          <span className="text-[11px] text-[#7bd0ff] font-semibold">{act.time}</span>
                        </div>
                        <p className="text-[11px] text-[#bfc7d2] mt-0.5 leading-relaxed">{act.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#89929b]">
                          <span>{act.location}</span>
                          {act.cost > 0 && (
                            <span className="text-[#dae2fd] font-semibold">
                              Est. {formatPrice(act.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Dining & Tip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2.5 rounded-xl bg-[#222a3d]/40 border border-[#2d3449]/40">
                    <span className="text-[10px] text-[#89929b] font-bold block mb-1">
                      🍽️ Recommended Dining:
                    </span>
                    <span className="text-[11px] text-[#dae2fd]">
                      {day.recommendations.restaurants.join(' • ')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#222a3d]/40 border border-[#2d3449]/40">
                    <span className="text-[10px] text-[#89929b] font-bold block mb-1">
                      💡 Copilot Local Tip:
                    </span>
                    <span className="text-[11px] text-[#bfc7d2]">
                      {day.recommendations.travelTip}
                    </span>
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
