export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-ink-bg">
      {/* LEFT PANEL — desktop only */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-ink-bg" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 20% 50%, rgba(76,110,245,0.13) 0%, transparent 60%),
              radial-gradient(ellipse 50% 35% at 85% 15%, rgba(76,110,245,0.07) 0%, transparent 50%)
            `,
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Content */}
        <div className="relative z-10">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-14">
            <div
              className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 28px rgba(76,110,245,0.45)' }}
            >
              <span className="text-white font-black text-xs tracking-tighter">TL</span>
            </div>
            <span className="text-text-primary font-semibold text-[15px] tracking-tight">TradeLog</span>
          </div>
          {/* Headline */}
          <div className="mb-12">
            <h1 className="text-[36px] font-bold text-text-primary tracking-tight leading-[1.2] mb-4">
              Your trades are<br />already happening.
            </h1>
            <p className="text-text-secondary text-[14px] leading-relaxed max-w-[320px]">
              Now they&apos;ll start teaching you. Voice-first AI journal built for Indian forex traders.
            </p>
          </div>
          {/* Features */}
          <div className="space-y-5">
            {[
              {
                icon: '⚡',
                label: 'MT5 Auto-Sync',
                desc: 'Trades appear automatically — nothing to type',
              },
              {
                icon: '🎤',
                label: 'Voice Reasoning',
                desc: 'Speak in Hindi, Marathi, or English',
              },
              {
                icon: '🤖',
                label: 'Honest AI Feedback',
                desc: 'Specific to your data, never generic advice',
              },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-ink-surface border border-ink-border flex items-center justify-center flex-shrink-0 text-[13px]">
                  {icon}
                </div>
                <div>
                  <p className="text-text-primary text-[13px] font-medium leading-tight">{label}</p>
                  <p className="text-text-secondary text-[12px] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="relative z-10">
          <p className="text-text-tertiary text-[11px]">TradeLog © 2025 · For Indian retail forex traders</p>
        </div>
      </div>
      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative">
        <div className="absolute inset-0 hidden lg:block border-l border-ink-border" />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(76,110,245,0.04) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 w-full max-w-[360px]">
          {children}
        </div>
      </div>
    </div>
  )
}
