// M2.3 — MT5 connect screen with skip (MetaApi deferred), routes to /rules-setup
// TODO: Build in M2.3 milestone session
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MT5ConnectPage() {
  const [skipping, setSkipping] = useState(false)
  const router = useRouter()

  function handleSkip() {
    setSkipping(true)
    router.push('/rules-setup')
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-12">
      <div className="mb-8">
        <p className="text-gray-500 text-sm mb-1">Step 2 of 3</p>
        <h1 className="text-2xl font-bold text-white">Connect MT5 Account</h1>
        <p className="text-gray-400 text-sm mt-1">
          We use read-only investor access — we can see your trades but cannot place, modify, or close any trade.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-2xl">🔗</div>
        <p className="text-gray-300 font-medium">MetaApi integration</p>
        <p className="text-gray-500 text-sm max-w-xs">
          MT5 auto-sync requires MetaApi. This will be available in a future update.
          <br /><br />
          You can still use TradeLog to journal trades manually.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handleSkip}
          disabled={skipping}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-md font-medium transition"
        >
          Continue without MT5
        </button>
        <p className="text-center text-gray-600 text-xs">You can connect later from Settings</p>
      </div>
    </div>
  )
}
