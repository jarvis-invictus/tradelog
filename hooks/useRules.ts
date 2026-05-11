// M8.1 — Rule monitoring logic (7 rule types)
// Checks: max_trades_day, max_risk_pct, daily_loss_limit, stop_after_losses,
//         no_revenge, session_only, no_day
// TODO: Build in M8.1 milestone session
export function useRules() {
  return { rules: [], violations: [], loading: true }
}
