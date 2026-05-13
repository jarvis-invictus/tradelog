export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import JournalFeed from '@/components/journal/JournalFeed'

export default async function JournalPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [tradesRes, journalsRes] = await Promise.all([
    supabase
      .from('trades')
      .select('id, pair, direction, pnl_rupees, status, lot_size, session, open_time, close_time, created_at')
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false }),
    supabase
      .from('trade_journals')
      .select('id, trade_id, entry_emotion, reasoning_text, reflection_note, created_at')
      .eq('user_id', user?.id ?? ''),
  ])

  const trades = tradesRes.data ?? []
  const journals = journalsRes.data ?? []

  const journalMap = Object.fromEntries(journals.map((j) => [j.trade_id, j]))

  const feedItems = trades.map((t) => ({
    ...t,
    journal: journalMap[t.id] ?? null,
  }))

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Journal</h1>
          <p className="text-ink-secondary text-sm mt-0.5">Your trades and reflections</p>
        </div>
      </div>
      <JournalFeed items={feedItems} />
    </div>
  )
}
