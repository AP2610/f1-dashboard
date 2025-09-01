'use client';

import { useStandings } from '@/hooks/use-standings';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';

export function LapCounter() {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const { leaderLapNumber, totalLaps } = useStandings();

  if (currentTime === null) return null;

  if (leaderLapNumber === null) {
    return <div className="text-sm opacity-70">Lap —</div>;
  }

  return (
    <div className="text-sm font-semibold">{totalLaps ? `Lap ${leaderLapNumber} / ${totalLaps}` : `Lap ${leaderLapNumber}`}</div>
  );
}
