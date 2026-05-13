import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

export interface Emotion {
  key: string
  label: string
  icon: string
  color: 'info' | 'profit' | 'warning' | 'danger'
}

interface EmotionTagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  emotion: Emotion
  selected?: boolean
  variant?: 'entry' | 'compact'
}

const emotions: Record<string, Emotion> = {
  calm: { key: 'calm', label: 'Calm', icon: '😌', color: 'info' },
  confident: { key: 'confident', label: 'Confident', icon: '💪', color: 'profit' },
  fomo: { key: 'fomo', label: 'FOMO', icon: '😰', color: 'warning' },
  revenge: { key: 'revenge', label: 'Revenge', icon: '😤', color: 'danger' },
}

const EmotionTag = ({ 
  emotion, 
  selected = false, 
  variant = 'entry',
  className,
  ...props 
}: EmotionTagProps) => {
  const baseClasses = variant === 'entry' 
    ? 'flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-[4px] transition-all duration-200 active:scale-[0.97]'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] transition-all duration-200'

  const unselectedClasses = 'bg-surface-600 hover:bg-surface-500 border border-surface-300 hover:border-surface-200'
  
  const colorClasses = {
    info: selected ? 'bg-info/15 border border-info/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]' : unselectedClasses,
    profit: selected ? 'bg-profit/15 border border-profit/50 shadow-[0_0_12px_rgba(34,197,94,0.15)]' : unselectedClasses,
    warning: selected ? 'bg-warning/15 border border-warning/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : unselectedClasses,
    danger: selected ? 'bg-danger/15 border border-danger/50 shadow-[0_0_12px_rgba(220,38,38,0.15)]' : unselectedClasses,
  }

  return (
    <button
      className={cn(
        baseClasses,
        colorClasses[emotion.color],
        className
      )}
      {...props}
    >
      <span className="text-xl">{emotion.icon}</span>
      {variant === 'entry' && (
        <span className={cn(
          'text-sm font-medium',
          selected ? 'text-ink-primary' : 'text-ink-secondary'
        )}>
          {emotion.label}
        </span>
      )}
    </button>
  )
}

export { EmotionTag, emotions }
export default EmotionTag
