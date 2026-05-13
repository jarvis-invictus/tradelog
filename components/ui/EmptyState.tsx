import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
}

const EmptyState = ({ 
  className, 
  icon: Icon, 
  title = 'No data', 
  description = 'There\'s nothing to show here yet.',
  ...props 
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 py-12 text-center',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-8 h-8 text-ink-tertiary" />}
      <div className="space-y-1">
        <p className="text-ink-secondary font-medium text-sm">{title}</p>
        <p className="text-ink-tertiary text-sm max-w-[200px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

export default EmptyState
