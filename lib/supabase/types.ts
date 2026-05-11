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
      trades: {
        Row: {
          id: string
          user_id: string
          metaapi_id: string | null
          pair: string
          direction: string
          entry_price: number
          sl_price: number | null
          tp_price: number | null
          lot_size: number
          session: string | null
          open_time: string
          close_time: string | null
          exit_price: number | null
          pnl_rupees: number | null
          status: string
          source: string
          lot_size_deviation: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metaapi_id?: string | null
          pair: string
          direction: string
          entry_price: number
          sl_price?: number | null
          tp_price?: number | null
          lot_size: number
          session?: string | null
          open_time?: string
          close_time?: string | null
          exit_price?: number | null
          pnl_rupees?: number | null
          status?: string
          source?: string
          lot_size_deviation?: boolean
        }
        Update: {
          pair?: string
          direction?: string
          entry_price?: number
          sl_price?: number | null
          tp_price?: number | null
          lot_size?: number
          session?: string | null
          open_time?: string
          close_time?: string | null
          exit_price?: number | null
          pnl_rupees?: number | null
          status?: string
        }
        Relationships: []
      }
      trade_journals: {
        Row: {
          id: string
          trade_id: string
          user_id: string
          reasoning_text: string | null
          entry_emotion: string | null
          exit_emotion: string | null
          reflection_note: string | null
          streak_counted: boolean
          reasoning_added_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trade_id: string
          user_id: string
          reasoning_text?: string | null
          entry_emotion?: string | null
          exit_emotion?: string | null
          reflection_note?: string | null
          streak_counted?: boolean
          reasoning_added_at?: string | null
        }
        Update: {
          reasoning_text?: string | null
          entry_emotion?: string | null
          exit_emotion?: string | null
          reflection_note?: string | null
          streak_counted?: boolean
        }
        Relationships: []
      }
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
