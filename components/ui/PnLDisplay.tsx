import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currency'

interface PnLDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number
  size?: 'hero' | 'compact' | 'large'
  showCurrency?: boolean
  showPlus?: boolean
  forceCurrency?: 'USD' | 'INR'
}

const PnLDisplay = ({ 
  amount, 
  size = 'compact', 
  showCurrency = true, 
  showPlus = true,
  forceCurrency,
  className,
  ...props 
}: PnLDisplayProps) => {
  const { formatAmount, currency } = useCurrencyStore()
  const isPositive = amount > 0
  const isNegative = amount < 0
  const isNeutral = amount === 0

  const sizes = {
    hero: 'text-3xl font-mono font-semibold',
    large: 'text-2xl font-mono font-semibold',
    compact: 'font-mono font-semibold text-sm'
  }

  const colors = {
    positive: 'text-profit-text',
    negative: 'text-loss-text',
    neutral: 'text-neutral'
  }

  const displayCurrency = forceCurrency || currency
  const formattedAmount = formatAmount(amount, displayCurrency)

  return (
    <div
      className={cn(
        sizes[size],
        isPositive && colors.positive,
        isNegative && colors.negative,
        isNeutral && colors.neutral,
        className
      )}
      {...props}
    >
      {isPositive && showPlus && '+'}
      {showCurrency ? formattedAmount : formattedAmount.replace(/[$₹]/, '')}
    </div>
  )
}

export default PnLDisplay
