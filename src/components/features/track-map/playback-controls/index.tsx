'use client';

import { CONSTANTS } from '@/lib/constants';
import { useRacePlayback } from '@/hooks/use-race-playback';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { Button } from '@/components/ui/button';

export const PlaybackControls = () => {
  const racePlayback = useRacePlayback();
  const sessionStartTimeMs = useSessionTimeLineStore((state) => state.sessionStartTimeMs);
  const sessionEndTime = useSessionTimeLineStore((state) => state.sessionEndTime);
  const isPlaying = useSessionTimeLineStore((state) => state.isPlaying);
  const playbackSpeed = useSessionTimeLineStore((state) => state.playbackSpeed);
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
    <Button
      variant="icon-button"
      key={speed}
      onClick={() => setPlaybackSpeed(speed)}
      disabled={playbackSpeed === speed}
      className="col-span-1 h-12 w-full rounded-none font-raleway text-sm text-accent-1 transition-all not-disabled:bg-accent-1/10 not-disabled:hover:bg-accent-1/10 active:bg-accent-1/20"
    >
      <span className="flex items-center justify-center">{speed}x</span>
    </Button>
  ));

  return (
    <div className="flex flex-col gap-4 rounded-md bg-black/90 p-6 shadow-lg">
      <div className="flex gap-2">
        <Button variant="primary" onClick={handleStartClick} disabled={isPlaying} className="w-full">
          Start
        </Button>

        <Button variant="secondary" onClick={handlePauseClick} disabled={!isPlaying} className="w-full">
          Pause
        </Button>
      </div>

      <Button variant="tertiary" onClick={handleResetSessionClick} disabled={!isPlaying}>
        Reset Session
      </Button>

      <div className="mt-2 grid grid-cols-2 gap-2">{playbackSpeedButtons}</div>
    </div>
  );
};
