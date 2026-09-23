import React from 'react';
import { useTravel } from '../context/TravelContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useTravel();

  return (
    <footer className="w-full bg-[#060e20] mt-space-2xl text-[#bfc7d2] border-t border-[#171f33]">
      <div className="w-full px-gutter py-space-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-space-md">
            <img
              alt="TRAVELAI Logo"
              className="h-7 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XvLfJWuS7_6E2pgeYCpTCZdw407PMLfB_DpgvUlYRY0Cj26_H0UxYmvAGwkalQYU8mt8H8ZI-3Kz81t8LtGYzzVE34AAXm73iauqlRp2bSp0YVS1yAPpeuTW8Qepreh0dt5lpe8MmlLu_hCAHDyG57t65geUfg97pRvk6p6Gl9u734g_F2h03grUGSc2Ui-psnJwRat4pSusp7ogaRi63YyEXaYFmKTv862OGysuZkr1IN3tM-oBpjUQAj"
            />
            <span className="font-['Plus_Jakarta_Sans'] text-[20px] text-[#dae2fd] font-bold">
              TRAVEL<span className="text-[#93ccff]">AI</span>
            </span>
          </div>
          <p className="font-['Inter'] text-[13px] text-[#bfc7d2] mb-space-md leading-relaxed">
            Autonomous travel orchestration platform tailored for global nomads and luxury explorers worldwide.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse"></span>
            <span className="font-['Inter'] text-[11px] text-[#bfc7d2]">AI Inference v4.8 Active</span>
          </div>
        </div>

        {/* Discover */}
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-sm text-[#dae2fd] font-semibold uppercase tracking-wider mb-space-md">
            Discover
          </h3>
          <ul className="space-y-2 font-['Inter'] text-[13px]">
            <li>
              <button
                onClick={() => {
                  setCurrentView('destinations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Curated Destinations
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('holidays');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Luxury Holidays
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('flights');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Private & Commercial Flights
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('hotels');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Boutique Hotels
              </button>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-sm text-[#dae2fd] font-semibold uppercase tracking-wider mb-space-md">
            Services
          </h3>
          <ul className="space-y-2 font-['Inter'] text-[13px]">
            <li>
              <button
                onClick={() => {
                  setCurrentView('my-trips');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Itinerary Vault
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('flights');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Flight Status Engine
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('hotels');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Concierge Stays
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('holidays');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Bespoke Group Tours
              </button>
            </li>
          </ul>
        </div>

        {/* AI Planner */}
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-sm text-[#dae2fd] font-semibold uppercase tracking-wider mb-space-md">
            AI Planner
          </h3>
          <ul className="space-y-2 font-['Inter'] text-[13px]">
            <li>
              <button
                onClick={() => {
                  setCurrentView('ai-trip-planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Ambient Route Generator
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('ai-trip-planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Budget Optimizer Model
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('ai-trip-planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Multi-City Synthesizer
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('destinations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#93ccff] transition-colors cursor-pointer text-left"
              >
                Real-Time Weather Copilot
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Trust */}
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-sm text-[#dae2fd] font-semibold uppercase tracking-wider mb-space-md">
            Legal & Trust
          </h3>
          <ul className="space-y-2 font-['Inter'] text-[13px]">
            <li><span className="hover:text-[#93ccff] transition-colors cursor-pointer">Terms of Service</span></li>
            <li><span className="hover:text-[#93ccff] transition-colors cursor-pointer">Privacy Framework</span></li>
            <li><span className="hover:text-[#93ccff] transition-colors cursor-pointer">Trust & Safety Protocol</span></li>
            <li><span className="hover:text-[#93ccff] transition-colors cursor-pointer">Data Encryption Standards</span></li>
          </ul>
        </div>
      </div>

      {/* API Notice / Disclaimer Banner */}
      <div className="w-full px-gutter py-space-md bg-[#131b2e] border-t border-[#171f33]">
        <div className="bg-[#171f33]/80 rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-[#2d3449]/40">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[24px]">api</span>
            <div>
              <p className="font-['Inter'] text-[13px] text-[#dae2fd] font-semibold">
                API Integration Notice & Disclaimer
              </p>
              <p className="font-['Inter'] text-[13px] text-[#bfc7d2] leading-relaxed">
                Real-time flight pricing, hotel room availability, and instantaneous travel bookings leverage mock service adapters calibrated for production GDS and live provider APIs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded bg-[#2d3449] font-['Inter'] text-[11px] text-[#c4e7ff] font-bold tracking-wider">
              SANDBOX CONNECTED
            </span>
          </div>
        </div>

        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <p className="font-['Inter'] text-[13px] text-[#bfc7d2]">
            © 2025 TRAVELAI Inc. All rights reserved.
          </p>
          <p className="font-['Inter'] text-[11px] text-[#89929b]">
            Engineered with high-assurance artificial intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
};
