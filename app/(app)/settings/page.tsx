export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('name, language, mt5_connected, plan, plan_expires_at, metaapi_account_id')
    .eq('id', user?.id ?? '')
    .maybeSingle()

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Settings</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Manage your account and preferences</p>
      </div>
      <SettingsClient
        userId={user?.id ?? ''}
        email={user?.email ?? ''}
        name={profile?.name ?? ''}
        language={profile?.language ?? 'en'}
        mt5Connected={profile?.mt5_connected ?? false}
        plan={profile?.plan ?? 'free'}
        planExpiresAt={profile?.plan_expires_at ?? null}
        metaapiAccountId={profile?.metaapi_account_id ?? null}
      />
    </div>
  )
}
