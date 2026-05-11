import PhoneOTPForm from '@/components/auth/PhoneOTPForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-950">
      {/* Top hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-900/40">
          <span className="text-white font-black text-xl tracking-tight">TL</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">TradeLog</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
          Your trades are already happening.<br />
          Now they&apos;ll start teaching you.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-gray-900 rounded-t-3xl px-6 pt-8 pb-12 shadow-2xl">
        <p className="text-white font-semibold text-base mb-6">Sign in with your phone</p>
        <PhoneOTPForm />
        <p className="text-center text-gray-600 text-xs mt-6">
          India only · +91 numbers only
        </p>
      </div>
    </main>
  )
}
