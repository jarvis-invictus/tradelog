// USD → INR exchange rate fetcher
// Uses Frankfurter API (https://www.frankfurter.app) — 100% free, no API key, ECB-backed
// Caches daily rate in Supabase `exchange_rates` table (see migration 010)
//
// Used by: utils/pnlCalculator.ts for all ₹ P&L math (M5.1)

const FRANKFURTER_URL = 'https://api.frankfurter.dev/v1/latest?from=USD&to=INR'
const FALLBACK_RATE = 94.5

export async function fetchUsdInrRate(): Promise<number> {
  try {
    const res = await fetch(FRANKFURTER_URL, {
      next: { revalidate: 60 * 60 * 12 }, // cache 12 hours at the edge
    })
    if (!res.ok) throw new Error(`Frankfurter returned ${res.status}`)
    const data: { rates?: { INR?: number } } = await res.json()
    const rate = data.rates?.INR
    if (typeof rate !== 'number' || rate <= 0) throw new Error('Invalid rate payload')
    return rate
  } catch (err) {
    // Graceful fallback — never let a rate fetch break P&L
    console.error('[exchangeRate] Frankfurter fetch failed, using fallback:', err)
    return FALLBACK_RATE
  }
}

/**
 * Get today's USD→INR rate.
 * Checks `exchange_rates` table first; if missing for today, fetches + upserts.
 * Pass a Supabase client (server-side, service-role).
 * TODO: wire in M5.1 once the calculator session begins.
 */
export async function getTodayUsdInrRate(_supabase: unknown): Promise<number> {
  // TODO M5.1 — read exchange_rates where date = current_date, fallback to fetchUsdInrRate + upsert
  return fetchUsdInrRate()
}
