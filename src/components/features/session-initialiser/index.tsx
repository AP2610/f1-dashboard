'use client';

import { CONSTANTS } from '@/lib/constants';
import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { LapDataMap } from '@/server-functions/api/get-session-lap-data';
import { useEffect } from 'react';

interface SessionInitialiserProps {
  sessionStartTime: number;
  initialCurrentTime: number;
  sessionEndTime: number;
  sessionDriverData: DriverDataMap;
  initialLapsByDriver: LapDataMap;
}

export const SessionInitialiser = ({
  sessionStartTime,
  initialCurrentTime,
  sessionEndTime,
  sessionDriverData,
  initialLapsByDriver,
}: SessionInitialiserProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setLapsByDriver = useLapsStore((state) => state.setLapsByDriver);
  const setDriverData = useDriverStore((state) => state.setDriverData);

  useEffect(() => {
    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, initialCurrentTime);
    setLapsByDriver(initialLapsByDriver);
    setDriverData(sessionDriverData);
  }, [sessionStartTime, sessionEndTime, sessionDriverData, initialLapsByDriver]);

  return null;
};
