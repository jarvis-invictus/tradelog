export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-bg flex">
      {/* Left panel — hero, desktop only */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-ink-border relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, #0F0F14 0%, #131318 50%, #0C0C14 100%)',
             backgroundImage: `linear-gradient(135deg, #0F0F14 0%, #131318 50%, #0C0C14 100%), radial-gradient(ellipse 60% 50% at 30% 20%, rgba(76,110,245,0.12) 0%, transparent 60%)`,
           }}>
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center" style={{boxShadow:'0 0 12px rgba(76,110,245,0.4)'}}>
            <span className="text-white text-[11px] font-black tracking-tighter">TL</span>
          </div>
          <span className="text-text-primary font-bold text-[15px]">TradeLog</span>
        </div>
        <div className="relative z-10">
          <blockquote className="text-[28px] font-bold text-text-primary leading-snug tracking-tight max-w-sm">
            &ldquo;Your trades are already happening. Now they&apos;ll start teaching you.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-col gap-4">
            {[
              { label: 'Sync trades',  desc: 'MT5 auto-sync or manual logging' },
              { label: 'AI feedback',  desc: 'Personalised, unbiased insights' },
              { label: 'Spot patterns', desc: 'See exactly where you lose money' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-accent shrink-0" />
                <div>
                  <p className="text-text-primary text-[14px] font-semibold">{label}</p>
                  <p className="text-text-secondary text-[13px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(76,110,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(76,110,245,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <p className="text-text-tertiary text-xs relative z-10">TradeLog &copy; 2025</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-6">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
