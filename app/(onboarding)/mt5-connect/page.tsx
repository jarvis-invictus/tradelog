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
          <div className="flex-1 h-[3px] rounded-full bg-accent" />
          <div className="flex-1 h-[3px] rounded-full bg-accent" />
          <div className="flex-1 h-[3px] rounded-full bg-ink-muted" />
        </div>
        <p className="text-text-tertiary text-xs font-medium mb-1">STEP 2 OF 3</p>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Connect MT5</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-14 h-14 rounded-[18px] bg-ink-surface border border-ink-border flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div>
          <p className="text-text-primary font-semibold text-[16px] mb-2">MT5 Auto-sync</p>
          <p className="text-text-secondary text-[13px] max-w-[260px] leading-relaxed">
            Auto-sync requires MetaApi — coming in a future update. You can log trades manually for now.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-up/5 border border-up/20 rounded-2xl px-4 py-3 text-left max-w-[280px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p className="text-up text-[12px] leading-relaxed">Read-only access — we can never place, modify, or close trades</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleSkip}
          disabled={skipping}
          className="w-full btn-primary py-4 text-[15px]"
        >
          Continue without MT5
        </button>
        <p className="text-center text-text-tertiary text-xs">Connect later from Settings</p>
      </div>
    </div>
  )
}
