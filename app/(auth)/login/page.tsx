import PhoneOTPForm from '@/components/auth/PhoneOTPForm'

export default function LoginPage() {
  return (
    <div className="w-full">
      {/* Mobile: show logo + tagline above form */}
      <div className="lg:hidden text-center mb-8">
        <div className="w-10 h-10 rounded-[12px] bg-accent flex items-center justify-center mx-auto mb-4" style={{boxShadow:'0 0 20px rgba(76,110,245,0.35)'}}>
          <span className="text-white font-black text-sm tracking-tighter">TL</span>
        </div>
        <h1 className="text-[24px] font-bold text-text-primary tracking-tight mb-2">TradeLog</h1>
        <p className="text-text-secondary text-[13px] max-w-[220px] mx-auto leading-relaxed">
          Your trades are already happening.<br />Now they&apos;ll start teaching you.
        </p>
      </div>

      {/* Form — shown on all sizes */}
      <div className="card p-6 lg:p-8">
        <h2 className="text-text-primary font-bold text-[18px] tracking-tight mb-1">Sign in</h2>
        <p className="text-text-secondary text-[13px] mb-6">Enter your phone number to continue</p>
        <PhoneOTPForm />
        <p className="text-center text-text-tertiary text-[11px] mt-6">India only &middot; OTP via SMS</p>
      </div>
    </div>
  )
}
