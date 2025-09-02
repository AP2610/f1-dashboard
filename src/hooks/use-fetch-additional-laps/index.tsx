'use client';

import { useStandings } from '@/hooks/use-standings';
import { CONSTANTS } from '@/lib/constants';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { debounce } from '@/lib/utils/debounce';
import { getLapsForDriverData } from '@/server-functions/api/get-laps-for-driver-data';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const ADDITIONAL_LAPS_TO_FETCH = 3;
const SAFETY_THRESHOLD = 1;

export function useFetchAdditionalLaps() {
  const isFetching = useRef(false);
  const sessionKey = CONSTANTS.raceSessionKey;

  const addDriverLaps = useLapsStore((s) => s.addDriverLaps);

  const isScrubbing = useSessionTimeLineStore((s) => s.isScrubbing);

  const { leaderLapNumber, totalLaps } = useStandings();

  const fetchMoreLaps = useCallback(
    async (upToLap: number) => {
      if (isFetching.current) return;

      isFetching.current = true;

      try {
        const response = await getLapsForDriverData(sessionKey, upToLap);

        if (response.hasError || !response.data) {
          console.error('Error fetching more laps', response.errorMessage);

          // reset the last requested up to lap so we can retry if needed on the next tick
          lastRequestedUpToRef.current = null;
          return;
        }

        addDriverLaps(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        isFetching.current = false;
      }
    },
    [sessionKey, addDriverLaps],
  );

  // so we dont create the debounced function on every render
  const memoizedDebouncedFetch = useMemo(() => debounce(fetchMoreLaps, 1000), [fetchMoreLaps]);

  // storing the last requested up to lap to prevent duplicate requests for the same target
  const lastRequestedUpToRef = useRef<number | null>(null);

  // reset the last requested up to lap when the total laps are more than the last requested up to lap so that we can fetch the next set of laps
  useEffect(() => {
    if (lastRequestedUpToRef.current !== null && totalLaps >= lastRequestedUpToRef.current) {
      lastRequestedUpToRef.current = null;
    }
  }, [totalLaps]);

  useEffect(() => {
    const leadersCurrentLap = leaderLapNumber;
    if (leadersCurrentLap == null) return;

    const lapsLeft = totalLaps - leadersCurrentLap;

    if (lapsLeft <= SAFETY_THRESHOLD) {
      const targetUpToLap = totalLaps + ADDITIONAL_LAPS_TO_FETCH;

      // avoid duplicate calls for the same target up to lap
      if (lastRequestedUpToRef.current === targetUpToLap || isFetching.current) {
        return;
      }

      lastRequestedUpToRef.current = targetUpToLap;

      if (isScrubbing) {
        memoizedDebouncedFetch(targetUpToLap);
        return;
      }

      fetchMoreLaps(targetUpToLap);
    }
  }, [leaderLapNumber, sessionKey, isFetching, memoizedDebouncedFetch, isScrubbing]);
}
