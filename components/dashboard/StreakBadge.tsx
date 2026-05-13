'use client'
import { useStreak } from '@/hooks/useStreak'
import { Flame } from 'lucide-react'

export default function StreakBadge() {
  const { streak } = useStreak()
  return (
    <div className="card p-4 flex items-center gap-3">
      <Flame className={`w-6 h-6 shrink-0 ${streak > 0 ? 'text-brand-400' : 'text-ink-tertiary'}`} />
      <div>
        <p className="section-label">Journaling streak</p>
        <p className="stat-value text-ink-primary num">
          {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : '—'}
        </p>
      </div>
    </div>
  )
}
