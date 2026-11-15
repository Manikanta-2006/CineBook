import React from 'react';
import { Projector } from 'lucide-react';

const CinemaScreenView = ({ screenName = 'Curved Silver Screen', screenType = 'IMAX' }) => {
  return (
    <div className="w-full flex flex-col items-center my-8 select-none">
      {/* Ambient Top Light Beam Effect */}
      <div className="w-3/4 max-w-lg h-12 bg-gradient-to-b from-sky-400/20 via-sky-400/5 to-transparent blur-xl pointer-events-none -mb-4"></div>

      {/* Realistic Curved Screen Bar */}
      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center">
        <div className="w-full h-3.5 rounded-[50%_50%_0_0/100%_100%_0_0] bg-gradient-to-r from-sky-200 via-white to-sky-200 shadow-glow-screen border-t border-sky-100/60"></div>
        <div className="w-11/12 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent blur-[1px]"></div>
      </div>

      {/* Screen Subtitle */}
      <div className="mt-3 flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
        <Projector className="w-3.5 h-3.5 text-sky-400" />
        <span>{screenName} • {screenType}</span>
      </div>
    </div>
  );
};

export default CinemaScreenView;
