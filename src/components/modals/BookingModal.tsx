import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';

export const BookingModal: React.FC = () => {
  const { activeModal, closeModal, formatPrice, addBooking, setCurrentView } = useTravel();

  const [fullName, setFullName] = useState('Shreyas Mathur');
  const [email, setEmail] = useState('shreyas.traveler@example.com');
  const [phone, setPhone] = useState('+91 98712 34567');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  if (activeModal.type !== 'booking' || !activeModal.data) return null;

  const data = activeModal.data;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const ref = addBooking({
        title: data.title || 'Dubai Travel Package',
        type: data.type || 'full_itinerary',
        destination: data.destination || 'Dubai, UAE',
        dates: data.dates || 'Nov 12 — Nov 16, 2025',
        passengers: data.passengers || 2,
        totalPaid: data.totalPaid || 98000,
        flightDetails: data.flightDetails,
        hotelDetails: data.hotelDetails,
      });
      setConfirmedRef(ref);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-[#171f33] rounded-2xl border border-[#2d3449] shadow-2xl p-6 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3198dc]/20 text-[#93ccff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dae2fd]">
                {confirmedRef ? 'Booking Confirmed!' : 'Express Checkout & Reservation'}
              </h3>
              <p className="text-[11px] text-[#bfc7d2]">
                Guaranteed by TRAVELAI Autonomous Booking Engine
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

        {confirmedRef ? (
          /* Confirmation Success Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                Trip Confirmed Successfully!
              </h2>
              <p className="text-xs text-[#bfc7d2] mt-1">
                Your reservation reference is{' '}
                <span className="font-mono font-bold text-[#93ccff]">{confirmedRef}</span>
              </p>
            </div>

            <div className="bg-[#131b2e] p-4 rounded-xl border border-[#2d3449] text-left max-w-sm mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#89929b]">Item:</span>
                <span className="text-[#dae2fd] font-bold">{data.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#89929b]">Lead Traveller:</span>
                <span className="text-[#dae2fd]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#89929b]">Total Charged:</span>
                <span className="text-emerald-400 font-bold">{formatPrice(data.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#89929b]">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  Confirmed & Synced
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  closeModal();
                  setCurrentView('my-trips');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] font-bold text-xs shadow-lg transition-colors cursor-pointer"
              >
                View in My Trips
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleConfirm} className="flex-1 overflow-y-auto py-3 space-y-4">
            {/* Booking Summary Box */}
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#2d3449]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7bd0ff] font-bold uppercase tracking-wider block">
                  Selected Package / Item
                </span>
                <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd]">
                  {data.title}
                </h4>
                <p className="text-[11px] text-[#bfc7d2]">{data.dates || 'Nov 12 — Nov 16'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#89929b] block">Total Amount</span>
                <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#7bd0ff]">
                  {formatPrice(data.totalPaid)}
                </span>
              </div>
            </div>

            {/* Traveller Details */}
            <div className="space-y-3">
              <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd] uppercase tracking-wider">
                1. Traveller Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#89929b] block mb-1">Full Name (as on Passport / ID)</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#131b2e] border border-[#2d3449] rounded-lg px-3 py-2 text-xs text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#89929b] block mb-1">Email for Tickets & Voucher</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#131b2e] border border-[#2d3449] rounded-lg px-3 py-2 text-xs text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-[#89929b] block mb-1">WhatsApp / Contact Number (with country code)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#131b2e] border border-[#2d3449] rounded-lg px-3 py-2 text-xs text-[#dae2fd] focus:border-[#3198dc] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2.5">
              <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd] uppercase tracking-wider">
                2. Select Payment Mode
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-[#222a3d] border-[#3198dc] text-[#93ccff]'
                      : 'bg-[#131b2e] border-[#2d3449] text-[#bfc7d2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] block mb-0.5">qr_code_2</span>
                  <span className="text-[11px] font-bold block">UPI / GPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#222a3d] border-[#3198dc] text-[#93ccff]'
                      : 'bg-[#131b2e] border-[#2d3449] text-[#bfc7d2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] block mb-0.5">credit_card</span>
                  <span className="text-[11px] font-bold block">Card / Forex</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#222a3d] border-[#3198dc] text-[#93ccff]'
                      : 'bg-[#131b2e] border-[#2d3449] text-[#bfc7d2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] block mb-0.5">account_balance</span>
                  <span className="text-[11px] font-bold block">NetBanking</span>
                </button>
              </div>

              <div className="p-3 bg-[#131b2e]/60 rounded-xl border border-[#2d3449]/40 text-[11px] text-[#bfc7d2] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">lock</span>
                <span>Sandbox Test Mode: Zero live credit card deductions. Direct GDS PNR issuance simulation.</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3198dc] to-[#00a6e0] hover:from-[#93ccff] hover:to-[#3198dc] text-[#002c47] font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#002c47] border-t-transparent rounded-full animate-spin"></span>
                    <span>Issuing Amadeus PNR & Hotel Voucher...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay {formatPrice(data.totalPaid)}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
