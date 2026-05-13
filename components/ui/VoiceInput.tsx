import { cn } from '@/lib/utils'
import { Mic, MicOff } from 'lucide-react'
import { ButtonHTMLAttributes, useState } from 'react'

interface VoiceInputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state?: 'idle' | 'recording' | 'processing'
  onStateChange?: (state: 'idle' | 'recording' | 'processing') => void
}

const VoiceInput = ({ 
  state = 'idle', 
  onStateChange,
  className,
  ...props 
}: VoiceInputProps) => {
  const [internalState, setInternalState] = useState<'idle' | 'recording' | 'processing'>(state)
  const currentState = onStateChange ? state : internalState

  const handleClick = () => {
    if (currentState === 'idle') {
      const newState = 'recording'
      if (onStateChange) {
        onStateChange(newState)
      } else {
        setInternalState(newState)
      }
    } else if (currentState === 'recording') {
      const newState = 'processing'
      if (onStateChange) {
        onStateChange(newState)
      } else {
        setInternalState(newState)
      }
      
      // Simulate processing completion
      setTimeout(() => {
        const finalState = 'idle'
        if (onStateChange) {
          onStateChange(finalState)
        } else {
          setInternalState(finalState)
        }
      }, 2000)
    }
  }

  const baseClasses = 'w-full flex items-center gap-3 px-4 py-3 rounded-[4px] transition-all duration-200 min-h-[44px]'

  const stateClasses = {
    idle: 'bg-surface-600 hover:bg-surface-500 border border-surface-300 hover:border-brand-400/40',
    recording: 'bg-surface-600 border border-brand-400 animate-pulse-border',
    processing: 'bg-surface-600 border border-surface-300'
  }

  const renderContent = () => {
    switch (currentState) {
      case 'idle':
        return (
          <>
            <span className="text-xl">🎙️</span>
            <span className="text-ink-secondary text-sm">
              Hold to speak — Hindi, Marathi, English
            </span>
          </>
        )
      
      case 'recording':
        return (
          <>
            <span className="text-xl animate-ping-slow">🎙️</span>
            <span className="text-brand-400 text-sm font-medium">
              Recording... release to stop
            </span>
          </>
        )
      
      case 'processing':
        return (
          <>
            <div className="w-5 h-5 border-2 border-surface-300 border-t-brand-400 rounded-full animate-spin" />
            <span className="text-ink-tertiary text-sm">Transcribing...</span>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <button
      className={cn(
        baseClasses,
        stateClasses[currentState],
        className
      )}
      onClick={handleClick}
      disabled={currentState === 'processing'}
      {...props}
    >
      {renderContent()}
    </button>
  )
}

export default VoiceInput
