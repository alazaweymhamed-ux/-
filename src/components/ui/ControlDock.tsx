import React, { useState } from 'react';
import { ARAB_CITIES, ArabCity, CameraViewMode, TimeOfDay } from '../../types/game';
import { ArabicRadioHUD } from './ArabicRadioHUD';
import {
  Sun,
  Sunset,
  Moon,
  Camera,
  ChevronDown,
  ChevronUp,
  MapPin,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Disc,
} from 'lucide-react';

interface ControlDockProps {
  currentCity: ArabCity;
  onSelectCity: (city: ArabCity) => void;
  timeOfDay: TimeOfDay;
  onSelectTimeOfDay: (time: TimeOfDay) => void;
  cameraView: CameraViewMode;
  onSelectCameraView: (cam: CameraViewMode) => void;
  onTouchInput: (key: 'gas' | 'brake' | 'steerLeft' | 'steerRight' | 'handbrake', isDown: boolean) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  currentCity,
  onSelectCity,
  timeOfDay,
  onSelectTimeOfDay,
  cameraView,
  onSelectCameraView,
  onTouchInput,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'city' | 'environment' | 'touch' | 'help'>('city');

  const citiesList: ArabCity[] = ['cairo', 'baghdad', 'riyadh', 'casablanca', 'dubai'];

  const timeOptions: { id: TimeOfDay; label: string; icon: React.ReactNode }[] = [
    { id: 'day', label: 'نهار مشمس', icon: <Sun className="w-4 h-4 text-amber-400" /> },
    { id: 'sunset', label: 'غروب ساحر', icon: <Sunset className="w-4 h-4 text-orange-400" /> },
    { id: 'night', label: 'ليل عربي مشع', icon: <Moon className="w-4 h-4 text-sky-400" /> },
  ];

