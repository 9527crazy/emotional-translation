import { create } from 'zustand';
import type { EmotionResult } from '@emotional-translation/shared';

interface EmotionStore {
  current: EmotionResult | null;
  smoothed: EmotionResult | null;
  sessionHistory: EmotionResult[];
  isDetecting: boolean;
  updateEmotion: (result: EmotionResult) => void;
  setSmoothed: (result: EmotionResult) => void;
  setDetecting: (detecting: boolean) => void;
  clearSession: () => void;
}

export const useEmotionStore = create<EmotionStore>((set) => ({
  current: null,
  smoothed: null,
  sessionHistory: [],
  isDetecting: false,
  updateEmotion: (result) =>
    set((state) => ({
      current: result,
      sessionHistory: [...state.sessionHistory.slice(-299), result],
    })),
  setSmoothed: (result) => set({ smoothed: result }),
  setDetecting: (detecting) => set({ isDetecting: detecting }),
  clearSession: () => set({ current: null, smoothed: null, sessionHistory: [] }),
}));
