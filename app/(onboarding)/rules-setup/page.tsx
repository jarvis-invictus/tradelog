'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Frequency = 'daily' | 'weekly'

export default function RulesSetupPage() {
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const [maxTrades, setMaxTrades] = useState(3)
  const [lossLimit, setLossLimit] = useState('200')
  const [loading, setLoading]     = useState(false)
  const router  = useRouter()
  const supabase = createClient()

  const maxLimit = frequency === 'daily' ? 20 : 10
  const safeMax  = Math.min(maxTrades, maxLimit)

  async function handleContinue() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_rules').insert([
        {
          user_id: user.id,
          name: `Max ${safeMax} trades per ${frequency === 'daily' ? 'day' : 'week'}`,
          type: 'max_trades_day',
          value: safeMax,
          note: `Set during onboarding (${frequency})`,
          active: true,
        },
        {
          user_id: user.id,
          name: `${frequency === 'daily' ? 'Daily' : 'Weekly'} loss limit ₹${lossLimit}`,
          type: 'daily_loss_pct',
          value: parseFloat(lossLimit),
          note: `Stop if I lose ₹${lossLimit} in a ${frequency === 'daily' ? 'day' : 'week'}`,
          active: true,
        },
      ])
    }
    setLoading(false)
    router.push('/complete')
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-10 min-h-screen">
      <div className="mb-8">
        <div className="flex gap-1.5 mb-6">
          <div className="flex-1 h-[3px] rounded-full bg-brand-400" />
          <div className="flex-1 h-[3px] rounded-full bg-brand-400" />
          <div className="flex-1 h-[3px] rounded-full bg-brand-400" />
        </div>
        <p className="section-label mb-1">Step 3 of 3</p>
        <h1 className="text-xl font-bold text-ink-primary tracking-tight">Your rules</h1>
        <p className="text-ink-secondary text-sm mt-1">Editable anytime from the Rules tab</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">

        {/* Frequency toggle */}
        <div className="card p-5">
          <p className="text-ink-primary text-sm font-semibold mb-0.5">Trading frequency</p>
          <p className="text-ink-tertiary text-xs mb-4">How often do you trade?</p>
          <div className="grid grid-cols-2 gap-2">
            {(['daily', 'weekly'] as Frequency[]).map((f) => (
              <button key={f}
                onClick={() => { setFrequency(f); setMaxTrades(f === 'daily' ? 3 : 2) }}
                className={`py-3 rounded-[4px] text-sm font-semibold capitalize border transition-all duration-150 ${
                  frequency === f
                    ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                    : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                }`}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Max trades slider */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-1">
            <p className="text-ink-primary text-sm font-semibold">
              Max trades per {frequency === 'daily' ? 'day' : 'week'}
            </p>
            <span className="text-brand-400 font-bold text-2xl num leading-none">{safeMax}</span>
          </div>
          <p className="text-ink-tertiary text-xs mb-5">Soft warning when you reach this</p>
          <input
            type="range" min={1} max={maxLimit} value={safeMax}
            onChange={(e) => setMaxTrades(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-400"
            style={{
              background: `linear-gradient(to right, #F4A623 0%, #F4A623 ${((safeMax - 1) / (maxLimit - 1)) * 100}%, #2A2A35 ${((safeMax - 1) / (maxLimit - 1)) * 100}%, #2A2A35 100%)`,
            }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-ink-tertiary text-xs">1</span>
            <span className="text-ink-tertiary text-xs">{maxLimit}</span>
          </div>
        </div>

        {/* Loss limit */}
        <div className="card p-5">
          <p className="text-ink-primary text-sm font-semibold mb-0.5">
            {frequency === 'daily' ? 'Daily' : 'Weekly'} loss limit
          </p>
          <p className="text-ink-tertiary text-xs mb-4">Hard stop — cannot be dismissed</p>
          <div className="flex items-center rounded-[4px] overflow-hidden bg-surface-600 border border-surface-300 focus-within:border-brand-400 transition-colors duration-150">
            <span className="px-4 text-ink-secondary font-semibold border-r border-surface-300 py-3.5 text-sm shrink-0">₹</span>
            <input
              type="number" value={lossLimit}
              onChange={(e) => setLossLimit(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-ink-primary text-base focus:outline-none num"
              min="100" step="100"
            />
          </div>
        </div>
      </div>

      <button onClick={handleContinue} disabled={loading} className="w-full btn-primary py-4 mt-6">
        {loading ? 'Saving…' : 'Finish setup'}
      </button>
    </div>
  )
}
