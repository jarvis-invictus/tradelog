// Weekly report generation.
// GET  → Vercel cron (0 13 * * 0 = 18:30 IST Sunday) — runs for all users
// POST → Manual trigger for a single user (used in UI)

import { NextRequest } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/lib/supabase/server'
import { buildWeeklyReportPrompt, generateWeeklyReport } from '@/lib/ai'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateForUser(supabaseAdmin: SupabaseClient<any>, userId: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()

  const [tradesRes, prevRes, profileRes] = await Promise.all([
    supabaseAdmin.from('trades').select('*').eq('user_id', userId).gte('created_at', weekAgo),
    supabaseAdmin.from('trades').select('pnl_rupees, status, created_at').eq('user_id', userId).gte('created_at', monthAgo).lt('created_at', weekAgo),
    supabaseAdmin.from('users').select('language').eq('id', userId).maybeSingle(),
  ])

  const trades = tradesRes.data ?? []
  if (trades.filter((t) => t.status === 'closed').length < 3) return null

  const prompt = buildWeeklyReportPrompt(
    trades,
    [],
    [prevRes.data ?? []],
    (profileRes.data?.language as string) ?? 'en'
  )

  const reportText = await generateWeeklyReport(prompt)

  const weekStart = weekAgo.slice(0, 10)
  await supabaseAdmin.from('weekly_reports').upsert({
    user_id:      userId,
    report_text:  reportText,
    week_start:   weekStart,
    generated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,week_start' })

  return reportText
}

export async function GET(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? ''}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: users } = await supabaseAdmin.from('users').select('id')
  const results = await Promise.allSettled(
    (users ?? []).map((u) => generateForUser(supabaseAdmin, u.id))
  )

  const generated = results.filter((r) => r.status === 'fulfilled' && r.value).length
  return Response.json({ generated, total: users?.length ?? 0 })
}

export async function POST() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const report = await generateForUser(supabaseAdmin, user.id)
    if (!report) return Response.json({ error: 'Not enough trades this week (min 3)' }, { status: 422 })

    return Response.json({ report })
  } catch (err) {
    console.error('Report generation error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to generate report' },
      { status: 500 }
    )
  }
}
