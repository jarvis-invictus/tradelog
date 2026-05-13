'use client'
import { useRules } from '@/hooks/useRules'
import { AlertTriangle } from 'lucide-react'

export default function AlertBanner() {
  const { violations } = useRules()
  if (violations.length === 0) return null

  const hardStop = violations.find((v) => v.severity === 'hard')
  const v = hardStop ?? violations[0]

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-[4px] border ${
      v.severity === 'hard'
        ? 'bg-loss/10 border-loss/30 text-loss-text'
        : 'bg-brand-400/10 border-brand-400/30 text-brand-400'
    }`}>
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold text-sm">{v.ruleName}</p>
        <p className="text-xs mt-0.5 opacity-80">{v.message}</p>
      </div>
    </div>
  )
}
