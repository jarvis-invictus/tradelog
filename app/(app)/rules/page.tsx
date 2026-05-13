export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import RulesScreen from '@/components/rules/RulesScreen'

export default async function RulesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rules } = await supabase
    .from('user_rules')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Rules</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Your trading guardrails</p>
      </div>
      <RulesScreen rules={(rules ?? []) as never[]} userId={user?.id ?? ''} />
    </div>
  )
}
