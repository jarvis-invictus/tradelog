// App shell layout — includes bottom nav (mobile) and sidebar (desktop)
// TODO: Build bottom nav and sidebar in M6.6 milestone session
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <main className="pb-20 md:pb-0 md:pl-60">
        {children}
      </main>
    </div>
  )
}
