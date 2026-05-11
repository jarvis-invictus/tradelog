// M3.3 — Supabase Realtime subscription on trades table
// Exposes: activeTrades, recentClosedTrades, loading
// TODO: Build in M3.3 milestone session
export function useTrades() {
  return { activeTrades: [], recentClosedTrades: [], loading: true }
}
