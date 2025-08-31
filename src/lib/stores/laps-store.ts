import { type LapDataMap } from '@/server-functions/api/get-laps-for-driver-data';
import { create } from 'zustand';

interface LapsStore {
  lapsByDriver: LapDataMap;
  setLapsByDriver: (lapsByDriver: LapDataMap) => void;
  addLapsByDriver: (lapsByDriver: LapDataMap) => void;
}

export const useLapsStore = create<LapsStore>((set) => ({
  lapsByDriver: new Map(),
  setLapsByDriver: (lapsByDriver: LapDataMap) => set({ lapsByDriver }),
  addLapsByDriver: (lapsByDriver: LapDataMap) =>
    set((state) => ({ lapsByDriver: new Map([...state.lapsByDriver, ...lapsByDriver]) })),
}));
