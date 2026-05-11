// M3.5 — Detect forex session from UTC timestamp (pure function)

export type ForexSession = 'London' | 'NewYork' | 'Asia'

export function detectSession(timestamp: Date): ForexSession {
  const utcHour = timestamp.getUTCHours()

  // London: 08:00–17:00 UTC
  if (utcHour >= 8 && utcHour < 17) return 'London'

  // New York: 13:00–22:00 UTC (overlaps with London 13–17)
  if (utcHour >= 13 && utcHour < 22) return 'NewYork'

  // Asia: 00:00–09:00 UTC
  return 'Asia'
}
