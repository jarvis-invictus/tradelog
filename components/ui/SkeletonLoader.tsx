import { cn } from '@/lib/utils'

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'pnl' | 'trade'
}

const SkeletonLoader = ({ className, variant = 'text', ...props }: SkeletonLoaderProps) => {
  const variants = {
    text: 'h-3 w-full',
    card: 'h-20 w-full',
    pnl: 'space-y-2',
    trade: 'h-24 w-full'
  }

  if (variant === 'pnl') {
    return (
      <div className="space-y-2" {...props}>
        <div className="h-3 w-16 bg-surface-600 rounded animate-pulse" />
        <div className="h-9 w-32 bg-surface-600 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-surface-600 rounded-[4px] animate-pulse',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export default SkeletonLoader
