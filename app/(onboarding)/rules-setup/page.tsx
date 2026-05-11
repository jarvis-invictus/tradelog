'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RulesSetupPage() {
  const [maxTrades, setMaxTrades] = useState('3')
  const [dailyLoss, setDailyLoss] = useState('2000')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleContinue() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_rules').insert([
        {
          user_id: user.id,
          type: 'max_trades_day',
          definition: { value: parseInt(maxTrades) },
          personal_note: `Max ${maxTrades} trades per day`,
        },
        {
          user_id: user.id,
          type: 'daily_loss_limit',
          definition: { value: parseInt(dailyLoss) },
          personal_note: `Stop if I lose ₹${dailyLoss} in a day`,
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
        <div className="bg-ink-surface rounded-2xl p-5 border border-ink-border">
          <p className="text-text-primary text-[14px] font-semibold mb-0.5">Max trades per day</p>
          <p className="text-text-tertiary text-[12px] mb-4">Soft warning when you reach this</p>
          <div className="flex gap-2">
            {['2', '3', '4', '5'].map((v) => (
              <button
                key={v}
                onClick={() => setMaxTrades(v)}
                className={`flex-1 py-3 rounded-xl text-[14px] font-bold transition-all border ${
                  maxTrades === v
                    ? 'bg-accent border-accent/60 text-white'
                    : 'bg-ink-muted border-ink-border text-text-secondary hover:border-ink-muted'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-ink-surface rounded-2xl p-5 border border-ink-border">
          <p className="text-text-primary text-[14px] font-semibold mb-0.5">Daily loss limit</p>
          <p className="text-text-tertiary text-[12px] mb-4">Hard stop — cannot be dismissed</p>
          <div className="flex items-center bg-ink-muted border border-ink-border rounded-xl overflow-hidden focus-within:border-accent transition-colors">
            <span className="px-4 text-text-secondary font-semibold border-r border-ink-border py-3.5 text-[13px] shrink-0">₹</span>
            <input
              type="number"
              value={dailyLoss}
              onChange={(e) => setDailyLoss(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-text-primary text-base focus:outline-none num"
              min="500"
              step="500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 text-white py-4 rounded-2xl font-semibold text-[15px] transition-all mt-6"
      >
        {loading ? 'Saving…' : 'Finish setup'}
      </button>
    </div>
  )
}
