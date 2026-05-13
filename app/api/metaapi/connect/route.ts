import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { connectMT5Account } from '@/lib/metaapi'

export async function POST(request: NextRequest) {
  if (!process.env.METAAPI_TOKEN) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const { loginId, password, server } = await request.json()
    if (!loginId || !password || !server) {
      return Response.json({ error: 'Missing loginId, password, or server' }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { accountId } = await connectMT5Account(loginId, password, server)

    await supabase
      .from('users')
      .update({ metaapi_account_id: accountId, mt5_connected: true })
      .eq('id', user.id)

    return Response.json({ success: true, accountId })
  } catch (err) {
    console.error('MetaAPI connect error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Connection failed' },
      { status: 500 }
    )
  }
}
