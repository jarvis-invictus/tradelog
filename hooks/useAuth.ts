// M1.2 — Auth state hook
// Subscribes to supabase.auth.onAuthStateChange
// Exposes: user, session, loading, signOut()
// TODO: Build in M1.2 milestone session
export function useAuth() {
  return { user: null, session: null, loading: true, signOut: async () => {} }
}
