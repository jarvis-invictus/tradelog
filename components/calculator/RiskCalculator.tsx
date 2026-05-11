'use client'

import { useState, useEffect, useCallback } from 'react'
import { calculateLotSize, calculateRR, calculatePnLRupees } from '@/utils/pnlCalculator'
import { fetchUsdInrRate } from '@/lib/exchangeRate'

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
      <div className="flex items-center bg-ink-muted border border-ink-border rounded-xl overflow-hidden focus-within:border-accent transition-colors">
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
  const [balance, setBalance] = useState('100000')
  const [riskPct, setRiskPct] = useState('1')
  const [entry, setEntry]     = useState('')
  const [sl, setSl]           = useState('')
  const [tp, setTp]           = useState('')
  const [usdInr, setUsdInr]   = useState(94.5)
  const [rateLabel, setRateLabel] = useState('Fetching rate…')

  useEffect(() => {
    fetchUsdInrRate().then((r) => {
      setUsdInr(r)
      setRateLabel(`1 USD = ₹${r.toFixed(2)}`)
    })
  }, [])

  const result = useCallback(() => {
    const b = parseFloat(balance), r = parseFloat(riskPct)
    const e = parseFloat(entry),   s = parseFloat(sl), t = parseFloat(tp)
    if (!b || !r || !e || !s || e === s) return null
    const lots        = calculateLotSize(b, r, e, s)
    const riskRupees  = Math.abs(calculatePnLRupees(lots, e, s, 'XAUUSD', usdInr))
    const rewardRupees = t ? Math.abs(calculatePnLRupees(lots, e, t, 'XAUUSD', usdInr)) : null
    const rr           = t ? calculateRR(e, s, t) : null
    return { lots, riskRupees, rewardRupees, rr }
  }, [balance, riskPct, entry, sl, tp, usdInr])()

  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 })

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-5">
      {/* Inputs column */}
      <div className="flex flex-col gap-4 bg-ink-surface border border-ink-border rounded-2xl p-5">
        <p className="text-text-primary font-semibold text-[14px]">Trade inputs</p>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Balance" value={balance} onChange={setBalance} prefix="₹" />
          <InputField label="Risk %" value={riskPct} onChange={setRiskPct} prefix="%" placeholder="1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Entry" value={entry} onChange={setEntry} placeholder="2340.00" />
          <InputField label="Stop Loss" value={sl} onChange={setSl} placeholder="2320.00" />
        </div>
        <InputField label="Take Profit (optional)" value={tp} onChange={setTp} placeholder="2380.00" />
        <p className="text-text-tertiary text-[11px] pt-1">{rateLabel} · Frankfurter API</p>
      </div>

      {/* Results column */}
      <div className="flex flex-col gap-3">
        <p className="text-text-primary font-semibold text-[14px] hidden lg:block">Output</p>
        {result ? (
          <div className="bg-ink-surface border border-ink-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 flex justify-between items-center border-b border-ink-border">
              <span className="text-text-secondary text-[13px]">Lot size</span>
              <span className="text-text-primary font-bold text-[22px] num">{result.lots}</span>
            </div>
            <div className="px-5 py-4 flex justify-between items-center border-b border-ink-border">
              <span className="text-text-secondary text-[13px]">Max risk</span>
              <span className="text-down font-semibold text-[15px] num">−₹{fmt(result.riskRupees)}</span>
            </div>
            {result.rewardRupees !== null && (
              <div className="px-5 py-4 flex justify-between items-center border-b border-ink-border">
                <span className="text-text-secondary text-[13px]">Potential reward</span>
                <span className="text-up font-semibold text-[15px] num">+₹{fmt(result.rewardRupees)}</span>
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
          <div className="bg-ink-surface border border-ink-border rounded-2xl px-5 py-10 text-center flex-1 flex items-center justify-center">
            <p className="text-text-tertiary text-[13px]">Enter entry &amp; stop loss to see results</p>
          </div>
        )}
      </div>
    </div>
  )
}

