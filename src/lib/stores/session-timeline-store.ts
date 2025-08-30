import { create } from 'zustand';

type PlaybackSpeed = 1 | 2 | 5;

interface SessionTimelineStore {
  sessionKey: number | null;
  sessionStartTime: number | null;
  sessionEndTime: number | null;
  currentTime: number;
  playbackSpeed: PlaybackSpeed;
  isPlaying: boolean;
  setSession: (sessionKey: number, sessionStartTime: number, sessionEndTime: number, currentTime: number) => void;
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  seek: (timeToSeekTo: number) => void;
  tick: (deltaTime: number) => void;
}

// The store controls the playback of a session
export const useSessionTimeLineStore = create<SessionTimelineStore>((set) => ({
  sessionKey: null,
  sessionStartTime: null,
  sessionEndTime: null,
  currentTime: 0,
  playbackSpeed: 1,
  isPlaying: false,

  // Setters
  setSession: (sessionKey: number, sessionStartTime: number, sessionEndTime: number, currentTime: number) =>
    set({ sessionKey, sessionStartTime, sessionEndTime, currentTime }),
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  // Actions
  seek: (timeToSeekTo: number) =>
    set((state) => {
      const { sessionStartTime, sessionEndTime, currentTime } = state;

      // Just return the current time if the session bounds are not set
      if (!sessionStartTime || !sessionEndTime) {
        return { currentTime };
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

      if (!isPlaying || !sessionStartTime || !sessionEndTime) {
        return { currentTime };
      }

      const nextTime = currentTime + deltaTime * playbackSpeed;

      return {
        currentTime: Math.min(Math.max(nextTime, sessionStartTime), sessionEndTime),
      };
    }),
}));
