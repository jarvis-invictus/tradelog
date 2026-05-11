import Link from 'next/link'
import { TrendingUp, Brain, BookOpen } from 'lucide-react'

const FEATURES = [
  { Icon: TrendingUp, label: 'Track every trade', desc: 'Auto-sync or log manually' },
  { Icon: Brain,      label: 'AI feedback',        desc: 'Learn what\'s working' },
  { Icon: BookOpen,   label: 'Spot patterns',       desc: 'See your weak points' },
]

export default function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-5 shadow-xl shadow-blue-900/50">
          <span className="text-white font-black text-2xl tracking-tight">TL</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome to TradeLog</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
          Your trades are already happening.<br />Now they&apos;ll start teaching you.
        </p>
      </div>

      {/* Features card */}
      <div className="bg-gray-900 rounded-t-3xl px-6 pt-8 pb-10">
        <div className="flex flex-col gap-4 mb-8">
          {FEATURES.map(({ Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/language"
          className="block w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-center py-3.5 rounded-xl font-semibold text-base transition"
        >
          Get Started →
        </Link>
      </div>
    </div>
  )
}
