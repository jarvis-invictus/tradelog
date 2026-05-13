export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import UpgradeClient from '@/components/upgrade/UpgradeClient'

export default async function UpgradePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('plan, plan_expires_at')
    .eq('id', user?.id ?? '')
    .maybeSingle()

  return (
    <div className="space-y-4 md:space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Upgrade to Pro</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Unlock AI coaching and advanced analytics</p>
      </div>
      <UpgradeClient
        currentPlan={profile?.plan ?? 'free'}
        planExpiresAt={profile?.plan_expires_at ?? null}
        razorpayEnabled={!!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)}
      />
    </div>
  )
}
