import { createServerClient } from '@/lib/supabase/server'
import { syncTrades, mapDealToTrade } from '@/lib/metaapi'

export async function POST() {
  if (!process.env.METAAPI_TOKEN) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('users')
      .select('metaapi_account_id')
      .eq('id', user.id)
      .maybeSingle()

    const accountId = (profile as Record<string, unknown>)?.metaapi_account_id as string | undefined
    if (!accountId) {
      return Response.json({ error: 'No MT5 account connected' }, { status: 422 })
    }

    const deals = await syncTrades(accountId)

    const { data: existing } = await supabase
      .from('trades')
      .select('metaapi_id')
      .eq('user_id', user.id)
      .not('metaapi_id', 'is', null)

    const existingIds = new Set((existing ?? []).map((t) => t.metaapi_id))
    const newDeals = deals.filter((d) => !existingIds.has(d.id))

    if (newDeals.length > 0) {
      const rows = newDeals.map((d) => mapDealToTrade(d, user.id))
      await supabase.from('trades').insert(rows)
    }

    return Response.json({ synced: newDeals.length, total: deals.length })
  } catch (err) {
    console.error('MetaAPI sync error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
