// Zustand store for trade state
// TODO: Build in M3.3 milestone session
import { create } from 'zustand'

interface TradeState {
  activeTrades: unknown[]
  recentTrades: unknown[]
  setActiveTrades: (trades: unknown[]) => void
  setRecentTrades: (trades: unknown[]) => void
}

export const useTradeStore = create<TradeState>((set) => ({
  activeTrades: [],
  recentTrades: [],
  setActiveTrades: (activeTrades) => set({ activeTrades }),
  setRecentTrades: (recentTrades) => set({ recentTrades }),
}))
