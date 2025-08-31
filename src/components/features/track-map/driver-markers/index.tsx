'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { findCurrentLap, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { useMemo } from 'react';
import { useLapsStore } from '@/lib/stores/laps-store';

type DriverMarker = {
  driverNumber: number;
  point: { x: number; y: number };
  progress: number;
  hex: string;
  label: string;
};

interface DriverMarkerOverlayProps {
  pathRef: React.RefObject<SVGPathElement>;
  drivers: DriverDataMap;
  sessionStartTime: number;
  driverNumbersToShow?: number[];
  dotRadius?: number;
  showLabels?: boolean;
}

export const DriverMarkers = ({
  pathRef,
  drivers,
  sessionStartTime,
  driverNumbersToShow,
  dotRadius = 8,
  showLabels = true,
}: DriverMarkerOverlayProps) => {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const lapsByDriver = useLapsStore((state) => state.lapsByDriver);
  const path = pathRef.current;

  // compute path length once per render
  const totalPathLength = useMemo(() => (path ? path.getTotalLength() : 0), [path]);

  // Convert driver data to number array
  const driverList = useMemo(() => driverNumbersToShow ?? Object.keys(drivers).map(Number), [drivers, driverNumbersToShow]);

  const driverMarkers = useMemo(() => {
    const markers =
      driverList.length > 0
        ? driverList.map((driverNumber) => {
            const laps = lapsByDriver[driverNumber];

            if (!laps || laps.length === 0 || currentTime === null || totalPathLength === 0) return null;

            const currentLap = findCurrentLap(currentTime, laps, sessionStartTime);

            if (!currentLap) return null;

            const progress = getDriverLapProgress(currentLap.startLapTime, currentLap.lapDuration, currentTime);
            const distance = progress * totalPathLength;
            const point = path.getPointAtLength(distance);
            const hex = `#${drivers[driverNumber].team_colour}`;
            const label = drivers[driverNumber].name_acronym;

            return { driverNumber, point, progress, hex, label };
          })
        : [];

    return markers;
  }, [driverList, drivers, lapsByDriver, currentTime, totalPathLength, path, sessionStartTime]).filter(Boolean) as DriverMarker[];

  if (!path || currentTime === null || totalPathLength === 0) return null;

  return (
    <>
      {driverMarkers &&
        driverMarkers.reverse().map((driverMarker) => (
          <g key={driverMarker.driverNumber} transform={`translate(${driverMarker.point.x}, ${driverMarker.point.y})`}>
            <circle r={dotRadius} strokeWidth={1} style={{ fill: driverMarker.hex }} className="stroke-light" />

            {showLabels && (
              <>
                <rect
                  x={dotRadius + 5.5}
                  y={-10}
                  width={driverMarker.label.length * 8 + 12}
                  height={18}
                  style={{ fill: driverMarker.hex }}
                  rx={2} // rounded corners
                />

                <text fontWeight="bold" x={dotRadius + 8} y={4} fontSize={14} className="fill-light">
                  {driverMarker.label}
                </text>
              </>
            )}
          </g>
        ))}
    </>
  );
};
