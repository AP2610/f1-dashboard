'use client';

import { useStandings } from '@/hooks/use-standings';
import { LapCounter } from './lap-counter';
import { useDriverStore } from '@/lib/stores/driver-store';

// TODO: implement component
export const Standings = () => {
  const { standings } = useStandings();
  const driverData = useDriverStore((state) => state.driverData);

  return (
    <div>
      <h2>Standings</h2>
      <LapCounter />

      {standings.map((standing, index) => (
        <div key={standing.driverNumber} className="flex items-center gap-2">
          <div>POS {index + 1}</div>
          <div>{driverData[standing.driverNumber]?.name_acronym}</div>
          <div>{standing.lapNumber}</div>
          {/* <div>{standing.lapProgress}</div> */}
        </div>
      ))}
    </div>
  );
};
