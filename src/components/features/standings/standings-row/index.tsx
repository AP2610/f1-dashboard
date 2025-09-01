import { memo } from 'react';

type RowProps = {
  position: number;
  acronym: string;
  teamHex: string;
  lapNumber: number; // Only being use for memo comparison
  lapProgress: number;
};

export const StandingsRow = memo(
  ({ position, acronym, teamHex, lapProgress }: RowProps) => {
    return (
      <li className="flex items-center gap-2">
        <span className="w-6 text-right tabular-nums">P{position}</span>
        <span className="inline-block h-3 w-3 rounded-sm" style={{ background: `#${teamHex}` }} />
        <span className="font-semibold">{acronym}</span>
        <span className="ml-auto h-1 w-20 bg-black/10">
          <span className="block h-1" style={{ width: `${Math.round(lapProgress * 100)}%`, background: `#${teamHex}` }} />
        </span>
      </li>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.position === nextProps.position &&
      prevProps.acronym === nextProps.acronym &&
      prevProps.teamHex === nextProps.teamHex &&
      prevProps.lapNumber === nextProps.lapNumber &&
      // rounding to avoiid rerenders on tiny decimal changes
      Math.round(prevProps.lapProgress * 100) === Math.round(nextProps.lapProgress * 100)
    );
  },
);

StandingsRow.displayName = 'StandingsRow';
