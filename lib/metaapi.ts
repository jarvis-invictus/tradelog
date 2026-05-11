// M3.1 / M3.2 — MetaApi service integration (server-side only)
// Read-only investor token — can see trades, cannot place/modify/close
// TODO: Build in M3.1 milestone session
export async function connectMT5Account(
  _loginId: string,
  _investorPassword: string,
  _server: string
): Promise<{ accountId: string }> {
  throw new Error('Not implemented')
}

export async function syncTrades(_accountId: string): Promise<unknown[]> {
  throw new Error('Not implemented')
}
