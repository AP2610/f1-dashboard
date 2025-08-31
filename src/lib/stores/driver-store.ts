import { DriverData, DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { SessionResult } from '@/server-functions/api/get-session-result';
import { create } from 'zustand';

type DriverDataMapWithQualifyingPosition = Record<number, DriverData & { qualifyingPosition: number }>;

interface DriverStore {
  driverData: DriverDataMapWithQualifyingPosition;
  setDriverData: (driverData: DriverDataMap, qualifyingPositionData: SessionResult[]) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  driverData: {},

  setDriverData: (driverData: DriverDataMap, qualifyingPositionData: SessionResult[]) => {
    const driverDataWithQualifyingPosition: DriverDataMapWithQualifyingPosition = {};

    Object.keys(driverData).forEach((driverNumberString) => {
      const driverNumber = Number(driverNumberString);
      const qualifyingPosition = qualifyingPositionData.find((position) => position.driver_number === driverNumber);

      // If no qualifying position is available, set it to be the last place
      driverDataWithQualifyingPosition[driverNumber] = {
        ...driverData[driverNumber],
        qualifyingPosition: qualifyingPosition?.position ?? qualifyingPositionData.length + 1,
      };
    });
    set({ driverData: driverDataWithQualifyingPosition });
  },
}));
