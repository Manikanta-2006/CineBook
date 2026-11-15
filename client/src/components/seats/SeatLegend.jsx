import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-cinema-800 border border-white/20"></div>
        <span>Available</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-amber-400 border border-amber-300 shadow-glow-gold"></div>
        <span className="text-amber-400 font-semibold">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-slate-800/80 border border-slate-700 flex items-center justify-center">
          <Lock className="w-3 h-3 text-slate-500" />
        </div>
        <span className="text-slate-500">Sold Out</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-cinema-800 border border-amber-500/50 relative">
          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2.5 h-0.5 bg-amber-400 rounded-full"></span>
        </div>
        <span className="text-amber-300">VIP Recliner</span>
      </div>
    </div>
  );
};

export default SeatLegend;
