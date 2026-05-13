'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

type Trade = {
  id: string
  pair: string
  direction: string
  pnl_rupees: number | null
  status: string
  session: string | null
  entry_price: number
  exit_price: number | null
  lot_size: number
  open_time: string
  close_time: string | null
  created_at: string
}

type Journal = {
  trade_id: string
  entry_emotion: string | null
}

type Period = 'week' | 'month' | 'all'

function fmtPnl(v: number) {
  return `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function pnlClass(v: number) {
  return v > 0 ? 'text-profit-text' : v < 0 ? 'text-loss-text' : 'text-ink-secondary'
}

export default function AnalyticsDashboard({
  trades,
  journals,
}: {
  trades: Trade[]
  journals: Journal[]
}) {
  const [period, setPeriod] = useState<Period>('all')

  const now = new Date()
  const filtered = useMemo(() => {
    return trades.filter((t) => {
      if (period === 'week') {
        const d = new Date(t.created_at)
        return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000
      }
      if (period === 'month') {
        const d = new Date(t.created_at)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }
      return true
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades, period])

  const emotionMap = useMemo(
    () => Object.fromEntries(journals.map((j) => [j.trade_id, j.entry_emotion])),
    [journals]
  )

  // Cumulative P&L chart data
  const chartData = useMemo(() => {
    let cum = 0
    return filtered.map((t) => {
      cum += t.pnl_rupees ?? 0
      return {
        date: new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        pnl: Math.round(cum),
      }
    })
  }, [filtered])

  const wins     = filtered.filter((t) => (t.pnl_rupees ?? 0) > 0)
  const losses   = filtered.filter((t) => (t.pnl_rupees ?? 0) < 0)
  const winRate  = filtered.length > 0 ? Math.round((wins.length / filtered.length) * 100) : null
  const totalPnl = filtered.reduce((s, t) => s + (t.pnl_rupees ?? 0), 0)
  const avgWin   = wins.length > 0 ? wins.reduce((s, t) => s + (t.pnl_rupees ?? 0), 0) / wins.length : null
  const avgLoss  = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + (t.pnl_rupees ?? 0), 0) / losses.length) : null
  const avgRR    = avgWin && avgLoss ? (avgWin / avgLoss).toFixed(2) : null

  // Pair performance
  const pairStats = useMemo(() => {
    const map: Record<string, { count: number; wins: number; pnl: number }> = {}
    filtered.forEach((t) => {
      if (!map[t.pair]) map[t.pair] = { count: 0, wins: 0, pnl: 0 }
      map[t.pair].count++
      if ((t.pnl_rupees ?? 0) > 0) map[t.pair].wins++
      map[t.pair].pnl += t.pnl_rupees ?? 0
    })
    return Object.entries(map)
      .map(([pair, s]) => ({ pair, ...s, winPct: Math.round((s.wins / s.count) * 100) }))
      .sort((a, b) => b.pnl - a.pnl)
  }, [filtered])

  // Session performance
  const sessionStats = useMemo(() => {
    const map: Record<string, { count: number; wins: number; pnl: number }> = {}
    filtered.forEach((t) => {
      const s = t.session ?? 'Unknown'
      if (!map[s]) map[s] = { count: 0, wins: 0, pnl: 0 }
      map[s].count++
      if ((t.pnl_rupees ?? 0) > 0) map[s].wins++
      map[s].pnl += t.pnl_rupees ?? 0
    })
    return Object.entries(map)
      .map(([session, s]) => ({ session, ...s, winPct: Math.round((s.wins / s.count) * 100) }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  // Emotion outcome
  const emotionStats = useMemo(() => {
    const map: Record<string, { count: number; wins: number }> = {}
    filtered.forEach((t) => {
      const em = emotionMap[t.id] ?? 'No tag'
      if (!map[em]) map[em] = { count: 0, wins: 0 }
      map[em].count++
      if ((t.pnl_rupees ?? 0) > 0) map[em].wins++
    })
    return Object.entries(map)
      .map(([emotion, s]) => ({ emotion, ...s, winPct: Math.round((s.wins / s.count) * 100) }))
      .sort((a, b) => b.count - a.count)
  }, [filtered, emotionMap])

  // Calendar — current month days
  const calDays = useMemo(() => {
    const year = now.getFullYear(), month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const pnlByDay: Record<string, number> = {}
    filtered.forEach((t) => {
      const d = new Date(t.created_at)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate().toString()
        pnlByDay[key] = (pnlByDay[key] ?? 0) + (t.pnl_rupees ?? 0)
      }
    })
    const firstDow = new Date(year, month, 1).getDay()
    return { daysInMonth, pnlByDay, firstDow }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered])

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'week', label: 'This week' },
    { key: 'month', label: 'This month' },
    { key: 'all', label: 'All time' },
  ]

  if (trades.length === 0) {
    return (
      <div className="empty-state card py-20">
        <p className="empty-state-text">No closed trades yet. Log some trades to see your analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Period tabs */}
      <div className="flex gap-1 bg-surface-800 border border-surface-300 rounded-[4px] p-1 w-fit">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-4 py-1.5 rounded-[4px] text-sm font-medium transition-all duration-150 ${
              period === key
                ? 'bg-brand-400/10 text-brand-400'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total P&L',  value: fmtPnl(totalPnl), color: pnlClass(totalPnl) },
          { label: 'Win rate',   value: winRate !== null ? `${winRate}%` : '—', color: 'text-ink-primary' },
          { label: 'Avg R:R',   value: avgRR ? `1 : ${avgRR}` : '—', color: 'text-ink-primary' },
          { label: 'Trades',    value: String(filtered.length), color: 'text-ink-primary' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex flex-col gap-1">
            <span className="section-label">{s.label}</span>
            <span className={`stat-value num ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* P&L Chart */}
      <div className="card p-4">
        <p className="text-ink-primary font-semibold text-sm mb-4">Cumulative P&L</p>
        {chartData.length < 2 ? (
          <p className="text-ink-tertiary text-sm text-center py-8">Need at least 2 trades to show chart</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B6B7A', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B6B7A', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <ReferenceLine y={0} stroke="#3A3A46" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  background: '#18181F',
                  border: '1px solid #3A3A46',
                  borderRadius: '4px',
                  color: '#F0F0F5',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                }}
                formatter={(v: number) => [fmtPnl(v), 'Cumulative P&L']}
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#F4A623"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#F4A623' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Main grid — tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pair performance */}
        <div className="card p-4">
          <p className="text-ink-primary font-semibold text-sm mb-3">By pair</p>
          {pairStats.length === 0 ? (
            <p className="text-ink-tertiary text-sm">No data</p>
          ) : (
            <div className="flex flex-col divide-y divide-surface-300">
              {pairStats.map((row) => (
                <div key={row.pair} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="trade-pair text-sm">{row.pair}</p>
                    <p className="text-ink-tertiary text-xs mt-0.5">{row.count} trades · {row.winPct}% win</p>
                  </div>
                  <span className={`font-mono font-semibold text-sm num ${pnlClass(row.pnl)}`}>
                    {fmtPnl(row.pnl)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session performance */}
        <div className="card p-4">
          <p className="text-ink-primary font-semibold text-sm mb-3">By session</p>
          {sessionStats.length === 0 ? (
            <p className="text-ink-tertiary text-sm">No data</p>
          ) : (
            <div className="flex flex-col divide-y divide-surface-300">
              {sessionStats.map((row) => (
                <div key={row.session} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-ink-primary text-sm font-medium">{row.session}</p>
                    <p className="text-ink-tertiary text-xs mt-0.5">{row.count} trades · {row.winPct}% win</p>
                  </div>
                  <span className={`font-mono font-semibold text-sm num ${pnlClass(row.pnl)}`}>
                    {fmtPnl(row.pnl)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emotion vs outcome */}
        <div className="card p-4">
          <p className="text-ink-primary font-semibold text-sm mb-3">Emotion vs outcome</p>
          {emotionStats.length === 0 ? (
            <p className="text-ink-tertiary text-sm">No data — add emotions when logging trades</p>
          ) : (
            <div className="flex flex-col divide-y divide-surface-300">
              {emotionStats.map((row) => (
                <div key={row.emotion} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-ink-primary text-sm font-medium">{row.emotion}</p>
                    <p className="text-ink-tertiary text-xs mt-0.5">{row.count} trades</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-semibold text-sm ${row.winPct >= 60 ? 'text-profit-text' : row.winPct >= 40 ? 'text-warning-text' : 'text-loss-text'}`}>
                      {row.winPct}% win
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="card p-4">
          <p className="text-ink-primary font-semibold text-sm mb-3">
            {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-ink-tertiary text-xs font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: calDays.firstDow }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: calDays.daysInMonth }).map((_, i) => {
              const day = i + 1
              const pnl = calDays.pnlByDay[day.toString()]
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-[4px] text-xs font-medium ${
                    pnl === undefined
                      ? 'text-ink-tertiary'
                      : pnl > 0
                      ? 'bg-profit/20 text-profit-text'
                      : pnl < 0
                      ? 'bg-loss/20 text-loss-text'
                      : 'bg-surface-600 text-ink-secondary'
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
