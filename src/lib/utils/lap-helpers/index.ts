import { LapData } from '@/server-functions/api/get-laps-for-driver-data';

// returns the current lap window for a given driver. Its used to determine the current lap and lap progress.
export const findCurrentLap = (currentTime: number, lapsByDriver: LapData[], sessionStartTime: number) => {
  for (let index = 0; index < lapsByDriver.length; index++) {
    const currentLap = lapsByDriver[index];
    const nextLap = lapsByDriver[index + 1];

    let lapDuration: number | null;
    let startLapTime: number | null;

    if (currentLap.date_start != null && currentLap.date_start !== undefined) {
      startLapTime = currentLap.date_start;
    } else if (currentLap.lap_number === 1) {
      startLapTime = sessionStartTime;
    } else {
      // Skip this lap because we dont have a start lap time
      continue;
    }

    // If the lap number is 1 and the next lap has a date start, then the lap duration is the difference between the next lap's date start and the start lap time
    if (currentLap.lap_number === 1 && nextLap && nextLap.date_start !== null && nextLap.date_start !== undefined) {
      lapDuration = nextLap.date_start - startLapTime;
    } else {
      lapDuration = currentLap.lap_duration ?? 0;
    }

    // If the lap duration is null or less than 0, dont render this lap for the given driver
    if (lapDuration == null || lapDuration <= 0) continue;

    const endLapTime = startLapTime + lapDuration;

    // currentTime < endLapTime, not <= to avoid potential lap overlap issues
    if (currentTime >= startLapTime && currentTime < endLapTime) {
      return { startLapTime, lapDuration, lapNumber: currentLap.lap_number };
    }
  }
  return null;
};

export const getDriverLapProgress = (startLapTime: number, lapDuration: number, currentTime: number) => {
  const timePassedSinceStartOfLap = currentTime - startLapTime;
  const totalTimeForLap = lapDuration;

  const progressAlongCurrentLap = timePassedSinceStartOfLap / totalTimeForLap;

  // i'm using the clamp here just for edge cases, 99% of the time the value will be between 0-1, but just in case/
  return Math.max(0, Math.min(1, progressAlongCurrentLap));
};
