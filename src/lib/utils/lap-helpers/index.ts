import { LapData } from '@/server-functions/api/get-session-lap-data';

export const findCurrentLap = (currentTime: number, lapsByDriver: LapData[], sessionStartTime: number) => {
  for (let index = 0; index < lapsByDriver.length; index++) {
    const currentLap = lapsByDriver[index];
    const nextLap = lapsByDriver[index + 1];
    let lapDuration: number;
    const startLapTime = currentLap.date_start ? currentLap.date_start : sessionStartTime;

    if (currentLap.lap_number === 1 && nextLap.date_start) {
      lapDuration = nextLap.date_start - startLapTime;
    } else {
      lapDuration = currentLap.lap_duration ?? 0;
    }

    const endLapTime = startLapTime + lapDuration;

    // CurrentTime < endLapTime, not <= to avoid potential lap overlap issues
    if (currentTime >= startLapTime && currentTime < endLapTime) {
      return { startLapTime, endLapTime, lapDuration, lapNumber: currentLap.lap_number };
    }
  }
  return null;
};

export const getDriverLapProgress = (startLapTime: number, lapDuration: number, currentTime: number) => {
  const progress = (currentTime - startLapTime) / lapDuration;

  // Clamp the progress between 0 and 1
  return Math.max(0, Math.min(1, progress));
};
