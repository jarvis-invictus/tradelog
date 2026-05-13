'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  User, Globe, Wifi, CreditCard, LogOut, Trash2, ChevronRight,
} from 'lucide-react'

type Props = {
  userId: string
  email: string
  name: string
  language: string
  mt5Connected: boolean
  plan: string
  planExpiresAt: string | null
  metaapiAccountId: string | null
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-300">
        <p className="section-label">{title}</p>
      </div>
      <div className="divide-y divide-surface-300">{children}</div>
    </div>
  )
}

function Row({ label, value, icon: Icon, onClick, danger }: {
  label: string
  value?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer hover:bg-surface-700 transition-colors duration-150' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon className={`w-4 h-4 shrink-0 ${danger ? 'text-danger-text' : 'text-ink-tertiary'}`} />}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-danger-text' : 'text-ink-primary'}`}>{label}</p>
        {value && <p className="text-ink-tertiary text-xs mt-0.5 truncate">{value}</p>}
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-ink-tertiary shrink-0" />}
    </div>
  )
}

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'hi', label: 'हिन्दी (Hindi)' },
  { key: 'mr', label: 'मराठी (Marathi)' },
  { key: 'gu', label: 'ગુજરાતી (Gujarati)' },
]

export default function SettingsClient({
  userId, email, name: initialName, language: initialLanguage,
  mt5Connected, plan, planExpiresAt, metaapiAccountId,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName]           = useState(initialName)
  const [language, setLanguage]   = useState(initialLanguage)
  const [editName, setEditName]   = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function saveName() {
    setSavingName(true)
    await supabase.from('users').update({ name }).eq('id', userId)
    setSavingName(false)
    setEditName(false)
  }

  async function saveLanguage(lang: string) {
    setLanguage(lang)
    await supabase.from('users').update({ language: lang }).eq('id', userId)
  }

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const planLabel = plan === 'pro' ? 'Pro' : 'Free'
  const planExpiry = planExpiresAt
    ? new Date(planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="max-w-xl space-y-4">

      {/* Profile */}
      <Section title="Profile">
        <div className="px-4 py-3.5 flex items-start gap-3">
          <User className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-primary mb-1.5">Display name</p>
            {editName ? (
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-2 text-ink-primary text-sm transition-colors duration-150"
                  placeholder="Your name"
                  autoFocus
                />
                <button onClick={saveName} disabled={savingName} className="px-3 py-2 bg-brand-400 hover:bg-brand-500 text-ink-inverse text-xs font-semibold rounded-[4px] transition-colors duration-150">
                  {savingName ? '…' : 'Save'}
                </button>
                <button onClick={() => setEditName(false)} className="btn-ghost px-3 py-2 text-xs">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-ink-secondary text-sm">{name || 'Not set'}</p>
                <button onClick={() => setEditName(true)} className="text-brand-400 text-xs hover:text-brand-300 transition-colors duration-150">
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <Row label="Email" value={email} icon={User} />
      </Section>

      {/* Language */}
      <Section title="Language">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-ink-tertiary" />
            <p className="text-ink-secondary text-xs">App language</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => saveLanguage(l.key)}
                className={`text-left px-3 py-2.5 rounded-[4px] text-sm border transition-all duration-150 ${
                  language === l.key
                    ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                    : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* MT5 Connection */}
      <Section title="MT5 Connection">
        <div className="px-4 py-3.5 flex items-center gap-3">
          <Wifi className={`w-4 h-4 shrink-0 ${mt5Connected ? 'text-profit-text' : 'text-ink-tertiary'}`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-primary">MetaTrader 5</p>
            <p className="text-ink-tertiary text-xs mt-0.5">
              {mt5Connected
                ? `Connected · ${metaapiAccountId ?? ''}`
                : 'Not connected — use onboarding to link your MT5 account'}
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded-[4px] text-xs font-medium border ${
            mt5Connected
              ? 'bg-profit/15 border-profit/30 text-profit-text'
              : 'bg-surface-600 border-surface-300 text-ink-tertiary'
          }`}>
            {mt5Connected ? 'Live' : 'Offline'}
          </span>
        </div>
      </Section>

      {/* Subscription */}
      <Section title="Subscription">
        <div className="px-4 py-3.5 flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-ink-tertiary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-primary">{planLabel} plan</p>
            {planExpiry && plan === 'pro' && (
              <p className="text-ink-tertiary text-xs mt-0.5">Renews {planExpiry}</p>
            )}
            {plan === 'free' && (
              <p className="text-ink-tertiary text-xs mt-0.5">Upgrade for unlimited trades, analytics &amp; reports</p>
            )}
          </div>
          {plan === 'free' && (
            <span className="px-3 py-1.5 bg-brand-400 hover:bg-brand-500 text-ink-inverse text-xs font-semibold rounded-[4px] cursor-pointer transition-colors duration-150">
              Upgrade
            </span>
          )}
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        <Row
          label={signingOut ? 'Signing out…' : 'Sign out'}
          icon={LogOut}
          onClick={handleSignOut}
        />
        {!confirmDelete ? (
          <Row
            label="Delete account"
            icon={Trash2}
            onClick={() => setConfirmDelete(true)}
            danger
          />
        ) : (
          <div className="px-4 py-3.5 space-y-2">
            <p className="text-danger-text text-sm font-medium">Are you sure? This is permanent and cannot be undone.</p>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-[4px] bg-danger/20 border border-danger/30 text-danger-text text-sm font-semibold transition-all duration-150 hover:bg-danger/30"
                onClick={async () => {
                  await supabase.from('users').delete().eq('id', userId)
                  await supabase.auth.signOut()
                  router.push('/login')
                }}
              >
                Yes, delete
              </button>
              <button
                className="flex-1 py-2 rounded-[4px] btn-secondary text-sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Section>

      <p className="text-ink-tertiary text-xs text-center pb-4">TradeLog © 2025 · v1.0</p>
    </div>
  )
}
