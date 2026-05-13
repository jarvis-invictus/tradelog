'use client'
import { usePnL } from '@/hooks/usePnL'

export default function TodayPnL() {
  const { todayPnL, weekPnL, loading } = usePnL()

  if (loading) return (
    <div className="card p-4 animate-pulse">
      <div className="h-3 w-16 bg-surface-500 rounded mb-2" />
      <div className="h-7 w-24 bg-surface-500 rounded" />
    </div>
  )

  const fmt = (v: number) =>
    `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  const cls = (v: number) => v >= 0 ? 'text-profit-text' : 'text-loss-text'

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div>
        <p className="section-label">Today&apos;s P&L</p>
        <p className={`stat-value num ${todayPnL !== 0 ? cls(todayPnL) : 'text-ink-primary'}`}>
          {todayPnL !== 0 ? fmt(todayPnL) : '—'}
        </p>
      </div>
      <div>
        <p className="section-label">This week</p>
        <p className={`text-lg font-mono font-bold num ${weekPnL !== 0 ? cls(weekPnL) : 'text-ink-secondary'}`}>
          {weekPnL !== 0 ? fmt(weekPnL) : '—'}
        </p>
      </div>
    </div>
  )
}
