import { create } from 'zustand';
import { CONSTANTS } from '../constants';

type PlaybackSpeed = (typeof CONSTANTS.playbackSpeeds)[number];

interface SessionTimelineStore {
  raceSessionKey: number | null;
  sessionStartTimeMs: number | null;
  sessionEndTime: number | null;
  playheadMs: number | null;
  playbackSpeed: PlaybackSpeed;
  isPlaying: boolean;
  isScrubbing: boolean;
  setSession: (raceSessionKey: number, sessionStartTimeMs: number, sessionEndTime: number, playheadMs: number) => void;
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsScrubbing: (isScrubbing: boolean) => void;
  seek: (timeToSeekTo: number) => void;
  tick: (deltaTime: number) => boolean;
}

export const useSessionTimeLineStore = create<SessionTimelineStore>((set, get) => ({
  raceSessionKey: null,
  sessionStartTimeMs: null,
  sessionEndTime: null,
  playheadMs: null, // I'm using playheadMs to track where the "playhead" is in the race timeline.
  playbackSpeed: 1,
  isPlaying: false, // I'm currently only using this for the playback controls disabled state, might use for animations in the future.
  isScrubbing: false,

  // Setters
  setSession: (raceSessionKey: number, sessionStartTimeMs: number, sessionEndTime: number, playheadMs: number) =>
    set({ raceSessionKey, sessionStartTimeMs, sessionEndTime, playheadMs }),
  setPlaybackSpeed: (playbackSpeed: PlaybackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setIsScrubbing: (isScrubbing: boolean) => set({ isScrubbing }),

  // Actions
  seek: (timeToSeekTo: number) =>
    set((state) => {
      const { sessionStartTimeMs, sessionEndTime, playheadMs } = state;

      if (sessionStartTimeMs == null || sessionEndTime == null || playheadMs == null) {
        return {};
      }

      // if timeToSeekTo is less than sessionStartTimeMs, set it to sessionStartTimeMs
      // if timeToSeekTo is greater than sessionEndTime, set it to sessionEndTime
      // otherwise, set it to timeToSeekTo
      return {
        playheadMs: Math.min(Math.max(timeToSeekTo, sessionStartTimeMs), sessionEndTime),
      };
    }),

  tick: (deltaTime: number): boolean => {
    const { sessionStartTimeMs, sessionEndTime, playheadMs, playbackSpeed, isPlaying, isScrubbing } = get();

    if (!isPlaying || sessionStartTimeMs == null || sessionEndTime == null || playheadMs == null || isScrubbing) {
      return false;
    }

    const nextTime = playheadMs + deltaTime * playbackSpeed;

    // ensure the new time is within valid bounds
    const clampedTime = Math.min(
      // first, ensure we don't go before the race started
      Math.max(nextTime, sessionStartTimeMs),
      // then, ensure we don't go past the race ended
      sessionEndTime,
    );

    set({ playheadMs: clampedTime });

    const reachedEnd = clampedTime === sessionEndTime;

    return reachedEnd;
  },
}));
