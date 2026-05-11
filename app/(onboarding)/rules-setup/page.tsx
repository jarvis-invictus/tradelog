'use client'

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
          type: 'max_trades',
          definition: { value: safeMax, frequency },
          personal_note: `Max ${safeMax} trades per ${frequency === 'daily' ? 'day' : 'week'}`,
        },
        {
          user_id: user.id,
          type: 'loss_limit',
          definition: { value: parseFloat(lossLimit), currency: 'USD', frequency },
          personal_note: `Stop if I lose $${lossLimit} in a ${frequency === 'daily' ? 'day' : 'week'}`,
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
          <div className="flex-1 h-[3px] rounded-full bg-accent" />
          <div className="flex-1 h-[3px] rounded-full bg-accent" />
          <div className="flex-1 h-[3px] rounded-full bg-accent" />
        </div>
        <p className="text-text-tertiary text-xs font-medium mb-1">STEP 3 OF 3</p>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Your rules</h1>
        <p className="text-text-secondary text-[13px] mt-1">Editable anytime from the Rules tab</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">

        {/* Frequency toggle */}
        <div className="card p-5">
          <p className="text-text-primary text-[14px] font-semibold mb-0.5">Trading frequency</p>
          <p className="text-text-tertiary text-[12px] mb-4">How often do you trade?</p>
          <div className="grid grid-cols-2 gap-2">
            {(['daily', 'weekly'] as Frequency[]).map((f) => (
              <button key={f} onClick={() => { setFrequency(f); setMaxTrades(f === 'daily' ? 3 : 2) }}
                className={`py-3 rounded-xl text-[13px] font-semibold capitalize border transition-all ${
                  frequency === f ? 'border-accent/60 text-accent' : 'border-ink-border bg-ink-muted text-text-secondary'
                }`}
                style={frequency === f ? {background:'linear-gradient(135deg,rgba(76,110,245,0.12) 0%,rgba(76,110,245,0.04) 100%)'} : undefined}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Max trades slider */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-1">
            <p className="text-text-primary text-[14px] font-semibold">
              Max trades per {frequency === 'daily' ? 'day' : 'week'}
            </p>
            <span className="text-accent font-bold text-[22px] num leading-none">{safeMax}</span>
          </div>
          <p className="text-text-tertiary text-[12px] mb-5">Soft warning when you reach this</p>
          <input
            type="range"
            min={1}
            max={maxLimit}
            value={safeMax}
            onChange={(e) => setMaxTrades(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4C6EF5 0%, #4C6EF5 ${((safeMax - 1) / (maxLimit - 1)) * 100}%, #1C1C24 ${((safeMax - 1) / (maxLimit - 1)) * 100}%, #1C1C24 100%)`,
            }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-text-tertiary text-[11px]">1</span>
            <span className="text-text-tertiary text-[11px]">{maxLimit}</span>
          </div>
        </div>

        {/* Loss limit */}
        <div className="card p-5">
          <p className="text-text-primary text-[14px] font-semibold mb-0.5">
            {frequency === 'daily' ? 'Daily' : 'Weekly'} loss limit
          </p>
          <p className="text-text-tertiary text-[12px] mb-4">Hard stop — cannot be dismissed</p>
          <div className="flex items-center rounded-xl overflow-hidden input-field">
            <span className="px-4 text-text-secondary font-semibold border-r border-ink-border py-3.5 text-[13px] shrink-0">$</span>
            <input
              type="number"
              value={lossLimit}
              onChange={(e) => setLossLimit(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-text-primary text-base focus:outline-none num"
              min="10"
              step="10"
            />
          </div>
        </div>
      </div>

      <button onClick={handleContinue} disabled={loading}
        className="w-full btn-primary py-4 text-[15px] mt-6"
      >
        {loading ? 'Saving…' : 'Finish setup'}
      </button>
    </div>
  )
}
