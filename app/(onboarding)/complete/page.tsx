'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5 min-h-screen">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle size={48} className="text-green-400" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re all set!</h1>
        <p className="text-gray-400 text-sm">Taking you to your dashboard...</p>
      </div>
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
