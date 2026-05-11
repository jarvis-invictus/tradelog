import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-bg">
      <Sidebar />
      {/* Desktop: offset by sidebar width. Mobile: full width, pad for bottom nav */}
      <main className="lg:pl-56 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-0">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
