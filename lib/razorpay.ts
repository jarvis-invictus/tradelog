// Razorpay — server-side only.
// INR subscriptions with UPI support.
// Plan ID is set in RAZORPAY_PLAN_ID env var.

import crypto from 'crypto'

function basicAuth() {
  const key = process.env.RAZORPAY_KEY_ID!
  const secret = process.env.RAZORPAY_KEY_SECRET!
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
}

export async function createSubscription(userId: string): Promise<{ subscriptionId: string; shortUrl: string }> {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const planId = process.env.RAZORPAY_PLAN_ID

  if (!keyId || !keySecret || !planId) throw new Error('Razorpay not configured')

  const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      Authorization: basicAuth(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id:        planId,
      total_count:    120,
      quantity:       1,
      notes:          { user_id: userId },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Razorpay error: ${err}`)
  }

  const data = await res.json() as { id: string; short_url: string }
  return { subscriptionId: data.id, shortUrl: data.short_url }
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET not configured')

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
