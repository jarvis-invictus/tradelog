// Zustand store for rules state
// TODO: Build in M8.1 milestone session
import { create } from 'zustand'

interface RulesState {
  rules: unknown[]
  setRules: (rules: unknown[]) => void
}

export const useRulesStore = create<RulesState>((set) => ({
  rules: [],
  setRules: (rules) => set({ rules }),
}))
