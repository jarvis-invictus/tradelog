// M10.1 — Weekly report generation (also triggered by Vercel cron)
// Cron: 0 13 * * 0 (13:00 UTC = 18:30 IST, Sunday)
// TODO: Build in M10.1 milestone session
export async function POST() {
  return Response.json({ error: 'Not implemented' }, { status: 501 })
}

export async function GET() {
  return Response.json({ error: 'Not implemented' }, { status: 501 })
}
