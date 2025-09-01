'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { findCurrentLap, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useDriverStore } from '@/lib/stores/driver-store';
import { useRef } from 'react';

type StandingsEntry = {
  driverNumber: number;
  lapNumber: number;
  lapProgress: number;
  qualifyingPosition: number;
};

export function useStandings() {
  const isPlaying = useSessionTimeLineStore((state) => state.isPlaying);
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);

  const lapsByDriver = useLapsStore((state) => state.lapsByDriver);
  const driverData = useDriverStore((state) => state.driverData);

  // always keep a copy of the previous standings to return in the edge cases where standings is empty
  const previousStandings = useRef<StandingsEntry[]>([]);
  const previousLeaderLapNumber = useRef<number | null>(null);

  const totalLaps = lapsByDriver.get(1)?.length ?? 0;

  if (currentTime === null || lapsByDriver === null || sessionStartTime === null) {
    return { standings: previousStandings.current, currentLapNumber: previousLeaderLapNumber.current, totalLaps };
  }

  // if true, we'll use the quali grid to display standings
  const isPreRaceStart = !isPlaying && currentTime < sessionStartTime;

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

  // Map previous standings by driver for quick per-driver fallback
  const previousByDriver = new Map(previousStandings.current.map((standing) => [standing.driverNumber, standing] as const));

  // live standings
  for (const [driverNumber, lapsForDriver] of lapsByDriver.entries()) {
    if (!lapsForDriver || lapsForDriver.length === 0) continue;

    const currentLap = findCurrentLap(currentTime, lapsForDriver, sessionStartTime);
    const driver = driverData.get(driverNumber);
    if (!driver) continue; // skip if driver is not in data

    if (!currentLap) {
      // keep last known row for this driver instead of dropping them for this frame
      const prev = previousByDriver.get(driverNumber);
      if (prev) {
        standings.push({
          driverNumber,
          lapNumber: prev.lapNumber,
          lapProgress: prev.lapProgress,
          qualifyingPosition: driver.qualifyingPosition,
        });
      }
      continue;
    }

    const lapProgress = getDriverLapProgress(currentLap.startLapTime, currentLap.lapDuration, currentTime);

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
      currentLapNumber: previousLeaderLapNumber.current,
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
