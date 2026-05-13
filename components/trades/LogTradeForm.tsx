'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculatePnLUSD } from '@/utils/pnlCalculator'

const PAIRS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY', 'NIFTY', 'BANKNIFTY']
const SESSIONS = ['Asian', 'London', 'New York', 'Overlap']
const EMOTIONS = ['Confident', 'Calm', 'Patient', 'Anxious', 'FOMO', 'Revenge', 'Greedy', 'Uncertain']

type Status = 'active' | 'closed'
type Direction = 'buy' | 'sell'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4 md:p-5 flex flex-col gap-4">
      <p className="section-label">{title}</p>
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-ink-secondary text-xs font-medium mb-1.5">{children}</p>
}

function NumInput({
  label, value, onChange, placeholder, prefix,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center rounded-[4px] overflow-hidden bg-surface-600 border border-surface-300 focus-within:border-brand-400 transition-colors duration-150">
        {prefix && (
          <span className="px-3 text-ink-secondary text-sm font-semibold border-r border-surface-300 py-3 shrink-0 select-none">
            {prefix}
          </span>
        )}
        <input
          type="number" inputMode="decimal"
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary focus:outline-none num"
        />
      </div>
    </div>
  )
}

export default function LogTradeForm() {
  const router = useRouter()
  const supabase = createClient()

  const [pair, setPair]           = useState('XAUUSD')
  const [direction, setDirection] = useState<Direction>('buy')
  const [session, setSession]     = useState('London')
  const [entry, setEntry]         = useState('')
  const [sl, setSl]               = useState('')
  const [tp, setTp]               = useState('')
  const [lots, setLots]           = useState('')
  const [status, setStatus]       = useState<Status>('closed')
  const [exitPrice, setExitPrice] = useState('')
  const [openTime, setOpenTime]   = useState(() => new Date().toISOString().slice(0, 16))
  const [closeTime, setCloseTime] = useState(() => new Date().toISOString().slice(0, 16))
  const [emotion, setEmotion]     = useState('')
  const [reasoning, setReasoning] = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const pnl = useCallback(() => {
    const e = parseFloat(entry), x = parseFloat(exitPrice), l = parseFloat(lots)
    if (!e || !x || !l || status !== 'closed') return null
    return calculatePnLUSD(l, e, x, pair)
  }, [entry, exitPrice, lots, pair, status])()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!entry || !lots) { setError('Entry price and lot size are required'); return }
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setSaving(false); return }

    const { data: trade, error: tradeErr } = await supabase
      .from('trades')
      .insert({
        user_id:     user.id,
        pair,
        direction,
        entry_price: parseFloat(entry),
        sl_price:    sl ? parseFloat(sl) : null,
        tp_price:    tp ? parseFloat(tp) : null,
        lot_size:    parseFloat(lots),
        session,
        open_time:   new Date(openTime).toISOString(),
        close_time:  status === 'closed' ? new Date(closeTime).toISOString() : null,
        exit_price:  status === 'closed' && exitPrice ? parseFloat(exitPrice) : null,
        pnl_rupees:  pnl ?? null,
        status,
        source:      'manual',
      })
      .select('id')
      .single()

    if (tradeErr || !trade) { setError(tradeErr?.message ?? 'Failed to save trade'); setSaving(false); return }

    if (emotion || reasoning) {
      await supabase.from('trade_journals').insert({
        trade_id:           trade.id,
        user_id:            user.id,
        entry_emotion:      emotion || null,
        reasoning_text:     reasoning || null,
        reasoning_added_at: new Date().toISOString(),
      })
    }

    router.push('/home')
  }

  const pnlColorClass = pnl === null ? '' : pnl >= 0 ? 'text-profit-text' : 'text-loss-text'
  const pnlFmt = pnl === null ? null : `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Trade details */}
      <Section title="Trade">
        <div>
          <FieldLabel>Instrument</FieldLabel>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {PAIRS.map((p) => (
              <button key={p} type="button" onClick={() => setPair(p)}
                className={`shrink-0 px-3 py-2 rounded-[4px] text-sm font-semibold border transition-all duration-150 ${
                  pair === p
                    ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                    : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                }`}
              >{p}</button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Direction</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {(['buy', 'sell'] as Direction[]).map((d) => (
              <button key={d} type="button" onClick={() => setDirection(d)}
                className={`py-3 rounded-[4px] text-sm font-bold uppercase tracking-wide border transition-all duration-150 ${
                  direction === d && d === 'buy'  ? 'bg-profit/15 border-profit/40 text-profit-text' :
                  direction === d && d === 'sell' ? 'bg-loss/15 border-loss/40 text-loss-text' :
                  'border-surface-300 bg-surface-600 text-ink-tertiary hover:bg-surface-500'
                }`}
              >{d}</button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Session</FieldLabel>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SESSIONS.map((s) => (
              <button key={s} type="button" onClick={() => setSession(s)}
                className={`shrink-0 px-3 py-2 rounded-[4px] text-sm font-semibold border transition-all duration-150 ${
                  session === s
                    ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                    : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                }`}
              >{s}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* Prices & Size */}
      <Section title="Prices & Size">
        <div className="grid grid-cols-2 gap-3">
          <NumInput label="Entry price" value={entry} onChange={setEntry} placeholder="2340.00" />
          <NumInput label="Lot size"    value={lots}  onChange={setLots}  placeholder="0.10" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumInput label="Stop Loss"   value={sl} onChange={setSl} placeholder="2320.00" />
          <NumInput label="Take Profit" value={tp} onChange={setTp} placeholder="2380.00" />
        </div>
        <div>
          <FieldLabel>Opened at</FieldLabel>
          <input type="datetime-local" value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm transition-colors duration-150 num"
          />
        </div>
      </Section>

      {/* Outcome */}
      <Section title="Outcome">
        <div>
          <FieldLabel>Status</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {(['active', 'closed'] as Status[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`py-3 rounded-[4px] text-sm font-semibold capitalize border transition-all duration-150 ${
                  status === s
                    ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                    : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                }`}
              >{s}</button>
            ))}
          </div>
        </div>

        {status === 'closed' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Exit price" value={exitPrice} onChange={setExitPrice} placeholder="2365.00" />
              <div>
                <FieldLabel>Closed at</FieldLabel>
                <input type="datetime-local" value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm transition-colors duration-150 num"
                />
              </div>
            </div>

            {pnlFmt && (
              <div className="flex items-center justify-between bg-surface-700 rounded-[4px] px-4 py-3 border border-surface-300">
                <span className="text-ink-secondary text-sm">Calculated P&L</span>
                <span className={`font-mono font-bold text-lg num ${pnlColorClass}`}>{pnlFmt}</span>
              </div>
            )}
          </>
        )}
      </Section>

      {/* Journal */}
      <Section title="Journal (optional)">
        <div>
          <FieldLabel>Entry emotion</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((em) => (
              <button key={em} type="button" onClick={() => setEmotion(emotion === em ? '' : em)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-all duration-150 ${
                  emotion === em
                    ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                    : 'border-surface-300 bg-surface-600 text-ink-tertiary hover:bg-surface-500 hover:text-ink-secondary'
                }`}
              >{em}</button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Reasoning / notes</FieldLabel>
          <textarea
            value={reasoning} onChange={(e) => setReasoning(e.target.value)}
            rows={3} placeholder="Why did you take this trade?"
            className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary resize-none transition-colors duration-150"
          />
        </div>
      </Section>

      {error && (
        <p className="text-danger-text text-sm px-1">{error}</p>
      )}

      <button type="submit" disabled={saving} className="btn-primary py-4 text-base">
        {saving ? 'Saving…' : 'Save trade'}
      </button>
    </form>
  )
}
