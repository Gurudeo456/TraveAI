import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';

export const CustomizeAIModal: React.FC = () => {
  const { activeModal, closeModal, currentItinerary, setCurrentItinerary, showToast, setCurrentView } = useTravel();
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (activeModal.type !== 'customize_ai') return null;

  const presets = [
    { id: 'abu-dhabi', label: 'Add 1-Day Abu Dhabi Grand Mosque & Louvre Excursion', deltaCost: 6400 },
    { id: 'make-relaxed', label: 'Make Itinerary More Relaxed (Late 10:30 AM starts)', deltaCost: 0 },
    { id: 'budget-optimizer', label: 'Optimize Budget: Switch to Rove Hotel & Save ₹10,400', deltaCost: -10400 },
    { id: 'luxury-upgrade', label: 'Upgrade to 5-Star Waterfront Suite with Balcony', deltaCost: 18000 },
    { id: 'family-parks', label: 'Add Atlantis Aquaventure & Miracle Garden for Family', deltaCost: 8200 },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    setTimeout(() => {
      setIsApplying(false);

      let costDelta = 0;
      let newTitle = currentItinerary.title;

      if (selectedPreset === 'abu-dhabi') {
        costDelta = 6400;
        newTitle = `${currentItinerary.origin} → Dubai & Abu Dhabi 5-Day Luxury on Budget`;
      } else if (selectedPreset === 'budget-optimizer') {
        costDelta = -10400;
      } else if (selectedPreset === 'luxury-upgrade') {
        costDelta = 18000;
      }

      setCurrentItinerary((prev) => ({
        ...prev,
        title: newTitle,
        totalEstimatedCost: Math.max(30000, prev.totalEstimatedCost + costDelta),
        aiReasoning: customPrompt
          ? `Regenerated based on custom directive: "${customPrompt}". Itinerary re-indexed with GDS slots.`
          : `Customized with: ${presets.find((p) => p.id === selectedPreset)?.label || 'Custom settings'}.`,
      }));

      showToast('✨ AI Itinerary successfully customized!');
      closeModal();
      setCurrentView('home');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#171f33] rounded-2xl border border-[#2d3449] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d3449] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3198dc] to-[#00a6e0] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                Customize with AI Engine
              </h3>
              <p className="text-[11px] text-[#7bd0ff]">
                Live parameter modification for {currentItinerary.destination}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#bfc7d2] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleApply} className="space-y-4">
          {/* Quick Preset Directives */}
          <div>
            <label className="text-xs font-bold text-[#dae2fd] block mb-2">
              Popular AI Modification Directives:
            </label>
            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    selectedPreset === preset.id
                      ? 'bg-[#222a3d] border-[#3198dc] text-[#93ccff]'
                      : 'bg-[#131b2e] border-[#2d3449]/60 text-[#bfc7d2] hover:border-[#3198dc]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPreset === preset.id ? 'border-[#3198dc] bg-[#3198dc]' : 'border-[#89929b]'}`}>
                      {selectedPreset === preset.id && <span className="w-1.5 h-1.5 rounded-full bg-[#002c47]"></span>}
                    </span>
                    <span>{preset.label}</span>
                  </div>
                  {preset.deltaCost !== 0 && (
                    <span className={`text-[11px] font-bold ${preset.deltaCost < 0 ? 'text-emerald-400' : 'text-[#7bd0ff]'}`}>
                      {preset.deltaCost < 0 ? `-₹${Math.abs(preset.deltaCost).toLocaleString()}` : `+₹${preset.deltaCost.toLocaleString()}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Natural Language Prompt Input */}
          <div>
            <label className="text-xs font-bold text-[#dae2fd] block mb-1">
              Or write custom request:
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Add a sunset catamaran yacht cruise in Dubai Marina on Day 3..."
              className="w-full bg-[#131b2e] border border-[#2d3449] rounded-xl p-3 text-xs text-[#dae2fd] placeholder:text-[#89929b] focus:border-[#3198dc] focus:outline-none"
            />
          </div>

          {/* Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl bg-[#222a3d] text-xs text-[#bfc7d2] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isApplying}
              className="px-5 py-2 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              {isApplying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#002c47] border-t-transparent rounded-full animate-spin"></span>
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>Apply AI Synthesis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
