'use client';

import { CONSTANTS } from '@/lib/constants';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { LapDataMap } from '@/server-functions/api/get-session-lap-data';
import { useEffect } from 'react';

interface SessionInitialiserProps {
  sessionStartTime: number;
  initialCurrentTime: number;
  sessionEndTime: number;
  initialLapsByDriver: LapDataMap;
}

export const SessionInitialiser = ({
  sessionStartTime,
  initialCurrentTime,
  sessionEndTime,
  initialLapsByDriver,
}: SessionInitialiserProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setLapsByDriver = useLapsStore((state) => state.setLapsByDriver);

  useEffect(() => {
    // Initialize the session and laps
    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, initialCurrentTime);
    setLapsByDriver(initialLapsByDriver);
  }, [sessionStartTime, sessionEndTime, initialLapsByDriver]);

  return null;
};
