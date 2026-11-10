import React, { useState } from 'react';
import { ARAB_CITIES, ArabCity, DailyObjective, TaxiState } from '../../types/game';
import { Award, CheckCircle2, ChevronRight, Gift, Trophy, X, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { proceduralAudio } from '../../utils/proceduralAudio';

interface DailyObjectivesHUDProps {
  city: ArabCity;
  taxiState: TaxiState;
  objectives: DailyObjective[];
  onClaimReward: (objectiveId: string) => void;
}

export const DailyObjectivesHUD: React.FC<DailyObjectivesHUDProps> = ({
  city,
  taxiState,
  objectives,
  onClaimReward,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cityConfig = ARAB_CITIES[city];

  // Active / Pinned objective (first uncompleted or first claimable)
  const claimableCount = objectives.filter((o) => o.isCompleted && !o.claimed).length;
  const activeObjective =
    objectives.find((o) => o.isCompleted && !o.claimed) ||
    objectives.find((o) => !o.isCompleted) ||
    objectives[0];

  const handleClaim = (id: string) => {
    proceduralAudio.playPaymentSound();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });
    onClaimReward(id);
  };

  return (
    <>
      {/* 1. Pinned Active Objective Mini-Banner (Top Right below Taximeter) */}
      <div className="absolute top-[230px] right-4 z-20 pointer-events-auto max-w-xs w-full select-none">
        <div
          onClick={() => setIsOpen(true)}
          className={`rounded-xl p-2.5 border shadow-xl cursor-pointer transition-all hover:scale-[1.02] ${
            claimableCount > 0
              ? 'bg-gradient-to-r from-amber-950/95 to-stone-900/95 border-amber-500 text-white animate-pulse'
              : 'bg-stone-900/95 border-stone-700/80 text-stone-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>المهمة اليومية النشطة</span>
              {claimableCount > 0 && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {claimableCount} جاهزة!
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 hover:text-white flex items-center">
              عرض الكل
              <ChevronRight className="w-3 h-3 rotate-180 inline" />
            </span>
          </div>

          {activeObjective && (
            <div>
              <div className="flex items-baseline justify-between text-xs font-bold text-stone-100">
                <span className="truncate max-w-[190px]">
                  {activeObjective.icon} {activeObjective.titleAr}
                </span>
                <span className="text-amber-400 font-mono text-[11px]">
                  {activeObjective.category === 'distance'
                    ? `${activeObjective.currentValue.toFixed(1)} / ${activeObjective.targetValue} كم`
                    : `${Math.min(activeObjective.currentValue, activeObjective.targetValue)} / ${activeObjective.targetValue}`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-800 rounded-full h-1.5 mt-1.5 overflow-hidden border border-stone-700">
                <div
                  className={`h-full transition-all duration-300 ${
                    activeObjective.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (activeObjective.currentValue / activeObjective.targetValue) * 100
                    )}%`,
                  }}
                />
              </div>

              {/* Reward preview */}
              <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400">
                <span>المكافأة:</span>
                <span className="text-amber-300 font-bold font-mono">
                  +{activeObjective.rewardCurrency.toLocaleString()} {cityConfig.currencySymbol}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Full Daily Objectives Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-2xl p-5 text-white font-sans max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-stone-800 pb-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">المهام اليومية لسائق التاكسي</h2>
                <p className="text-xs text-stone-400">
                  أنجز مهام التوصيل في {cityConfig.nameAr} واكسب مكافآت نقدية ونقاط خبرة (XP)
                </p>
              </div>
            </div>

            {/* Driver Level & Progression Card */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center font-black text-emerald-400 text-sm">
                  {taxiState.driverLevel || 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>رتبة السائق:</span>
                    <span className="text-amber-400">
                      {(taxiState.driverLevel || 1) >= 3 ? 'كابتن مخضرم 🎖️' : 'سائق معتمد ⭐'}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400">
                    الخبرة: {taxiState.driverXp || 0} XP
                  </div>
                </div>
              </div>

              <div className="text-left text-xs">
                <div className="text-[10px] text-stone-400">المشاوير المكتملة</div>
                <div className="font-bold text-amber-400 font-mono text-sm">
                  {taxiState.tripsCompleted} مشوار
                </div>
              </div>
            </div>

            {/* Objectives List */}
            <div className="space-y-3">
              {objectives.map((obj) => {
                const progressPct = Math.min(100, (obj.currentValue / obj.targetValue) * 100);

                return (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      obj.claimed
                        ? 'bg-stone-950/60 border-stone-800 opacity-60'
                        : obj.isCompleted
                        ? 'bg-gradient-to-r from-amber-950/40 to-emerald-950/40 border-amber-500/80 shadow-lg'
                        : 'bg-stone-800/60 border-stone-700/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl mt-0.5">{obj.icon}</span>
                        <div>
                          <h3 className="text-sm font-black text-white">{obj.titleAr}</h3>
                          <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                            {obj.descriptionAr}
                          </p>

                          {/* Rewards Badge */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              <span>
                                +{obj.rewardCurrency.toLocaleString()} {cityConfig.currencySymbol}
                              </span>
                            </span>
                            <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <span>+{obj.rewardXp} XP</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 pt-1">
                        {obj.claimed ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>مكتملة</span>
                          </div>
                        ) : obj.isCompleted ? (
                          <button
                            onClick={() => handleClaim(obj.id)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer animate-bounce"
                          >
                            استلام المكافأة!
                          </button>
                        ) : (
                          <span className="text-stone-400 text-xs font-mono font-bold bg-stone-900 px-2 py-1 rounded border border-stone-800">
                            {obj.category === 'distance'
                              ? `${obj.currentValue.toFixed(1)} / ${obj.targetValue} كم`
                              : `${obj.currentValue} / ${obj.targetValue}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {!obj.claimed && (
                      <div className="w-full bg-stone-900 rounded-full h-2 mt-3 overflow-hidden border border-stone-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            obj.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer reset info */}
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>تتجدد المهام يومياً عند منتصف الليل</span>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
