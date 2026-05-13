export const dynamic = 'force-dynamic'
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

function pnlColorClass(v: number | null) {
  if (v === null) return 'text-ink-secondary'
  return v >= 0 ? 'text-profit-text' : 'text-loss-text'
}

function fmtPnl(v: number | null) {
  if (v === null) return '—'
  return `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
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

  const todayTrades = allTrades.filter((t) => t.created_at?.slice(0, 10) === today)
  const closedToday = todayTrades.filter((t) => t.status === 'closed')
  const todayPnl    = closedToday.reduce((s, t) => s + (t.pnl_rupees ?? 0), 0)
  const closedAll   = allTrades.filter((t) => t.status === 'closed')
  const wins        = closedAll.filter((t) => (t.pnl_rupees ?? 0) > 0).length
  const winRate     = closedAll.length > 0 ? Math.round((wins / closedAll.length) * 100) : null

  return (
    <div className="space-y-4 md:space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Dashboard</h1>
          <p className="text-ink-secondary text-sm mt-0.5">Your trading overview</p>
        </div>
        <Link
          href="/trade/new"
          className="btn-primary !w-auto px-4 py-2.5 text-sm"
        >
          + Log trade
        </Link>
      </div>

      {/* Stat cards — 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Today P&L — hero */}
        <div className="card p-4 flex flex-col gap-1">
          <span className="section-label">Today&apos;s P&L</span>
          <span className={`stat-value num ${closedToday.length > 0 ? pnlColorClass(todayPnl) : 'text-ink-primary'}`}>
            {closedToday.length > 0 ? fmtPnl(todayPnl) : '—'}
          </span>
        </div>

        <div className="card p-4 flex flex-col gap-1">
          <span className="section-label">Win rate</span>
          <span className="stat-value text-ink-primary num">
            {winRate !== null ? `${winRate}%` : '—'}
          </span>
        </div>

        <div className="card p-4 flex flex-col gap-1">
          <span className="section-label">Today trades</span>
          <span className="stat-value text-ink-primary num">
            {todayTrades.length > 0 ? todayTrades.length : '—'}
          </span>
        </div>

        <div className="card p-4 flex flex-col gap-1">
          <span className="section-label">Total trades</span>
          <span className="stat-value text-ink-primary num">
            {allTrades.length > 0 ? allTrades.length : '—'}
          </span>
        </div>
      </div>

      {/* Main content — stacked on mobile, 3-col grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Recent trades — takes 2/3 on desktop */}
        <div className="md:col-span-2 card p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-ink-primary font-semibold text-sm">Recent trades</p>
            {trades.length > 0 && (
              <span className="text-ink-tertiary text-xs">{trades.length} shown</span>
            )}
          </div>

          {trades.length === 0 ? (
            <div className="empty-state py-10">
              <p className="empty-state-text">No trades logged yet</p>
              <Link href="/trade/new" className="btn-primary !w-auto px-4 py-2 text-sm mt-2">
                Log your first trade
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {trades.map((t, i) => (
                <Link
                  key={t.id}
                  href={`/trade/${t.id}`}
                  className={`flex items-center justify-between py-3 px-2 -mx-2 rounded-[4px] hover:bg-surface-700 transition-colors duration-150 ${i > 0 ? 'border-t border-surface-300' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full shrink-0 ${t.direction === 'buy' ? 'bg-profit' : 'bg-loss'}`} />
                    <div>
                      <p className="trade-pair text-sm">{t.pair}</p>
                      <p className="text-ink-tertiary text-xs capitalize mt-0.5">
                        {t.direction} · {t.status} · {t.lot_size} lots
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-semibold text-sm num ${pnlColorClass(t.pnl_rupees)}`}>
                      {fmtPnl(t.pnl_rupees)}
                    </p>
                    <p className="text-ink-tertiary text-xs mt-0.5">
                      {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions — 1/3 on desktop, full width below on mobile */}
        <div className="flex flex-col gap-3">
          <div className="card p-4 md:p-5">
            <p className="text-ink-primary font-semibold text-sm mb-3">Quick actions</p>
            <div className="flex flex-col gap-2">
              {[
                { label: '+ Log a trade',     href: '/trade/new' },
                { label: 'Risk calculator',   href: '/calculator' },
                { label: 'View rules',        href: '/rules' },
                { label: 'Analytics',         href: '/analytics' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="w-full text-left px-4 py-3 rounded-[4px] bg-surface-600 hover:bg-surface-500 text-ink-secondary hover:text-ink-primary text-sm transition-all duration-150 block"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Week summary mini card */}
          <div className="card p-4">
            <p className="section-label mb-3">This week</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-ink-tertiary text-xs mb-1">Closed</p>
                <p className="font-mono font-semibold text-ink-primary text-base num">{closedAll.length}</p>
              </div>
              <div>
                <p className="text-ink-tertiary text-xs mb-1">Win rate</p>
                <p className="font-mono font-semibold text-ink-primary text-base num">
                  {winRate !== null ? `${winRate}%` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
