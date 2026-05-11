'use client'
export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingCompletePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function finish() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('users').update({ onboarding_complete: true }).eq('id', user.id)
      }
      setTimeout(() => router.push('/home'), 2500)
    }
    finish()
  }, [supabase, router])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5 min-h-screen">
      <div className="relative">
        <div className="w-[72px] h-[72px] rounded-full bg-up/10 border border-up/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full border border-up/20 animate-ping" />
      </div>
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight mb-2">You&apos;re all set</h1>
        <p className="text-text-secondary text-[13px]">Taking you to your dashboard…</p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
