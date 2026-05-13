import { createServerClient } from '@/lib/supabase/server'
import { createSubscription } from '@/lib/razorpay'

export async function POST() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { subscriptionId, shortUrl } = await createSubscription(user.id)

    return Response.json({ subscriptionId, shortUrl })
  } catch (err) {
    console.error('Razorpay create error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
