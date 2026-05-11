// M2.2 — Language picker (EN/HI/MR) saves to Supabase users.language, routes to /mt5-connect
// TODO: Build in M2.2 milestone session

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
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
      {/* Progress */}
      <div className="mb-8">
        <div className="flex gap-1.5 mb-5">
          {[1,2,3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s === 1 ? 'bg-blue-500' : 'bg-gray-800'}`} />
          ))}
        </div>
        <p className="text-gray-500 text-xs mb-1">Step 1 of 3</p>
        <h1 className="text-2xl font-bold text-white">Choose your language</h1>
        <p className="text-gray-400 text-sm mt-1">AI feedback will be delivered in this language</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition-all ${
              selected === lang.code
                ? 'border-blue-500 bg-blue-600/10'
                : 'border-gray-800 bg-gray-900 hover:border-gray-700'
            }`}
          >
            <div className="text-left">
              <p className={`font-semibold text-base ${selected === lang.code ? 'text-white' : 'text-gray-200'}`}>{lang.native}</p>
              <p className="text-xs text-gray-500 mt-0.5">{lang.label}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              selected === lang.code ? 'border-blue-500 bg-blue-500' : 'border-gray-700'
            }`}>
              {selected === lang.code && <Check size={11} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold text-base transition mt-8"
      >
        {loading ? 'Saving...' : 'Continue →'}
      </button>
    </div>
  )
}
