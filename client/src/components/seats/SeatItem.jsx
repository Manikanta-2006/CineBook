import React from 'react';
import { Armchair, Lock } from 'lucide-react';

const SeatItem = ({ seatNumber, status, tier, price, onToggle, disabled }) => {
  const isBooked = status === 'booked';
  const isSelected = status === 'selected';
  const isVIP = tier?.toLowerCase().includes('vip') || tier?.toLowerCase().includes('recliner');

  const handleClick = () => {
    if (isBooked || disabled) return;
    onToggle({ seatNumber, tier, price });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBooked || disabled}
      title={`${seatNumber} - ${tier} (₹${price}) ${isBooked ? '(Sold Out)' : ''}`}
      className={`relative group flex flex-col items-center justify-center transition-all duration-200 select-none rounded-lg focus:outline-none ${
        isVIP ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-8 h-8 sm:w-9 sm:h-9'
      } ${
        isBooked
          ? 'bg-slate-800/60 border border-slate-700/50 text-slate-600 cursor-not-allowed opacity-60'
          : isSelected
          ? 'bg-gradient-to-t from-amber-500 to-amber-400 text-black font-extrabold shadow-glow-gold scale-105 border border-amber-300'
          : isVIP
          ? 'bg-cinema-800 hover:bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:border-amber-400'
          : 'bg-cinema-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 hover:border-white/30'
      }`}
    >
      {/* Icon or seat number */}
      {isBooked ? (
        <Lock className="w-3.5 h-3.5 text-slate-500" />
      ) : (
        <span className="text-[11px] sm:text-xs font-bold">{seatNumber.replace(/^[A-Z]/, '')}</span>
      )}

      {/* Recliner Footrest Indicator bar for VIP */}
      {isVIP && (
        <span
          className={`absolute -bottom-1 w-4 h-1 rounded-full ${
            isSelected ? 'bg-black' : isBooked ? 'bg-slate-700' : 'bg-amber-400/60'
          }`}
        ></span>
      )}
    </button>
  );
};

export default SeatItem;
