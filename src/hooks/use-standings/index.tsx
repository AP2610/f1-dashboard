'use client';

import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { getActiveLapWindow, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { useRef } from 'react';

type StandingsEntry = {
  driverNumber: number;
  lapNumber: number;
  lapProgress: number;
  qualifyingPosition: number;
};

export function useStandings() {
  const isPlaying = useSessionTimeLineStore((state) => state.isPlaying);
  const playheadMs = useSessionTimeLineStore((state) => state.playheadMs);
  const sessionStartTimeMs = useSessionTimeLineStore((state) => state.sessionStartTimeMs);

  const driverLaps = useLapsStore((state) => state.driverLaps);
  const driverData = useDriverStore((state) => state.driverData);

  // always keep a copy of the previous standings to return in the edge cases where standings is empty
  const previousStandings = useRef<StandingsEntry[]>([]);
  const previousLeaderLapNumber = useRef<number | null>(null);

  const totalLaps = driverLaps.get(1)?.length ?? 0;

  if (playheadMs === null || driverLaps === null || sessionStartTimeMs === null) {
    return { standings: previousStandings.current, leaderLapNumber: previousLeaderLapNumber.current, totalLaps };
  }

  // if true, we'll use the quali grid to display standings
  const isPreRaceStart = !isPlaying && playheadMs < sessionStartTimeMs;

  if (isPreRaceStart) {
    const standings = Array.from(driverData.entries()).map(([driverNumber, data], idx) => ({
      driverNumber,
      lapNumber: 1,
      lapProgress: 0,
      qualifyingPosition: data.qualifyingPosition,
      position: idx + 1,
    }));

    return { standings, leaderLapNumber: 1, totalLaps };
  }

  const standings: StandingsEntry[] = [];

  // map previous standings by driver to derive the last known standing for each driver
  const previousStandingsByDriver = new Map(
    previousStandings.current.map((standing) => [standing.driverNumber, standing] as const),
  );

  // live standings
  for (const [driverNumber, lapsForDriver] of driverLaps.entries()) {
    if (!lapsForDriver || lapsForDriver.length === 0) continue;

    const currentLap = getActiveLapWindow(playheadMs, lapsForDriver, sessionStartTimeMs);
    const driver = driverData.get(driverNumber);

    if (!driver) continue; // skip if driver is not in data

    if (!currentLap) {
      // keep last known standing for this driver instead of dropping them for this frame
      const driverPreviousStanding = previousStandingsByDriver.get(driverNumber);

      if (driverPreviousStanding) {
        standings.push({
          driverNumber,
          lapNumber: driverPreviousStanding.lapNumber,
          lapProgress: driverPreviousStanding.lapProgress,
          qualifyingPosition: driver.qualifyingPosition,
        });
      }
      continue;
    }

    const lapProgress = getDriverLapProgress(currentLap.startLapTimeMs, currentLap.lapDurationMs, playheadMs);

    standings.push({
      driverNumber,
      lapNumber: currentLap.lapNumber,
      lapProgress,
      qualifyingPosition: driver.qualifyingPosition,
    });
  }

  if (standings.length === 0) {
    return {
      standings: previousStandings.current,
      leaderLapNumber: previousLeaderLapNumber.current,
      totalLaps,
    };
  }

  // Sort: highest lapNumber, then highest progress
  // If drivers are on the same lap, then sort by progress of that lap
  standings.sort((a, b) => {
    if (a.lapNumber !== b.lapNumber) {
      return b.lapNumber - a.lapNumber;
    }

    if (a.lapProgress !== b.lapProgress) {
      return b.lapProgress - a.lapProgress;
    }

    return a.qualifyingPosition - b.qualifyingPosition;
  });

  previousStandings.current = standings;
  previousLeaderLapNumber.current = standings[0]?.lapNumber;

  const leader = standings[0];

  return { standings, leaderLapNumber: leader.lapNumber, totalLaps };
}
