'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePnL() {
  const supabase = createClient()
  const [todayPnL, setTodayPnL] = useState<number>(0)
  const [weekPnL, setWeekPnL]   = useState<number>(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today   = new Date().toISOString().slice(0, 10)
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

      const [todayRes, weekRes] = await Promise.all([
        supabase
          .from('trades')
          .select('pnl_rupees')
          .eq('user_id', user.id)
          .eq('status', 'closed')
          .gte('close_time', today + 'T00:00:00Z'),
        supabase
          .from('trades')
          .select('pnl_rupees')
          .eq('user_id', user.id)
          .eq('status', 'closed')
          .gte('close_time', weekAgo),
      ])

      const sum = (rows: { pnl_rupees: number | null }[] | null) =>
        (rows ?? []).reduce((s, t) => s + (t.pnl_rupees ?? 0), 0)

      setTodayPnL(sum(todayRes.data))
      setWeekPnL(sum(weekRes.data))
      setLoading(false)
    }
    load()
  }, [supabase])

  return { todayPnL, weekPnL, loading }
}
