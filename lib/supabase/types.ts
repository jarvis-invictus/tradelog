// M0.3 — Generated DB types
// Re-generate after every schema change with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      user_rules: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      trades: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      trade_journals: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      ai_feedback: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      rule_breaks: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      weekly_reports: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      ai_rule_suggestions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      subscriptions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      exchange_rates: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
