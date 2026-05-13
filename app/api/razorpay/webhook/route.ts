// Razorpay webhook: subscription.activated / subscription.cancelled / subscription.expired
// Vercel dashboard → set Razorpay webhook URL to POST /api/razorpay/webhook

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature } from '@/lib/razorpay'

type RazorpayEvent = {
  event: string
  payload: {
    subscription?: {
      entity: {
        id: string
        status: string
        notes?: { user_id?: string }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  try {
    if (!verifyWebhookSignature(body, signature)) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } catch {
    return Response.json({ error: 'Webhook secret not configured' }, { status: 503 })
  }

  const event = JSON.parse(body) as RazorpayEvent
  const sub = event.payload.subscription?.entity
  const userId = sub?.notes?.user_id

  if (!userId) return Response.json({ ignored: true })

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const plan = event.event === 'subscription.activated' ? 'pro' : 'free'

  await supabaseAdmin
    .from('users')
    .update({ plan, razorpay_subscription_id: sub?.id ?? null })
    .eq('id', userId)

  return Response.json({ success: true, plan })
}
