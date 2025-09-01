// hooks/use-auto-extend-laps.ts
'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { getLapsForDriverData } from '@/server-functions/api/get-laps-for-driver-data'; // your server function
import { getHighestLapForDriver } from '@/lib/utils/laps-helpers';
import { useStandings } from '@/hooks/use-standings'; // the version returning full standings

const CHUNK_SIZE = 3;
const SAFETY_THRESHOLD = 1; // when only <=1 lap is left, extend

export function useAutoExtendLaps() {
  const queryClient = useQueryClient();

  // stores
  const sessionKey = useSessionTimeLineStore((s) => s.raceSessionKey);
  const driverLaps = useLapsStore((s) => s.driverLaps);
  const addLapsByDriver = useLapsStore((s) => s.addLapsByDriver);

  // leader from standings (already sorted by lapNumber + progress)
  const { standings } = useStandings();
  const leaderNumber = standings[0]?.driverNumber ?? null;

  // prevent duplicate requests for the same target
  const lastRequestedUpToRef = useRef<number | null>(null);

  // A disabled query that we trigger programmatically
  const fetchMore = async (upToLap: number) => {
    if (sessionKey == null) return;
    const res = await getLapsForDriverData(sessionKey, upToLap);
    if (res.hasError || !res.data) return;
    // Merge new laps
    addLapsByDriver(res.data);
    // Prime the cache (optional)
    queryClient.setQueryData(['laps', sessionKey, upToLap], res.data);
  };

  // React Query object so we get refetch behavior if you want later
  const { refetch, isFetching } = useQuery({
    queryKey: ['laps', sessionKey, lastRequestedUpToRef.current],
    queryFn: () => fetchMore(lastRequestedUpToRef.current!),
    enabled: false, // manual control only
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (leaderNumber == null || sessionKey == null) return;

    const highestCached = getHighestLapForDriver(driverLaps, leaderNumber);
    if (highestCached == null) return;

    const leadersCurrentLap = standings[0]?.lapNumber ?? null;
    if (leadersCurrentLap == null) return;

    const lapsLeft = highestCached - leadersCurrentLap;

    if (lapsLeft <= SAFETY_THRESHOLD) {
      const targetUpToLap = highestCached + CHUNK_SIZE;

      // avoid duplicate calls for the same target
      if (lastRequestedUpToRef.current === targetUpToLap || isFetching) return;

      lastRequestedUpToRef.current = targetUpToLap;

      // fire the controlled query
      refetch();
    }
  }, [leaderNumber, standings, driverLaps, sessionKey, isFetching, refetch]);
}
