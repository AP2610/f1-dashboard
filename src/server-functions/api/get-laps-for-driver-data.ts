'use server';

import { z } from 'zod';
import { type BaseReturnType } from '@/lib/types/api-types';
import { getApiData } from './get-api-data';

const lapDataSchema = z.object({
  date_start: z
    .string()
    .transform((val) => (val ? Date.parse(val) : null))
    .nullable(),
  driver_number: z.number(),
  duration_sector_1: z.number().nullable(),
  duration_sector_2: z.number().nullable(),
  duration_sector_3: z.number().nullable(),
  is_pit_out_lap: z.boolean(),
  // Convert seconds to milliseconds
  lap_duration: z
    .number()
    .transform((val) => (val ? val * 1000 : null))
    .nullable(),
  lap_number: z.number(),
});

export type LapData = z.infer<typeof lapDataSchema>;
export type LapDataMap = Map<number, LapData[]>;

export const getLapsForDriverData = async (raceSessionKey: number, lapNumber: number): Promise<BaseReturnType<LapDataMap>> => {
  const path = `/laps?session_key=${raceSessionKey}&lap_number<=${lapNumber}`;

  // Validated the data is an array of lap data
  const schema = z.array(lapDataSchema);

  const { hasError, errorMessage, data: sessionLapData } = await getApiData<LapData[]>(path, schema);

  if (hasError || sessionLapData === null) {
    return { hasError, errorMessage, data: null };
  }

  /**
   * Important to remember that the api returns lap data according to race positions.
   * So for example, if Norris is in position 2, then the first lap data for Norris will be the second lap data in the array.
   * But if his position changes to P1 in lap 2, then his second lap data will be in the first position of the array.
   */
  const lapsByDriverNumberMap: LapDataMap = new Map();

  // Group the laps by driver number
  for (const lap of sessionLapData) {
    const lapsForDriver = lapsByDriverNumberMap.get(lap.driver_number) ?? [];

    // Avoid duplicate lap numbers
    if (!lapsForDriver.some((existing) => existing.lap_number === lap.lap_number)) {
      lapsForDriver.push(lap);
    }

    lapsByDriverNumberMap.set(lap.driver_number, lapsForDriver);
  }

  // Ensure correct order of laps for each driver
  for (const lapsForDriver of [...lapsByDriverNumberMap.values()]) {
    lapsForDriver.sort((a, b) => a.lap_number - b.lap_number);
  }

  return { hasError, errorMessage, data: lapsByDriverNumberMap };
};
