'use client';

import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { findCurrentLap, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { type DriverDataMapWithQualifyingPosition } from '@/server-functions/api/get-session-driver-data-with-qualifying';
import { useMemo } from 'react';

const getMarkerDetails = (
  currentLap: ReturnType<typeof findCurrentLap>,
  currentTime: number,
  totalPathLength: number,
  path: SVGPathElement,
  driverData: DriverDataMapWithQualifyingPosition,
  driverNumber: number,
) => {
  const progress = getDriverLapProgress(currentLap!.startLapTime, currentLap!.lapDuration, currentTime);
  const distance = progress * totalPathLength;

  // Returns x, y for a point on the path at a certain distance along the path
  const point = path.getPointAtLength(distance);
  const hex = `#${driverData.get(driverNumber)?.team_colour ?? '000'}`;
  const label = driverData.get(driverNumber)?.name_acronym ?? '';

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
  driverNumbersToShow?: number[];
  dotRadius?: number;
  showLabels?: boolean;
}

export const DriverMarkers = ({ pathRef, driverNumbersToShow, dotRadius = 8, showLabels = true }: DriverMarkerOverlayProps) => {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);
  const lapsByDriver = useLapsStore((state) => state.lapsByDriver);
  const driverData = useDriverStore((state) => state.driverData);
  const path = pathRef.current;

  const totalPathLength = useMemo(() => (path ? path.getTotalLength() : 0), [path]);
  const driverList = useMemo(() => driverNumbersToShow ?? Array.from(driverData.keys()), [driverData, driverNumbersToShow]);

  const driverMarkers = useMemo(() => {
    if (!path || currentTime == null || totalPathLength === 0 || sessionStartTime == null || driverList.length === 0) {
      return [] as DriverMarker[];
    }

    const markers = driverList.map((driverNumber) => {
      const laps = lapsByDriver.get(driverNumber);

      if (!laps || laps.length === 0) return null;

      const currentLap = findCurrentLap(currentTime, laps, sessionStartTime);

      if (!currentLap) return null;

      const { point, progress, hex, label } = getMarkerDetails(
        currentLap,
        currentTime,
        totalPathLength,
        path,
        driverData,
        driverNumber,
      );

      return { driverNumber, point, progress, hex, label };
    });

    return markers;
  }, [driverList, lapsByDriver, currentTime, totalPathLength, sessionStartTime, driverData, path]).filter(
    Boolean,
  ) as DriverMarker[];

  if (!driverMarkers || driverMarkers.length === 0) return null;

  return (
    <>
      {driverMarkers.toReversed().map((driverMarker) => (
        <g key={driverMarker.driverNumber} transform={`translate(${driverMarker.point.x}, ${driverMarker.point.y})`}>
          <circle r={dotRadius} strokeWidth={1} style={{ fill: driverMarker.hex }} className="stroke-white" />

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

              <text fontWeight="bold" x={dotRadius + 8} y={4} fontSize={14} className="fill-white">
                {driverMarker.label}
              </text>
            </>
          )}
        </g>
      ))}
    </>
  );
};
