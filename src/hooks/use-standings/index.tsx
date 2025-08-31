'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { findCurrentLap, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useDriverStore } from '@/lib/stores/driver-store';

type StandingsEntry = {
  driverNumber: number;
  lapNumber: number;
  lapProgress: number;
  qualifyingPosition: number;
};

export function useStandings() {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);
  const lapsByDriver = useLapsStore((state) => state.lapsByDriver);
  const driverData = useDriverStore((state) => state.driverData);

  if (currentTime == null || lapsByDriver == null) {
    return { standings: [], currentLapNumber: null };
  }

  const standings: StandingsEntry[] = [];

  for (const driverNumberStr of Object.keys(lapsByDriver)) {
    const driverNumber = Number(driverNumberStr);
    const lapsForDriver = lapsByDriver[driverNumber];
    if (!lapsForDriver || lapsForDriver.length === 0 || sessionStartTime == null) continue;

    const currentLap = findCurrentLap(currentTime, lapsForDriver, sessionStartTime);
    if (!currentLap) continue; // skip if driver it not on a lap

    const lapProgress = getDriverLapProgress(currentLap.startLapTime, currentLap.lapDuration, currentTime);

    const driver = driverData[driverNumber];
    if (!driver) continue; // skip if driver is not in data

    standings.push({
      driverNumber,
      lapNumber: currentLap.lapNumber,
      lapProgress,
      qualifyingPosition: driver.qualifyingPosition,
    });
  }

  if (standings.length === 0) {
    return { standings: [], currentLapNumber: null };
  }

  // Sort: first by quali position, then highest lapNumber, then highest progress
  standings.sort((a, b) => {
    if (a.lapNumber !== b.lapNumber) {
      return b.lapNumber - a.lapNumber;
    }

    if (a.lapProgress !== b.lapProgress) {
      return b.lapProgress - a.lapProgress;
    }

    // when on the same lap and same progress, use quali position
    return a.qualifyingPosition - b.qualifyingPosition;
  });

  const leader = standings[0];
  return { standings, currentLapNumber: leader.lapNumber };
}
