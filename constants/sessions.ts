export const SESSIONS = ['London', 'NewYork', 'Asia'] as const
export type Session = typeof SESSIONS[number]

export const SESSION_HOURS_UTC: Record<Session, { start: number; end: number }> = {
  London: { start: 8, end: 17 },
  NewYork: { start: 13, end: 22 },
  Asia: { start: 0, end: 9 },
}

export const SESSION_LABELS: Record<Session, string> = {
  London: 'London',
  NewYork: 'New York',
  Asia: 'Asia',
}
