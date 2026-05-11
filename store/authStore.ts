// M1.2 — Zustand store for user + session
// TODO: Build in M1.2 milestone session
import { create } from 'zustand'

interface AuthState {
  user: null
  session: null
  setUser: (user: null) => void
  setSession: (session: null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
}))
