import { z } from 'zod';
import { BaseReturnType } from '@/lib/types/api-types';
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
  lap_duration: z.number().nullable(),
  lap_number: z.number(),
});

type LapData = z.infer<typeof lapDataSchema>;

export const getSessionLapData = async (
  sessionKey: number,
  lapNumber: number,
): Promise<BaseReturnType<Record<number, LapData[]>>> => {
  const path = `/laps?session_key=${sessionKey}&lap_number<=${lapNumber}`;

  // Validated the data is an array of lap data
  const schema = z.array(lapDataSchema);

  // Pass LapData[] as the type of the data to be returned
  const { hasError, errorMessage, data: sessionLapData } = await getApiData<LapData[]>(path, schema);

  if (hasError || sessionLapData === null) {
    return { hasError, errorMessage, data: null };
  }

  const lapsByDriverNumberMap: Record<number, LapData[]> = {};

  // Group the laps by driver number
  for (const lap of sessionLapData) {
    const lapsForDriver = lapsByDriverNumberMap[lap.driver_number] ?? [];

    // Avoid duplicate lap numbers
    if (!lapsForDriver.some((existing) => existing.lap_number === lap.lap_number)) {
      lapsForDriver.push(lap);
    }

    lapsByDriverNumberMap[lap.driver_number] = lapsForDriver;
  }

  // Ensure correct order of laps for each driver
  for (const lapsForDriver of Object.values(lapsByDriverNumberMap)) {
    lapsForDriver.sort((a, b) => a.lap_number - b.lap_number);
  }

  return { hasError, errorMessage, data: lapsByDriverNumberMap };
};
