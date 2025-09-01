'use client';

import { CONSTANTS } from '@/lib/constants';
import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { type DriverDataMapWithQualifyingPosition } from '@/server-functions/api/get-session-driver-data-with-qualifying';
import { type LapDataMap } from '@/server-functions/api/get-laps-for-driver-data';
import { type SessionResult } from '@/server-functions/api/get-session-result';
import { useEffect } from 'react';

interface SessionInitialiserProps {
  sessionStartTime: number;
  initialCurrentTime: number;
  sessionEndTime: number;
  sessionDriverDataWithQualifying: DriverDataMapWithQualifyingPosition;
  initialLapsByDriver: LapDataMap;
  qualifyingPositionData: SessionResult[];
}

export const SessionInitialiser = ({
  sessionStartTime,
  initialCurrentTime,
  sessionEndTime,
  sessionDriverDataWithQualifying,
  initialLapsByDriver,
  qualifyingPositionData,
}: SessionInitialiserProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setLapsByDriver = useLapsStore((state) => state.setLapsByDriver);
  const setDriverData = useDriverStore((state) => state.setDriverData);

  useEffect(() => {
    setSession(CONSTANTS.raceSessionKey, sessionStartTime, sessionEndTime, initialCurrentTime);
    setLapsByDriver(initialLapsByDriver);
    setDriverData(sessionDriverDataWithQualifying);
  }, [sessionStartTime, sessionEndTime, sessionDriverDataWithQualifying, initialLapsByDriver, qualifyingPositionData]);

  return null;
};
