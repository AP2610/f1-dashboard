import { create } from 'zustand';

export type PlaybackSpeed = 1 | 2 | 5 | 10;

interface SessionTimelineStore {
  raceSessionKey: number | null;
  sessionStartTime: number | null;
  sessionEndTime: number | null;
  currentTime: number | null;
  playbackSpeed: PlaybackSpeed;
  isPlaying: boolean;
  setSession: (raceSessionKey: number, sessionStartTime: number, sessionEndTime: number, currentTime: number) => void;
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  seek: (timeToSeekTo: number) => void;
  tick: (deltaTime: number) => void;
}

// The store controls the playback of a session
export const useSessionTimeLineStore = create<SessionTimelineStore>((set) => ({
  raceSessionKey: null,
  sessionStartTime: null,
  sessionEndTime: null,
  currentTime: null,
  playbackSpeed: 1,
  isPlaying: false,

  // Setters
  setSession: (raceSessionKey: number, sessionStartTime: number, sessionEndTime: number, currentTime: number) =>
    set({ raceSessionKey, sessionStartTime, sessionEndTime, currentTime }),
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  // Actions
  seek: (timeToSeekTo: number) =>
    set((state) => {
      const { sessionStartTime, sessionEndTime, currentTime } = state;

      if (!sessionStartTime || !sessionEndTime || !currentTime) {
        return {};
      }

      // if timeToSeekTo is less than sessionStartTime, set it to sessionStartTime
      // if timeToSeekTo is greater than sessionEndTime, set it to sessionEndTime
      // otherwise, set it to timeToSeekTo
      return {
        currentTime: Math.min(Math.max(timeToSeekTo, sessionStartTime), sessionEndTime),
      };
    }),

  tick: (deltaTime: number) =>
    set((state) => {
      const { sessionStartTime, sessionEndTime, currentTime, playbackSpeed, isPlaying } = state;

      if (!isPlaying || !sessionStartTime || !sessionEndTime || !currentTime) {
        return {}; // No state change - currentTime stays the same
      }

      // Calculate where we should be after this tick
      // Example: if deltaTime=16ms and speed=5x, we advance 80ms
      const nextTime = currentTime + deltaTime * playbackSpeed;

      // Ensure the new time is within valid bounds
      return {
        currentTime: Math.min(
          // First, ensure we don't go before the race started
          Math.max(nextTime, sessionStartTime),
          // Then, ensure we don't go past the race ended
          sessionEndTime,
        ),
      };
    }),
}));
