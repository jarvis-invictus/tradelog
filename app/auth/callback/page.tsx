'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase JS automatically detects and processes the #access_token hash
    // from the URL when the page loads. We just need to wait for auth state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user

          const { data: profile } = await supabase
            .from('users')
            .select('onboarding_complete')
            .eq('id', user.id)
            .maybeSingle()

          if (!profile) {
            await supabase.from('users').insert({ id: user.id })
            router.replace('/welcome')
          } else {
            router.replace(profile.onboarding_complete ? '/home' : '/welcome')
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-ink-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-text-secondary text-[13px]">Signing you in…</p>
      </div>
    </div>
  )
}
