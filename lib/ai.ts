// M7.2 / M10.2 — Claude API calls (server-side only)
// Model: claude-3-5-sonnet
// All P&L in ₹, never pips. Respond in user's language (en/hi/mr).
// TODO: Build prompts in M7.2 and M10.2 milestone sessions

export function buildFeedbackPrompt(
  _trade: unknown,
  _journal: unknown,
  _history: unknown[],
  _rules: unknown[]
): string {
  throw new Error('Not implemented')
}

export function buildWeeklyReportPrompt(
  _trades: unknown[],
  _ruleBreaks: unknown[],
  _previousWeeks: unknown[],
  _language: string
): string {
  throw new Error('Not implemented')
}

export async function generateFeedback(_prompt: string): Promise<string> {
  throw new Error('Not implemented')
}

export async function generateWeeklyReport(_prompt: string): Promise<string> {
  throw new Error('Not implemented')
}
