'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { cn } from '@/lib/utils/cn';
import { formatTime } from '@/lib/utils/date/format-date';

interface ScrubberProps {
  className?: string;
  inputClassName?: string;
}

export const Scrubber = ({ className, inputClassName }: ScrubberProps) => {
  const currentTime = useSessionTimeLineStore((state) => state.currentTime);
  const sessionStartTime = useSessionTimeLineStore((state) => state.sessionStartTime);
  const sessionEndTime = useSessionTimeLineStore((state) => state.sessionEndTime);
  const seek = useSessionTimeLineStore((state) => state.seek);

  if (sessionEndTime === null || sessionStartTime === null || currentTime === null) return null;

  const timeLeftInRace = formatTime(sessionEndTime - currentTime);

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
        min={sessionStartTime ?? 0}
        max={sessionEndTime ?? 0}
        value={currentTime ?? sessionStartTime ?? 0}
        onChange={handleScrubberChange}
      />

      <p>-{timeLeftInRace}</p>
    </div>
  );
};
