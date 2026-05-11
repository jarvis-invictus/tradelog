'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fetchUsdInrRate } from '@/lib/exchangeRate'
import { calculatePnLRupees } from '@/utils/pnlCalculator'

const PAIRS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY', 'NIFTY', 'BANKNIFTY']
const SESSIONS = ['Asian', 'London', 'New York', 'Overlap']
const EMOTIONS = ['Confident', 'Calm', 'Patient', 'Anxious', 'FOMO', 'Revenge', 'Greedy', 'Uncertain']

type Status = 'active' | 'closed'
type Direction = 'buy' | 'sell'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <p className="text-text-tertiary text-[11px] font-semibold uppercase tracking-widest">{title}</p>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-text-secondary text-[12px] font-medium mb-1.5">{children}</p>
}

function NumInput({
  label, value, onChange, placeholder, prefix,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center rounded-xl overflow-hidden input-field">
        {prefix && <span className="px-3 text-text-secondary text-[13px] font-semibold border-r border-ink-border py-3 shrink-0 select-none">{prefix}</span>}
        <input
          type="number" inputMode="decimal"
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-text-primary text-[14px] placeholder-text-tertiary focus:outline-none num"
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
  const [usdInr, setUsdInr]       = useState(84.5)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => { fetchUsdInrRate().then(setUsdInr) }, [])

  const pnl = useCallback(() => {
    const e = parseFloat(entry), x = parseFloat(exitPrice), l = parseFloat(lots)
    if (!e || !x || !l || status !== 'closed') return null
    return calculatePnLRupees(l, e, x, pair, usdInr)
  }, [entry, exitPrice, lots, pair, usdInr, status])()

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
        sl_price:    sl    ? parseFloat(sl)        : null,
        tp_price:    tp    ? parseFloat(tp)        : null,
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
        trade_id:       trade.id,
        user_id:        user.id,
        entry_emotion:  emotion  || null,
        reasoning_text: reasoning || null,
        reasoning_added_at: new Date().toISOString(),
      })
    }

    router.push('/home')
  }

  const pnlColor = pnl === null ? '' : pnl >= 0 ? 'text-up' : 'text-down'
  const pnlFmt   = pnl === null ? null : `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Pair + Direction */}
      <Section title="Trade">
        <div>
          <Label>Instrument</Label>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {PAIRS.map((p) => (
              <button key={p} type="button" onClick={() => setPair(p)}
                className={`shrink-0 px-3 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-150 ${
                  pair === p
                    ? 'border-accent/60 text-accent'
                    : 'border-ink-border bg-ink-muted text-text-secondary hover:border-ink-muted'
                }`}
                style={pair === p ? { background: 'linear-gradient(135deg, rgba(76,110,245,0.12) 0%, rgba(76,110,245,0.04) 100%)' } : undefined}
              >{p}</button>
            ))}
          </div>
        </div>

        <div>
          <Label>Direction</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['buy', 'sell'] as Direction[]).map((d) => (
              <button key={d} type="button" onClick={() => setDirection(d)}
                className={`py-3 rounded-xl text-[14px] font-bold uppercase tracking-wide border transition-all duration-150 ${
                  direction === d && d === 'buy'  ? 'bg-up/15 border-up/40 text-up' :
                  direction === d && d === 'sell' ? 'bg-down/15 border-down/40 text-down' :
                  'border-ink-border bg-ink-muted text-text-tertiary hover:border-ink-muted'
                }`}
              >{d}</button>
            ))}
          </div>
        </div>

        <div>
          <Label>Session</Label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SESSIONS.map((s) => (
              <button key={s} type="button" onClick={() => setSession(s)}
                className={`shrink-0 px-3 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-150 ${
                  session === s
                    ? 'border-accent/60 text-accent'
                    : 'border-ink-border bg-ink-muted text-text-secondary'
                }`}
                style={session === s ? { background: 'linear-gradient(135deg, rgba(76,110,245,0.12) 0%, rgba(76,110,245,0.04) 100%)' } : undefined}
              >{s}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* Prices */}
      <Section title="Prices & Size">
        <div className="grid grid-cols-2 gap-3">
          <NumInput label="Entry price" value={entry} onChange={setEntry} placeholder="2340.00" />
          <NumInput label="Lot size" value={lots} onChange={setLots} placeholder="0.10" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumInput label="Stop Loss" value={sl} onChange={setSl} placeholder="2320.00" />
          <NumInput label="Take Profit" value={tp} onChange={setTp} placeholder="2380.00" />
        </div>

        <div>
          <Label>Opened at</Label>
          <input type="datetime-local" value={openTime} onChange={(e) => setOpenTime(e.target.value)}
            className="w-full input-field px-3 py-3 text-text-primary text-[14px] focus:outline-none num" />
        </div>
      </Section>

      {/* Outcome */}
      <Section title="Outcome">
        <div>
          <Label>Status</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['active', 'closed'] as Status[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`py-3 rounded-xl text-[13px] font-semibold capitalize border transition-all ${
                  status === s
                    ? 'border-accent/60 text-accent'
                    : 'border-ink-border bg-ink-muted text-text-secondary'
                }`}
                style={status === s ? { background: 'linear-gradient(135deg, rgba(76,110,245,0.12) 0%, rgba(76,110,245,0.04) 100%)' } : undefined}
              >{s}</button>
            ))}
          </div>
        </div>

        {status === 'closed' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Exit price" value={exitPrice} onChange={setExitPrice} placeholder="2365.00" />
              <div>
                <Label>Closed at</Label>
                <input type="datetime-local" value={closeTime} onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full input-field px-3 py-3 text-text-primary text-[14px] focus:outline-none num" />
              </div>
            </div>

            {pnlFmt && (
              <div className="flex items-center justify-between bg-ink-muted rounded-xl px-4 py-3 border border-ink-border">
                <span className="text-text-secondary text-[13px]">Calculated P&L</span>
                <span className={`font-bold text-[18px] num ${pnlColor}`}>{pnlFmt}</span>
              </div>
            )}
          </>
        )}
      </Section>

      {/* Journal */}
      <Section title="Journal (optional)">
        <div>
          <Label>Entry emotion</Label>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((em) => (
              <button key={em} type="button" onClick={() => setEmotion(emotion === em ? '' : em)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                  emotion === em
                    ? 'border-accent/60 text-accent bg-accent/10'
                    : 'border-ink-border text-text-tertiary hover:border-ink-muted'
                }`}
              >{em}</button>
            ))}
          </div>
        </div>

        <div>
          <Label>Reasoning / notes</Label>
          <textarea
            value={reasoning} onChange={(e) => setReasoning(e.target.value)}
            rows={3} placeholder="Why did you take this trade?"
            className="w-full input-field px-3 py-3 text-text-primary text-[14px] resize-none focus:outline-none"
          />
        </div>
      </Section>

      {error && <p className="text-down text-[13px] px-1">{error}</p>}

      <button type="submit" disabled={saving} className="w-full btn-primary py-4 text-[15px]">
        {saving ? 'Saving…' : 'Save trade'}
      </button>
    </form>
  )
}
