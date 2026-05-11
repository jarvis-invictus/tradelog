'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

async function handleUser(userId: string, router: ReturnType<typeof useRouter>) {
  const supabase = createClient()
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

export default function AuthCallbackPage() {
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    const supabase = createClient()

    // Case 1: session already exists when page mounts (event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !handled.current) {
        handled.current = true
        handleUser(session.user.id, router)
      }
    })

    // Case 2: session arrives via onAuthStateChange (hash processed after mount)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user && !handled.current) {
          handled.current = true
          handleUser(session.user.id, router)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen bg-ink-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-text-secondary text-[13px]">Signing you in…</p>
      </div>
    </div>
  )
}
