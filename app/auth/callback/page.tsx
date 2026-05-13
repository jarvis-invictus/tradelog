'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getDeviceInfo } from '@/lib/deviceFingerprint'

export default function AuthCallbackPage() {
  const router = useRouter()
  const handled = useRef(false)
  const [message, setMessage] = useState('Signing you in…')

  useEffect(() => {
    if (handled.current) return
    const supabase = createClient()

    async function handleDeviceManagement(userId: string) {
      try {
        const deviceInfo = getDeviceInfo()
        
        // Call device invalidation API
        const response = await fetch('/api/auth/device-invalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            deviceFingerprint: deviceInfo.fingerprint,
          }),
        })

        const result = await response.json()

        if (result.action === 'device_switched') {
          setMessage('Logged out from other device. Continuing…')
          // Show message for 2 seconds before redirect
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.error('Device management error:', error)
        // Continue with login even if device management fails
      }
    }

    async function resolveRedirect(userId: string) {
      // Handle device management first
      await handleDeviceManagement(userId)

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
        <p className="text-text-secondary text-[13px]">{message}</p>
      </div>
    </div>
  )
}
