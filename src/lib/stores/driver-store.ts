import { DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { create } from 'zustand';

interface DriverStore {
  driverData: DriverDataMap;
  setDriverData: (driverData: DriverDataMap) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  driverData: {},
  setDriverData: (driverData: DriverDataMap) => set({ driverData }),
}));
