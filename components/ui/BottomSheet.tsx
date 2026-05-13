import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showHandle?: boolean
}

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  showHandle = true 
}: BottomSheetProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-surface-700 border-t border-surface-300 rounded-t-[4px] transition-transform duration-300 ease-out translate-y-0 max-h-[90dvh] overflow-y-auto pb-safe">
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-4">
            <div className="w-10 h-1 bg-surface-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-4">
            <h2 className="text-lg font-semibold text-ink-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-ink-tertiary hover:text-ink-primary transition-colors rounded-[4px] hover:bg-surface-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default BottomSheet
