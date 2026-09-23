import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { MOCK_HOLIDAY_PACKAGES } from '../services/holidayService';

export const AdminDashboardView: React.FC = () => {
  const { formatPrice, showToast } = useTravel();
  const [packages, setPackages] = useState(MOCK_HOLIDAY_PACKAGES);

  const toggleFeatured = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
    showToast('Updated package spotlight status.');
  };

  return (
    <div className="w-full min-h-screen pt-20 px-gutter max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="py-8 border-b border-[#2d3449] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[11px] font-bold">
            Platform Operations & Telemetry
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold text-[#dae2fd] mt-2">
            TRAVELAI Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1">
            Real-time GDS distribution feeds, booking transaction volume, and autonomous agent latency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-emerald-400">GDS SYNC: 99.98% OK</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-[#89929b] block">Total Bookings GMV</span>
          <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#7bd0ff] mt-1">
            ₹28,42,000
          </div>
          <span className="text-xs text-emerald-400 font-bold block mt-1">+24.8% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-[#89929b] block">Active Travellers</span>
          <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#dae2fd] mt-1">
            3,420
          </div>
          <span className="text-xs text-[#bfc7d2] block mt-1">540 departures this week</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-[#89929b] block">AI Syntheses Generated</span>
          <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#dae2fd] mt-1">
            14,892
          </div>
          <span className="text-xs text-[#7bd0ff] block mt-1">Avg Latency 1.2s</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171f33] border border-[#2d3449] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-[#89929b] block">Conversion Rate</span>
          <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-emerald-400 mt-1">
            18.6%
          </div>
          <span className="text-xs text-[#bfc7d2] block mt-1">+4.2% AI copilot assisted</span>
        </div>
      </div>

      {/* Real-time API Integration Status Table */}
      <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-xl mb-8">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] mb-4">
          Integrated Travel Provider APIs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2d3449] text-[#89929b]">
                <th className="pb-3 font-semibold">Service Name</th>
                <th className="pb-3 font-semibold">Domain</th>
                <th className="pb-3 font-semibold">Latency</th>
                <th className="pb-3 font-semibold">Uptime</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3449]/40 text-[#dae2fd]">
              <tr>
                <td className="py-3 font-bold">Amadeus Enterprise API</td>
                <td className="py-3 text-[#bfc7d2]">Flight Search & PNR Booking</td>
                <td className="py-3 font-mono text-[#7bd0ff]">38ms</td>
                <td className="py-3 text-emerald-400">99.98%</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold">Sabre Flight Network</td>
                <td className="py-3 text-[#bfc7d2]">Global Low-Fare Arbitrage</td>
                <td className="py-3 font-mono text-[#7bd0ff]">44ms</td>
                <td className="py-3 text-emerald-400">99.95%</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold">Hotelbeds & Expedia Partner</td>
                <td className="py-3 text-[#bfc7d2]">Direct Property Inventory</td>
                <td className="py-3 font-mono text-[#7bd0ff]">52ms</td>
                <td className="py-3 text-emerald-400">99.92%</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold">Gemini 2.5 Flash Travel Agent</td>
                <td className="py-3 text-[#bfc7d2]">Autonomous Itinerary Sequencing</td>
                <td className="py-3 font-mono text-[#7bd0ff]">1.2s</td>
                <td className="py-3 text-emerald-400">100.0%</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-[#3198dc]/20 text-[#93ccff] text-[10px] font-bold">
                    SYNTHESIZING
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Holiday Catalog Management */}
      <div className="bg-[#171f33] rounded-2xl border border-[#2d3449] p-5 shadow-xl">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd] mb-4">
          Holiday Package Spotlight Configuration
        </h3>
        <div className="space-y-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-3 bg-[#131b2e] rounded-xl border border-[#2d3449]/50 flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <span className="font-bold text-[#dae2fd]">{pkg.title}</span>
                <span className="text-[#89929b] ml-2">({pkg.destination}, {pkg.durationDays}D/{pkg.durationNights}N)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#7bd0ff]">{formatPrice(pkg.pricePerPerson)}</span>
                <button
                  onClick={() => toggleFeatured(pkg.id)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    pkg.featured
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#222a3d] text-[#89929b] border border-[#2d3449]'
                  }`}
                >
                  {pkg.featured ? 'Featured on Home' : 'Standard'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
