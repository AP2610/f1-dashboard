'use client';

import { CONSTANTS } from '@/lib/constants';
import { useDriverStore } from '@/lib/stores/driver-store';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { type DriverDataMapWithQualifyingPosition } from '@/server-functions/api/get-session-driver-data-with-qualifying';
import { type LapDataMap } from '@/server-functions/api/get-laps-for-driver-data';
import { type SessionResult } from '@/server-functions/api/get-session-result';
import { useEffect } from 'react';
import { useFetchAdditionalLaps } from '@/hooks/use-fetch-additional-laps';

interface SessionInitialiserProps {
  sessionStartTimeMs: number;
  initialCurrentTime: number;
  sessionEndTime: number;
  sessionDriverDataWithQualifying: DriverDataMapWithQualifyingPosition;
  initialLapsByDriver: LapDataMap;
  qualifyingPositionData: SessionResult[];
}

export const SessionInitialiser = ({
  sessionStartTimeMs,
  initialCurrentTime,
  sessionEndTime,
  sessionDriverDataWithQualifying,
  initialLapsByDriver,
  qualifyingPositionData,
}: SessionInitialiserProps) => {
  const setSession = useSessionTimeLineStore((state) => state.setSession);
  const setDriverLaps = useLapsStore((state) => state.setDriverLaps);
  const setDriverData = useDriverStore((state) => state.setDriverData);

  useFetchAdditionalLaps();

  useEffect(() => {
    setSession(CONSTANTS.raceSessionKey, sessionStartTimeMs, sessionEndTime, initialCurrentTime);
    setDriverLaps(initialLapsByDriver);
    setDriverData(sessionDriverDataWithQualifying);
  }, [sessionStartTimeMs, sessionEndTime, sessionDriverDataWithQualifying, initialLapsByDriver, qualifyingPositionData]);

  return null;
};
