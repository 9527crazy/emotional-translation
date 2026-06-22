import { create } from 'zustand';

interface UiStore {
  translationPanelOpen: boolean;
  activeTranslationTab: 'color' | 'emoji' | 'text' | 'chart';
  showFaceOverlay: boolean;
  toggleTranslationPanel: () => void;
  setActiveTranslationTab: (tab: UiStore['activeTranslationTab']) => void;
  setShowFaceOverlay: (show: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  translationPanelOpen: true,
  activeTranslationTab: 'color',
  showFaceOverlay: false,
  toggleTranslationPanel: () => set((s) => ({ translationPanelOpen: !s.translationPanelOpen })),
  setActiveTranslationTab: (tab) => set({ activeTranslationTab: tab }),
  setShowFaceOverlay: (show) => set({ showFaceOverlay: show }),
}));
