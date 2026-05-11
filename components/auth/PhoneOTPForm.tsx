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
      <form onSubmit={handleSendOtp} className="space-y-4 w-full max-w-sm">
        <div className="flex">
          <span className="flex items-center px-3 bg-gray-800 border border-r-0 border-gray-700 rounded-l-md text-gray-300 select-none">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-r-md px-3 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-md font-medium transition"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4 w-full max-w-sm">
      <p className="text-gray-400 text-sm text-center">Sent to {fullPhone}</p>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="••••••"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-blue-500"
        autoFocus
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-md font-medium transition"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep('phone')
          setOtp('')
          setError(null)
        }}
        className="w-full text-gray-400 hover:text-white text-sm"
      >
        Change phone number
      </button>
    </form>
  )
}
