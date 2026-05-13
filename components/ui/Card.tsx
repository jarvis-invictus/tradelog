import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'trade' | 'win' | 'loss' | 'stat'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-800 border border-surface-300',
      elevated: 'bg-surface-700 border border-surface-200 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
      trade: 'bg-surface-800 border border-brand-400/40 shadow-[0_0_16px_rgba(244,166,35,0.08)]',
      win: 'bg-surface-800 border-l-2 border-l-profit border-y border-r border-surface-300',
      loss: 'bg-surface-800 border-l-2 border-l-loss border-y border-r border-surface-300',
      stat: 'bg-surface-800 border border-surface-300 flex flex-col gap-1'
    }

    return (
      <div
        className={cn(
          'rounded-[4px] p-4',
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card
