'use client';

import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { getActiveLapWindow, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { type DriverDataMapWithQualifyingPosition } from '@/server-functions/api/get-session-driver-data-with-qualifying';
import { useMemo } from 'react';

const getMarkerDetails = (
  currentLap: ReturnType<typeof getActiveLapWindow>,
  playheadMs: number,
  totalPathLength: number,
  path: SVGPathElement,
  driverData: DriverDataMapWithQualifyingPosition,
  driverNumber: number,
) => {
  const progressAlongLap = getDriverLapProgress(currentLap!.startLapTimeMs, currentLap!.lapDurationMs, playheadMs);
  const distanceTraveledAlongLap = progressAlongLap * totalPathLength;

  // Returns x, y for a point on the path at a certain distance along the path
  const currentPointOnPath = path.getPointAtLength(distanceTraveledAlongLap);
  const teamColorHex = `#${driverData.get(driverNumber)?.team_colour ?? '000'}`;
  const driverAcronym = driverData.get(driverNumber)?.name_acronym ?? '';

  return { driverNumber, currentPointOnPath, progressAlongLap, teamColorHex, driverAcronym };
};

type DriverMarker = {
  driverNumber: number;
  currentPointOnPath: DOMPoint;
  progressAlongLap: number;
  teamColorHex: string;
  driverAcronym: string;
};

interface DriverMarkerOverlayProps {
  pathRef: React.RefObject<SVGPathElement>;
  driverNumbersToShow?: number[];
  dotRadius?: number;
  showLabels?: boolean;
}

export const DriverMarkers = ({ pathRef, driverNumbersToShow, dotRadius = 8, showLabels = true }: DriverMarkerOverlayProps) => {
  const playheadMs = useSessionTimeLineStore((state) => state.playheadMs);
  const sessionStartTimeMs = useSessionTimeLineStore((state) => state.sessionStartTimeMs);
  const driverLaps = useLapsStore((state) => state.driverLaps);
  const driverData = useDriverStore((state) => state.driverData);
  const path = pathRef.current;

  const totalPathLength = useMemo(() => (path ? path.getTotalLength() : 0), [path]);
  const driverList = useMemo(() => driverNumbersToShow ?? Array.from(driverData.keys()), [driverData, driverNumbersToShow]);

  const driverMarkers = useMemo(() => {
    if (!path || playheadMs === null || totalPathLength === 0 || sessionStartTimeMs === null || driverList.length === 0) {
      return [] as DriverMarker[];
    }

    const markers = driverList.map((driverNumber) => {
      const lapsPerDriver = driverLaps.get(driverNumber);

      if (!lapsPerDriver || lapsPerDriver.length === 0) return null;

      const currentLap = getActiveLapWindow(playheadMs, lapsPerDriver, sessionStartTimeMs);

      if (!currentLap) return null;

      const { currentPointOnPath, progressAlongLap, teamColorHex, driverAcronym } = getMarkerDetails(
        currentLap,
        playheadMs,
        totalPathLength,
        path,
        driverData,
        driverNumber,
      );

      return { driverNumber, currentPointOnPath, progressAlongLap, teamColorHex, driverAcronym };
    });

    return markers;
  }, [driverList, driverLaps, playheadMs, totalPathLength, sessionStartTimeMs, driverData, path]).filter(
    Boolean,
  ) as DriverMarker[];

  if (!driverMarkers || driverMarkers.length === 0) return null;

  return (
    <>
      {driverMarkers.toReversed().map((driverMarker) => (
        <g
          key={driverMarker.driverNumber}
          transform={`translate(${driverMarker.currentPointOnPath.x}, ${driverMarker.currentPointOnPath.y})`}
        >
          <circle r={dotRadius} strokeWidth={1} style={{ fill: driverMarker.teamColorHex }} className="stroke-white" />

          {showLabels && (
            <>
              <rect
                x={dotRadius + 5.5}
                y={-10}
                width={driverMarker.driverAcronym.length * 8 + 12}
                height={18}
                style={{ fill: driverMarker.teamColorHex }}
                rx={2} // rounded corners
              />

              <text fontWeight="bold" x={dotRadius + 8} y={4} fontSize={14} className="fill-white">
                {driverMarker.driverAcronym}
              </text>
            </>
          )}
        </g>
      ))}
    </>
  );
};
