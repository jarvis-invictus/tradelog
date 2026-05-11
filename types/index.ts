// Shared TypeScript types across the entire codebase

export type Language = 'en' | 'hi' | 'mr'
export type Plan = 'free' | 'pro'
export type TradeDirection = 'buy' | 'sell'
export type TradeStatus = 'active' | 'closed' | 'breakeven'
export type TradeSource = 'mt5' | 'manual'
export type ForexSession = 'London' | 'NewYork' | 'Asia'
export type EntryEmotion = 'calm' | 'confident' | 'fomo' | 'revenge'
export type ExitEmotion = 'followed_plan' | 'exited_early' | 'held_too_long' | 'moved_sl'
export type RuleType = 'max_trades_day' | 'max_risk_pct' | 'daily_loss_limit' | 'stop_after_losses' | 'no_revenge' | 'session_only' | 'no_day'
export type RuleSuggestionStatus = 'pending' | 'accepted' | 'dismissed'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'
export type WeeklyReportType = 'full' | 'light'

export interface User {
  id: string
  name: string | null
  language: Language
  metaapi_account_id: string | null
  mt5_connected: boolean
  onboarding_complete: boolean
  plan: Plan
  plan_expires_at: string | null
  fcm_token: string | null
  created_at: string
}

export interface Trade {
  id: string
  user_id: string
  metaapi_id: string | null
  pair: string
  direction: TradeDirection
  entry_price: number
  sl_price: number | null
  tp_price: number | null
  lot_size: number
  session: ForexSession | null
  open_time: string
  close_time: string | null
  exit_price: number | null
  pnl_rupees: number | null
  status: TradeStatus
  source: TradeSource
  lot_size_deviation: boolean
  created_at: string
}

export interface TradeJournal {
  id: string
  trade_id: string
  user_id: string
  reasoning_text: string | null
  entry_emotion: EntryEmotion | null
  exit_emotion: ExitEmotion | null
  reflection_note: string | null
  streak_counted: boolean
  reasoning_added_at: string | null
  created_at: string
}

export interface UserRule {
  id: string
  user_id: string
  type: RuleType
  definition: Record<string, unknown>
  personal_note: string | null
  compliance_rate: number
  last_broken: string | null
  created_at: string
}

export interface AIFeedback {
  id: string
  trade_id: string
  user_id: string
  feedback_text: string
  actionable_line: string
  patterns_referenced: PatternReference[]
  read: boolean
  generated_at: string
}

export interface PatternReference {
  name: string
  trade_count: number
  win_rate: number
  net_pnl_rupees: number
}

export interface RuleBreak {
  id: string
  rule_id: string
  user_id: string
  trade_id: string | null
  cost_rupees: number | null
  broken_at: string
}

export interface WeeklyReport {
  id: string
  user_id: string
  week_start: string
  headline_text: string
  biggest_insight: string
  pattern_stats: Record<string, unknown>
  rule_compliance: Record<string, unknown>
  next_week_focus: string
  report_type: WeeklyReportType
  total_trades: number
  rule_compliance_rate: number
  generated_at: string
}

export interface ExchangeRate {
  date: string
  usd_inr: number
  fetched_at: string
}
