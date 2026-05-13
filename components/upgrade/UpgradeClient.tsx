'use client'
import { useState } from 'react'
import { Sparkles, CheckCircle2, Lock } from 'lucide-react'

const PRO_FEATURES = [
  'Claude AI / Groq per-trade feedback',
  'Weekly AI performance report (every Sunday)',
  'Voice-to-text journal entries',
  'Rule violation analytics',
  'Priority support',
]

export default function UpgradeClient({
  currentPlan,
  planExpiresAt,
  razorpayEnabled,
}: {
  currentPlan: string
  planExpiresAt: string | null
  razorpayEnabled: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const isPro = currentPlan === 'pro'

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/razorpay/create', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create subscription')
      if (data.short_url) {
        window.location.href = data.short_url
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current plan badge */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="section-label">Current plan</p>
          <p className="text-ink-primary font-bold text-lg capitalize">{currentPlan}</p>
          {isPro && planExpiresAt && (
            <p className="text-ink-tertiary text-xs mt-0.5">
              Renews {new Date(planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        {isPro && (
          <span className="px-3 py-1 rounded-full bg-brand-400/15 border border-brand-400/30 text-brand-400 text-xs font-semibold">
            Active
          </span>
        )}
      </div>

      {/* Pro card */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2 bg-brand-400/8">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <p className="text-ink-primary font-semibold text-sm">TradeLog Pro</p>
        </div>
        <div className="px-4 py-4 space-y-3">
          <ul className="space-y-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            {isPro ? (
              <div className="flex items-center gap-2 text-profit-text text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                You&apos;re on Pro — all features unlocked
              </div>
            ) : razorpayEnabled ? (
              <>
                {error && <p className="text-danger-text text-xs mb-2">{error}</p>}
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="btn-primary py-3 text-sm"
                >
                  {loading ? 'Redirecting to checkout…' : 'Upgrade to Pro — ₹499/mo'}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-ink-tertiary text-xs">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                Payments not configured yet — set <code className="bg-surface-600 px-1 rounded">RAZORPAY_KEY_ID</code> and <code className="bg-surface-600 px-1 rounded">RAZORPAY_KEY_SECRET</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Free plan features for reference */}
      {!isPro && (
        <div className="card p-4">
          <p className="section-label mb-2">Free plan includes</p>
          <ul className="space-y-1.5 text-xs text-ink-secondary">
            {['Unlimited manual trade logging', 'Journal & reflection', 'Rules engine (hard-stops)', 'P&L analytics'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
