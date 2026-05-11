// M6.3 — Streak calculation (pure function)
// Streak = consecutive trade_journals with streak_counted: true
// Reads in reverse chronological order

export function calculateStreak(journals: Array<{ streak_counted: boolean }>): number {
  let streak = 0
  for (const journal of journals) {
    if (journal.streak_counted) {
      streak++
    } else {
      break
    }
  }
  return streak
}
