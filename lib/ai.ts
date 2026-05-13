// AI layer — server-side only.
// Priority: ANTHROPIC_API_KEY (Claude) → GROQ_API_KEY (llama-3.3-70b) → error
// All P&L always in ₹. Never mentions pips. Responds in user's language.

type Trade = Record<string, unknown>
type Journal = Record<string, unknown> | null
type Rule = Record<string, unknown>

async function callClaude(prompt: string, maxTokens = 1024): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) { const err = await res.text(); throw new Error(`Claude API error: ${err}`) }
  const data = await res.json() as { content: Array<{ text: string }> }
  return data.content[0]?.text ?? ''
}

async function callGroq(prompt: string, maxTokens = 1024): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY!
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) { const err = await res.text(); throw new Error(`Groq API error: ${err}`) }
  const data = await res.json() as { choices: Array<{ message: { content: string } }> }
  return data.choices[0]?.message?.content ?? ''
}

async function callAI(prompt: string, maxTokens = 1024): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) return callClaude(prompt, maxTokens)
  if (process.env.GROQ_API_KEY)      return callGroq(prompt, maxTokens)
  throw new Error('No AI API key configured. Set ANTHROPIC_API_KEY or GROQ_API_KEY.')
}

export function isAIConfigured(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || process.env.GROQ_API_KEY)
}

export function buildFeedbackPrompt(
  trade: Trade,
  journal: Journal,
  history: Trade[],
  rules: Rule[]
): string {
  const pnl = typeof trade.pnl_rupees === 'number'
    ? `${trade.pnl_rupees >= 0 ? '+' : ''}₹${Math.abs(trade.pnl_rupees).toLocaleString('en-IN')}`
    : 'unknown'

  const wins = history.filter((t) => (t.pnl_rupees as number) > 0).length
  const winRate = history.length > 0 ? Math.round((wins / history.length) * 100) : null

  const activeRules = rules.filter((r) => r.active).map((r) => `- ${r.name}`).join('\n')

  return `You are a disciplined trading coach reviewing a trade. Be direct, specific, and actionable. Do not be encouraging unless warranted.

TRADE:
- Pair: ${trade.pair}, Direction: ${trade.direction}
- P&L: ${pnl}
- Session: ${trade.session ?? 'unknown'}
- Lot size: ${trade.lot_size}
- Entry: ${trade.entry_price}, Exit: ${trade.exit_price ?? 'open'}

JOURNAL:
- Entry emotion: ${journal?.entry_emotion ?? 'not recorded'}
- Exit emotion: ${journal?.exit_emotion ?? 'not recorded'}
- Reasoning: ${journal?.reasoning_text ?? 'none'}
- Post-trade reflection: ${journal?.reflection_note ?? 'none'}

TRADER HISTORY (last ${history.length} closed trades):
- Win rate: ${winRate !== null ? `${winRate}%` : 'N/A'}

ACTIVE RULES:
${activeRules || 'No rules set'}

Write 3–5 short paragraphs covering:
1. Was this trade in line with their rules and reasoning?
2. What does their emotional state reveal?
3. What should they do differently next time?
Keep it under 300 words. No bullet points — write in flowing paragraphs.`
}

export function buildWeeklyReportPrompt(
  trades: Trade[],
  ruleBreaks: Trade[],
  previousWeeks: Trade[][],
  language: string
): string {
  const closedTrades = trades.filter((t) => t.status === 'closed')
  const wins = closedTrades.filter((t) => (t.pnl_rupees as number) > 0)
  const losses = closedTrades.filter((t) => (t.pnl_rupees as number) < 0)
  const totalPnl = closedTrades.reduce((s, t) => s + ((t.pnl_rupees as number) ?? 0), 0)
  const winRate = closedTrades.length > 0 ? Math.round((wins.length / closedTrades.length) * 100) : 0

  const pnlStr = `${totalPnl >= 0 ? '+' : ''}₹${Math.abs(totalPnl).toLocaleString('en-IN')}`

  const langNote = language === 'hi' ? 'Respond in Hindi (Devanagari script).'
    : language === 'mr' ? 'Respond in Marathi (Devanagari script).'
    : 'Respond in English.'

  return `You are a trading performance analyst generating a weekly report. ${langNote}

WEEK SUMMARY:
- Total closed trades: ${closedTrades.length}
- Wins: ${wins.length}, Losses: ${losses.length}
- Win rate: ${winRate}%
- Net P&L: ${pnlStr}
- Rule violations this week: ${ruleBreaks.length}

Previous weeks comparison: ${previousWeeks.length} prior weeks of data available.

Write a structured weekly report with these sections:
1. **Performance Summary** — key numbers and whether it was a good or bad week
2. **Patterns** — recurring mistakes or strengths this week
3. **Rule adherence** — how well they followed their trading rules
4. **Focus for next week** — one or two specific, actionable improvements

Keep it under 400 words. Be honest and direct.`
}

export async function generateFeedback(prompt: string): Promise<string> {
  return callAI(prompt, 800)
}

export async function generateWeeklyReport(prompt: string): Promise<string> {
  return callAI(prompt, 1200)
}
