'use client'

// M5.2 — Risk calculator
// Inputs: balance, risk%, entry, SL, TP (optional)
// Outputs: lot size, P&L ₹, RR — recalculates on every keystroke

import { useState, useEffect, useCallback } from 'react'
import { calculateLotSize, calculateRR, calculatePnLRupees } from '@/utils/pnlCalculator'
import { fetchUsdInrRate } from '@/lib/exchangeRate'

function Field({
  label, value, onChange, placeholder, prefix, readOnly, highlight,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  prefix?: string
  readOnly?: boolean
  highlight?: 'green' | 'red' | 'blue'
}) {
  const colors = {
    green: 'text-green-400',
    red:   'text-red-400',
    blue:  'text-blue-400',
  }
  return (
    <div>
      <label className="block text-gray-400 text-xs mb-1">{label}</label>
      <div className="flex items-center bg-gray-900 border border-gray-700 rounded-md overflow-hidden focus-within:border-blue-500">
        {prefix && <span className="px-3 text-gray-400 text-sm border-r border-gray-700 py-2">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none ${
            readOnly ? (highlight ? colors[highlight] : 'text-white') + ' font-semibold cursor-default' : 'text-white'
          }`}
        />
      </div>
    </div>
  )
}

export default function RiskCalculator() {
  const [balance, setBalance]   = useState('100000')
  const [riskPct, setRiskPct]   = useState('1')
  const [entry, setEntry]       = useState('')
  const [sl, setSl]             = useState('')
  const [tp, setTp]             = useState('')
  const [usdInr, setUsdInr]     = useState(94.5)
  const [rateLabel, setRateLabel] = useState('Loading rate...')

  useEffect(() => {
    fetchUsdInrRate().then((r) => {
      setUsdInr(r)
      setRateLabel(`1 USD = ₹${r.toFixed(2)}`)
    })
  }, [])

  const calc = useCallback(() => {
    const b = parseFloat(balance)
    const r = parseFloat(riskPct)
    const e = parseFloat(entry)
    const s = parseFloat(sl)
    const t = parseFloat(tp)
    if (!b || !r || !e || !s || e === s) return null

    const lots = calculateLotSize(b, r, e, s)
    const riskRupees = calculatePnLRupees(lots, e, s, 'XAUUSD', usdInr)
    const rewardRupees = t ? calculatePnLRupees(lots, e, t, 'XAUUSD', usdInr) : null
    const rr = t ? calculateRR(e, s, t) : null

    return { lots, riskRupees: Math.abs(riskRupees), rewardRupees, rr }
  }, [balance, riskPct, entry, sl, tp, usdInr])

  const result = calc()

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Account Balance" value={balance} onChange={setBalance} prefix="₹" />
        <Field label="Risk %" value={riskPct} onChange={setRiskPct} prefix="%" placeholder="1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Entry Price" value={entry} onChange={setEntry} placeholder="1.08500" />
        <Field label="Stop Loss" value={sl} onChange={setSl} placeholder="1.08000" />
      </div>

      <Field label="Take Profit (optional)" value={tp} onChange={setTp} placeholder="1.09500" />

      {result ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-gray-400 text-sm">Lot Size</span>
            <span className="text-white font-bold text-lg">{result.lots}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-gray-400 text-sm">Max Risk</span>
            <span className="text-red-400 font-semibold">−₹{result.riskRupees.toLocaleString('en-IN')}</span>
          </div>
          {result.rewardRupees !== null && (
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-gray-400 text-sm">Potential Reward</span>
              <span className="text-green-400 font-semibold">+₹{Math.abs(result.rewardRupees).toLocaleString('en-IN')}</span>
            </div>
          )}
          {result.rr !== null && (
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-gray-400 text-sm">Risk:Reward</span>
              <span className={`font-bold text-lg ${result.rr >= 2 ? 'text-green-400' : result.rr >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                1:{result.rr}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-6 text-center text-gray-600 text-sm">
          Enter entry and SL to calculate
        </div>
      )}

      <p className="text-center text-gray-700 text-xs">{rateLabel} · Updates every 12h</p>
    </div>
  )
}

