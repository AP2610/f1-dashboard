import { LapDataMap } from '@/server-functions/api/get-session-lap-data';
import { create } from 'zustand';

interface LapsStore {
  lapsByDriver: LapDataMap;
  setLapsByDriver: (lapsByDriver: LapDataMap) => void;
  addLapsByDriver: (lapsByDriver: LapDataMap) => void;
}

export const useLapsStore = create<LapsStore>((set) => ({
  lapsByDriver: {},
  setLapsByDriver: (lapsByDriver: LapDataMap) => set({ lapsByDriver }),
  addLapsByDriver: (lapsByDriver: LapDataMap) => set((state) => ({ lapsByDriver: { ...state.lapsByDriver, ...lapsByDriver } })),
}));
