import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await createServerClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error('[auth/callback] exchangeCodeForSession error:', exchangeError.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_complete')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        await supabase.from('users').insert({ id: user.id })
        return NextResponse.redirect(`${origin}/welcome`)
      }

      return NextResponse.redirect(
        `${origin}${profile.onboarding_complete ? next : '/welcome'}`
      )
    }
  }

  console.error('[auth/callback] No code in request or user not found')
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
