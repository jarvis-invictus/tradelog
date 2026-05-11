'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Shield, ArrowRight } from 'lucide-react'

export default function MT5ConnectPage() {
  const [skipping, setSkipping] = useState(false)
  const router = useRouter()

  function handleSkip() {
    setSkipping(true)
    router.push('/rules-setup')
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-10 min-h-screen">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex gap-1.5 mb-5">
          {[1,2,3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s <= 2 ? 'bg-blue-500' : 'bg-gray-800'}`} />
          ))}
        </div>
        <p className="text-gray-500 text-xs mb-1">Step 2 of 3</p>
        <h1 className="text-2xl font-bold text-white">Connect MT5</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Link2 size={28} className="text-gray-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg mb-1">MT5 Auto-sync</p>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Auto-sync requires MetaApi integration — coming in a future update.
            You can still log all your trades manually.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-900/20 border border-green-800/40 rounded-xl px-4 py-3">
          <Shield size={14} className="text-green-400 shrink-0" />
          <p className="text-green-400 text-xs text-left">Read-only access only — we can never place, modify, or close trades</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handleSkip}
          disabled={skipping}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
        >
          Continue without MT5 <ArrowRight size={16} />
        </button>
        <p className="text-center text-gray-600 text-xs">You can connect later from Settings</p>
      </div>
    </div>
  )
}
