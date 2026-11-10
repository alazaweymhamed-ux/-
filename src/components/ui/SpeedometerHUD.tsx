import React from 'react';
import { TaxiState } from '../../types/game';
import { proceduralAudio } from '../../utils/proceduralAudio';
import { Disc, Lightbulb, BellRing } from 'lucide-react';

interface SpeedometerHUDProps {
  taxiState: TaxiState;
  onHonk: () => void;
  onToggleLights?: () => void;
}

export const SpeedometerHUD: React.FC<SpeedometerHUDProps> = ({ taxiState, onHonk }) => {
  const speed = taxiState.speedKmh;
  const maxDialSpeed = 160;
  // Calculate dial needle angle (-120deg to +120deg)
  const needleAngle = -120 + (Math.min(speed, maxDialSpeed) / maxDialSpeed) * 240;

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2.5 pointer-events-auto">
      {/* Speedometer & RPM Cluster */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700/80 rounded-2xl p-3 shadow-2xl text-white font-mono flex items-center gap-4">
        {/* Analog-styled circular dial gauge */}
        <div className="relative w-24 h-24 rounded-full bg-black/90 border-2 border-stone-700 flex items-center justify-center shadow-inner">
          {/* Tick marks */}
          <div className="absolute inset-1 rounded-full border border-stone-800 border-dashed opacity-60"></div>

          {/* Needle */}
          <div
            className="absolute w-1 h-10 bg-amber-500 rounded-full origin-bottom transition-transform duration-75"
            style={{
              bottom: '50%',
              transform: `rotate(${needleAngle}deg)`,
            }}
          />

          {/* Center cap */}
          <div className="w-4 h-4 rounded-full bg-stone-300 border-2 border-amber-600 shadow z-10" />

          {/* Digital speed number in center */}
          <div className="absolute bottom-3 text-center">
            <span className="text-xl font-black text-white">{speed}</span>
            <div className="text-[9px] text-stone-400 font-sans">كم / س</div>
          </div>
        </div>

        {/* Transmission & Info column */}
        <div className="flex flex-col justify-between h-24 py-0.5">
          {/* Gear indicators */}
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-lg border border-stone-800 text-xs font-bold">
            {(['P', 'R', 'N', 'D'] as const).map((g) => (
              <span
                key={g}
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  taxiState.gear === g
                    ? 'bg-amber-500 text-stone-950 font-black shadow'
                    : 'text-stone-500'
                }`}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Horn button (زامور التاكسي العربي الشهير) */}
          <button
            onClick={() => {
              proceduralAudio.playHorn(true);
              onHonk();
            }}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs px-3 py-1.5 rounded-lg shadow active:scale-95 transition-all cursor-pointer font-sans"
            title="انقر أو اضغط H لاستخدام الكلكس"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>كلكس التاكسي (طط!)</span>
          </button>

          {/* RPM meter */}
          <div className="text-[10px] text-stone-400 flex items-center justify-between font-sans">
            <span>دورة المحرك:</span>
            <span className="text-amber-300 font-mono font-bold">{Math.round(taxiState.rpm)} RPM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
