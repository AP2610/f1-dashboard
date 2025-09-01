'use client';

import { useLapsStore } from '@/lib/stores/laps-store';
import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { cn } from '@/lib/utils/cn';
import { formatTime } from '@/lib/utils/date/format-date';
import { useMemo } from 'react';

interface ScrubberProps {
  className?: string;
  inputClassName?: string;
}

export const Scrubber = ({ className, inputClassName }: ScrubberProps) => {
  const playheadMs = useSessionTimeLineStore((state) => state.playheadMs);
  const sessionStartTimeMs = useSessionTimeLineStore((state) => state.sessionStartTimeMs);
  const sessionEndTime = useSessionTimeLineStore((state) => state.sessionEndTime);
  const seek = useSessionTimeLineStore((state) => state.seek);

  const driverLaps = useLapsStore((state) => state.driverLaps);
  const lastAvailableLap = useMemo(() => driverLaps.get(1)?.at(-1), [driverLaps]);
  const lastAvailableLapStartMs = useMemo(() => lastAvailableLap?.date_start, [lastAvailableLap]);
  const bufferEndMs = useMemo(
    () => lastAvailableLapStartMs! + (lastAvailableLap?.lap_duration ?? 0),
    [lastAvailableLapStartMs, lastAvailableLap],
  );

  if (sessionEndTime === null || sessionStartTimeMs === null || playheadMs === null) return null;

  const timeLeftInRace = formatTime(sessionEndTime - playheadMs);

  const handleScrubberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(event.target.value));
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
        max={bufferEndMs ?? sessionEndTime ?? 0}
        value={playheadMs ?? sessionStartTimeMs ?? 0}
        onChange={handleScrubberChange}
      />

      <p>-{timeLeftInRace}</p>
    </div>
  );
};
