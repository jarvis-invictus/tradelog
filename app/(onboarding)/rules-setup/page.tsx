// M2.4 — Rules setup screen
// TODO: Build in M2.4 milestone session
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
    <div className="flex-1 flex flex-col px-6 py-12">
      <div className="mb-8">
        <p className="text-gray-500 text-sm mb-1">Step 3 of 3</p>
        <h1 className="text-2xl font-bold text-white">Set your rules</h1>
        <p className="text-gray-400 text-sm mt-1">You can edit these anytime from the Rules tab</p>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <label className="block text-white font-medium mb-1">Max trades per day</label>
          <p className="text-gray-500 text-xs mb-3">TradeLog will warn you when you approach this limit</p>
          <div className="flex gap-2">
            {['2', '3', '4', '5'].map((v) => (
              <button
                key={v}
                onClick={() => setMaxTrades(v)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition border ${
                  maxTrades === v
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <label className="block text-white font-medium mb-1">Daily loss limit (₹)</label>
          <p className="text-gray-500 text-xs mb-3">Hard stop — you will not be able to dismiss this alert</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-lg">₹</span>
            <input
              type="number"
              value={dailyLoss}
              onChange={(e) => setDailyLoss(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-lg focus:outline-none focus:border-blue-500"
              min="500"
              step="500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-md font-medium transition mt-8"
      >
        {loading ? 'Saving...' : 'Finish setup'}
      </button>
    </div>
  )
}
