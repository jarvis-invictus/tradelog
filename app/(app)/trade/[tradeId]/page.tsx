export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TradeDetailClient from '@/components/trades/TradeDetailClient'

export default async function TradeDetailPage({ params }: { params: { tradeId: string } }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [tradeRes, journalRes] = await Promise.all([
    supabase
      .from('trades')
      .select('*')
      .eq('id', params.tradeId)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
    supabase
      .from('trade_journals')
      .select('*')
      .eq('trade_id', params.tradeId)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
  ])

  if (!tradeRes.data) notFound()

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/journal" className="text-ink-tertiary hover:text-ink-secondary text-sm transition-colors duration-150">
          ← Journal
        </Link>
        <span className="text-surface-300">|</span>
        <h1 className="text-xl font-bold text-ink-primary tracking-tight">Trade detail</h1>
      </div>
      <TradeDetailClient trade={tradeRes.data} journal={journalRes.data ?? null} />
    </div>
  )
}
