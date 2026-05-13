export const dynamic = 'force-dynamic'
import RiskCalculator from '@/components/calculator/RiskCalculator'

export default function CalculatorPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-primary tracking-tight">Risk Calculator</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Know your lot size before you enter</p>
      </div>
      <RiskCalculator />
    </div>
  )
}
