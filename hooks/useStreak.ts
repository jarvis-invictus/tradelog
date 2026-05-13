'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useStreak() {
  const supabase = createClient()
  const [streak, setStreak]   = useState(0)
  const [history, setHistory] = useState<boolean[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('trade_journals')
        .select('streak_counted, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)

      const rows = data ?? []
      let s = 0
      for (const row of rows) {
        if (row.streak_counted) s++
        else break
      }
      setStreak(s)
      setHistory(rows.map((r) => !!r.streak_counted))
    }
    load()
  }, [supabase])

  return { streak, history }
}
