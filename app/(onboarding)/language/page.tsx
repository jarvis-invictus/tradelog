// M2.2 — Language picker (EN/HI/MR) saves to Supabase users.language, routes to /mt5-connect
// TODO: Build in M2.2 milestone session

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
    <div className="flex-1 flex flex-col px-6 py-12">
      <div className="mb-8">
        <p className="text-gray-500 text-sm mb-1">Step 1 of 3</p>
        <h1 className="text-2xl font-bold text-white">Choose your language</h1>
        <p className="text-gray-400 text-sm mt-1">AI feedback will be in this language</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition ${
              selected === lang.code
                ? 'border-blue-500 bg-blue-600/10 text-white'
                : 'border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <p className="font-medium">{lang.native}</p>
              <p className="text-sm text-gray-500">{lang.label}</p>
            </div>
            {selected === lang.code && (
              <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">✓</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-md font-medium transition mt-8"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  )
}
