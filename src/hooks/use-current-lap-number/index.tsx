'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { findCurrentLap, getDriverLapProgress } from '@/lib/utils/lap-helpers';
import { useLapsStore } from '@/lib/stores/laps-store';

type CurrentLapNumberEntry = {
  driverNumber: number;
  lapNumber: number;
  lapProgress: number;
};

export function useCurrentLapNumber(sessionStartTime: number) {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const lapsByDriver = useLapsStore((state) => state.lapsByDriver);

  if (currentTime == null || lapsByDriver == null) {
    return { currentLapNumber: null };
  }

  // Build simple standings (lapNumber + progress)
  const standings: CurrentLapNumberEntry[] = [];

  for (const driverNumberStr of Object.keys(lapsByDriver)) {
    const driverNumber = Number(driverNumberStr);
    const lapsForDriver = lapsByDriver[driverNumber];
    if (!lapsForDriver || lapsForDriver.length === 0) continue;

    const window = findCurrentLap(currentTime, lapsForDriver, sessionStartTime);
    if (!window) continue;

    // Get the progress of the current lap to sort standings
    const lapProgress = getDriverLapProgress(window.startLapTime, window.lapDuration, currentTime);

    standings.push({
      driverNumber,
      lapNumber: window.lapNumber,
      lapProgress,
    });
  }

  if (standings.length === 0) {
    return { currentLapNumber: null };
  }

  // Sort: highest lapNumber, then highest progress
  // If drivers are on the same lap, then sort by progress of that lap
  standings.sort((a, b) => {
    if (a.lapNumber !== b.lapNumber) return b.lapNumber - a.lapNumber;
    return b.lapProgress - a.lapProgress;
  });

  const leader = standings[0];
  return { currentLapNumber: leader.lapNumber };
}
