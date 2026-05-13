'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Rule = {
  id: string
  type: string
  value: number | null
  active: boolean
  name: string
}

export type Violation = {
  ruleId: string
  ruleName: string
  message: string
  severity: 'warn' | 'hard'
}

export function useRules() {
  const supabase = createClient()
  const [rules, setRules]         = useState<Rule[]>([])
  const [violations, setViolations] = useState<Violation[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().slice(0, 10)

      const [rulesRes, todayTradesRes] = await Promise.all([
        supabase.from('user_rules').select('*').eq('user_id', user.id).eq('active', true),
        supabase
          .from('trades')
          .select('pnl_rupees, status, created_at')
          .eq('user_id', user.id)
          .gte('created_at', today + 'T00:00:00Z'),
      ])

      const activeRules: Rule[] = (rulesRes.data ?? []) as Rule[]
      const todayTrades = todayTradesRes.data ?? []
      const closedToday = todayTrades.filter((t) => t.status === 'closed')
      const todayLoss   = closedToday.reduce((s, t) => s + Math.min(t.pnl_rupees ?? 0, 0), 0)

      const fired: Violation[] = []
      for (const rule of activeRules) {
        const val = rule.value ?? 0
        if (rule.type === 'max_trades_day' && todayTrades.length >= val) {
          fired.push({
            ruleId: rule.id, ruleName: rule.name, severity: 'hard',
            message: `You've reached your daily limit of ${val} trade${val !== 1 ? 's' : ''}.`,
          })
        }
        if ((rule.type === 'loss_limit' || rule.type === 'daily_loss_limit') && Math.abs(todayLoss) >= val) {
          fired.push({
            ruleId: rule.id, ruleName: rule.name, severity: 'hard',
            message: `Daily loss limit of ₹${val.toLocaleString('en-IN')} hit. Stop trading for today.`,
          })
        }
      }

      setRules(activeRules)
      setViolations(fired)
      setLoading(false)
    }
    load()
  }, [supabase])

  return { rules, violations, loading }
}
