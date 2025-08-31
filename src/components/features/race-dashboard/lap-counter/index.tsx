'use client';

import { useCurrentLapNumber } from '@/hooks/use-current-lap-number';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';

interface LapCounterProps {
  totalLaps?: number;
  sessionStartTime: number;
}

export function LapCounter({ totalLaps = 72, sessionStartTime }: LapCounterProps) {
  const currentTime = useSessionTimeLineStore((s) => s.currentTime);
  const { currentLapNumber } = useCurrentLapNumber(sessionStartTime);

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
