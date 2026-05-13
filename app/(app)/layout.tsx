import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-900">
      <Sidebar />
      {/* Mobile: full width + bottom nav padding. Desktop: offset by sidebar w-60 */}
      <main className="md:pl-60 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
