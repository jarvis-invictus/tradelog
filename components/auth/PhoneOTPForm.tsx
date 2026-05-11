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
      <form onSubmit={handleSendOtp} className="space-y-4 w-full">
        <div className="flex rounded-xl overflow-hidden border border-gray-700 focus-within:border-blue-500 transition bg-gray-800">
          <span className="flex items-center px-4 text-gray-400 font-medium text-sm border-r border-gray-700 select-none bg-gray-800">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3.5 text-white text-base placeholder-gray-600 focus:outline-none"
            autoFocus
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold text-base transition"
        >
          {loading ? 'Sending code...' : 'Send OTP →'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4 w-full">
      <div className="text-center mb-2">
        <p className="text-gray-400 text-sm">Code sent to <span className="text-white font-medium">{fullPhone}</span></p>
      </div>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="0  0  0  0  0  0"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-4 text-white text-center text-2xl font-bold tracking-[0.6em] placeholder-gray-700 focus:outline-none transition"
        autoFocus
      />
      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold text-base transition"
      >
        {loading ? 'Verifying...' : 'Verify →'}
      </button>
      <button
        type="button"
        onClick={() => { setStep('phone'); setOtp(''); setError(null) }}
        className="w-full text-gray-500 hover:text-gray-300 text-sm py-1 transition"
      >
        ← Change number
      </button>
    </form>
  )
}
