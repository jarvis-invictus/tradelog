export const dynamic = 'force-dynamic'
import Link from 'next/link'

const FEATURES = [
  { dot: 'bg-accent',  label: 'Sync trades',    desc: 'MT5 auto-sync or manual logging' },
  { dot: 'bg-up',      label: 'AI feedback',     desc: 'Personalised, unbiased insights' },
  { dot: 'bg-warn',    label: 'Spot patterns',   desc: 'See exactly where you lose money' },
]

export default function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-10 text-center">
        <div className="w-11 h-11 rounded-[14px] bg-accent flex items-center justify-center mb-7" style={{boxShadow:'0 0 24px rgba(76,110,245,0.4)'}}>
          <span className="text-white font-black text-base tracking-tighter">TL</span>
        </div>
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-tight mb-3">
          Welcome to TradeLog
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-[240px]">
          Your trades are already happening.<br />Now they&apos;ll start teaching you.
        </p>
      </div>

      <div className="bg-ink-surface border-t border-ink-border rounded-t-[28px] px-6 pt-7 pb-10" style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.4)'}}>
        <div className="flex flex-col gap-5 mb-8">
          {FEATURES.map(({ dot, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dot}`} />
              <div>
                <p className="text-text-primary text-[14px] font-semibold">{label}</p>
                <p className="text-text-secondary text-[13px] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/language"
          className="block w-full btn-primary py-4 text-[15px] text-center"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
