'use server';

import { z } from 'zod';
import { BaseReturnType } from '@/lib/types/api-types';
import { getApiData } from './get-api-data';

const driverDataSchema = z.object({
  broadcast_name: z.string(),
  country_code: z.string(),
  driver_number: z.number(),
  first_name: z.string(),
  full_name: z.string(),
  headshot_url: z.string(),
  last_name: z.string(),
  meeting_key: z.number(),
  name_acronym: z.string(),
  session_key: z.number(),
  team_colour: z.string(),
  team_name: z.string(),
});

export type DriverData = z.infer<typeof driverDataSchema>;
export type DriverDataMap = Record<number, DriverData>;

export const getSessionDriverData = async (raceSessionKey: number): Promise<BaseReturnType<DriverDataMap>> => {
  const path = `/drivers?session_key=${raceSessionKey}`;

  // Validated the data is an array of driver data
  const schema = z.array(driverDataSchema);

  // Pass DriverData[] as the type of the data to be returned
  const { hasError, errorMessage, data: sessionDriverData } = await getApiData<DriverData[]>(path, schema);

  if (hasError || sessionDriverData === null) {
    return { hasError, errorMessage, data: null };
  }

  const driversByNumberMap: DriverDataMap = {};

  for (const driver of sessionDriverData) {
    driversByNumberMap[driver.driver_number] = driver;
  }

  return { hasError, errorMessage, data: driversByNumberMap };
};
