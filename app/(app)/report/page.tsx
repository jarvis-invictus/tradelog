export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import ReportClient from '@/components/report/ReportClient'

export default async function ReportPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: reports } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Weekly Reports</h1>
        <p className="text-ink-secondary text-sm mt-0.5">AI-generated performance summaries every Sunday</p>
      </div>
      <ReportClient reports={reports ?? []} aiEnabled={!!process.env.ANTHROPIC_API_KEY} />
    </div>
  )
}
