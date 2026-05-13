import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'small' | 'default' | 'large'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const baseClasses = 'font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 disabled:opacity-40 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-brand-400 hover:bg-brand-500 active:bg-brand-600 text-ink-inverse active:scale-[0.98]',
      secondary: 'bg-surface-600 hover:bg-surface-500 active:bg-surface-400 text-ink-primary border border-surface-300',
      ghost: 'text-ink-secondary hover:text-ink-primary hover:bg-surface-500',
      danger: 'bg-danger/20 hover:bg-danger/30 text-danger-text border border-danger/30'
    }
    
    const sizes = {
      small: 'px-3 py-1.5 text-xs',
      default: 'px-4 py-3 text-sm',
      large: 'px-6 py-4 text-base'
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          variant === 'primary' || variant === 'secondary' || variant === 'danger' ? 'w-full' : '',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button
