import { type LapDataMap } from '@/server-functions/api/get-laps-for-driver-data';
import { create } from 'zustand';

interface LapsStore {
  driverLaps: LapDataMap;
  setDriverLaps: (driverLaps: LapDataMap) => void;
  addDriverLaps: (driverLaps: LapDataMap) => void;
}

export const useLapsStore = create<LapsStore>((set) => ({
  driverLaps: new Map(),
  setDriverLaps: (driverLaps: LapDataMap) => set({ driverLaps }),
  addDriverLaps: (driverLaps: LapDataMap) => set((state) => ({ driverLaps: new Map([...state.driverLaps, ...driverLaps]) })),
}));
