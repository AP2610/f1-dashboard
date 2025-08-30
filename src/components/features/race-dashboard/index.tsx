'use client';

import { Section } from '@/components/layout/section';
import { type PlaybackSpeed, useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { useRacePlayback } from '@/hooks/use-race-playback';
import { useEffect, useMemo, useRef } from 'react';
import { TrackSvg } from '../replay-track/track-svg';
import { type DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { type LapDataMap } from '@/server-functions/api/get-session-lap-data';
import { CONSTANTS } from '@/lib/constants';
import { DriverMarkers } from '../replay-track/driver-markers';

interface RaceDashboardProps {
  sessionStartTime: number;
  sessionEndTime: number;
  sessionDriverData: DriverDataMap;
  initialLapsByDriver: LapDataMap;
  poleSitterDriverNumber: number;
}

// TODO: Add session reset button;
// TODO: create scrubbing slider;
// TODO: Add playback speed selector

export const RaceDashboard = ({
  sessionStartTime,
  sessionEndTime,
  sessionDriverData,
  initialLapsByDriver,
  poleSitterDriverNumber,
}: RaceDashboardProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const playbackSpeed = useSessionTimeLineStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useSessionTimeLineStore((state) => state.setPlaybackSpeed);
  const isPlaying = useSessionTimeLineStore((state) => state.isPlaying);
  const racePlayback = useRacePlayback();
  const trackRef = useRef<SVGPathElement | null>(null);

  /**
   * Since the the first lap returned from the API does not have a start time, we don't know when the first lap starts.
   * In DriverMarkers.tsx, I have to use the second lap to determine the start time of the first lap. This is done by
   * subtracting the second laps duration from the start time of the second lap to approximate the start time of the first lap.
   * Over here, we initialise currentTime to the approximate start time of the first lap so that it is within the bounds of the actual race start time.
   * If not, findCurrentLap in DriverMarkers.tsx will return null and the driver markers will not be rendered.
   * This is a workaround due to the limitations of the API
   */
  // const initialCurrentTime = useMemo(() => {
  //   const poleSitterLaps = initialLapsByDriver[poleSitterDriverNumber];
  //   const lap2 = poleSitterLaps?.find((lap) => lap.lap_number === 2);

  //   let initialTime = sessionStartTime;

  //   if (lap2?.date_start && lap2?.lap_duration) {
  //     initialTime = lap2.date_start - lap2.lap_duration;
  //   }

  //   return initialTime;
  // }, [sessionStartTime, initialLapsByDriver, poleSitterDriverNumber]);

  useEffect(() => {
    console.log('sessionStartTime: ', sessionStartTime);
    console.log('sessionEndTime: ', sessionEndTime);
    if (sessionStartTime && sessionEndTime) {
      setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, sessionStartTime);
    }
  }, [sessionStartTime, sessionEndTime, setSession]);

  const handleStartClick = () => {
    console.log('handleStartClick');
    racePlayback.start();
  };

  const handlePauseClick = () => {
    console.log('handleStopClick');
    racePlayback.stop();
  };

  const handleResetSessionClick = () => {
    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, sessionStartTime);
    racePlayback.stop();
    setPlaybackSpeed(1);
  };

  const playbackSpeeds: PlaybackSpeed[] = [1, 2, 5, 10];

  const playbackSpeedButtons = playbackSpeeds.map((speed) => (
    <button key={speed} onClick={() => setPlaybackSpeed(speed)} className="rounded-md bg-info p-2 text-light">
      {speed}x
    </button>
  ));

  return (
    <Section className="grid grid-cols-12">
      <div className="col-span-8 space-y-8">
        {/* Replace with heading component */}
        <h2>Track Map</h2>

        <TrackSvg ref={trackRef as React.RefObject<SVGPathElement>}>
          <DriverMarkers
            pathRef={trackRef as React.RefObject<SVGPathElement>}
            drivers={sessionDriverData}
            lapsByDriver={initialLapsByDriver}
            sessionStartTime={sessionStartTime}
            // driverNumbersToShow={[1, 4]}
          />
        </TrackSvg>

        {/* Replace with button component */}
        <div className="flex gap-2">
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
        </div>
      </div>
    </Section>
  );
};
