import React, { useState, useEffect } from 'react';
import {
  ArabicDialect,
  ARABIC_DIALECTS,
  DialogueOption,
  Passenger,
  TaxiState,
} from '../../types/game';
import { proceduralAudio } from '../../utils/proceduralAudio';
import {
  Fan,
  Radio,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Volume2,
  ChevronDown,
  ChevronUp,
  Globe2,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react';

interface PassengerInteractionHUDProps {
  passenger: Passenger | null;
  missionStatus: 'searching' | 'onboard' | 'dropped';
  taxiState: TaxiState;
  selectedDialect: ArabicDialect | 'auto';
  onSelectDialect: (dialect: ArabicDialect | 'auto') => void;
  onFulfillRequest: () => void;
  onSelectDialogueOption: (option: DialogueOption) => void;
  onToggleAc: () => void;
  onApologize: () => void;
  onBlessing: () => void;
}

export const PassengerInteractionHUD: React.FC<PassengerInteractionHUDProps> = ({
  passenger,
  missionStatus,
  taxiState,
  selectedDialect,
  onSelectDialect,
  onFulfillRequest,
  onSelectDialogueOption,
  onToggleAc,
  onApologize,
  onBlessing,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDialectSelector, setShowDialectSelector] = useState(false);

  // Keyboard shortcut listener for dialogue options and cab actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      const key = e.key.toLowerCase();

      // Dialogue choices [1], [2], [3]
      if (passenger && passenger.conversationHistory.length > 0) {
        const lastMsg = passenger.conversationHistory[passenger.conversationHistory.length - 1];
        if (lastMsg && lastMsg.options && lastMsg.options.length > 0) {
          if (key === '1' && lastMsg.options[0]) {
            e.preventDefault();
            onSelectDialogueOption(lastMsg.options[0]);
            return;
          }
          if (key === '2' && lastMsg.options[1]) {
            e.preventDefault();
            onSelectDialogueOption(lastMsg.options[1]);
            return;
          }
          if (key === '3' && lastMsg.options[2]) {
            e.preventDefault();
            onSelectDialogueOption(lastMsg.options[2]);
            return;
          }
        }
      }

      // Quick hotkeys
      if (key === 't') {
        e.preventDefault();
        onToggleAc();
      } else if (key === 'x') {
        e.preventDefault();
        onApologize();
      } else if (key === 'b') {
        e.preventDefault();
        onBlessing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passenger, onSelectDialogueOption, onToggleAc, onApologize, onBlessing]);

  if (!passenger) return null;

  // Active dialogue with pending options
  const pendingDialogue =
    passenger.conversationHistory.length > 0
      ? passenger.conversationHistory[passenger.conversationHistory.length - 1]
      : null;

  const hasOptions = pendingDialogue?.options && pendingDialogue.options.length > 0;

  // Mood color & icon
  const getMoodBadge = () => {
    switch (passenger.currentMood) {
      case 'thrilled':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'منبهر وسعيد جداً',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          barColor: 'from-emerald-500 to-teal-400',
        };
      case 'happy':
        return {
          icon: <Smile className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'مبسوط ومرتاح',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          barColor: 'from-emerald-500 to-green-400',
        };
      case 'neutral':
        return {
          icon: <Meh className="w-3.5 h-3.5 text-amber-400" />,
          label: 'هادئ وطبيعي',
          color: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
          barColor: 'from-amber-500 to-yellow-400',
        };
      case 'nervous':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
          label: 'قلقان ومضطرب',
          color: 'bg-orange-950/80 text-orange-300 border-orange-500/50',
          barColor: 'from-orange-500 to-amber-500',
        };
      case 'angry':
        return {
          icon: <Frown className="w-3.5 h-3.5 text-rose-400" />,
          label: 'معصب وفزع!',
          color: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          barColor: 'from-rose-600 to-red-500',
        };
    }
  };

  const moodInfo = getMoodBadge();

  // Driving style badge
  const getDrivingStyleBadge = () => {
    switch (taxiState.drivingStyle) {
      case 'smooth':
        return { label: 'سياقة سلسة وراقية 🌟', color: 'text-emerald-400' };
      case 'aggressive':
        return { label: 'فرامل أو انعطاف حاد ⚠️', color: 'text-rose-400 font-bold animate-pulse' };
      case 'erratic':
        return { label: 'سرعة مفرطة أو رصيف 🚨', color: 'text-red-500 font-black animate-bounce' };
      default:
        return { label: 'سياقة معتادة 🟢', color: 'text-stone-300' };
    }
  };

  const styleBadge = getDrivingStyleBadge();

  return (
    <div className="absolute bottom-20 left-4 z-20 w-84 max-w-[92vw] pointer-events-auto font-sans transition-all">
      <div className="bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-stone-950/95 border-2 border-amber-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-white overflow-hidden relative">
        {/* Subtle decorative Islamic arch geometric glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow">{passenger.avatarIcon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-amber-200 truncate max-w-[140px]">
                  {passenger.name}
                </span>
                <span className="text-[10px] bg-stone-800/90 border border-stone-700 px-1.5 py-0.5 rounded text-stone-300">
                  {passenger.dialectFlag} {passenger.dialectNameAr}
                </span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-medium block">
                {passenger.personaTitleAr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Dialect Switcher Button */}
            <button
              onClick={() => setShowDialectSelector((prev) => !prev)}
              title="تغيير لهجة الركاب"
              className="p-1 rounded bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors text-xs flex items-center gap-1 border border-stone-700"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1 rounded bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dialect Selection Popup */}
        {showDialectSelector && (
          <div className="mb-2 p-2 bg-stone-950/95 border border-amber-500/40 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-stone-400 pb-1 border-b border-stone-800 text-[11px]">
              <span className="font-bold text-amber-300">اختر لهجة الركاب:</span>
              <span className="text-[10px]">تؤثر على الكلام وردود الأفعال</span>
            </div>
            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => {
                  onSelectDialect('auto');
                  setShowDialectSelector(false);
                }}
                className={`px-2 py-1.5 rounded text-right transition-colors ${
                  selectedDialect === 'auto'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-500/60 font-bold'
                    : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                🌍 تلقائي (متنوع)
              </button>
              {(Object.keys(ARABIC_DIALECTS) as ArabicDialect[]).map((dKey) => {
                const d = ARABIC_DIALECTS[dKey];
                return (
                  <button
                    key={dKey}
                    onClick={() => {
                      onSelectDialect(dKey);
                      setShowDialectSelector(false);
                    }}
                    className={`px-2 py-1.5 rounded text-right transition-colors ${
                      selectedDialect === dKey
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-500/60 font-bold'
                        : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {d.flag} {d.nameAr}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="space-y-2.5">
            {/* Passenger Satisfaction & Comfort Bar */}
            <div className="bg-black/60 rounded-xl p-2 border border-stone-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-400 font-medium flex items-center gap-1">
                  مزاج ورضا الراكب
                </span>
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${moodInfo.color}`}
                >
                  {moodInfo.icon}
                  <span>{moodInfo.label}</span>
                  <span className="font-mono">({Math.round(passenger.satisfaction)}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${moodInfo.barColor} transition-all duration-300`}
                  style={{ width: `${Math.max(5, Math.min(100, passenger.satisfaction))}%` }}
                />
              </div>

              {/* Driving Style Live Assessment */}
              <div className="flex items-center justify-between mt-1.5 text-[11px] text-stone-400">
                <span>أسلوب القيادة:</span>
                <span className={`font-semibold ${styleBadge.color}`}>{styleBadge.label}</span>
              </div>
            </div>

            {/* Active Request Alert (طلب الراكب أثناء الرحلة) */}
            {passenger.activeRequest && !passenger.activeRequest.fulfilled && !passenger.activeRequest.expired && (
              <div className="bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-500/70 rounded-xl p-2.5 shadow-lg animate-pulse">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    طلب خاص من الراكب!
                  </span>
                  <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    ⏱️ {Math.ceil(passenger.activeRequest.remainingSeconds)} ث
                  </span>
                </div>

                <p className="text-xs text-amber-100 font-semibold mb-2 italic">
                  "{passenger.activeRequest.promptAr}"
                </p>

                <button
                  onClick={onFulfillRequest}
                  className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95 cursor-pointer"
                >
                  <span>{passenger.activeRequest.actionLabelAr}</span>
                  <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-stone-900 font-mono">
                    +{passenger.activeRequest.rewardTipPercent}% إكرامية
                  </span>
                </button>
              </div>
            )}

            {/* Passenger Live Dialogue Speech Bubble */}
            {pendingDialogue && (
              <div className="bg-stone-950/80 rounded-xl p-2.5 border border-stone-800 space-y-2">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-0.5">
                      <span className="font-semibold text-amber-300">حديث الراكب:</span>
                      {pendingDialogue.moodIndicator && (
                        <span className="text-[10px] text-stone-400">{pendingDialogue.moodIndicator}</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-100 leading-relaxed font-sans font-medium">
                      "{pendingDialogue.textAr}"
                    </p>
                  </div>
                </div>

                {/* Interactive Driver Response Options [1], [2], [3] */}
                {hasOptions && (
                  <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                    <span className="text-[10px] text-amber-400/90 font-bold block">
                      اختر رد السائق (أو اضغط 1, 2, 3 على الكيبورد):
                    </span>
                    {pendingDialogue.options!.map((opt, idx) => (
                      <button
                        key={opt.id}
                        onClick={() => onSelectDialogueOption(opt)}
                        className="w-full text-right p-2 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/60 transition-all text-xs flex items-center justify-between gap-2 group cursor-pointer"
                      >
                        <span className="text-stone-200 group-hover:text-amber-200 transition-colors leading-snug">
                          {opt.textAr}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">
                            +{opt.effectOnSatisfaction}%
                          </span>
                          <span className="text-[10px] bg-stone-800 text-amber-400 font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* In-Cab Taxi Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
              {/* AC Button */}
              <button
                onClick={onToggleAc}
                title="تشغيل أو إطفاء تكييف التاكسي [T]"
                className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1 transition-all ${
                  taxiState.acActive
                    ? 'bg-sky-950/90 border-sky-500 text-sky-200 shadow-md'
                    : 'bg-stone-900/80 border-stone-700/80 text-stone-400 hover:text-sky-300 hover:border-sky-700'
                }`}
              >
                <Fan className={`w-3.5 h-3.5 ${taxiState.acActive ? 'animate-spin' : ''}`} />
                <span>المكيف {taxiState.acActive ? 'شغال' : 'مطفأ'}</span>
                <span className="text-[9px] text-stone-500 font-mono">[T]</span>
              </button>

              {/* Apologize button */}
              <button
                onClick={onApologize}
                title="اعتذار للراكب عند الفرملة القوية أو المطبات [X]"
                className="py-1.5 px-2 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-600/60 text-stone-300 hover:text-amber-300 transition-colors flex items-center justify-center gap-1"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                <span>اعتذار للراكب</span>
                <span className="text-[9px] text-stone-500 font-mono">[X]</span>
              </button>

              {/* Passenger Blessing / Travel prayer */}
              <button
                onClick={onBlessing}
                title="دعاء السفر والسكينة لتهدئة الركاب [B]"
                className="py-1.5 px-2 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 hover:border-emerald-600/60 text-stone-300 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>دعاء السفر</span>
                <span className="text-[9px] text-stone-500 font-mono">[B]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
