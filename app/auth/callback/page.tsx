'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    const supabase = createClient()

    async function resolveRedirect(userId: string) {
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_complete')
        .eq('id', userId)
        .maybeSingle()
      if (!profile) {
        await supabase.from('users').insert({ id: userId })
        router.replace('/welcome')
      } else {
        router.replace(profile.onboarding_complete ? '/home' : '/welcome')
      }
    }

    // Handle session that already exists on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !handled.current) {
        handled.current = true
        resolveRedirect(session.user.id)
        return
      }
    })

    // Handle session arriving via hash fragment (Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (handled.current) return
        if (event === 'SIGNED_IN' && session?.user) {
          handled.current = true
          resolveRedirect(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-bg">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-text-secondary text-[13px]">Signing you in…</p>
      </div>
    </div>
  )
}
