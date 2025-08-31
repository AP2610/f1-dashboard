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
      <div className="col-span-4">
        <h2>Standings</h2>

        <LapCounter sessionStartTime={sessionStartTime} />
      </div>

      <div className="col-span-8 space-y-8">
        {/* Replace with heading component */}
        <h2>Track Map</h2>

        <TrackMap
          trackRef={trackRef as React.RefObject<SVGPathElement>}
          sessionDriverData={sessionDriverData}
          sessionStartTime={sessionStartTime}
        />

        {/* Replace with button component */}
        <div className="flex gap-2">
          <PlaybackControls />
        </div>
      </div>
    </Section>
  );
};
