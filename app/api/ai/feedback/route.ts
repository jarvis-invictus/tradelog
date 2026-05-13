import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { buildFeedbackPrompt, generateFeedback } from '@/lib/ai'

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const { tradeId } = await request.json()
    if (!tradeId) return Response.json({ error: 'Missing tradeId' }, { status: 400 })

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const [tradeRes, journalRes, historyRes, rulesRes, profileRes] = await Promise.all([
      supabase.from('trades').select('*').eq('id', tradeId).eq('user_id', user.id).maybeSingle(),
      supabase.from('trade_journals').select('*').eq('trade_id', tradeId).eq('user_id', user.id).maybeSingle(),
      supabase.from('trades').select('pnl_rupees, pair, direction, session').eq('user_id', user.id).eq('status', 'closed').order('created_at', { ascending: false }).limit(20),
      supabase.from('user_rules').select('*').eq('user_id', user.id).eq('active', true),
      supabase.from('users').select('language').eq('id', user.id).maybeSingle(),
    ])

    if (!tradeRes.data) return Response.json({ error: 'Trade not found' }, { status: 404 })

    const prompt = buildFeedbackPrompt(
      tradeRes.data,
      journalRes.data ?? null,
      historyRes.data ?? [],
      rulesRes.data ?? []
    )

    const feedback = await generateFeedback(prompt)

    await supabase.from('ai_feedback').upsert({
      trade_id:      tradeId,
      user_id:       user.id,
      feedback_text: feedback,
      language:      profileRes.data?.language ?? 'en',
      generated_at:  new Date().toISOString(),
    }, { onConflict: 'trade_id' })

    return Response.json({ feedback })
  } catch (err) {
    console.error('AI feedback error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to generate feedback' },
      { status: 500 }
    )
  }
}
