import { create } from 'zustand';
import type { CameraState, CameraError } from '@emotional-translation/shared';

interface CameraStore {
  state: CameraState;
  error: CameraError | null;
  resolution: { width: number; height: number };
  setState: (state: CameraState) => void;
  setError: (error: CameraError | null) => void;
  setResolution: (resolution: { width: number; height: number }) => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  state: 'idle',
  error: null,
  resolution: { width: 640, height: 480 },
  setState: (state) => set({ state }),
  setError: (error) => set({ error }),
  setResolution: (resolution) => set({ resolution }),
}));
