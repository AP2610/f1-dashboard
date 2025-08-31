import { create } from 'zustand';
import { CONSTANTS } from '../constants';

type PlaybackSpeed = (typeof CONSTANTS.playbackSpeeds)[number];

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
  tick: (deltaTime: number) => boolean;
}

export const useSessionTimeLineStore = create<SessionTimelineStore>((set, get) => ({
  raceSessionKey: null,
  sessionStartTime: null,
  sessionEndTime: null,
  currentTime: null, // I'm using currentTime to track where the "playhead" is in the race timeline.
  playbackSpeed: 1,
  isPlaying: false, // I'm currently only using this for the playback controls disabled state, might use for animations in the future.

  // Setters
  setSession: (raceSessionKey: number, sessionStartTime: number, sessionEndTime: number, currentTime: number) =>
    set({ raceSessionKey, sessionStartTime, sessionEndTime, currentTime }),
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  // Actions
  seek: (timeToSeekTo: number) =>
    set((state) => {
      const { sessionStartTime, sessionEndTime, currentTime } = state;

      if (sessionStartTime == null || sessionEndTime == null || currentTime == null) {
        return {};
      }

      // if timeToSeekTo is less than sessionStartTime, set it to sessionStartTime
      // if timeToSeekTo is greater than sessionEndTime, set it to sessionEndTime
      // otherwise, set it to timeToSeekTo
      return {
        currentTime: Math.min(Math.max(timeToSeekTo, sessionStartTime), sessionEndTime),
      };
    }),

  tick: (deltaTime: number): boolean => {
    const { sessionStartTime, sessionEndTime, currentTime, playbackSpeed, isPlaying } = get();

    if (!isPlaying || sessionStartTime == null || sessionEndTime == null || currentTime == null) {
      return false;
    }

    const nextTime = currentTime + deltaTime * playbackSpeed;

    // ensure the new time is within valid bounds
    const clampedTime = Math.min(
      // first, ensure we don't go before the race started
      Math.max(nextTime, sessionStartTime),
      // then, ensure we don't go past the race ended
      sessionEndTime,
    );

    set({ currentTime: clampedTime });

    const reachedEnd = clampedTime === sessionEndTime;

    return reachedEnd;
  },
}));
