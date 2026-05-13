export const dynamic = 'force-dynamic'
import LogTradeForm from '@/components/trades/LogTradeForm'
import Link from 'next/link'

export default function NewTradePage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/home"
          className="text-ink-tertiary hover:text-ink-secondary text-sm transition-colors duration-150"
        >
          ← Back
        </Link>
        <span className="text-surface-300">|</span>
        <h1 className="text-xl font-bold text-ink-primary tracking-tight">Log a trade</h1>
      </div>
      <div className="max-w-2xl">
        <LogTradeForm />
      </div>
    </div>
  )
}
