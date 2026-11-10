import React, { useState } from 'react';
import { ARAB_CITIES, ArabCity, Passenger, TaxiState } from '../../types/game';
import { Navigation, ZoomIn, ZoomOut, MapPin, Maximize2, Minimize2, Compass } from 'lucide-react';

interface MiniMapHUDProps {
  city: ArabCity;
  taxiState: TaxiState;
  currentPassenger: Passenger | null;
  missionStatus: 'searching' | 'onboard' | 'dropped';
}

export const MiniMapHUD: React.FC<MiniMapHUDProps> = ({
  city,
  taxiState,
  currentPassenger,
  missionStatus,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 0.6 (wide), 1.0 (standard), 1.6 (close-up)
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const cityConfig = ARAB_CITIES[city];

  // Map canvas dimensions
  const mapSize = 180;
  const halfMap = mapSize / 2;

  // World to map coordinate scale (meters to pixels)
  // At zoom 1.0, 1 world meter = ~1.2 pixels (showing approx 150m radius)
  const baseScale = 1.15 * zoomLevel;

  // Player position in world
  const taxiX = taxiState.posX || 4.8;
  const taxiZ = taxiState.posZ || 0;
  const taxiHeading = taxiState.heading || 0;

  // Convert a world coordinate (wx, wz) to mini-map pixel position relative to centered taxi
  // In our 3D world, Z is forward/backward along the avenue, X is left/right across lanes.
  const worldToMap = (wx: number, wz: number) => {
    const dx = wx - taxiX;
    const dz = wz - taxiZ;
    // Map center is (halfMap, halfMap)
    // Note: in 3D, +Z is forward along road; on 2D screen, -Y is up.
    return {
      x: halfMap + dx * baseScale,
      y: halfMap - dz * baseScale,
    };
  };

  // Target position (either pickup or dropoff depending on mission status)
  let targetWorldPos: { x: number; z: number } | null = null;
  let targetLabel = '';
  let targetIcon = '🟢';

  if (currentPassenger) {
    if (missionStatus === 'searching') {
      targetWorldPos = currentPassenger.pickupPos;
      targetLabel = 'موقع الراكب';
      targetIcon = '🙋‍♂️';
    } else if (missionStatus === 'onboard') {
      targetWorldPos = currentPassenger.dropoffPos;
      targetLabel = currentPassenger.destinationName;
      targetIcon = '📍';
    }
  }

  // Calculate distance to target in meters
  let distanceToTargetMeters = 0;
  let targetAngleRad = 0;
  if (targetWorldPos) {
    const dx = targetWorldPos.x - taxiX;
    const dz = targetWorldPos.z - taxiZ;
    distanceToTargetMeters = Math.round(Math.hypot(dx, dz));
    // Angle from taxi heading to target
    targetAngleRad = Math.atan2(dx, dz) - taxiHeading;
  }

  // Target map coordinates
  const targetMapPos = targetWorldPos ? worldToMap(targetWorldPos.x, targetWorldPos.z) : null;

  // Clamp target map marker to radar rim if it's off-screen
  let clampedTarget = null;
  if (targetMapPos) {
    const relX = targetMapPos.x - halfMap;
    const relY = targetMapPos.y - halfMap;
    const distFromCenter = Math.hypot(relX, relY);
    const maxRadius = halfMap - 12;

    if (distFromCenter > maxRadius) {
      const angle = Math.atan2(relY, relX);
      clampedTarget = {
        x: halfMap + Math.cos(angle) * maxRadius,
        y: halfMap + Math.sin(angle) * maxRadius,
        isOffscreen: true,
      };
    } else {
      clampedTarget = {
        x: targetMapPos.x,
        y: targetMapPos.y,
        isOffscreen: false,
      };
    }
  }

  // Major cross streets / landmarks in the city to draw on map
  const crossStreets = [
    { z: -180, name: 'شارع المعز' },
    { z: -90, name: 'طريق الكورنيش' },
    { z: 0, name: 'ميدان التحرير' },
    { z: 90, name: 'شارع الرشيد' },
    { z: 180, name: 'طريق الملك فهد' },
  ];

  const landmarks = [
    { x: -36, z: 50, icon: '🕌', name: 'جامع المدينة' },
    { x: 26, z: -40, icon: '🏪', name: 'الأسواق' },
    { x: -28, z: -120, icon: '🏥', name: 'المستشفى' },
  ];

  return (
    <div className="absolute bottom-24 right-4 z-20 flex flex-col items-end pointer-events-auto select-none">
      {/* Header bar with compass & toggle */}
      <div className="flex items-center justify-between w-full bg-stone-900/95 border-t border-x border-stone-700/80 px-2.5 py-1 rounded-t-xl text-[11px] font-bold text-stone-200 shadow-md">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Navigation className="w-3.5 h-3.5 rotate-45 text-amber-500" />
          <span>نظام الملاحة GPS</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom controls */}
          {!isMinimized && (
            <div className="flex items-center bg-stone-800 rounded p-0.5 border border-stone-700 ml-1">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 1.8))}
                className="p-0.5 hover:text-amber-400 text-stone-300 transition-colors"
                title="تكبير الخريطة"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.6))}
                className="p-0.5 hover:text-amber-400 text-stone-300 transition-colors"
                title="تصغير الخريطة"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-stone-400 hover:text-white p-0.5"
            title={isMinimized ? 'توسيع الخريطة' : 'تصغير'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Radar / Map Display */}
      {!isMinimized && (
        <div className="relative bg-stone-950/95 border-2 border-stone-700/80 rounded-b-xl shadow-2xl overflow-hidden p-1.5 backdrop-blur-none">
          {/* SVG Map Container */}
          <div
            className="relative rounded-lg overflow-hidden border border-stone-800 bg-[#121820]"
            style={{ width: `${mapSize}px`, height: `${mapSize}px` }}
          >
            <svg
              width={mapSize}
              height={mapSize}
              className="absolute inset-0"
              style={{ overflow: 'hidden' }}
            >
              {/* Background Radar Grid Rings */}
              <circle
                cx={halfMap}
                cy={halfMap}
                r={halfMap * 0.4}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle
                cx={halfMap}
                cy={halfMap}
                r={halfMap * 0.75}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <circle
                cx={halfMap}
                cy={halfMap}
                r={halfMap - 4}
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Cross streets (horizontal lines across boulevard) */}
              {crossStreets.map((st, i) => {
                const py = halfMap - (st.z - taxiZ) * baseScale;
                if (py < -30 || py > mapSize + 30) return null;
                return (
                  <g key={i}>
                    {/* Cross street road pavement */}
                    <rect
                      x="0"
                      y={py - 6 * baseScale}
                      width={mapSize}
                      height={12 * baseScale}
                      fill="#1f2937"
                      opacity="0.8"
                    />
                    {/* Street centerline */}
                    <line
                      x1="0"
                      y1={py}
                      x2={mapSize}
                      y2={py}
                      stroke="#475569"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    {/* Street Name text */}
                    <text
                      x="8"
                      y={py - 3}
                      fill="#94a3b8"
                      fontSize="8"
                      fontFamily="Cairo, sans-serif"
                    >
                      {st.name}
                    </text>
                  </g>
                );
              })}

              {/* Main Grand Avenue (Vertical boulevard) */}
              {(() => {
                const roadHalfWidth = 12 * baseScale; // roadWidth is 24m
                const roadCenterX = halfMap - taxiX * baseScale;

                return (
                  <g>
                    {/* Road asphalt corridor */}
                    <rect
                      x={roadCenterX - roadHalfWidth}
                      y="0"
                      width={roadHalfWidth * 2}
                      height={mapSize}
                      fill="#1e2632"
                    />
                    {/* Outer sidewalk curbs */}
                    <line
                      x1={roadCenterX - roadHalfWidth}
                      y1="0"
                      x2={roadCenterX - roadHalfWidth}
                      y2={mapSize}
                      stroke="#eab308"
                      strokeWidth="2"
                    />
                    <line
                      x1={roadCenterX + roadHalfWidth}
                      y1="0"
                      x2={roadCenterX + roadHalfWidth}
                      y2={mapSize}
                      stroke="#eab308"
                      strokeWidth="2"
                    />
                    {/* Central Median Divider */}
                    <rect
                      x={roadCenterX - 1.6 * baseScale}
                      y="0"
                      width={3.2 * baseScale}
                      height={mapSize}
                      fill="#065f46"
                    />
                    {/* Lane dashed lines */}
                    <line
                      x1={roadCenterX - 6 * baseScale}
                      y1="0"
                      x2={roadCenterX - 6 * baseScale}
                      y2={mapSize}
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeDasharray="6,8"
                      opacity="0.5"
                    />
                    <line
                      x1={roadCenterX + 6 * baseScale}
                      y1="0"
                      x2={roadCenterX + 6 * baseScale}
                      y2={mapSize}
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeDasharray="6,8"
                      opacity="0.5"
                    />
                  </g>
                );
              })()}

              {/* City Landmarks on Map */}
              {landmarks.map((lm, i) => {
                const pt = worldToMap(lm.x, lm.z);
                if (pt.x < -15 || pt.x > mapSize + 15 || pt.y < -15 || pt.y > mapSize + 15) return null;
                return (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <text
                      x={pt.x}
                      y={pt.y + 3}
                      fontSize="9"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {lm.icon}
                    </text>
                  </g>
                );
              })}

              {/* Target / Passenger Destination Marker */}
              {clampedTarget && (
                <g>
                  {/* Glowing beacon circle */}
                  <circle
                    cx={clampedTarget.x}
                    cy={clampedTarget.y}
                    r={clampedTarget.isOffscreen ? 11 : 9}
                    fill={missionStatus === 'searching' ? '#10b981' : '#f59e0b'}
                    opacity="0.35"
                  />
                  <circle
                    cx={clampedTarget.x}
                    cy={clampedTarget.y}
                    r={clampedTarget.isOffscreen ? 7 : 5}
                    fill={missionStatus === 'searching' ? '#10b981' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Target Icon label */}
                  <text
                    x={clampedTarget.x}
                    y={clampedTarget.y - 9}
                    fill={missionStatus === 'searching' ? '#34d399' : '#fbbf24'}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo, sans-serif"
                  >
                    {missionStatus === 'searching' ? 'الراكب' : 'الوجهة'}
                  </text>
                </g>
              )}

              {/* Player Taxi Icon in Center */}
              <g transform={`translate(${halfMap}, ${halfMap})`}>
                {/* Headlight cone beam */}
                <path
                  d="M0,0 L-18,-36 L18,-36 Z"
                  fill="url(#headlightGradient)"
                  transform={`rotate(${(taxiHeading * 180) / Math.PI})`}
                  opacity="0.4"
                />

                {/* Taxi triangle pointer pointing along heading */}
                <g transform={`rotate(${(taxiHeading * 180) / Math.PI})`}>
                  {/* Taxi vehicle silhouette */}
                  <polygon
                    points="0,-10 6,8 0,5 -6,8"
                    fill="#f59e0b"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  {/* Roof light dot */}
                  <circle cx="0" cy="0" r="2" fill="#ef4444" />
                </g>
              </g>

              {/* Gradients */}
              <defs>
                <linearGradient id="headlightGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* North Compass Indicator in top-left */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded border border-stone-700 text-[9px] font-bold text-amber-400">
              <Compass className="w-3 h-3 text-red-400" />
              <span>ش</span>
            </div>
          </div>

          {/* Distance & Destination Info Ribbon */}
          {targetWorldPos && (
            <div className="mt-1.5 bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-right font-sans">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-amber-400 font-bold truncate max-w-[110px]">
                  {targetIcon} {targetLabel}
                </span>
                <span className="text-white font-mono font-bold">
                  {distanceToTargetMeters > 1000
                    ? `${(distanceToTargetMeters / 1000).toFixed(1)} كم`
                    : `${distanceToTargetMeters} م`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
