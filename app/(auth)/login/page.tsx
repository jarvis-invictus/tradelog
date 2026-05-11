import PhoneOTPForm from '@/components/auth/PhoneOTPForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">TradeLog</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Your trades are already happening.
          <br />Now they&apos;ll start teaching you.
        </p>
      </div>
      <PhoneOTPForm />
    </main>
  )
}
