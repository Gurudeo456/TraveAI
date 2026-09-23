import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Currency } from '../types/travel';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, currency, setCurrency, savedBookings, showToast } = useTravel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'flights', label: 'Flights' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'holidays', label: 'Holidays' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'ai-trip-planner', label: 'AI Trip Planner', badge: '★ AI' },
    { id: 'my-trips', label: 'My Trips', count: savedBookings.length },
    { id: 'admin', label: 'Admin' },
  ];

  const notifications = [
    { id: 1, title: 'Fare Drop Alert', desc: 'IndiGo DEL→DXB dropped by ₹1,400 for mid-week departures.', time: '10m ago' },
    { id: 2, title: 'Dubai Weather Update', desc: 'Forecast: 28°C, calm winds, ideal for desert safari.', time: '1h ago' },
    { id: 3, title: 'Check-in Reminder', desc: 'Online check-in opens 24h prior to departure for EK-511.', time: '3h ago' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b1326]/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(2,6,23,0.5)] border-b border-[#171f33]/60">
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-md">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-space-lg">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none group"
          >
            <img
              alt="TRAVELAI Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XvLfJWuS7_6E2pgeYCpTCZdw407PMLfB_DpgvUlYRY0Cj26_H0UxYmvAGwkalQYU8mt8H8ZI-3Kz81t8LtGYzzVE34AAXm73iauqlRp2bSp0YVS1yAPpeuTW8Qepreh0dt5lpe8MmlLu_hCAHDyG57t65geUfg97pRvk6p6Gl9u734g_F2h03grUGSc2Ui-psnJwRat4pSusp7ogaRi63YyEXaYFmKTv862OGysuZkr1IN3tM-oBpjUQAj"
            />
            <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#dae2fd] tracking-tight">
              TRAVEL<span className="text-[#93ccff]">AI</span>
            </span>
          </button>

          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 font-['Inter'] text-[13px] font-semibold transition-all rounded-lg flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#222a3d] text-[#93ccff] shadow-sm'
                      : 'text-[#bfc7d2] hover:text-[#dae2fd] hover:bg-[#171f33]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#3198dc] text-[#002c47] text-[10px] font-extrabold tracking-wider uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#3198dc]/30 text-[#93ccff] text-[10px] font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Currency & User Controls */}
        <div className="flex items-center gap-3">
          {/* Currency Selector */}
          <div className="relative flex items-center bg-[#171f33] px-3 py-1.5 rounded-lg border border-[#2d3449]/50 hover:border-[#3198dc]/40 transition-colors">
            <span className="material-symbols-outlined text-[#93ccff] text-[18px] mr-1.5">currency_exchange</span>
            <select
              aria-label="Currency Selector"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value as Currency);
                showToast(`Currency updated to ${e.target.value}`);
              }}
              className="bg-transparent font-['Inter'] text-[13px] font-semibold text-[#dae2fd] focus:outline-none cursor-pointer pr-1"
            >
              <option className="bg-[#222a3d] text-[#dae2fd]" value="INR">INR ₹</option>
              <option className="bg-[#222a3d] text-[#dae2fd]" value="USD">USD $</option>
              <option className="bg-[#222a3d] text-[#dae2fd]" value="AED">AED د.إ</option>
              <option className="bg-[#222a3d] text-[#dae2fd]" value="EUR">EUR €</option>
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label="Notifications"
              className="relative p-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#bfc7d2] hover:text-[#dae2fd] transition-colors border border-[#2d3449]/40 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fb575c]"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#171f33] rounded-xl border border-[#2d3449] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#2d3449] mb-2">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#93ccff]">
                    Notifications (3)
                  </span>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] text-[#bfc7d2] hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] transition-colors">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#dae2fd]">{n.title}</span>
                        <span className="text-[10px] text-[#89929b]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#bfc7d2] mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-[#93ccff] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[#003351] text-[18px]">person</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-['Inter'] text-[13px] text-[#dae2fd] font-semibold leading-tight">Shreyas</span>
              <span className="font-['Inter'] text-[11px] text-[#7bd0ff] font-medium">Delhi, IN</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#171f33] text-[#dae2fd] hover:bg-[#222a3d] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0e172a] border-b border-[#2d3449] px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full px-4 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                  isActive ? 'bg-[#222a3d] text-[#93ccff]' : 'text-[#bfc7d2] hover:bg-[#171f33]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#3198dc] text-[#002c47] text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
