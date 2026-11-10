import React from 'react';
import { ARAB_CITIES, ArabCity, Passenger, TaxiState } from '../../types/game';

interface TaximeterHUDProps {
  city: ArabCity;
  taxiState: TaxiState;
  currentPassenger: Passenger | null;
  missionStatus: 'searching' | 'onboard' | 'dropped';
}

export const TaximeterHUD: React.FC<TaximeterHUDProps> = ({
  city,
  taxiState,
  currentPassenger,
  missionStatus,
}) => {
  const cityConfig = ARAB_CITIES[city];

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5 max-w-xs w-full pointer-events-auto">
      {/* Authentic Digital Taxi Meter Device (عداد التاكسي العربي) */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700/80 rounded-xl p-3 shadow-2xl text-white font-mono relative overflow-hidden backdrop-blur-none">
        {/* Metal brand plaque */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>عداد الأجرة الرقمي</span>
          </div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">
            {cityConfig.nameAr} • {cityConfig.plateRegionAr}
          </span>
        </div>

        {/* LED Digital Display */}
        <div className="bg-black/90 border border-stone-800 rounded-lg p-2.5 mb-2.5 shadow-inner">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-stone-400 text-[11px] font-sans">الأجرة المستحقة</span>
            <span
              className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded ${
                taxiState.meterHired ? 'bg-red-900/80 text-red-200' : 'bg-emerald-900/80 text-emerald-200'
              }`}
            >
              {taxiState.meterHired ? 'مشغول (HIRED)' : 'شاغر (VACANT)'}
            </span>
          </div>

          <div className="flex items-baseline justify-between text-right">
            <span className="text-stone-500 text-xs font-sans">
              {cityConfig.currencySymbol} ({cityConfig.currencyAr})
            </span>
            <div className="text-3xl font-black text-amber-400 tracking-wider">
              {taxiState.meterHired ? taxiState.currentFare.toLocaleString() : (0).toLocaleString()}
            </div>
          </div>

          {/* Sub-readout for distance & base rate */}
          <div className="mt-2 pt-1.5 border-t border-stone-800/80 flex justify-between text-[11px] text-stone-400 font-sans">
            <div>
              <span>المسافة: </span>
              <span className="text-white font-mono font-bold">
                {taxiState.meterDistanceKm.toFixed(2)} كم
              </span>
            </div>
            <div>
              <span>التعرفة: </span>
              <span className="text-white font-mono">
                {cityConfig.perKmRate} {cityConfig.currencySymbol}/كم
              </span>
            </div>
          </div>
        </div>

        {/* Total Driver Earnings & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-300 px-1 font-sans">
          <div className="flex items-center gap-1">
            <span className="text-amber-400">💰 الأرباح:</span>
            <span className="font-bold text-white font-mono">
              {taxiState.totalEarnings.toLocaleString()} {cityConfig.currencySymbol}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-400">⭐ التقييم:</span>
            <span className="font-bold text-white">{taxiState.customerRating.toFixed(1)}</span>
            <span className="text-stone-500">({taxiState.tripsCompleted} مشوار)</span>
          </div>
        </div>
      </div>

      {/* Active Passenger Mission Card */}
      {currentPassenger && (
        <div
          className={`rounded-xl p-3 border shadow-xl transition-all ${
            missionStatus === 'onboard'
              ? 'bg-amber-950/90 border-amber-600/60 text-amber-50'
              : missionStatus === 'dropped'
              ? 'bg-emerald-950/90 border-emerald-600/60 text-emerald-50'
              : 'bg-stone-900/90 border-stone-700/70 text-stone-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
              {currentPassenger.avatarIcon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-sm text-white truncate">{currentPassenger.name}</span>
                  <span className="text-[10px] bg-stone-800/90 border border-stone-700 px-1 py-0.2 rounded text-amber-300 font-sans">
                    {currentPassenger.dialectFlag} {currentPassenger.dialectNameAr}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    missionStatus === 'onboard'
                      ? 'bg-amber-500/20 text-amber-300'
                      : missionStatus === 'dropped'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-sky-500/20 text-sky-300'
                  }`}
                >
                  {missionStatus === 'onboard'
                    ? 'في التاكسي 🚕'
                    : missionStatus === 'dropped'
                    ? 'تم التوصيل بنجاح! ✨'
                    : 'ينتظر على الرصيف 🙋‍♂️'}
                </span>
              </div>

              {/* Persona subtitle & Satisfaction */}
              <div className="flex items-center justify-between text-[11px] text-stone-300 mt-0.5">
                <span className="text-amber-400 font-medium">{currentPassenger.personaTitleAr}</span>
                {missionStatus === 'onboard' && (
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">
                    الرضا: {Math.round(currentPassenger.satisfaction)}%
                  </span>
                )}
              </div>

              {/* Destination */}
              <div className="text-xs text-stone-300 mt-1 flex items-center gap-1">
                <span className="text-amber-400">📍 الوجهة:</span>
                <span className="font-semibold text-white truncate">{currentPassenger.destinationName}</span>
              </div>

              {/* Passenger dialogue bubble */}
              <div className="mt-1.5 bg-black/40 rounded-lg p-2 text-xs italic text-amber-200 border-r-2 border-amber-400 leading-snug">
                "{currentPassenger.greetingAr}"
              </div>

              {/* Fare & Distance estimate */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-stone-300">
                <span>المسافة: ~{currentPassenger.distanceKm} كم</span>
                <span className="font-bold text-amber-400">
                  الأجرة: ~{currentPassenger.fareEstimate} {cityConfig.currencySymbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
