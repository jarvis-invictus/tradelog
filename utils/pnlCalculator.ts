// M5.1 — Pure P&L calculation functions (fully unit testable)
// All values in Indian Rupees (₹)

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

export function calculatePnLRupees(
  lots: number,
  entry: number,
  exit: number,
  _pair: string,
  usdInr: number = 94.5
): number {
  const pipValue = lots * 10
  const pips = (exit - entry) * 10000
  return parseFloat((pips * pipValue * usdInr).toFixed(2))
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

export function usdToRupees(usd: number, rate: number = 94.5): number {
  return parseFloat((usd * rate).toFixed(2))
}
