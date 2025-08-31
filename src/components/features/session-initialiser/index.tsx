'use client';

import { CONSTANTS } from '@/lib/constants';
import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { LapDataMap } from '@/server-functions/api/get-session-lap-data';
import { SessionResult } from '@/server-functions/api/get-session-result';
import { useEffect } from 'react';

interface SessionInitialiserProps {
  sessionStartTime: number;
  initialCurrentTime: number;
  sessionEndTime: number;
  sessionDriverData: DriverDataMap;
  initialLapsByDriver: LapDataMap;
  qualifyingPositionData: SessionResult[];
}

export const SessionInitialiser = ({
  sessionStartTime,
  initialCurrentTime,
  sessionEndTime,
  sessionDriverData,
  initialLapsByDriver,
  qualifyingPositionData,
}: SessionInitialiserProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setLapsByDriver = useLapsStore((state) => state.setLapsByDriver);
  const setDriverData = useDriverStore((state) => state.setDriverData);
  const driverData = useDriverStore((state) => state.driverData);

  useEffect(() => {
    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, initialCurrentTime);
    setLapsByDriver(initialLapsByDriver);
    setDriverData(sessionDriverData, qualifyingPositionData);
  }, [sessionStartTime, sessionEndTime, sessionDriverData, initialLapsByDriver, qualifyingPositionData]);

  useEffect(() => {
    console.log('driverData: ', driverData);
  }, [driverData]);

  return null;
};
