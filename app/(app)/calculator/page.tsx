import RiskCalculator from '@/components/calculator/RiskCalculator'

export default function CalculatorPage() {
  return (
    <div className="py-6 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Risk Calculator</h1>
        <p className="text-text-secondary text-[13px] mt-1">Know your lot size before you enter</p>
      </div>
      {/* On desktop: split into inputs (left) and results (right) via RiskCalculator's internal layout */}
      <div className="max-w-2xl">
        <RiskCalculator />
      </div>
    </div>
  )
}
