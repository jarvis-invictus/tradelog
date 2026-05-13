'use client'

import { useState } from 'react'
import Link from 'next/link'
import StandaloneNoteSheet from './StandaloneNoteSheet'

type JournalEntry = {
  id: string
  entry_emotion: string | null
  reasoning_text: string | null
  reflection_note: string | null
  created_at: string
} | null

type FeedItem = {
  id: string
  pair: string
  direction: string
  pnl_rupees: number | null
  status: string
  lot_size: number
  session: string | null
  open_time: string
  close_time: string | null
  created_at: string
  journal: JournalEntry
}

type Filter = 'all' | 'win' | 'loss' | 'no-journal'

const EMOTION_COLORS: Record<string, string> = {
  Confident: 'bg-profit/15 text-profit-text border-profit/30',
  Calm:      'bg-info/15 text-info-text border-info/30',
  Patient:   'bg-info/15 text-info-text border-info/30',
  Anxious:   'bg-warning/15 text-warning-text border-warning/30',
  FOMO:      'bg-warning/15 text-warning-text border-warning/30',
  Revenge:   'bg-danger/15 text-danger-text border-danger/30',
  Greedy:    'bg-warning/15 text-warning-text border-warning/30',
  Uncertain: 'bg-neutral/15 text-neutral border-neutral/30',
}

function pnlColorClass(v: number | null) {
  if (v === null) return 'text-ink-secondary'
  return v >= 0 ? 'text-profit-text' : 'text-loss-text'
}

function fmtPnl(v: number | null) {
  if (v === null) return '—'
  return `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JournalFeed({ items }: { items: FeedItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [noteSheetOpen, setNoteSheetOpen] = useState(false)

  const filtered = items.filter((t) => {
    if (filter === 'win')        return (t.pnl_rupees ?? 0) > 0
    if (filter === 'loss')       return (t.pnl_rupees ?? 0) < 0
    if (filter === 'no-journal') return !t.journal
    return true
  })

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',        label: 'All' },
    { key: 'win',        label: 'Wins' },
    { key: 'loss',       label: 'Losses' },
    { key: 'no-journal', label: 'No journal' },
  ]

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Filter bar + Add Note — sidebar on desktop, top bar on mobile */}
        <div className="md:w-44 shrink-0">
          <div className="card p-3 flex md:flex-col gap-1.5">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 md:flex-none text-left px-3 py-2 rounded-[4px] text-sm font-medium transition-all duration-150 ${
                  filter === key
                    ? 'bg-brand-400/10 text-brand-400'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-600'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="hidden md:block border-t border-surface-300 my-1" />
            <button
              onClick={() => setNoteSheetOpen(true)}
              className="hidden md:block text-left px-3 py-2 rounded-[4px] text-sm font-medium text-brand-400 hover:bg-brand-400/10 transition-all duration-150"
            >
              + Add note
            </button>
          </div>

          {/* Mobile: Add note button below filters */}
          <button
            onClick={() => setNoteSheetOpen(true)}
            className="md:hidden w-full mt-2 btn-secondary py-2.5 text-sm"
          >
            + Add standalone note
          </button>
        </div>

        {/* Feed */}
        <div className="flex-1 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="empty-state card py-16">
              <p className="empty-state-text">No trades match this filter</p>
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/trade/${item.id}`}
                className="card p-4 hover:border-surface-200 hover:bg-surface-700 transition-all duration-150 block"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-6 rounded-full shrink-0 ${item.direction === 'buy' ? 'bg-profit' : 'bg-loss'}`} />
                    <span className="trade-pair text-sm">{item.pair}</span>
                    <span className="session-badge">{item.session ?? '—'}</span>
                    {item.status === 'active' && (
                      <span className="px-2 py-0.5 bg-brand-400/15 border border-brand-400/30 rounded-[4px] text-xs text-brand-400 font-medium">Live</span>
                    )}
                  </div>
                  <span className={`font-mono font-semibold text-sm num ${pnlColorClass(item.pnl_rupees)}`}>
                    {fmtPnl(item.pnl_rupees)}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3 pl-3">
                  <span className="text-ink-tertiary text-xs capitalize">{item.direction} · {item.lot_size} lots</span>
                  <span className="text-ink-tertiary text-xs">{fmtDate(item.created_at)}</span>
                </div>

                {/* Journal content */}
                {item.journal ? (
                  <div className="pl-3 space-y-2">
                    {item.journal.entry_emotion && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium border ${
                        EMOTION_COLORS[item.journal.entry_emotion] ?? 'bg-surface-600 text-ink-secondary border-surface-300'
                      }`}>
                        {item.journal.entry_emotion}
                      </span>
                    )}
                    {item.journal.reasoning_text && (
                      <p className="text-ink-secondary text-sm leading-relaxed line-clamp-2">
                        {item.journal.reasoning_text}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pl-3">
                    <p className="text-ink-tertiary text-xs italic">No journal entry — tap to add</p>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      <StandaloneNoteSheet open={noteSheetOpen} onClose={() => setNoteSheetOpen(false)} />
    </>
  )
}
