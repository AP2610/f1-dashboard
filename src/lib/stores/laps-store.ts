import { type LapDataMap } from '@/server-functions/api/get-laps-for-driver-data';
import { create } from 'zustand';

interface LapsStore {
  driverLaps: LapDataMap;
  setLapsByDriver: (driverLaps: LapDataMap) => void;
  addLapsByDriver: (driverLaps: LapDataMap) => void;
}

export const useLapsStore = create<LapsStore>((set) => ({
  driverLaps: new Map(),
  setLapsByDriver: (driverLaps: LapDataMap) => set({ driverLaps }),
  addLapsByDriver: (driverLaps: LapDataMap) => set((state) => ({ driverLaps: new Map([...state.driverLaps, ...driverLaps]) })),
}));
