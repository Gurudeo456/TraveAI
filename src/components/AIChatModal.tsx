import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';

export const AIChatModal: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, chatMessages, sendChatMessage, setCurrentView, showToast } = useTravel();
  const [inputText, setInputText] = useState('');

  if (!isAIChatOpen) return null;

  const quickPrompts = [
    'What is the cheapest month to visit Dubai?',
    'Can I reduce my hotel cost?',
    'Add a desert safari & BBQ to my plan',
    'Best family destinations in India for Dec?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:w-[480px] h-[90vh] sm:h-[650px] bg-[#171f33] rounded-t-3xl sm:rounded-2xl border border-[#2d3449] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="p-4 bg-[#131b2e] border-b border-[#2d3449] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3198dc] to-[#00a6e0] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dae2fd]">
                  TRAVELAI Copilot
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-[10px] font-bold">
                  v4.8
                </span>
              </div>
              <p className="text-[11px] text-[#7bd0ff] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7bd0ff] animate-ping"></span>
                GDS & Hotel Inventory Synchronized
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIChatOpen(false)}
            className="w-8 h-8 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#bfc7d2] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#0e172a] border-b border-[#2d3449]/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => sendChatMessage(qp)}
              className="px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[11px] text-[#bfc7d2] hover:text-[#93ccff] whitespace-nowrap transition-colors border border-[#2d3449]/40 shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#3198dc] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
              )}
              <div className="max-w-[85%] space-y-2">
                <div
                  className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#3198dc] text-[#002c47] font-medium rounded-tr-xs ml-auto'
                      : 'bg-[#222a3d] text-[#dae2fd] rounded-tl-xs border border-[#2d3449]/60'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Optional interactive card inside chat */}
                {msg.card && (
                  <div className="bg-[#131b2e] p-3 rounded-xl border border-[#3198dc]/30 flex items-center justify-between gap-3 shadow-md">
                    <div className="min-w-0">
                      <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#dae2fd] truncate">
                        {msg.card.title}
                      </p>
                      <p className="text-[11px] text-[#bfc7d2] truncate">{msg.card.subtitle}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAIChatOpen(false);
                        setCurrentView('flights');
                        showToast(`Loaded route: ${msg.card?.title}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#3198dc] hover:bg-[#93ccff] text-[#002c47] text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      {msg.card.actionLabel}
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-[#89929b] block px-1">
                  {msg.time}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#222a3d] text-[#dae2fd] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  S
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#131b2e] border-t border-[#2d3449]">
          <div className="relative flex items-center bg-[#222a3d] rounded-xl p-1 border border-[#2d3449] focus-within:border-[#3198dc] transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. Can we do Dubai on ₹75k?)"
              className="w-full bg-transparent px-3 font-['Inter'] text-[13px] text-[#dae2fd] placeholder:text-[#89929b] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-lg bg-[#3198dc] text-[#002c47] hover:bg-[#93ccff] disabled:opacity-40 disabled:hover:bg-[#3198dc] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AskAIButton: React.FC = () => {
  const { setIsAIChatOpen } = useTravel();

  return (
    <aside className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="flex items-center gap-space-sm bg-gradient-to-r from-[#3198dc] to-[#00a6e0] text-[#002c47] px-space-lg py-3 rounded-full shadow-[0_12px_28px_rgba(2,132,199,0.35)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer font-bold"
        type="button"
      >
        <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
        <span className="font-['Inter'] text-[13px] font-bold tracking-wide">
          Ask AI Assistant
        </span>
      </button>
    </aside>
  );
};
