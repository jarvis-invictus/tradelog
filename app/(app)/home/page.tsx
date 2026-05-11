import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Trade = {
  id: string
  pair: string
  direction: string
  pnl_rupees: number | null
  status: string
  lot_size: number
  created_at: string
}

function pnlColor(v: number | null) {
  if (v === null) return 'text-text-secondary'
  return v >= 0 ? 'text-up' : 'text-down'
}
function fmtPnl(v: number | null) {
  if (v === null) return '—'
  return `${v >= 0 ? '+' : '-'}$${Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().slice(0, 10)

  const [tradesRes, statsRes] = await Promise.all([
    supabase
      .from('trades')
      .select('id, pair, direction, pnl_rupees, status, lot_size, created_at')
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('trades')
      .select('pnl_rupees, status, created_at')
      .eq('user_id', user?.id ?? ''),
  ])

  const trades: Trade[] = (tradesRes.data ?? []) as Trade[]
  const allTrades = statsRes.data ?? []

  const todayTrades   = allTrades.filter((t) => t.created_at?.slice(0, 10) === today)
  const closedToday   = todayTrades.filter((t) => t.status === 'closed')
  const todayPnl      = closedToday.reduce((s, t) => s + (t.pnl_rupees ?? 0), 0)
  const closedAll     = allTrades.filter((t) => t.status === 'closed')
  const wins          = closedAll.filter((t) => (t.pnl_rupees ?? 0) > 0).length
  const winRate       = closedAll.length > 0 ? Math.round((wins / closedAll.length) * 100) : null

  const stats = [
    { label: "Today's P&L",  value: closedToday.length > 0 ? fmtPnl(todayPnl) : '—', color: closedToday.length > 0 ? pnlColor(todayPnl) : 'text-text-primary' },
    { label: 'Win rate',      value: winRate !== null ? `${winRate}%` : '—',           color: 'text-text-primary' },
    { label: 'Today trades',  value: todayTrades.length > 0 ? String(todayTrades.length) : '—', color: 'text-text-primary' },
    { label: 'Total trades',  value: allTrades.length > 0 ? String(allTrades.length) : '—',     color: 'text-text-primary' },
  ]

  return (
    <div className="py-6 lg:py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-text-secondary text-[13px] mt-1">Your trading overview</p>
        </div>
        <Link href="/trade/new"
          className="btn-primary px-5 py-2.5 text-[13px] font-semibold"
        >
          + Log trade
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card-hover p-4">
            <p className="text-text-tertiary text-[11px] font-medium uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`stat-value ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent trades */}
        <div className="md:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-text-primary font-semibold text-[14px]">Recent trades</p>
            {trades.length > 0 && (
              <span className="text-text-tertiary text-[12px]">{trades.length} total</span>
            )}
          </div>
          {trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <p className="text-text-tertiary text-[13px]">No trades logged yet</p>
              <Link href="/trade/new" className="btn-primary px-4 py-2 text-[13px]">
                Log your first trade
              </Link>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-ink-border">
              {trades.map((t) => (
                <Link key={t.id} href={`/trade/${t.id}`}
                  className="flex items-center justify-between py-3 hover:bg-ink-muted/30 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${t.direction === 'buy' ? 'bg-up' : 'bg-down'}`} />
                    <div>
                      <p className="text-text-primary text-[13px] font-semibold">{t.pair}</p>
                      <p className="text-text-tertiary text-[11px] capitalize">{t.direction} · {t.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[14px] font-bold num ${pnlColor(t.pnl_rupees)}`}>
                      {fmtPnl(t.pnl_rupees)}
                    </p>
                    <p className="text-text-tertiary text-[11px]">{t.lot_size} lots</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <p className="text-text-primary font-semibold text-[14px] mb-4">Quick actions</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Log a trade',      href: '/trade/new' },
              { label: 'Risk calculator',  href: '/calculator' },
              { label: 'View rules',       href: '/rules' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="w-full text-left px-4 py-3 rounded-xl bg-ink-muted hover:bg-ink-border text-text-secondary hover:text-text-primary text-[13px] transition-colors block"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
