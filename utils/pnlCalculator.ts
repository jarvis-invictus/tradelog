// M5.1 — Pure P&L calculation functions (fully unit testable)
// All monetary values in USD ($)

export function calculateLotSize(
  balance: number,
  riskPct: number,
  entry: number,
  sl: number
): number {
  const riskAmount = balance * (riskPct / 100)
  const pipDiff = Math.abs(entry - sl)
  if (pipDiff === 0) return 0
  return parseFloat((riskAmount / (pipDiff * 100000)).toFixed(2))
}

export function calculatePnLUSD(
  lots: number,
  entry: number,
  exit: number,
  pair: string
): number {
  const diff = exit - entry
  if (pair.includes('XAU') || pair.includes('GOLD')) {
    // XAUUSD: 1 lot = 100 oz
    return parseFloat((diff * lots * 100).toFixed(2))
  } else if (pair.includes('JPY')) {
    // JPY pairs: pip = 0.01, pip value ~= $10/lot
    return parseFloat((diff * 100 * lots * 10).toFixed(2))
  } else if (pair === 'NIFTY' || pair === 'BANKNIFTY' || pair === 'SENSEX') {
    // Indian indices — 1 lot = 1 unit for simplicity
    return parseFloat((diff * lots).toFixed(2))
  } else {
    // Standard forex: 1 lot = 100,000 units, pip value = $10
    return parseFloat((diff * 10000 * lots * 10).toFixed(2))
  }
}

export function calculateRR(
  entry: number,
  sl: number,
  tp: number
): number {
  const risk = Math.abs(entry - sl)
  const reward = Math.abs(tp - entry)
  if (risk === 0) return 0
  return parseFloat((reward / risk).toFixed(2))
}
