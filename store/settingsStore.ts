// Zustand store for user settings (language, plan, etc.)
// TODO: Build in M2.2 milestone session
import { create } from 'zustand'

type Language = 'en' | 'hi' | 'mr'

interface SettingsState {
  language: Language
  plan: 'free' | 'pro'
  setLanguage: (lang: Language) => void
  setPlan: (plan: 'free' | 'pro') => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en',
  plan: 'free',
  setLanguage: (language) => set({ language }),
  setPlan: (plan) => set({ plan }),
}))
