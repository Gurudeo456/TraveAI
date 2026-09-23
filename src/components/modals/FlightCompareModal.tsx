import React from 'react';
import { useTravel } from '../../context/TravelContext';
import { MOCK_FLIGHTS } from '../../services/flightService';

export const FlightCompareModal: React.FC = () => {
  const { activeModal, closeModal, formatPrice, openModal } = useTravel();

  if (activeModal.type !== 'flight_compare') return null;

  const flights = MOCK_FLIGHTS.slice(0, 3); // IndiGo, Air India, Emirates

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-[#171f33] rounded-2xl border border-[#2d3449] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2d3449] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3198dc]/20 text-[#93ccff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">compare</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dae2fd]">
                AI Flight Matrix Comparison
              </h3>
              <p className="text-xs text-[#bfc7d2]">
                New Delhi (DEL) ⇄ Dubai (DXB) • Nov 12 — Nov 16 (2 Passengers)
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

        {/* Matrix Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 gap-3 text-sm">
            {/* Row: Feature Header */}
            <div className="p-3 bg-[#131b2e] rounded-xl font-bold text-[#93ccff]">Features</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 bg-[#222a3d] rounded-xl text-center">
                <span className="font-bold text-[#dae2fd] block">{f.airline}</span>
                <span className="text-[11px] text-[#bfc7d2]">{f.flightNumber}</span>
                {f.badge && (
                  <span className="mt-1 inline-block px-2 py-0.5 rounded bg-[#3198dc]/20 text-[#93ccff] text-[10px] font-bold">
                    {f.badge}
                  </span>
                )}
              </div>
            ))}

            {/* Row: Price */}
            <div className="p-3 font-semibold text-[#dae2fd]">Round-trip Price (2 Pax)</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center">
                <div className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#7bd0ff]">
                  {formatPrice(f.totalPrice)}
                </div>
                <span className="text-[10px] text-[#89929b]">Taxes incl.</span>
              </div>
            ))}

            {/* Row: Flight Duration */}
            <div className="p-3 font-semibold text-[#dae2fd]">Outbound Duration</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center text-[#dae2fd]">
                {f.outbound.duration} ({f.outbound.stops})
              </div>
            ))}

            {/* Row: Baggage */}
            <div className="p-3 font-semibold text-[#dae2fd]">Checked Baggage</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center text-[#bfc7d2] text-xs">
                {f.outbound.baggage}
              </div>
            ))}

            {/* Row: Seat Pitch */}
            <div className="p-3 font-semibold text-[#dae2fd]">Seat Pitch & Comfort</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center text-[#dae2fd] text-xs">
                {f.seatPitch}
              </div>
            ))}

            {/* Row: Meals */}
            <div className="p-3 font-semibold text-[#dae2fd]">Meal Service</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center text-[#bfc7d2] text-xs">
                {f.outbound.meal}
              </div>
            ))}

            {/* Row: On-Time Rate */}
            <div className="p-3 font-semibold text-[#dae2fd]">On-Time Reliability</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center text-[#7bd0ff] font-bold text-xs">
                {f.onTimeRate}
              </div>
            ))}

            {/* Row: Carbon Score */}
            <div className="p-3 font-semibold text-[#dae2fd]">Carbon Footprint</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center text-[#bfc7d2] text-xs">
                {f.carbonScore}
              </div>
            ))}

            {/* Action Row */}
            <div className="p-3 font-semibold text-[#dae2fd]">Action</div>
            {flights.map((f) => (
              <div key={f.id} className="p-3 text-center">
                <button
                  onClick={() => {
                    closeModal();
                    openModal('booking', {
                      type: 'flight',
                      title: `${f.airline} (${f.flightNumber}) Round-Trip DEL ⇄ DXB`,
                      totalPaid: f.totalPrice,
                      destination: 'Dubai (DXB)',
                      flightDetails: {
                        airline: f.airline,
                        flightNumber: f.flightNumber,
                        seat: '12A, 12B',
                        pnr: 'Q8K4M9',
                        gate: 'Terminal 3, Gate 18',
                      },
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs shadow-md transition-colors"
                >
                  Select & Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
