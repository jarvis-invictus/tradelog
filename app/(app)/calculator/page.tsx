import RiskCalculator from '@/components/calculator/RiskCalculator'

export default function CalculatorPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-white">Risk Calculator</h1>
        <p className="text-gray-500 text-sm">Know your lot size before entering</p>
      </div>
      <RiskCalculator />
    </div>
  )
}
