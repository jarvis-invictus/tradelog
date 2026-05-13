// Single-device enforcement — signs out all other sessions when a new device logs in.
// Does NOT require or touch any device-fingerprint columns in the users table.

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Sign out all existing sessions for this user
    try {
      await supabaseAdmin.auth.admin.signOut(userId)
    } catch (err) {
      console.error('signOut error:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('device-invalidate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
