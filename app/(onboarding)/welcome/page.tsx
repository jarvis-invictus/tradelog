import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold text-white select-none">
          TL
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Welcome to TradeLog</h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-xs">
            Your trades are already happening.
            <br />Now they&apos;ll start teaching you.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-xs text-center">
          {[
            { icon: '📊', label: 'Auto-sync trades' },
            { icon: '🧠', label: 'AI feedback' },
            { icon: '📈', label: 'Track patterns' },
          ].map((f) => (
            <div key={f.label} className="bg-gray-900 rounded-xl p-3">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-gray-400 text-xs">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-sm">
        <Link
          href="/language"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-md font-medium transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
