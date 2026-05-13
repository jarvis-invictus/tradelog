'use client'
export const dynamic = 'force-dynamic'

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
    <div className="flex-1 flex flex-col px-6 py-10 min-h-screen">
      <div className="mb-8">
        <div className="flex gap-1.5 mb-6">
          <div className="flex-1 h-[3px] rounded-full bg-brand-400" />
          <div className="flex-1 h-[3px] rounded-full bg-brand-400" />
          <div className="flex-1 h-[3px] rounded-full bg-surface-400" />
        </div>
        <p className="section-label mb-1">Step 2 of 3</p>
        <h1 className="text-xl font-bold text-ink-primary tracking-tight">Connect MT5</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-14 h-14 rounded-[4px] bg-surface-700 border border-surface-300 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B6B7A" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div>
          <p className="text-ink-primary font-semibold text-base mb-2">MT5 Auto-sync</p>
          <p className="text-ink-secondary text-sm max-w-[260px] leading-relaxed">
            Auto-sync requires MetaApi — coming in a future update. You can log trades manually for now.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-profit/5 border border-profit/20 rounded-[4px] px-4 py-3 text-left max-w-[280px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p className="text-profit-text text-xs leading-relaxed">Read-only access — we can never place, modify, or close trades</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={handleSkip} disabled={skipping} className="w-full btn-primary py-4">
          Continue without MT5
        </button>
        <p className="text-center text-ink-tertiary text-xs">Connect later from Settings</p>
      </div>
    </div>
  )
}