  const cameraOptions: { id: CameraViewMode; label: string }[] = [
    { id: 'chase', label: 'منظور خلفي' },
    { id: 'cockpit', label: 'قمرة السائق' },
    { id: 'hood', label: 'مقدمة التاكسي' },
    { id: 'orbit', label: 'كاميرا سينمائية' },
  ];

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto transition-transform duration-300"
      style={{
        maxWidth: 'min(940px, 95vw)',
        width: '100%',
        transform: isCollapsed ? 'translate(-50%, calc(100% - 32px))' : 'translate(-50%, 0)',
      }}
    >
      {/* Collapse / Expand Toggle Tab */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-1.5 bg-stone-900 border-t border-x border-stone-700/80 px-4 py-1.5 rounded-t-xl text-xs font-bold text-stone-200 shadow-lg hover:bg-stone-800 transition-colors cursor-pointer"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-4 h-4 text-amber-400" />
            <span>إظهار لوحة التحكم والمدن</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 text-amber-400" />
            <span>وضع السينما (إخفاء اللوحة)</span>
          </>
        )}
      </button>

      {/* Main Glassmorphic Dock Container */}
      <div className="w-full bg-stone-900/95 border-2 border-stone-700/80 rounded-2xl p-3 shadow-2xl text-white backdrop-blur-none">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('city')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'city'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>المدن والتاكسي</span>
            </button>

            <button
              onClick={() => setActiveTab('environment')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'environment'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span>الأجواء والكاميرا</span>
            </button>

            <button
              onClick={() => setActiveTab('touch')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'touch'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>🎮 أزرار القيادة</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طريقة اللعب</span>
            </button>
          </div>

          {/* Active city badge */}
          <div className="text-xs text-amber-300 font-bold hidden md:flex items-center gap-1">
            <span>المدينة الحالية:</span>
            <span className="text-white bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
              {ARAB_CITIES[currentCity].countryAr}
            </span>
          </div>
        </div>

        {/* Tab 1: City & Taxi Customization */}
        {activeTab === 'city' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {citiesList.map((cId) => {
              const c = ARAB_CITIES[cId];
              const isSelected = currentCity === cId;
              return (
                <button
                  key={cId}
                  onClick={() => onSelectCity(cId)}
                  className={`flex flex-col items-start p-2 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                      : 'bg-stone-800/60 border-stone-700 hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-black text-sm">{c.nameAr}</span>
                    <span className="text-xs">{c.countryAr.slice(-4)}</span>
                  </div>
                  <span className="text-[10px] text-amber-300/90 mt-0.5 font-semibold">
                    {c.taxiColors.roofSignText}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-500 inline-block"
                      style={{ backgroundColor: c.taxiColors.primary }}
                    />
                    {c.taxiColors.secondary && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-500 inline-block -mr-1"
                        style={{ backgroundColor: c.taxiColors.secondary }}
                      />
                    )}
                    <span className="text-[10px] text-stone-400 mr-1 font-mono">
                      {c.currencySymbol}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Environment & Camera */}
        {activeTab === 'environment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            {/* Time of Day */}
            <div>
              <span className="text-xs text-stone-400 font-semibold mb-1.5 block">
                توقيت اليوم والإضاءة:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onSelectTimeOfDay(opt.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      timeOfDay === opt.id
                        ? 'bg-amber-500 text-stone-950 font-black border-amber-400 shadow'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera View */}
            <div>
              <span className="text-xs text-stone-400 font-semibold mb-1.5 block">
                زاوية الكاميرا:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {cameraOptions.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => onSelectCameraView(cam.id)}
                    className={`flex items-center justify-center py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      cameraView === cam.id
                        ? 'bg-amber-500 text-stone-950 font-black border-amber-400 shadow'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
                    }`}
                  >
                    <span>{cam.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: On-screen Touch Controls (for mobile / mouse) */}
        {activeTab === 'touch' && (
          <div className="flex items-center justify-between gap-4 py-1">
            {/* Steering */}
            <div className="flex items-center gap-2">
              <button
                onPointerDown={() => onTouchInput('steerLeft', true)}
                onPointerUp={() => onTouchInput('steerLeft', false)}
                onPointerLeave={() => onTouchInput('steerLeft', false)}
                className="w-14 h-12 bg-stone-800 hover:bg-stone-750 active:bg-amber-500 active:text-stone-950 border border-stone-700 rounded-xl flex items-center justify-center font-bold text-sm shadow cursor-pointer select-none"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onPointerDown={() => onTouchInput('steerRight', true)}
                onPointerUp={() => onTouchInput('steerRight', false)}
                onPointerLeave={() => onTouchInput('steerRight', false)}
                className="w-14 h-12 bg-stone-800 hover:bg-stone-750 active:bg-amber-500 active:text-stone-950 border border-stone-700 rounded-xl flex items-center justify-center font-bold text-sm shadow cursor-pointer select-none"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Handbrake */}
            <button
              onPointerDown={() => onTouchInput('handbrake', true)}
              onPointerUp={() => onTouchInput('handbrake', false)}
              onPointerLeave={() => onTouchInput('handbrake', false)}
              className="px-4 h-12 bg-red-950/80 hover:bg-red-900 active:bg-red-600 border border-red-700 rounded-xl flex items-center justify-center font-bold text-xs text-red-200 shadow cursor-pointer select-none"
            >
              <Disc className="w-4 h-4 ml-1" />
              <span>فرامل اليد (درفت)</span>
            </button>

            {/* Gas & Brake */}
            <div className="flex items-center gap-2">
              <button
                onPointerDown={() => onTouchInput('brake', true)}
                onPointerUp={() => onTouchInput('brake', false)}
                onPointerLeave={() => onTouchInput('brake', false)}
                className="w-14 h-12 bg-rose-900/60 hover:bg-rose-800 active:bg-rose-600 border border-rose-700 rounded-xl flex flex-col items-center justify-center font-bold text-[10px] text-rose-200 shadow cursor-pointer select-none"
              >
                <ArrowDown className="w-4 h-4 mb-0.5" />
                <span>فرامل</span>
              </button>

              <button
                onPointerDown={() => onTouchInput('gas', true)}
                onPointerUp={() => onTouchInput('gas', false)}
                onPointerLeave={() => onTouchInput('gas', false)}
                className="w-16 h-12 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-500 border border-emerald-500 rounded-xl flex flex-col items-center justify-center font-black text-xs text-white shadow cursor-pointer select-none"
              >
                <ArrowUp className="w-5 h-5 mb-0.5" />
                <span>بنزين</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Instructions / Keyboard Shortcuts */}
        {activeTab === 'help' && (
          <div className="text-xs text-stone-300 space-y-1.5 py-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <span className="font-bold text-amber-400 block mb-0.5">W / ↑</span>
                <span>زيادة السرعة (دعسة بنزين)</span>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <span className="font-bold text-amber-400 block mb-0.5">S / ↓</span>
                <span>فرامل / رجوع للخلف (R)</span>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <span className="font-bold text-amber-400 block mb-0.5">A - D / ← →</span>
                <span>توجيه عجلة القيادة</span>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <span className="font-bold text-amber-400 block mb-0.5">Space / H / C</span>
                <span>فرامل يد / كلكس / تبديل الكاميرا</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-200/90 pt-1">
              💡 <span className="font-bold">نصيحة السائق:</span> قف داخل الدائرة الخضراء لنقل الراكب، ثم انطلق بالعداد إلى الدائرة البرتقالية لاستلام الأجرة والبقشيش!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
