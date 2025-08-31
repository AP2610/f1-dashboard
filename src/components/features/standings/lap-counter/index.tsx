'use client';

import { useCurrentLapNumber } from '@/hooks/use-current-lap-number';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';

interface LapCounterProps {
  totalLaps?: number;
}

export function LapCounter({ totalLaps = 72 }: LapCounterProps) {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);
  const { currentLapNumber } = useCurrentLapNumber(sessionStartTime ?? 0);

  if (currentTime == null) return null;

  if (currentLapNumber == null) {
    return <div className="text-sm opacity-70">Lap —</div>;
  }

  return (
    <div className="text-sm font-semibold">
      {totalLaps ? `Lap ${currentLapNumber} / ${totalLaps}` : `Lap ${currentLapNumber}`}
    </div>
  );
}
