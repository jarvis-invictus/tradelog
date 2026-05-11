// M0.3 — Generated DB types
// Re-generate after every schema change with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          language: string
          metaapi_account_id: string | null
          mt5_connected: boolean
          onboarding_complete: boolean
          plan: string
          plan_expires_at: string | null
          fcm_token: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          language?: string
          metaapi_account_id?: string | null
          mt5_connected?: boolean
          onboarding_complete?: boolean
          plan?: string
          plan_expires_at?: string | null
          fcm_token?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          language?: string
          metaapi_account_id?: string | null
          mt5_connected?: boolean
          onboarding_complete?: boolean
          plan?: string
          plan_expires_at?: string | null
          fcm_token?: string | null
        }
        Relationships: []
      }
      user_rules: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      trades: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      trade_journals: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      ai_feedback: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      rule_breaks: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      weekly_reports: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      ai_rule_suggestions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      subscriptions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
      exchange_rates: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
