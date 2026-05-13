import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  console.log('[auth/callback] received. code present:', !!code, 'origin:', origin)
  console.log('[auth/callback] all cookies:', request.cookies.getAll().map(c => c.name))

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // setAll called from a Server Component — safe to ignore
            }
          },
        },
      }
    )

    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    console.log('[auth/callback] exchangeCodeForSession result:', { error: error?.message, userId: data?.user?.id })

    if (!error) {
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
          `${origin}${profile.onboarding_complete ? '/home' : '/welcome'}`
        )
      }
    }

    console.error('Auth callback exchangeCodeForSession error:', error?.message)
  } else {
    console.error('Auth callback: no code param received. URL:', request.url)
  }

  return NextResponse.redirect(`${origin}/login?error=Authentication+failed`)
}
