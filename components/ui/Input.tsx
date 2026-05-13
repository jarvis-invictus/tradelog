import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 bg-surface-600 border border-surface-300 hover:border-surface-200 focus:border-brand-400 focus:outline-none rounded-[4px] text-ink-primary text-base font-sans placeholder:text-ink-tertiary transition-colors duration-150',
            error && 'border-danger/60 focus:border-danger',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger-text">
            {error}
          </span>
        )}
        {helper && !error && (
          <span className="text-xs text-ink-tertiary">
            {helper}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
