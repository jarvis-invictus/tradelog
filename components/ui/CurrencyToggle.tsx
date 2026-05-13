import { useCurrencyStore } from '@/store/currency'

interface CurrencyToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: 'compact' | 'full'
}

const CurrencyToggle = ({ 
  variant = 'compact', 
  className,
  ...props 
}: CurrencyToggleProps) => {
  const { currency, setCurrency } = useCurrencyStore()

  const handleToggle = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD')
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className={`
          inline-flex items-center gap-1 px-2 py-1 
          bg-surface-600 hover:bg-surface-500 
          border border-surface-300 hover:border-surface-200
          rounded-[4px] text-xs font-medium
          text-ink-secondary hover:text-ink-primary
          transition-all duration-200
          min-h-[32px]
          ${className}
        `}
        {...props}
      >
        <span className={currency === 'USD' ? 'text-brand-400' : ''}>
          $
        </span>
        <span className="text-ink-tertiary">/</span>
        <span className={currency === 'INR' ? 'text-brand-400' : ''}>
          ₹
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        flex items-center gap-2 px-3 py-2
        bg-surface-600 hover:bg-surface-500
        border border-surface-300 hover:border-surface-200
        rounded-[4px] text-sm font-medium
        text-ink-secondary hover:text-ink-primary
        transition-all duration-200
        min-h-[44px]
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center gap-1">
        <span className={currency === 'USD' ? 'text-brand-400' : ''}>
          USD
        </span>
        <span className="text-ink-tertiary">/</span>
        <span className={currency === 'INR' ? 'text-brand-400' : ''}>
          INR
        </span>
      </div>
      <span className="text-ink-tertiary text-xs">
        ({currency})
      </span>
    </button>
  )
}

export default CurrencyToggle
