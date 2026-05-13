// API endpoint to invalidate other device sessions for single-device enforcement
// POST /api/auth/device-invalidate

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, deviceFingerprint } = await request.json()

    if (!userId || !deviceFingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get current user device info
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('current_device_id, device_fingerprint')
      .eq('id', userId)
      .single()

    if (userError || !currentUser) {
      // If user not found, create the user record
      if (userError?.code === 'PGRST116') {
        await supabaseAdmin
          .from('users')
          .insert({ 
            id: userId,
            current_device_id: deviceFingerprint,
            device_fingerprint: deviceFingerprint,
            last_active_at: new Date().toISOString()
          })
        return NextResponse.json({ success: true, action: 'new_device' })
      }
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If user has no current device, allow login
    if (!currentUser.current_device_id) {
      await supabaseAdmin
        .from('users')
        .update({ 
          current_device_id: deviceFingerprint,
          device_fingerprint: deviceFingerprint,
          last_active_at: new Date().toISOString()
        })
        .eq('id', userId)
      return NextResponse.json({ success: true, action: 'new_device' })
    }

    // Check if this is the same device
    const isSameDevice = currentUser.device_fingerprint === deviceFingerprint

    if (isSameDevice) {
      // Same device, just update last active
      await supabaseAdmin
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', userId)

      return NextResponse.json({ success: true, action: 'same_device' })
    }

    // Different device - invalidate old sessions and set new device
    try {
      // Sign out all sessions for this user using admin function
      await supabaseAdmin.auth.admin.signOut(userId)
    } catch (signOutError) {
      console.error('Error signing out sessions:', signOutError)
      // Continue anyway - we'll update device info
    }

    // Update to new device
    await supabaseAdmin
      .from('users')
      .update({ 
        current_device_id: deviceFingerprint,
        device_fingerprint: deviceFingerprint,
        last_active_at: new Date().toISOString()
      })
      .eq('id', userId)

    return NextResponse.json({ 
      success: true, 
      action: 'device_switched',
      message: 'Logged out from other device' 
    })

  } catch (error) {
    console.error('Device invalidation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
