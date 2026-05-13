import { cn } from '@/lib/utils'
import { AlertTriangle, Info, X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'

interface AlertProps {
  level: 1 | 2 | 3
  title?: string
  message: string
  onClose?: () => void
  personalNote?: string
  actionText?: string
  onAction?: () => void
  showIcon?: boolean
}

const Alert = ({ 
  level, 
  title, 
  message, 
  onClose, 
  personalNote,
  actionText,
  onAction,
  showIcon = true
}: AlertProps) => {
  useEffect(() => {
    if (level === 1 && onClose) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [level, onClose])

  // Level 1 — Warning banner (amber, non-blocking)
  if (level === 1) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-warning-dim border-b border-warning/30 flex items-center gap-3 animate-slide-down">
        {showIcon && <span className="text-warning text-base">⚠️</span>}
        <span className="text-warning-text text-sm font-medium flex-1">
          {message}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-warning-text hover:bg-warning/20 rounded-[4px] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  // Level 2 — Hard stop overlay (non-dismissable)
  if (level === 2) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
        <div className="w-full max-w-md bg-surface-700 border border-danger/30 rounded-t-[4px] p-6 pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <h3 className="text-ink-primary font-semibold text-lg">{title}</h3>
          </div>
          <p className="text-ink-secondary text-sm leading-relaxed">
            {message}
          </p>
          
          {personalNote && (
            <div className="bg-surface-600 border border-surface-300 rounded-[4px] p-3 text-ink-tertiary text-sm italic">
              "{personalNote}"
            </div>
          )}
          
          <button 
            onClick={onAction}
            className="w-full px-4 py-3 bg-danger/20 hover:bg-danger/30 text-danger-text font-semibold text-sm rounded-[4px] border border-danger/30 transition-all duration-200"
          >
            {actionText || 'Stop for today'}
          </button>
        </div>
      </div>
    )
  }

  // Level 3 — Trade flag badge (on trade card)
  if (level === 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/15 border border-warning/30 rounded-[4px] text-warning-text text-xs font-medium">
        {showIcon && <AlertTriangle className="w-3 h-3" />}
        {message}
      </span>
    )
  }

  return null
}

export default Alert
