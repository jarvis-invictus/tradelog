// MetaApi REST integration — server-side only.
// Read-only investor token: can see trades, CANNOT place/modify/close.
// Docs: https://metaapi.cloud/docs/client/

const BASE = 'https://mt-client-api-v1.london.agiliumtrade.ai'

function headers() {
  return {
    'auth-token': process.env.METAAPI_TOKEN!,
    'Content-Type': 'application/json',
  }
}

export type MetaApiDeal = {
  id: string
  type: string           // DEAL_TYPE_BUY | DEAL_TYPE_SELL
  symbol: string
  lots: number
  openPrice: number
  closePrice: number
  profit: number         // USD
  time: string           // ISO
  closeTime?: string
}

export async function connectMT5Account(
  loginId: string,
  password: string,
  server: string
): Promise<{ accountId: string }> {
  const token = process.env.METAAPI_TOKEN
  if (!token) throw new Error('METAAPI_TOKEN not configured')

  const res = await fetch('https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      login: loginId,
      password,
      server,
      name: `TradeLog-${loginId}`,
      type: 'cloud',
      magic: 0,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`MetaApi connect error: ${err}`)
  }

  const data = await res.json() as { id: string }
  return { accountId: data.id }
}

export async function syncTrades(accountId: string): Promise<MetaApiDeal[]> {
  const token = process.env.METAAPI_TOKEN
  if (!token) throw new Error('METAAPI_TOKEN not configured')

  const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

  const res = await fetch(
    `${BASE}/users/current/accounts/${accountId}/history-deals/time/${from}/${new Date().toISOString()}`,
    { headers: headers() }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`MetaApi sync error: ${err}`)
  }

  const data = await res.json() as { deals: MetaApiDeal[] }
  return data.deals ?? []
}

export function mapDealToTrade(deal: MetaApiDeal, userId: string) {
  const direction = deal.type === 'DEAL_TYPE_BUY' ? 'buy' : 'sell'
  return {
    user_id:      userId,
    metaapi_id:   deal.id,
    pair:         deal.symbol,
    direction,
    entry_price:  deal.openPrice,
    exit_price:   deal.closePrice ?? null,
    lot_size:     deal.lots,
    open_time:    deal.time,
    close_time:   deal.closeTime ?? null,
    status:       deal.closeTime ? 'closed' : 'active',
    source:       'metaapi',
    pnl_rupees:   null,
  }
}
