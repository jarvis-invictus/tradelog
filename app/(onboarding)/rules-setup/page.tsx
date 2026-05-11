'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, TrendingDown } from 'lucide-react'
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
      {/* Progress */}
      <div className="mb-8">
        <div className="flex gap-1.5 mb-5">
          {[1,2,3].map((s) => (
            <div key={s} className="flex-1 h-1 rounded-full bg-blue-500" />
          ))}
        </div>
        <p className="text-gray-500 text-xs mb-1">Step 3 of 3</p>
        <h1 className="text-2xl font-bold text-white">Set your rules</h1>
        <p className="text-gray-400 text-sm mt-1">Editable anytime from the Rules tab</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Max trades */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
              <AlertTriangle size={15} className="text-orange-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Max trades per day</p>
              <p className="text-gray-500 text-xs">Soft warning when you reach the limit</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['2', '3', '4', '5'].map((v) => (
              <button
                key={v}
                onClick={() => setMaxTrades(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition border ${
                  maxTrades === v
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Daily loss */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <TrendingDown size={15} className="text-red-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Daily loss limit</p>
              <p className="text-gray-500 text-xs">Hard stop — cannot be dismissed</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition">
            <span className="px-4 text-gray-400 font-semibold border-r border-gray-700 py-3 text-sm">₹</span>
            <input
              type="number"
              value={dailyLoss}
              onChange={(e) => setDailyLoss(e.target.value)}
              className="flex-1 bg-transparent px-3 py-3 text-white text-base focus:outline-none"
              min="500"
              step="500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold text-base transition mt-6"
      >
        {loading ? 'Saving...' : 'Finish Setup →'}
      </button>
    </div>
  )
}
