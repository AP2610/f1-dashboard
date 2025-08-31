'use client';

import { Section } from '@/components/layout/section';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { useEffect, useRef } from 'react';
import { type DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { type LapDataMap } from '@/server-functions/api/get-session-lap-data';
import { CONSTANTS } from '@/lib/constants';
import { TrackMap } from '../track-map';
import { LapCounter } from './lap-counter';
import { useLapsStore } from '@/lib/stores/laps-store';
import { PlaybackControls } from '../track-map/playback-controls';
import { Standings } from '../standings';

interface RaceDashboardProps {
  sessionStartTime: number;
  sessionEndTime: number;
  sessionDriverData: DriverDataMap;
  initialLapsByDriver: LapDataMap;
}

// TODO: create scrubbing slider;

export const RaceDashboard = ({
  sessionStartTime,
  sessionEndTime,
  sessionDriverData,
  initialLapsByDriver,
}: RaceDashboardProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setLapsByDriver = useLapsStore((state) => state.setLapsByDriver);
  const trackRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    // Initialize the session and laps
    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, sessionStartTime);
    setLapsByDriver(initialLapsByDriver);
  }, [sessionStartTime, sessionEndTime, initialLapsByDriver]);

  return (
    <Section className="grid grid-cols-12 gap-8">
      {/* Standings */}
      <div className="col-span-4 space-y-8">
        <LapCounter sessionStartTime={sessionStartTime} />

        <Standings />
      </div>

      <div className="col-span-8 space-y-8">
        {/* Replace with heading component */}
        <h2>Track Map</h2>

        <div className="grid grid-cols-12 gap-8">
          {/* Replace with button component */}
          <div className="col-span-3">
            <div className="flex flex-col gap-4">
              <PlaybackControls />
            </div>
          </div>

          <div className="col-span-9 mx-auto">
            <TrackMap
              trackRef={trackRef as React.RefObject<SVGPathElement>}
              sessionDriverData={sessionDriverData}
              sessionStartTime={sessionStartTime}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
