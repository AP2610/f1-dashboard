'use client';

import { useEffect, useRef } from 'react';
import { useLapsStore } from '@/lib/stores/laps-store';
import { getLapsForDriverData } from '@/server-functions/api/get-laps-for-driver-data';
import { useStandings } from '@/hooks/use-standings';
import { CONSTANTS } from '@/lib/constants';

const ADDITIONAL_LAPS_TO_FETCH = 3;
const SAFETY_THRESHOLD = 1;

export function useFetchAdditionalLaps() {
  const isFetching = useRef(false);
  const sessionKey = CONSTANTS.raceSessionKey;

  const driverLaps = useLapsStore((s) => s.driverLaps);
  const addDriverLaps = useLapsStore((s) => s.addDriverLaps);

  const { leaderLapNumber, totalLaps } = useStandings();

  // storing the last requested up to lap to prevent duplicate requests for the same target
  const lastRequestedUpToRef = useRef<number | null>(null);

  // reset the last requested up to lap when the total laps are more than the last requested up to lap
  useEffect(() => {
    if (lastRequestedUpToRef.current !== null && totalLaps >= lastRequestedUpToRef.current) {
      lastRequestedUpToRef.current = null;
    }
  }, [totalLaps]);

  useEffect(() => {
    console.log('useFetchAdditionalLaps');

    const fetchMoreLaps = async (upToLap: number) => {
      try {
        isFetching.current = true;
        const res = await getLapsForDriverData(sessionKey, upToLap);

        if (res.hasError || !res.data) {
          lastRequestedUpToRef.current = null;
          return;
        }

        addDriverLaps(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        isFetching.current = false;
      }
    };

    const leadersCurrentLap = leaderLapNumber;
    if (leadersCurrentLap == null) return;

    const lapsLeft = totalLaps - leadersCurrentLap;
    console.log('lapsLeft', lapsLeft);

    if (lapsLeft <= SAFETY_THRESHOLD) {
      const targetUpToLap = totalLaps + ADDITIONAL_LAPS_TO_FETCH;
      console.log('targetUpToLap', targetUpToLap);

      // avoid duplicate calls for the same target up to lap
      if (lastRequestedUpToRef.current === targetUpToLap || isFetching.current) {
        return;
      }

      lastRequestedUpToRef.current = targetUpToLap;

      fetchMoreLaps(targetUpToLap);
    }
  }, [leaderLapNumber, totalLaps, driverLaps, sessionKey, addDriverLaps, isFetching]);
}
