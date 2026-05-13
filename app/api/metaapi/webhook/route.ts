// MetaApi webhook: handles trade-completed events pushed from MetaApi stream.
// Configure the webhook URL in MetaApi dashboard: POST /api/metaapi/webhook

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mapDealToTrade, type MetaApiDeal } from '@/lib/metaapi'

type WebhookPayload = {
  type: 'deal-completed' | 'order-completed' | string
  accountId: string
  deal?: MetaApiDeal
  userId?: string
}

export async function POST(request: NextRequest) {
  if (!process.env.METAAPI_TOKEN) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const payload = await request.json() as WebhookPayload

    if (payload.type !== 'deal-completed' || !payload.deal) {
      return Response.json({ ignored: true })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: userRow } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('metaapi_account_id', payload.accountId)
      .maybeSingle() as { data: { id: string } | null }

    if (!userRow) return Response.json({ error: 'User not found for accountId' }, { status: 404 })

    const tradeRow = mapDealToTrade(payload.deal, userRow.id)

    const { data: existing } = await supabaseAdmin
      .from('trades')
      .select('id')
      .eq('metaapi_id', payload.deal.id)
      .maybeSingle()

    if (existing) {
      await supabaseAdmin
        .from('trades')
        .update({
          exit_price: tradeRow.exit_price,
          close_time: tradeRow.close_time,
          status:     'closed',
        })
        .eq('id', (existing as { id: string }).id)
    } else {
      await supabaseAdmin.from('trades').insert(tradeRow)
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('MetaAPI webhook error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Webhook failed' },
      { status: 500 }
    )
  }
}
