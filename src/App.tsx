import React, { useState, useEffect, useCallback } from 'react';
import {
  ArabicDialect,
  ArabCity,
  CameraViewMode,
  DailyObjective,
  DialogueOption,
  Passenger,
  TaxiState,
  TimeOfDay,
} from './types/game';
import { TaxiCanvas } from './components/3d/TaxiCanvas';
import { SpeedometerHUD } from './components/ui/SpeedometerHUD';
import { TaximeterHUD } from './components/ui/TaximeterHUD';
import { ArabicRadioHUD } from './components/ui/ArabicRadioHUD';
import { MiniMapHUD } from './components/ui/MiniMapHUD';
import { DailyObjectivesHUD } from './components/ui/DailyObjectivesHUD';
import { PassengerInteractionHUD } from './components/ui/PassengerInteractionHUD';
import { ControlDock } from './components/ui/ControlDock';
import { proceduralAudio } from './utils/proceduralAudio';
import { generateDailyObjectives } from './utils/dailyObjectives';
import { Car } from 'lucide-react';

export default function App() {
  const [city, setCity] = useState<ArabCity>('cairo');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('sunset');
  const [cameraView, setCameraView] = useState<CameraViewMode>('chase');
  const [selectedDialect, setSelectedDialect] = useState<ArabicDialect | 'auto'>('auto');
  const [hornTrigger, setHornTrigger] = useState<number>(0);
  const [acActive, setAcActive] = useState<boolean>(false);
  const [fulfillRequestTrigger, setFulfillRequestTrigger] = useState<number>(0);
  const [apologyTrigger, setApologyTrigger] = useState<number>(0);
  const [blessingTrigger, setBlessingTrigger] = useState<number>(0);
  const [activeDialogueOption, setActiveDialogueOption] = useState<DialogueOption | null>(null);

  const handleHonk = useCallback(() => {
    proceduralAudio.playHorn(true);
    setHornTrigger((prev) => prev + 1);
  }, []);

  const handleToggleAc = useCallback(() => {
    setAcActive((prev) => {
      const next = !prev;
      proceduralAudio.playAcToggleSound(next);
      return next;
    });
    setFulfillRequestTrigger((prev) => prev + 1);
  }, []);

  const handleApologize = useCallback(() => {
    setApologyTrigger((prev) => prev + 1);
  }, []);

  const handleBlessing = useCallback(() => {
    setBlessingTrigger((prev) => prev + 1);
  }, []);

  const handleFulfillRequest = useCallback(() => {
    setFulfillRequestTrigger((prev) => prev + 1);
  }, []);

  const handleSelectDialogueOption = useCallback((option: DialogueOption) => {
    setActiveDialogueOption(option);
  }, []);

  // Daily Objectives
  const [objectives, setObjectives] = useState<DailyObjective[]>(() => generateDailyObjectives('cairo'));

  // Input states (Keyboard + Touch)
  const [keys, setKeys] = useState({
    gas: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    handbrake: false,
  });

  const [touchControls, setTouchControls] = useState({
    gas: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    handbrake: false,
  });

  // Combined input state
  const combinedInput = {
    gas: keys.gas || touchControls.gas,
    brake: keys.brake || touchControls.brake,
    steerLeft: keys.steerLeft || touchControls.steerLeft,
    steerRight: keys.steerRight || touchControls.steerRight,
    handbrake: keys.handbrake || touchControls.handbrake,
  };

  // Taxi runtime state
  const [taxiState, setTaxiState] = useState<TaxiState>({
    speedKmh: 0,
    rpm: 800,
    gear: 'D',
    steeringAngle: 0,
    headlightsOn: true,
    hazardLightsOn: false,
    meterHired: false,
    meterDistanceKm: 0,
    currentFare: 0,
    totalEarnings: 0,
    tripsCompleted: 0,
    customerRating: 5.0,
    posX: 4.8,
    posZ: 0,
    heading: 0,
    driverXp: 0,
    driverLevel: 1,
    acActive: false,
    drivingStyle: 'normal',
    comfortScore: 92,
    totalSatisfiedPassengers: 0,
  });

  // Passenger mission
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);
  const [missionStatus, setMissionStatus] = useState<'searching' | 'onboard' | 'dropped'>('searching');

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp') {
        setKeys((prev) => ({ ...prev, gas: true }));
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        setKeys((prev) => ({ ...prev, brake: true }));
      } else if (code === 'KeyA' || code === 'ArrowLeft') {
        setKeys((prev) => ({ ...prev, steerLeft: true }));
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        setKeys((prev) => ({ ...prev, steerRight: true }));
      } else if (code === 'Space') {
        setKeys((prev) => ({ ...prev, handbrake: true }));
      } else if (key === 'h') {
        handleHonk();
      } else if (key === 'c') {
        setCameraView((prev) => {
          const views: CameraViewMode[] = ['chase', 'cockpit', 'hood', 'orbit'];
          const nextIdx = (views.indexOf(prev) + 1) % views.length;
          return views[nextIdx];
        });
      } else if (key === 'r') {
        proceduralAudio.toggleRadio();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') {
        setKeys((prev) => ({ ...prev, gas: false }));
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        setKeys((prev) => ({ ...prev, brake: false }));
      } else if (code === 'KeyA' || code === 'ArrowLeft') {
        setKeys((prev) => ({ ...prev, steerLeft: false }));
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        setKeys((prev) => ({ ...prev, steerRight: false }));
      } else if (code === 'Space') {
        setKeys((prev) => ({ ...prev, handbrake: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleHonk]);

  const handleCityChange = useCallback((newCity: ArabCity) => {
    setCity(newCity);
    setObjectives(generateDailyObjectives(newCity));
  }, []);

  const handleTouchInput = useCallback(
    (key: 'gas' | 'brake' | 'steerLeft' | 'steerRight' | 'handbrake', isDown: boolean) => {
      setTouchControls((prev) => ({ ...prev, [key]: isDown }));
    },
    []
  );

  const handleStateUpdate = useCallback((newState: TaxiState) => {
    setTaxiState((prev) => {
      const merged = { ...newState, driverXp: prev.driverXp, driverLevel: prev.driverLevel };
      setObjectives((prevObjs) =>
        prevObjs.map((obj) => {
          if (obj.category === 'distance') {
            const currentDist = Number(
              (
                obj.currentValue +
                (newState.meterDistanceKm > prev.meterDistanceKm
                  ? newState.meterDistanceKm - prev.meterDistanceKm
                  : 0)
              ).toFixed(2)
            );
            const isCompleted = currentDist >= obj.targetValue;
            return {
              ...obj,
              currentValue: currentDist,
              isCompleted: obj.isCompleted || isCompleted,
            };
          }
          return obj;
        })
      );
      return merged;
    });
  }, []);

  const handlePassengerUpdate = useCallback(
    (passenger: Passenger | null, status: 'searching' | 'onboard' | 'dropped') => {
      setCurrentPassenger(passenger);
      setMissionStatus(status);

      if (status === 'dropped' && passenger) {
        setObjectives((prevObjs) =>
          prevObjs.map((obj) => {
            let increment = 0;
            if (obj.category === 'airport') {
              increment = 1;
            } else if (obj.category === 'night_shift' && timeOfDay === 'night') {
              increment = 1;
            } else if (obj.category === 'earnings') {
              const currentVal = obj.currentValue + passenger.fareEstimate;
              return {
                ...obj,
                currentValue: currentVal,
                isCompleted: currentVal >= obj.targetValue,
              };
            }

            if (increment > 0) {
              const newVal = obj.currentValue + increment;
              return {
                ...obj,
                currentValue: newVal,
                isCompleted: newVal >= obj.targetValue,
              };
            }
            return obj;
          })
        );
      }
    },
    [timeOfDay]
  );

  const handleClaimReward = useCallback((objectiveId: string) => {
    setObjectives((prevObjs) => {
      const targetObj = prevObjs.find((o) => o.id === objectiveId);
      if (!targetObj || targetObj.claimed) return prevObjs;

      setTaxiState((prev) => {
        const newXp = prev.driverXp + targetObj.rewardXp;
        const newLevel = Math.floor(newXp / 200) + 1;
        return {
          ...prev,
          totalEarnings: prev.totalEarnings + targetObj.rewardCurrency,
          driverXp: newXp,
          driverLevel: newLevel,
        };
      });

      return prevObjs.map((o) => (o.id === objectiveId ? { ...o, claimed: true } : o));
    });
  }, []);

  return (
    <div dir="rtl" className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* 1. 3D WebGL Canvas Layer (100% Unobstructed Center Viewport) */}
      <div className="absolute inset-0 z-0">
        <TaxiCanvas
          key={`${city}-${timeOfDay}`}
          city={city}
          timeOfDay={timeOfDay}
          cameraView={cameraView}
          selectedDialect={selectedDialect}
          hornTrigger={hornTrigger}
          inputState={combinedInput}
          acActive={acActive}
          fulfillRequestTrigger={fulfillRequestTrigger}
          apologyTrigger={apologyTrigger}
          blessingTrigger={blessingTrigger}
          activeDialogueOption={activeDialogueOption}
          onStateUpdate={handleStateUpdate}
          onPassengerUpdate={handlePassengerUpdate}
        />
      </div>

      {/* 2. Top-Center Title / Spec Badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="inline-flex items-center gap-2 bg-stone-900/90 border border-stone-700/80 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-none">
          <Car className="w-4 h-4 text-amber-400" />
          <h1 className="text-sm font-black text-white tracking-wide">محاكي التاكسي العربي</h1>
          <span className="text-stone-500 text-xs">|</span>
          <span className="text-xs font-semibold text-amber-300">تفاعل الركاب واللهجات العربية</span>
        </div>
      </div>

      {/* 3. Speedometer & Instrument Cluster (Top-Left) */}
      <SpeedometerHUD taxiState={taxiState} onHonk={handleHonk} />

      {/* 4. Taximeter & Active Passenger Card (Top-Right) */}
      <TaximeterHUD
        city={city}
        taxiState={taxiState}
        currentPassenger={currentPassenger}
        missionStatus={missionStatus}
      />

      {/* 5. Daily Objectives & Progression Card (Right-side below Taximeter) */}
      <DailyObjectivesHUD
        city={city}
        taxiState={taxiState}
        objectives={objectives}
        onClaimReward={handleClaimReward}
      />

      {/* 6. Arabic Radio HUD (Mid-Left Floating Player) */}
      <div className="absolute top-36 left-4 z-20 pointer-events-auto">
        <ArabicRadioHUD />
      </div>

      {/* 7. In-Cab Interactive Passenger Console & Arabic Dialect Dialogue HUD (Bottom-Left) */}
      <PassengerInteractionHUD
        passenger={currentPassenger}
        missionStatus={missionStatus}
        taxiState={taxiState}
        selectedDialect={selectedDialect}
        onSelectDialect={setSelectedDialect}
        onFulfillRequest={handleFulfillRequest}
        onSelectDialogueOption={handleSelectDialogueOption}
        onToggleAc={handleToggleAc}
        onApologize={handleApologize}
        onBlessing={handleBlessing}
      />

      {/* 8. GPS Mini-Map HUD (Bottom-Right Corner) */}
      <MiniMapHUD
        city={city}
        taxiState={taxiState}
        currentPassenger={currentPassenger}
        missionStatus={missionStatus}
      />

      {/* 9. Unified Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      <ControlDock
        currentCity={city}
        onSelectCity={handleCityChange}
        timeOfDay={timeOfDay}
        onSelectTimeOfDay={setTimeOfDay}
        cameraView={cameraView}
        onSelectCameraView={setCameraView}
        onTouchInput={handleTouchInput}
      />
    </div>
  );
}
