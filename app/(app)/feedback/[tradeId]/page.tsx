export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FeedbackClient from '@/components/feedback/FeedbackClient'

export default async function FeedbackPage({ params }: { params: { tradeId: string } }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [tradeRes, journalRes, feedbackRes, profileRes] = await Promise.all([
    supabase
      .from('trades')
      .select('id, pair, direction, pnl_rupees, session, lot_size, entry_price, exit_price, status, created_at')
      .eq('id', params.tradeId)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
    supabase
      .from('trade_journals')
      .select('entry_emotion, exit_emotion, reasoning_text, reflection_note')
      .eq('trade_id', params.tradeId)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
    supabase
      .from('ai_feedback')
      .select('feedback_text, generated_at')
      .eq('trade_id', params.tradeId)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
    supabase
      .from('users')
      .select('plan')
      .eq('id', user?.id ?? '')
      .maybeSingle(),
  ])

  if (!tradeRes.data) notFound()

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/trade/${params.tradeId}`} className="text-ink-tertiary hover:text-ink-secondary text-sm transition-colors duration-150">
          ← Trade
        </Link>
        <span className="text-surface-300">|</span>
        <h1 className="text-xl font-bold text-ink-primary tracking-tight">AI Feedback</h1>
      </div>
      <FeedbackClient
        trade={tradeRes.data}
        journal={journalRes.data ?? null}
        existingFeedback={feedbackRes.data ? {
          feedback_text: feedbackRes.data.feedback_text as string,
          generated_at:  feedbackRes.data.generated_at as string,
        } : null}
        aiEnabled={!!(process.env.ANTHROPIC_API_KEY || process.env.GROQ_API_KEY)}
        isPro={(profileRes.data?.plan ?? 'free') === 'pro'}
      />
    </div>
  )
}
