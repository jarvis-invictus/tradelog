'use client'

import { useState, useCallback } from 'react'
import { calculateLotSize, calculateRR, calculatePnLUSD } from '@/utils/pnlCalculator'
import { useCurrencyStore } from '@/store/currency'
import CurrencyToggle from '@/components/ui/CurrencyToggle'
import PnLDisplay from '@/components/ui/PnLDisplay'

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
      <p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary mb-2">{label}</p>
      <div className="flex items-center rounded-[4px] overflow-hidden bg-surface-600 border border-surface-300">
        {prefix && (
          <span className="px-3 text-ink-secondary text-sm font-semibold border-r border-surface-300 py-3 shrink-0 select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-ink-primary text-base placeholder:text-ink-tertiary focus:outline-none font-mono"
        />
      </div>
    </div>
  )
}

export default function RiskCalculator() {
  const { currency, formatAmount } = useCurrencyStore()
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
    <div className="space-y-4">
      {/* Header with currency toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink-primary">Risk Calculator</h2>
          <p className="text-sm text-ink-secondary mt-1">Calculate position size and risk management</p>
        </div>
        <CurrencyToggle variant="full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inputs column */}
        <div className="bg-surface-800 border border-surface-300 rounded-[4px] p-4 space-y-4">
          <p className="text-ink-primary font-semibold text-sm">Trade inputs</p>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary mb-2">Pair</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['XAUUSD','EURUSD','GBPUSD','USDJPY','GBPJPY'].map((p) => (
                <button key={p} type="button" onClick={() => setPair(p)}
                  className={`shrink-0 px-3 py-1.5 rounded-[4px] text-xs font-semibold border transition-all ${
                    pair === p 
                      ? 'border-brand-400/60 text-brand-400 bg-brand-400/10' 
                      : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Account balance" value={balance} onChange={setBalance} prefix={currency === 'USD' ? '$' : '₹'} />
            <InputField label="Risk %" value={riskPct} onChange={setRiskPct} prefix="%" placeholder="1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Entry" value={entry} onChange={setEntry} placeholder="2340.00" />
            <InputField label="Stop Loss" value={sl} onChange={setSl} placeholder="2320.00" />
          </div>
          <InputField label="Take Profit (optional)" value={tp} onChange={setTp} placeholder="2380.00" />
          <p className="text-xs text-ink-tertiary pt-1">All calculations in USD · XAUUSD = 100 oz/lot</p>
        </div>

        {/* Results column */}
        <div className="space-y-3">
          <p className="text-ink-primary font-semibold text-sm hidden md:block">Output</p>
          {result ? (
            <div className="bg-surface-800 border border-surface-300 rounded-[4px] overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center border-b border-surface-300">
                <span className="text-ink-secondary text-sm">Lot size</span>
                <span className="text-ink-primary font-bold text-2xl font-mono">{result.lots}</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center border-b border-surface-300">
                <span className="text-ink-secondary text-sm">Max risk</span>
                <PnLDisplay amount={-result.riskUSD} size="large" showPlus={false} />
              </div>
              {result.rewardUSD !== null && (
                <div className="px-4 py-3 flex justify-between items-center border-b border-surface-300">
                  <span className="text-ink-secondary text-sm">Potential reward</span>
                  <PnLDisplay amount={result.rewardUSD} size="large" />
                </div>
              )}
              {result.rr !== null && (
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-ink-secondary text-sm">Risk : Reward</span>
                  <span className={`font-bold text-2xl font-mono ${
                    result.rr >= 2 ? 'text-profit-text' : 
                    result.rr >= 1 ? 'text-warning-text' : 
                    'text-loss-text'
                  }`}>
                    1 : {result.rr}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface-800 border border-surface-300 rounded-[4px] px-4 py-10 text-center flex items-center justify-center">
              <p className="text-ink-tertiary text-sm">Enter entry & stop loss to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

