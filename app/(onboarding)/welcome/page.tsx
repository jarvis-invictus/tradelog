export const dynamic = 'force-dynamic'
import Link from 'next/link'

const FEATURES = [
  { dot: 'bg-brand-400', label: 'Sync trades',    desc: 'MT5 auto-sync or manual logging' },
  { dot: 'bg-profit',    label: 'AI feedback',    desc: 'Personalised, unbiased insights' },
  { dot: 'bg-warning',   label: 'Spot patterns',  desc: 'See exactly where you lose money' },
]

export default function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-10 text-center">
        <div className="w-11 h-11 rounded-[4px] bg-brand-400 flex items-center justify-center mb-7"
          style={{ boxShadow: '0 0 24px rgba(244,166,35,0.4)' }}>
          <span className="text-ink-inverse font-black text-base tracking-tighter">TL</span>
        </div>
        <h1 className="text-2xl font-bold text-ink-primary tracking-tight leading-tight mb-3">
          Welcome to TradeLog
        </h1>
        <p className="text-ink-secondary text-sm leading-relaxed max-w-[240px]">
          Your trades are already happening.<br />Now they&apos;ll start teaching you.
        </p>
      </div>

      <div className="bg-surface-800 border-t border-surface-300 rounded-t-[4px] px-6 pt-7 pb-10"
        style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.4)' }}>
        <div className="flex flex-col gap-5 mb-8">
          {FEATURES.map(({ dot, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dot}`} />
              <div>
                <p className="text-ink-primary text-sm font-semibold">{label}</p>
                <p className="text-ink-secondary text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/language" className="block w-full btn-primary py-4 text-center">
          Get Started
        </Link>
      </div>
    </div>
  )
}
