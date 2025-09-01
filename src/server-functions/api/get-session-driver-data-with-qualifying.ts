'use server';

import { type BaseReturnType } from '@/lib/types/api-types';
import { type DriverData, DriverDataObject, getSessionDriverData } from './get-session-driver-data';
import { getSessionResult } from './get-session-result';
import path from 'path';
import { promises as fs } from 'fs';

export type DriverDataMapWithQualifyingPosition = Map<number, DriverData & { qualifyingPosition: number }>;

export const getSessionDriverDataWithQualifying = async (
  raceSessionKey: number,
  qualifyingSessionKey: number,
): Promise<BaseReturnType<DriverDataMapWithQualifyingPosition>> => {
  if (process.env.NEXT_PUBLIC_USE_BACKUP_DATA === 'true') {
    const driverDataFilePath = path.join(process.cwd(), 'src/lib/backup-json/driver-data.json');
    const qualifyingDataFilePath = path.join(process.cwd(), 'src/lib/backup-json/qualifying-data.json');

    const driverDataRaw = await fs.readFile(driverDataFilePath, 'utf-8');
    const qualifyingDataRaw = await fs.readFile(qualifyingDataFilePath, 'utf-8');

    const backupDriverData = JSON.parse(driverDataRaw) as DriverData[];

    const backupQualifyingData = JSON.parse(qualifyingDataRaw) as {
      driver_number: number;
      position: number;
    }[];

    const driversByNumberObject: DriverDataObject = {};

    for (const driver of backupDriverData) {
      driversByNumberObject[driver.driver_number] = driver;
    }

    const backupDriverDataWithQualifying: DriverDataMapWithQualifyingPosition = new Map();

    for (const [driverNumber, driver] of Object.entries(driversByNumberObject)) {
      const qualifyingPosition = backupQualifyingData.find((position) => position.driver_number === Number(driverNumber));

      // If no qualifying position is available, set it to be the last place
      backupDriverDataWithQualifying.set(Number(driverNumber), {
        ...driver,
        qualifyingPosition: qualifyingPosition?.position ?? backupQualifyingData.length + 1,
      });
    }

    // Need the sort so markers are at the right position
    const backupSortedEntries = Array.from(backupDriverDataWithQualifying.entries()).sort(
      ([, a], [, b]) => a.qualifyingPosition - b.qualifyingPosition,
    );

    const backupSortedDriverData: DriverDataMapWithQualifyingPosition = new Map();

    for (const [driverNumber, driverData] of backupSortedEntries) {
      backupSortedDriverData.set(driverNumber, driverData);
    }

    return { hasError: false, errorMessage: null, data: backupSortedDriverData };
  }

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
