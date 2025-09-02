'use client';

import { useStandings } from '@/hooks/use-standings';
import { LapCounter } from './lap-counter';
import { useDriverStore } from '@/lib/stores/driver-store';
import { StandingsRow } from './standings-row';

// TODO: implement component
export const Standings = () => {
  const { standings } = useStandings();
  const driverData = useDriverStore((state) => state.driverData);

  return (
    <div className="rounded-md bg-black/90 pt-6 font-raleway shadow-lg">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-bold">Standings</h2>
        <LapCounter />
      </div>

      <ul>
        {standings.map((standing, index) => (
          <StandingsRow
            key={driverData.get(standing.driverNumber)?.driver_number}
            position={index + 1}
            acronym={driverData.get(standing.driverNumber)?.name_acronym ?? 'N/A'}
            teamHex={driverData.get(standing.driverNumber)?.team_colour ?? '000'}
            lapNumber={standing.lapNumber}
            lapProgress={standing.lapProgress}
          />
        ))}
      </ul>
    </div>
  );
};
