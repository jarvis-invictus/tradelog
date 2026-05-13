import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'

interface StreakBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  streak: number
  variant?: 'active' | 'compact'
}

const StreakBadge = ({ 
  streak, 
  variant = 'active',
  className,
  ...props 
}: StreakBadgeProps) => {
  if (streak === 0) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 bg-surface-600 border border-surface-300 rounded-[4px]',
          className
        )}
        {...props}
      >
        <span className="text-ink-tertiary text-sm">Start your streak</span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 bg-brand-400/10 border border-brand-400/30 rounded-[4px]',
          className
        )}
        {...props}
      >
        <Flame className="w-3 h-3 text-brand-400" />
        <span className="text-brand-400 font-mono font-bold text-sm">
          {streak}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 bg-brand-400/10 border border-brand-400/30 rounded-[4px]',
        className
      )}
      {...props}
    >
      <span className="text-brand-400 font-mono font-bold text-lg">🔥 {streak}</span>
      <span className="text-ink-secondary text-sm">trade streak</span>
    </div>
  )
}

export default StreakBadge
