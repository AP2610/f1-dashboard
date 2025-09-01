'use client';

import { useStandings } from '@/hooks/use-standings';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';

export function LapCounter() {
  const playheadMs = useSessionTimeLineStore((state) => state.playheadMs);
  const { leaderLapNumber, totalLaps } = useStandings();

  if (playheadMs === null) return null;

  if (leaderLapNumber === null) {
    return <div className="text-sm opacity-70">Lap —</div>;
  }

  return (
    <div className="text-sm font-semibold">{totalLaps ? `Lap ${leaderLapNumber} / ${totalLaps}` : `Lap ${leaderLapNumber}`}</div>
  );
}
