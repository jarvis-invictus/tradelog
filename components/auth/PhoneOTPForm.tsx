'use client'

// M1.1 — Phone OTP auth form (+91 pre-filled)
// Two-step state machine: enter phone → enter OTP
// On success: ensures public.users row exists, redirects to /welcome or /home

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Step = 'phone' | 'otp'

export default function PhoneOTPForm() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const digits = phone.replace(/\D/g, '')
  const fullPhone = `+91${digits}`

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (digits.length !== 10) {
      setError('Enter a 10-digit phone number')
      return
    }
    setLoading(true)
    const { error: sendErr } = await supabase.auth.signInWithOtp({ phone: fullPhone })
    setLoading(false)
    if (sendErr) {
      setError(sendErr.message)
      return
    }
    setStep('otp')
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (otp.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    setLoading(true)
    const { data, error: verifyErr } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: 'sms',
    })
    if (verifyErr || !data.user) {
      setLoading(false)
      setError(verifyErr?.message ?? 'Verification failed')
      return
    }

    // Ensure public.users row exists, decide redirect
    const { data: profile } = await supabase
      .from('users')
      .select('onboarding_complete')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!profile) {
      await supabase.from('users').insert({ id: data.user.id })
      setLoading(false)
      router.push('/welcome')
      return
    }

    setLoading(false)
    router.push(profile.onboarding_complete ? '/home' : '/welcome')
  }

  if (step === 'phone') {
    return (
      <form onSubmit={handleSendOtp} className="space-y-3 w-full">
        <div className="flex rounded-2xl overflow-hidden border border-ink-border bg-ink-muted focus-within:border-accent transition-colors">
          <span className="flex items-center px-4 text-text-secondary text-[13px] font-semibold border-r border-ink-border select-none shrink-0">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-transparent px-4 py-4 text-text-primary text-base placeholder-text-tertiary focus:outline-none num"
            autoFocus
          />
        </div>
        {error && (
          <p className="text-down text-[13px] px-1">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 text-white py-4 rounded-2xl font-semibold text-[15px] transition-all"
        >
          {loading ? 'Sending…' : 'Send code'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-3 w-full">
      <p className="text-text-secondary text-[13px] mb-1">
        Code sent to <span className="text-text-primary font-semibold">{fullPhone}</span>
      </p>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="—  —  —  —  —  —"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        className="w-full bg-ink-muted border border-ink-border focus:border-accent rounded-2xl px-4 py-4 text-text-primary text-center text-[26px] font-bold tracking-[0.5em] placeholder-text-tertiary focus:outline-none transition-colors num"
        autoFocus
      />
      {error && (
        <p className="text-down text-[13px] px-1">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 text-white py-4 rounded-2xl font-semibold text-[15px] transition-all"
      >
        {loading ? 'Verifying…' : 'Verify'}
      </button>
      <button
        type="button"
        onClick={() => { setStep('phone'); setOtp(''); setError(null) }}
        className="w-full text-text-tertiary hover:text-text-secondary text-[13px] py-2 transition-colors"
      >
        Use a different number
      </button>
    </form>
  )
}
