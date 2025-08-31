'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { findCurrentLap, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { useMemo } from 'react';
import { useLapsStore } from '@/lib/stores/laps-store';

const getMarkerDetails = (
  currentLap: ReturnType<typeof findCurrentLap>,
  currentTime: number,
  totalPathLength: number,
  path: SVGPathElement,
  drivers: DriverDataMap,
  driverNumber: number,
) => {
  const progress = getDriverLapProgress(currentLap!.startLapTime, currentLap!.lapDuration, currentTime);
  const distance = progress * totalPathLength;

  // Returns x, y for a point on the path at a certain distance along the path
  const point = path.getPointAtLength(distance);
  const hex = `#${drivers[driverNumber].team_colour ?? '000'}`;
  const label = drivers[driverNumber].name_acronym;

  return { driverNumber, point, progress, hex, label };
};

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
  driverNumbersToShow?: number[];
  dotRadius?: number;
  showLabels?: boolean;
}

export const DriverMarkers = ({
  pathRef,
  drivers,
  driverNumbersToShow,
  dotRadius = 8,
  showLabels = true,
}: DriverMarkerOverlayProps) => {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);
  const lapsByDriver = useLapsStore((state) => state.lapsByDriver);
  const path = pathRef.current;

  const totalPathLength = useMemo(() => (path ? path.getTotalLength() : 0), [path]);
  const driverNumbers = Object.keys(drivers).map(Number);

  const driverList = useMemo(() => driverNumbersToShow ?? driverNumbers, [driverNumbers, driverNumbersToShow]);

  const driverMarkers = useMemo(() => {
    const markers =
      driverList.length > 0
        ? driverList.map((driverNumber) => {
            const laps = lapsByDriver[driverNumber];

            if (!laps || laps.length === 0 || currentTime === null || totalPathLength === 0 || sessionStartTime === null) {
              return null;
            }

            const currentLap = findCurrentLap(currentTime, laps, sessionStartTime);

            if (!currentLap) return null;

            const { point, progress, hex, label } = getMarkerDetails(
              currentLap,
              currentTime,
              totalPathLength,
              path,
              drivers,
              driverNumber,
            );

            return { driverNumber, point, progress, hex, label };
          })
        : [];

    return markers;
  }, [driverList, lapsByDriver, currentTime]).filter(Boolean) as DriverMarker[];

  if (!driverMarkers || driverMarkers.length === 0) return null;

  return (
    <>
      {driverMarkers.toReversed().map((driverMarker) => (
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
