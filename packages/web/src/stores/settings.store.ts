import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TranslationMode = 'color' | 'emoji' | 'text' | 'chart';

interface SettingsStore {
  theme: 'light' | 'dark' | 'auto';
  preferredTranslations: TranslationMode[];
  privacyMode: boolean;
  language: 'zh' | 'en';
  updateSettings: (partial: Partial<Omit<SettingsStore, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      preferredTranslations: ['color', 'emoji', 'text', 'chart'],
      privacyMode: false,
      language: 'zh',
      updateSettings: (partial) => set(partial),
    }),
    { name: 'et-settings' },
  ),
);
