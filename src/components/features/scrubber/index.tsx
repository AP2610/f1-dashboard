'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { cn } from '@/lib/utils/cn';
import { formatTime } from '@/lib/utils/date/format-date';

interface ScrubberProps {
  className?: string;
  inputClassName?: string;
}

export const Scrubber = ({ className, inputClassName }: ScrubberProps) => {
  const playheadMs = useSessionTimeLineStore((state) => state.playheadMs);
  const sessionStartTimeMs = useSessionTimeLineStore((state) => state.sessionStartTimeMs);
  const sessionEndTime = useSessionTimeLineStore((state) => state.sessionEndTime);
  const seek = useSessionTimeLineStore((state) => state.seek);

  if (sessionEndTime === null || sessionStartTimeMs === null || playheadMs === null) return null;

  const timeLeftInRace = formatTime(sessionEndTime - playheadMs);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <div className={cn('space-y-2 font-raleway', className)}>
      <label htmlFor="scrubber">Scrubber</label>
      <input
        className={cn('w-full', inputClassName)}
        type="range"
        id="scrubber"
        step="10000"
        min={sessionStartTimeMs ?? 0}
        max={sessionEndTime ?? 0}
        value={playheadMs ?? sessionStartTimeMs ?? 0}
        onChange={handleScrubberChange}
      />

      <p>-{timeLeftInRace}</p>
    </div>
  );
};
