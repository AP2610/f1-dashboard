import { LapData } from '@/server-functions/api/get-laps-for-driver-data';

type ActiveLapWindow = {
  startLapTimeMs: number;
  lapDurationMs: number;
  lapNumber: number;
};

// returns the current lap window for a given driver. Its used to determine the current lap and lap progress.
export const getActiveLapWindow = (
  playheadMs: number,
  driverLaps: LapData[],
  sessionStartTimeMsMs: number,
): ActiveLapWindow | null => {
  for (let index = 0; index < driverLaps.length; index++) {
    const currentLap = driverLaps[index];
    const nextLap = driverLaps[index + 1];

    let lapDurationMs: number | null;
    let startLapTimeMs: number | null;

    if (currentLap.date_start != null && currentLap.date_start !== undefined) {
      startLapTimeMs = currentLap.date_start;
    } else if (currentLap.lap_number === 1) {
      startLapTimeMs = sessionStartTimeMsMs;
    } else {
      // Skip this lap because we dont have a start lap time
      continue;
    }

    // If the lap number is 1 and the next lap has a date start, then the lap duration is the difference between the next lap's date start and the start lap time
    if (currentLap.lap_number === 1 && nextLap && nextLap.date_start !== null && nextLap.date_start !== undefined) {
      lapDurationMs = nextLap.date_start - startLapTimeMs;
    } else {
      lapDurationMs = currentLap.lap_duration ?? 0;
    }

    // If the lap duration is null or less than 0, dont render this lap for the given driver
    if (lapDurationMs == null || lapDurationMs <= 0) continue;

    const endLapTime = startLapTimeMs + lapDurationMs;

    /**
     * playheadMs < endLapTime, not <= to avoid potential lap overlap issues
     * for example: Lap 1 runs from 100s to 180s. Lap 2 starts at 180s.
     * At 180s, we don’t want that moment to count for both laps.
     */
    if (playheadMs >= startLapTimeMs && playheadMs < endLapTime) {
      return { startLapTimeMs, lapDurationMs, lapNumber: currentLap.lap_number };
    }
  }
  return null;
};

export const getDriverLapProgress = (startLapTimeMs: number, lapDuration: number, playheadMs: number) => {
  const timePassedSinceStartOfLap = playheadMs - startLapTimeMs;
  const totalTimeForLap = lapDuration;

  const progressAlongCurrentLap = timePassedSinceStartOfLap / totalTimeForLap;

  // i'm using the clamp here just for edge cases, 99% of the time the value will be between 0-1, but just in case/
  return Math.max(0, Math.min(1, progressAlongCurrentLap));
};
