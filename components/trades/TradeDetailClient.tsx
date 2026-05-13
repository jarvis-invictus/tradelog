'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Check, X } from 'lucide-react'

type Trade = {
  id: string
  pair: string
  direction: string
  entry_price: number
  sl_price: number | null
  tp_price: number | null
  exit_price: number | null
  lot_size: number
  session: string | null
  open_time: string
  close_time: string | null
  pnl_rupees: number | null
  status: string
  source: string
}

type Journal = {
  id: string
  trade_id: string
  user_id: string
  entry_emotion: string | null
  exit_emotion: string | null
  reasoning_text: string | null
  reflection_note: string | null
  streak_counted: boolean
  created_at: string
} | null

const EMOTIONS = ['Confident', 'Calm', 'Patient', 'Anxious', 'FOMO', 'Revenge', 'Greedy', 'Uncertain']

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

function fmtPrice(v: number | null) {
  if (v === null) return '—'
  return v.toLocaleString('en-IN', { maximumFractionDigits: 5 })
}

function fmtDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function StatRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-300 last:border-0">
      <span className="text-ink-tertiary text-sm">{label}</span>
      <span className={`text-sm font-medium num ${valueClass ?? 'text-ink-primary'}`}>{value}</span>
    </div>
  )
}

export default function TradeDetailClient({
  trade,
  journal: initialJournal,
}: {
  trade: Trade
  journal: Journal
}) {
  const router = useRouter()
  const supabase = createClient()

  const [journal, setJournal]             = useState<Journal>(initialJournal)
  const [editingJournal, setEditingJournal] = useState(false)
  const [entryEmotion, setEntryEmotion]   = useState(initialJournal?.entry_emotion ?? '')
  const [exitEmotion, setExitEmotion]     = useState(initialJournal?.exit_emotion ?? '')
  const [reasoning, setReasoning]         = useState(initialJournal?.reasoning_text ?? '')
  const [reflection, setReflection]       = useState(initialJournal?.reflection_note ?? '')
  const [saving, setSaving]               = useState(false)
  const [deletingTrade, setDeletingTrade] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function saveJournal() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const basePayload = {
      entry_emotion:   entryEmotion || null,
      exit_emotion:    exitEmotion || null,
      reasoning_text:  reasoning || null,
      reflection_note: reflection || null,
    }

    if (journal) {
      const { data } = await supabase
        .from('trade_journals')
        .update(basePayload)
        .eq('id', journal.id)
        .select()
        .single()
      if (data) setJournal(data as unknown as Journal)
    } else {
      const { data } = await supabase
        .from('trade_journals')
        .insert({
          ...basePayload,
          trade_id:           trade.id,
          user_id:            user.id,
          reasoning_added_at: new Date().toISOString(),
          streak_counted:     true,
        })
        .select()
        .single()
      if (data) setJournal(data as unknown as Journal)
    }

    // Ensure streak is counted whenever a journal is saved/updated
    await supabase
      .from('trade_journals')
      .update({ streak_counted: true })
      .eq('trade_id', trade.id)
      .eq('user_id', user.id)

    setSaving(false)
    setEditingJournal(false)
  }

  function cancelEdit() {
    setEntryEmotion(journal?.entry_emotion ?? '')
    setExitEmotion(journal?.exit_emotion ?? '')
    setReasoning(journal?.reasoning_text ?? '')
    setReflection(journal?.reflection_note ?? '')
    setEditingJournal(false)
  }

  async function deleteTrade() {
    setDeletingTrade(true)
    await supabase.from('trade_journals').delete().eq('trade_id', trade.id)
    await supabase.from('trades').delete().eq('id', trade.id)
    router.push('/journal')
  }

  const rr = trade.sl_price && trade.tp_price
    ? Math.abs((trade.tp_price - trade.entry_price) / (trade.entry_price - trade.sl_price)).toFixed(2)
    : null

  return (
    <div className="space-y-4">

      {/* Trade summary card */}
      <div className="card overflow-hidden">
        {/* Header strip */}
        <div className={`px-4 py-3 flex items-center justify-between border-b border-surface-300 ${
          trade.direction === 'buy' ? 'bg-profit/8' : 'bg-loss/8'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-1 h-8 rounded-full ${trade.direction === 'buy' ? 'bg-profit' : 'bg-loss'}`} />
            <div>
              <p className="trade-pair">{trade.pair}</p>
              <p className="text-ink-tertiary text-xs capitalize mt-0.5">
                {trade.direction} · {trade.session ?? 'Unknown session'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`stat-value num ${pnlColorClass(trade.pnl_rupees)}`}>
              {fmtPnl(trade.pnl_rupees)}
            </p>
            <p className="text-ink-tertiary text-xs mt-0.5 capitalize">{trade.status}</p>
          </div>
        </div>

        {/* Price table */}
        <div className="px-4">
          <StatRow label="Entry price"  value={fmtPrice(trade.entry_price)} />
          <StatRow label="Exit price"   value={fmtPrice(trade.exit_price)} />
          <StatRow label="Stop loss"    value={fmtPrice(trade.sl_price)} />
          <StatRow label="Take profit"  value={fmtPrice(trade.tp_price)} />
          <StatRow label="Lot size"     value={`${trade.lot_size} lots`} />
          {rr && <StatRow label="R:R ratio" value={`1 : ${rr}`} valueClass={
            parseFloat(rr) >= 2 ? 'text-profit-text' :
            parseFloat(rr) >= 1 ? 'text-warning-text' : 'text-loss-text'
          } />}
          <StatRow label="Opened"  value={fmtDateTime(trade.open_time)} />
          <StatRow label="Closed"  value={fmtDateTime(trade.close_time)} />
          <StatRow label="Source"  value={trade.source} />
        </div>
      </div>

      {/* Journal card */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center justify-between">
          <p className="section-label">Journal entry</p>
          {!editingJournal && (
            <button
              onClick={() => setEditingJournal(true)}
              className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors duration-150"
            >
              <Pencil className="w-3.5 h-3.5" />
              {journal ? 'Edit' : 'Add journal'}
            </button>
          )}
          {editingJournal && (
            <div className="flex items-center gap-3">
              <button onClick={cancelEdit} className="text-ink-tertiary hover:text-ink-secondary text-xs transition-colors duration-150 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={saveJournal}
                disabled={saving}
                className="text-brand-400 hover:text-brand-300 text-xs font-semibold transition-colors duration-150 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <div className="px-4 py-4 space-y-4">
          {editingJournal ? (
            <>
              {/* Entry emotion */}
              <div>
                <p className="text-ink-tertiary text-xs font-medium mb-2">Entry emotion</p>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEntryEmotion(entryEmotion === em ? '' : em)}
                      className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-all duration-150 ${
                        entryEmotion === em
                          ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                          : 'border-surface-300 bg-surface-600 text-ink-tertiary hover:bg-surface-500'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exit emotion */}
              {trade.status === 'closed' && (
                <div>
                  <p className="text-ink-tertiary text-xs font-medium mb-2">Exit emotion</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setExitEmotion(exitEmotion === em ? '' : em)}
                        className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-all duration-150 ${
                          exitEmotion === em
                            ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                            : 'border-surface-300 bg-surface-600 text-ink-tertiary hover:bg-surface-500'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning */}
              <div>
                <p className="text-ink-tertiary text-xs font-medium mb-2">Trade reasoning</p>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  rows={3}
                  placeholder="Why did you take this trade? What was your setup?"
                  className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary resize-none transition-colors duration-150"
                />
              </div>

              {/* Reflection */}
              <div>
                <p className="text-ink-tertiary text-xs font-medium mb-2">Post-trade reflection</p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={3}
                  placeholder="What went well? What would you do differently?"
                  className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary resize-none transition-colors duration-150"
                />
              </div>
            </>
          ) : journal && (journal.entry_emotion || journal.exit_emotion || journal.reasoning_text || journal.reflection_note) ? (
            <div className="space-y-4">
              {/* Emotions row */}
              {(journal.entry_emotion || journal.exit_emotion) && (
                <div className="flex items-center gap-3 flex-wrap">
                  {journal.entry_emotion && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-ink-tertiary text-xs">Entry</span>
                      <span className={`px-2 py-0.5 rounded-[4px] text-xs font-medium border ${
                        EMOTION_COLORS[journal.entry_emotion] ?? 'bg-surface-600 text-ink-secondary border-surface-300'
                      }`}>
                        {journal.entry_emotion}
                      </span>
                    </div>
                  )}
                  {journal.exit_emotion && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-ink-tertiary text-xs">Exit</span>
                      <span className={`px-2 py-0.5 rounded-[4px] text-xs font-medium border ${
                        EMOTION_COLORS[journal.exit_emotion] ?? 'bg-surface-600 text-ink-secondary border-surface-300'
                      }`}>
                        {journal.exit_emotion}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {journal.reasoning_text && (
                <div>
                  <p className="text-ink-tertiary text-xs font-medium mb-1.5">Reasoning</p>
                  <p className="text-ink-secondary text-sm leading-relaxed">{journal.reasoning_text}</p>
                </div>
              )}

              {journal.reflection_note && (
                <div>
                  <p className="text-ink-tertiary text-xs font-medium mb-1.5">Reflection</p>
                  <p className="text-ink-secondary text-sm leading-relaxed">{journal.reflection_note}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-ink-tertiary text-sm">No journal entry yet</p>
              <button
                onClick={() => setEditingJournal(true)}
                className="mt-3 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors duration-150"
              >
                + Add your reflection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete trade */}
      <div className="card p-4">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-danger-text text-sm font-medium hover:opacity-80 transition-opacity duration-150"
          >
            <Trash2 className="w-4 h-4" />
            Delete this trade
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-danger-text text-sm font-medium">Delete this trade and its journal entry? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={deleteTrade}
                disabled={deletingTrade}
                className="flex-1 py-2.5 rounded-[4px] bg-danger/20 border border-danger/30 text-danger-text text-sm font-semibold transition-all duration-150 hover:bg-danger/30"
              >
                {deletingTrade ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-[4px] bg-surface-600 border border-surface-300 text-ink-secondary text-sm font-semibold hover:bg-surface-500 transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
