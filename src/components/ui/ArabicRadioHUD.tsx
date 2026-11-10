import React, { useState } from 'react';
import { proceduralAudio } from '../../utils/proceduralAudio';
import { Radio, Volume2, VolumeX, SkipForward } from 'lucide-react';

export const ArabicRadioHUD: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentStationIdx, setCurrentStationIdx] = useState<number>(0);

  const stations = [
    { name: 'إذاعة أم كلثوم والزمن الجميل', desc: 'مقام البياتي - طرب أصيل' },
    { name: 'راديو فيروز ونفحات الصباح', desc: 'مقام الرست - أنغام شرقية' },
    { name: 'موجة العود العربي والتراث', desc: 'مقام الحجاز - تقاسيم وأوتار' },
    { name: 'شعبية ومهرجانات الشارع', desc: 'إيقاعات ودربكة شعبية' },
    { name: 'إذاعة القرآن الكريم والتواشيح', desc: 'سكينة وطمأنينة' },
  ];

  const handleToggleRadio = () => {
    const newState = proceduralAudio.toggleRadio();
    setIsPlaying(newState);
  };

  const handleNextStation = () => {
    const nextIdx = (currentStationIdx + 1) % stations.length;
    setCurrentStationIdx(nextIdx);
    proceduralAudio.setStation(nextIdx);
  };

  const handleToggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    proceduralAudio.setMuted(newMute);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-700/80 rounded-xl p-2.5 shadow-xl text-white font-sans max-w-xs w-full backdrop-blur-none">
      <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Radio className="w-4 h-4 text-amber-500" />
          <span>راديو التاكسي العربي FM</span>
        </div>

        <button
          onClick={handleToggleMute}
          title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          className="text-stone-400 hover:text-white p-1 rounded transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Station Banner */}
      <div className="bg-black/80 border border-stone-800 rounded-lg p-2 mb-2 flex items-center justify-between">
        <div className="min-w-0 pr-1">
          <div className="text-xs font-bold text-amber-300 truncate">
            {isPlaying ? stations[currentStationIdx].name : 'الراديو متوقف'}
          </div>
          <div className="text-[10px] text-stone-400 truncate">
            {isPlaying ? stations[currentStationIdx].desc : 'انقر تشغيل للاستماع للأغاني التراثية'}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleRadio}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              isPlaying
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-black'
            }`}
          >
            {isPlaying ? 'إيقاف' : 'تشغيل'}
          </button>

          {isPlaying && (
            <button
              onClick={handleNextStation}
              title="المحطة التالية"
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
