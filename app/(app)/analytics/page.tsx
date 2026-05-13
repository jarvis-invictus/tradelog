export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default async function AnalyticsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trades } = await supabase
    .from('trades')
    .select('id, pair, direction, pnl_rupees, status, session, entry_price, exit_price, lot_size, open_time, close_time, created_at')
    .eq('user_id', user?.id ?? '')
    .eq('status', 'closed')
    .order('created_at', { ascending: true })

  const { data: journals } = await supabase
    .from('trade_journals')
    .select('trade_id, entry_emotion')
    .eq('user_id', user?.id ?? '')

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Analytics</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Performance breakdown across all your trades</p>
      </div>
      <AnalyticsDashboard trades={trades ?? []} journals={journals ?? []} />
    </div>
  )
}
