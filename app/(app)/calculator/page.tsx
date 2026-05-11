import RiskCalculator from '@/components/calculator/RiskCalculator'

export default function CalculatorPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="px-4 pt-7 pb-2">
        <h1 className="text-[20px] font-bold text-text-primary tracking-tight">Risk Calculator</h1>
        <p className="text-text-secondary text-[13px] mt-0.5">Know your size before you enter</p>
      </div>
      <RiskCalculator />
    </div>
  )
}
