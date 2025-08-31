'use server';

import { type BaseReturnType } from '@/lib/types/api-types';
import { type DriverData, getSessionDriverData } from './get-session-driver-data';
import { getSessionResult } from './get-session-result';

export type DriverDataMapWithQualifyingPosition = Map<number, DriverData & { qualifyingPosition: number }>;

export const getSessionDriverDataWithQualifying = async (
  raceSessionKey: number,
  qualifyingSessionKey: number,
): Promise<BaseReturnType<DriverDataMapWithQualifyingPosition>> => {
  const [driverDataResult, qualifyingResult] = await Promise.all([
    getSessionDriverData(raceSessionKey),
    getSessionResult(qualifyingSessionKey),
  ]);

  if (driverDataResult.hasError || qualifyingResult.hasError) {
    return {
      hasError: true,
      errorMessage: driverDataResult.errorMessage || qualifyingResult.errorMessage,
      data: null,
    };
  }

  const driverData = driverDataResult.data!;
  const qualifyingData = qualifyingResult.data!;

  const driverDataWithQualifying: DriverDataMapWithQualifyingPosition = new Map();

  for (const [driverNumber, driver] of Object.entries(driverData)) {
    const qualifyingPosition = qualifyingData.find((position) => position.driver_number === Number(driverNumber));

    // If no qualifying position is available, set it to be the last place
    driverDataWithQualifying.set(Number(driverNumber), {
      ...driver,
      qualifyingPosition: qualifyingPosition?.position ?? qualifyingData.length + 1,
    });
  }

  // Need the sort so markers are at the right position
  const sortedEntries = Array.from(driverDataWithQualifying.entries()).sort(
    ([, a], [, b]) => a.qualifyingPosition - b.qualifyingPosition,
  );

  const sortedDriverData: DriverDataMapWithQualifyingPosition = new Map();

  for (const [driverNumber, driverData] of sortedEntries) {
    sortedDriverData.set(driverNumber, driverData);
  }

  return { hasError: false, errorMessage: null, data: sortedDriverData };
};
