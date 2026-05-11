export const ENTRY_EMOTIONS = ['calm', 'confident', 'fomo', 'revenge'] as const
export type EntryEmotion = typeof ENTRY_EMOTIONS[number]

export const EXIT_EMOTIONS = ['followed_plan', 'exited_early', 'held_too_long', 'moved_sl'] as const
export type ExitEmotion = typeof EXIT_EMOTIONS[number]

export const ENTRY_EMOTION_LABELS: Record<EntryEmotion, string> = {
  calm: 'Calm',
  confident: 'Confident',
  fomo: 'FOMO',
  revenge: 'Revenge',
}

export const EXIT_EMOTION_LABELS: Record<ExitEmotion, string> = {
  followed_plan: 'Followed Plan',
  exited_early: 'Exited Early',
  held_too_long: 'Held Too Long',
  moved_sl: 'Moved SL',
}
