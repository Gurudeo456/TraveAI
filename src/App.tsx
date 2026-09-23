import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AskAIButton, AIChatModal } from './components/AIChatModal';

// Modals
import { FlightCompareModal } from './components/modals/FlightCompareModal';
import { HotelDetailsModal } from './components/modals/HotelDetailsModal';
import { BookingModal } from './components/modals/BookingModal';
import { CustomizeAIModal } from './components/modals/CustomizeAIModal';

// Views
import { HomeView } from './views/HomeView';
import { FlightsView } from './views/FlightsView';
import { HotelsView } from './views/HotelsView';
import { HolidaysView } from './views/HolidaysView';
import { DestinationsView } from './views/DestinationsView';
import { AITripPlannerView } from './views/AITripPlannerView';
import { MyTripsView } from './views/MyTripsView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainAppContent: React.FC = () => {
  const { currentView, toastMessage } = useTravel();

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter'] flex flex-col selection:bg-[#3198dc] selection:text-[#002c47]">
      {/* Top Global Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'flights' && <FlightsView />}
        {currentView === 'hotels' && <HotelsView />}
        {currentView === 'holidays' && <HolidaysView />}
        {currentView === 'destinations' && <DestinationsView />}
        {currentView === 'ai-trip-planner' && <AITripPlannerView />}
        {currentView === 'my-trips' && <MyTripsView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Copilot Button & Assistant Drawer */}
      <AskAIButton />
      <AIChatModal />

      {/* Interactive Global Modals */}
      <FlightCompareModal />
      <HotelDetailsModal />
      <BookingModal />
      <CustomizeAIModal />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#171f33]/95 border border-[#3198dc]/50 backdrop-blur-md rounded-xl text-xs font-semibold text-[#dae2fd] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <MainAppContent />
    </TravelProvider>
  );
}
