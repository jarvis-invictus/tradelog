'use client'

import { useState, useCallback } from 'react'
import { calculateLotSize, calculateRR, calculatePnLUSD } from '@/utils/pnlCalculator'

function InputField({
  label, value, onChange, placeholder, prefix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  prefix?: string
}) {
  return (
    <div>
      <p className="text-text-tertiary text-[11px] font-medium uppercase tracking-wider mb-1.5">{label}</p>
      <div className="flex items-center rounded-xl overflow-hidden input-field">
        {prefix && (
          <span className="px-3 text-text-secondary text-[13px] font-semibold border-r border-ink-border py-3 shrink-0 select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-text-primary text-[14px] placeholder-text-tertiary focus:outline-none num"
        />
      </div>
    </div>
  )
}

export default function RiskCalculator() {
  const [balance, setBalance] = useState('10000')
  const [riskPct, setRiskPct] = useState('1')
  const [pair, setPair]       = useState('XAUUSD')
  const [entry, setEntry]     = useState('')
  const [sl, setSl]           = useState('')
  const [tp, setTp]           = useState('')

  const result = useCallback(() => {
    const b = parseFloat(balance), r = parseFloat(riskPct)
    const e = parseFloat(entry),   s = parseFloat(sl), t = parseFloat(tp)
    if (!b || !r || !e || !s || e === s) return null
    const lots      = calculateLotSize(b, r, e, s)
    const riskUSD   = Math.abs(calculatePnLUSD(lots, e, s, pair))
    const rewardUSD = t ? Math.abs(calculatePnLUSD(lots, e, t, pair)) : null
    const rr        = t ? calculateRR(e, s, t) : null
    return { lots, riskUSD, rewardUSD, rr }
  }, [balance, riskPct, entry, sl, tp, pair])()

  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-5">
      {/* Inputs column */}
      <div className="flex flex-col gap-4 card p-5">
        <p className="text-text-primary font-semibold text-[14px]">Trade inputs</p>
        <div className="mb-1">
          <p className="text-text-tertiary text-[11px] font-medium uppercase tracking-wider mb-1.5">Pair</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['XAUUSD','EURUSD','GBPUSD','USDJPY','GBPJPY'].map((p) => (
              <button key={p} type="button" onClick={() => setPair(p)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                  pair === p ? 'border-accent/60 text-accent' : 'border-ink-border bg-ink-muted text-text-secondary'
                }`}
                style={pair === p ? {background:'linear-gradient(135deg,rgba(76,110,245,0.12) 0%,rgba(76,110,245,0.04) 100%)'} : undefined}
              >{p}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Account balance" value={balance} onChange={setBalance} prefix="$" />
          <InputField label="Risk %" value={riskPct} onChange={setRiskPct} prefix="%" placeholder="1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Entry" value={entry} onChange={setEntry} placeholder="2340.00" />
          <InputField label="Stop Loss" value={sl} onChange={setSl} placeholder="2320.00" />
        </div>
        <InputField label="Take Profit (optional)" value={tp} onChange={setTp} placeholder="2380.00" />
        <p className="text-text-tertiary text-[11px] pt-1">All values in USD · XAUUSD = 100 oz/lot</p>
      </div>

      {/* Results column */}
      <div className="flex flex-col gap-3">
        <p className="text-text-primary font-semibold text-[14px] hidden lg:block">Output</p>
        {result ? (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 flex justify-between items-center border-b border-ink-border">
              <span className="text-text-secondary text-[13px]">Lot size</span>
              <span className="text-text-primary font-bold text-[22px] num">{result.lots}</span>
            </div>
            <div className="px-5 py-4 flex justify-between items-center border-b border-ink-border">
              <span className="text-text-secondary text-[13px]">Max risk</span>
              <span className="text-down font-semibold text-[15px] num">−${fmt(result.riskUSD)}</span>
            </div>
            {result.rewardUSD !== null && (
              <div className="px-5 py-4 flex justify-between items-center border-b border-ink-border">
                <span className="text-text-secondary text-[13px]">Potential reward</span>
                <span className="text-up font-semibold text-[15px] num">+${fmt(result.rewardUSD)}</span>
              </div>
            )}
            {result.rr !== null && (
              <div className="px-5 py-4 flex justify-between items-center">
                <span className="text-text-secondary text-[13px]">Risk : Reward</span>
                <span className={`font-bold text-[22px] num ${result.rr >= 2 ? 'text-up' : result.rr >= 1 ? 'text-warn' : 'text-down'}`}>
                  1 : {result.rr}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="card px-5 py-10 text-center flex-1 flex items-center justify-center">
            <p className="text-text-tertiary text-[13px]">Enter entry &amp; stop loss to see results</p>
          </div>
        )}
      </div>
    </div>
  )
}

