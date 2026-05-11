// M12.1 — Razorpay subscription creation (server-side only)
// INR subscriptions + UPI support
// TODO: Build in M12.1 milestone session
export async function createSubscription(_userId: string): Promise<{ subscriptionId: string }> {
  throw new Error('Not implemented')
}

export function verifyWebhookSignature(_body: string, _signature: string): boolean {
  throw new Error('Not implemented')
}
