'use client';

import { CONSTANTS } from '@/lib/constants';
import { useRacePlayback } from '@/hooks/use-race-playback';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';

export const PlaybackControls = () => {
  const racePlayback = useRacePlayback();
  const sessionStartTimeMs = useSessionTimeLineStore((state) => state.sessionStartTimeMs);
  const sessionEndTime = useSessionTimeLineStore((state) => state.sessionEndTime);
  const isPlaying = useSessionTimeLineStore((state) => state.isPlaying);
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setPlaybackSpeed = useSessionTimeLineStore((state) => state.setPlaybackSpeed);

  const handleStartClick = () => {
    racePlayback.start();
  };

  const handlePauseClick = () => {
    racePlayback.stop();
  };

  const handleResetSessionClick = () => {
    if (sessionStartTimeMs === null || sessionEndTime === null) {
      return;
    }

    setSession(CONSTANTS.raceSessionKey, sessionStartTimeMs, sessionEndTime, sessionStartTimeMs);
    racePlayback.stop();
    setPlaybackSpeed(1);
  };

  const playbackSpeeds = CONSTANTS.playbackSpeeds;

  const playbackSpeedButtons = playbackSpeeds.map((speed) => (
    <button
      key={speed}
      onClick={() => setPlaybackSpeed(speed)}
      className="w-1/4 flex-grow flex-wrap rounded-md bg-accent-1 p-2 text-white"
    >
      {speed}x
    </button>
  ));

  return (
    <>
      <button
        onClick={handleStartClick}
        disabled={isPlaying}
        className="rounded-md bg-primary p-2 text-white disabled:bg-primary/50"
      >
        Start
      </button>

      <button
        onClick={handlePauseClick}
        disabled={!isPlaying}
        className="text-dark rounded-md bg-secondary p-2 disabled:bg-secondary/50"
      >
        Pause
      </button>

      <button onClick={handleResetSessionClick} className="rounded-md bg-tertiary p-2 text-white disabled:bg-tertiary/50">
        Reset Session
      </button>

      <div className="flex gap-2">{playbackSpeedButtons}</div>
    </>
  );
};
