import { type DriverDataMapWithQualifyingPosition } from '@/server-functions/api/get-session-driver-data-with-qualifying';
import { create } from 'zustand';

interface DriverStore {
  driverData: DriverDataMapWithQualifyingPosition;
  setDriverData: (driverData: DriverDataMapWithQualifyingPosition) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  driverData: new Map(),
  setDriverData: (driverData: DriverDataMapWithQualifyingPosition) => set({ driverData }),
}));
