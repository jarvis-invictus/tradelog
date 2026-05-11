import PhoneOTPForm from '@/components/auth/PhoneOTPForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ink-bg">
      {/* Top — wordmark + copy */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-10 text-center">
        <div className="w-11 h-11 rounded-[14px] bg-accent flex items-center justify-center mb-7">
          <span className="text-white font-black text-base tracking-tighter">TL</span>
        </div>
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-tight mb-3">
          TradeLog
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-[240px]">
          Your trades are already happening.<br />
          Now they&apos;ll start teaching you.
        </p>
      </div>

      {/* Bottom sheet */}
      <div className="bg-ink-surface border-t border-ink-border rounded-t-[28px] px-6 pt-7 pb-10">
        <p className="text-text-primary font-semibold text-[15px] mb-5">Enter your phone number</p>
        <PhoneOTPForm />
        <p className="text-center text-text-tertiary text-xs mt-7">
          India only &middot; OTP via SMS
        </p>
      </div>
    </main>
  )
}
