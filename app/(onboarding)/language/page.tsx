'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
] as const

type LangCode = 'en' | 'hi' | 'mr'

export default function LanguagePage() {
  const [selected, setSelected] = useState<LangCode>('en')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleContinue() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ language: selected }).eq('id', user.id)
    }
    setLoading(false)
    router.push('/mt5-connect')
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-10 min-h-screen">
      <div className="mb-8">
        <div className="flex gap-1.5 mb-6">
          <div className="flex-1 h-[3px] rounded-full bg-accent" />
          <div className="flex-1 h-[3px] rounded-full bg-ink-muted" />
          <div className="flex-1 h-[3px] rounded-full bg-ink-muted" />
        </div>
        <p className="text-text-tertiary text-xs font-medium mb-1">STEP 1 OF 3</p>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Language</h1>
        <p className="text-text-secondary text-[13px] mt-1">AI feedback will be in this language</p>
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-150 ${
              selected === lang.code
                ? 'border-accent/60'
                : 'border-ink-border bg-ink-surface hover:border-ink-muted'
            }`}
            style={selected === lang.code ? {
              background: 'linear-gradient(135deg, rgba(76,110,245,0.10) 0%, rgba(76,110,245,0.04) 100%)',
              boxShadow: '0 0 0 1px rgba(76,110,245,0.25), 0 2px 8px rgba(0,0,0,0.3)',
            } : undefined}
          >
            <div className="text-left">
              <p className={`font-semibold text-[15px] ${selected === lang.code ? 'text-text-primary' : 'text-text-primary/80'}`}>
                {lang.native}
              </p>
              <p className="text-text-tertiary text-[12px] mt-0.5">{lang.label}</p>
            </div>
            <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-all ${
              selected === lang.code ? 'border-accent bg-accent' : 'border-ink-muted'
            }`}>
              {selected === lang.code && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full btn-primary py-4 text-[15px] mt-6"
      >
        {loading ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}
