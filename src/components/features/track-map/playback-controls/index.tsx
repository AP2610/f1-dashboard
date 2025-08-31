import { CONSTANTS } from '@/lib/constants';
import { PlaybackSpeed } from '@/lib/stores/session-timeline-store';
import { useRacePlayback } from '@/hooks/use-race-playback';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';

export const PlaybackControls = () => {
  const racePlayback = useRacePlayback();
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setPlaybackSpeed = useSessionTimeLineStore((state) => state.setPlaybackSpeed);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);
  const sessionEndTime = useSessionTimeLineStore((state) => state.sessionEndTime);

  const handleStartClick = () => {
    console.log('handleStartClick');
    racePlayback.start();
  };

  const handlePauseClick = () => {
    console.log('handleStopClick');
    racePlayback.stop();
  };

  const handleResetSessionClick = () => {
    if (!sessionStartTime || !sessionEndTime) {
      return;
    }

    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, sessionStartTime);
    racePlayback.stop();
    setPlaybackSpeed(1);
  };

  const playbackSpeeds: PlaybackSpeed[] = [1, 2, 5, 10];

  const playbackSpeedButtons = playbackSpeeds.map((speed) => (
    <button
      key={speed}
      onClick={() => setPlaybackSpeed(speed)}
      className="w-1/4 flex-grow flex-wrap rounded-md bg-info p-2 text-light"
    >
      {speed}x
    </button>
  ));

  return (
    <>
      <button onClick={handleStartClick} className="rounded-md bg-success p-2 text-light">
        Start
      </button>

      <button onClick={handlePauseClick} className="rounded-md bg-accent p-2 text-dark">
        Pause
      </button>

      <button onClick={handleResetSessionClick} className="rounded-md bg-error p-2 text-light">
        Reset Session
      </button>

      <div className="flex gap-2">{playbackSpeedButtons}</div>
    </>
  );
};
