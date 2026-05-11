export const dynamic = 'force-dynamic'
import LogTradeForm from '@/components/trades/LogTradeForm'
import Link from 'next/link'

export default function NewTradePage() {
  return (
    <div className="py-6 lg:py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home"
          className="text-text-tertiary hover:text-text-secondary text-[13px] transition-colors"
        >
          ← Back
        </Link>
        <span className="text-ink-border">|</span>
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight leading-none">Log a trade</h1>
        </div>
      </div>
      <div className="max-w-2xl">
        <LogTradeForm />
      </div>
    </div>
  )
}
