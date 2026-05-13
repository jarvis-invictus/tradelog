'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

type Trade = {
  id: string
  pair: string
  direction: string
  pnl_rupees: number | null
  session: string | null
  lot_size: number
  entry_price: number
  exit_price: number | null
  status: string
  created_at: string
}

type Journal = {
  entry_emotion: string | null
  exit_emotion: string | null
  reasoning_text: string | null
  reflection_note: string | null
} | null

type Feedback = {
  feedback_text: string
  generated_at: string
} | null

function pnlColorClass(v: number | null) {
  if (v === null) return 'text-ink-secondary'
  return v >= 0 ? 'text-profit-text' : 'text-loss-text'
}

function fmtPnl(v: number | null) {
  if (v === null) return '—'
  return `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export default function FeedbackClient({
  trade,
  journal,
  existingFeedback,
  aiEnabled,
  isPro = true,
}: {
  trade: Trade
  journal: Journal
  existingFeedback: Feedback
  aiEnabled: boolean
  isPro?: boolean
}) {
  const [feedback, setFeedback]   = useState<Feedback>(existingFeedback)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId: trade.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate feedback')
      setFeedback({ feedback_text: data.feedback, generated_at: new Date().toISOString() })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Trade recap */}
      <div className="card p-4">
        <p className="section-label mb-3">Trade recap</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-6 rounded-full ${trade.direction === 'buy' ? 'bg-profit' : 'bg-loss'}`} />
            <span className="trade-pair">{trade.pair}</span>
            <span className="text-ink-tertiary text-xs capitalize">{trade.direction} · {trade.lot_size} lots</span>
          </div>
          <span className={`font-mono font-semibold num ${pnlColorClass(trade.pnl_rupees)}`}>
            {fmtPnl(trade.pnl_rupees)}
          </span>
        </div>
        {journal && (
          <div className="space-y-1.5 border-t border-surface-300 pt-3">
            {(journal.entry_emotion || journal.exit_emotion) && (
              <p className="text-ink-tertiary text-xs">
                Emotions: {[journal.entry_emotion, journal.exit_emotion].filter(Boolean).join(' → ')}
              </p>
            )}
            {journal.reasoning_text && (
              <p className="text-ink-secondary text-xs leading-relaxed line-clamp-2">
                &ldquo;{journal.reasoning_text}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Feedback section */}
      {!aiEnabled ? (
        <div className="card p-6 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-ink-tertiary mx-auto" />
          <p className="text-ink-primary font-semibold text-sm">AI feedback not configured</p>
          <p className="text-ink-secondary text-sm leading-relaxed max-w-xs mx-auto">
            Set <code className="bg-surface-600 px-1 rounded text-brand-400">ANTHROPIC_API_KEY</code> or <code className="bg-surface-600 px-1 rounded text-brand-400">GROQ_API_KEY</code> to enable AI analysis.
          </p>
        </div>
      ) : !isPro ? (
        <div className="card p-6 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
          <p className="text-ink-primary font-semibold text-sm">Pro feature</p>
          <p className="text-ink-secondary text-sm leading-relaxed max-w-xs mx-auto">
            AI trade feedback is available on the Pro plan.
          </p>
          <a href="/upgrade" className="btn-primary !w-auto px-6 py-2.5 text-sm inline-block">
            Upgrade to Pro
          </a>
        </div>
      ) : feedback ? (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <p className="text-ink-primary font-semibold text-sm">AI Feedback</p>
            </div>
            <p className="text-ink-tertiary text-xs">{fmtDate(feedback.generated_at)}</p>
          </div>
          <div className="px-4 py-4">
            <pre className="text-ink-secondary text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {feedback.feedback_text}
            </pre>
          </div>
          <div className="px-4 py-3 border-t border-surface-300">
            <button
              onClick={generate}
              disabled={loading}
              className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors duration-150 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Regenerate
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-6 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
          <div>
            <p className="text-ink-primary font-semibold text-sm">Get AI feedback on this trade</p>
            <p className="text-ink-secondary text-sm mt-1 leading-relaxed">
              Claude will analyse your setup, emotions, and outcome against your trading rules.
            </p>
          </div>
          {error && <p className="text-danger-text text-sm">{error}</p>}
          <button
            onClick={generate}
            disabled={loading}
            className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 mx-auto !w-auto"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate feedback</>
            )}
          </button>
          {!journal && (
            <p className="text-ink-tertiary text-xs">
              Tip: Add a journal entry first for richer feedback.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
