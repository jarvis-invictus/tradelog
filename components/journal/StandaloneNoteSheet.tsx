'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const WHISPER_ENABLED = process.env.NEXT_PUBLIC_WHISPER_ENABLED === 'true'

export default function StandaloneNoteSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [note, setNote]           = useState('')
  const [emotion, setEmotion]     = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const EMOTIONS = ['Confident', 'Calm', 'Patient', 'Anxious', 'FOMO', 'Revenge', 'Greedy', 'Uncertain']

  async function toggleRecording() {
    if (recording) {
      mediaRef.current?.stop()
      setRecording(false)
      return
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = (e) => chunksRef.current.push(e.data)
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop())
      setTranscribing(true)
      try {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('audio', blob, 'audio.webm')
        const res = await fetch('/api/whisper', { method: 'POST', body: form })
        const data = await res.json()
        if (data.transcript) setNote((n) => n ? `${n} ${data.transcript}` : data.transcript)
      } catch {}
      setTranscribing(false)
    }
    mr.start()
    mediaRef.current = mr
    setRecording(true)
  }

  async function handleSave() {
    if (!note.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    await supabase.from('trade_journals').insert({
      trade_id:           '00000000-0000-0000-0000-000000000000',
      user_id:            user.id,
      entry_emotion:      emotion || null,
      reasoning_text:     note,
      reasoning_added_at: new Date().toISOString(),
    })

    setSaving(false)
    setSaved(true)
    setNote('')
    setEmotion('')
    setTimeout(() => { setSaved(false); onClose() }, 1000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-surface-700 border-t border-surface-300 rounded-t-[4px] max-h-[90dvh] overflow-y-auto pb-safe animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-surface-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-ink-primary font-semibold text-base">Add a note</h2>
            <button
              onClick={onClose}
              className="text-ink-tertiary hover:text-ink-secondary text-sm transition-colors duration-150"
            >
              Cancel
            </button>
          </div>

          {/* Emotion */}
          <div>
            <p className="section-label mb-2">How are you feeling?</p>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmotion(emotion === em ? '' : em)}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-all duration-150 ${
                    emotion === em
                      ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                      : 'border-surface-300 bg-surface-600 text-ink-tertiary hover:bg-surface-500'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Your reflection</p>
              {WHISPER_ENABLED && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={transcribing}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-medium border transition-all duration-150 ${
                    recording
                      ? 'bg-danger/15 border-danger/40 text-danger-text animate-pulse'
                      : 'bg-surface-600 border-surface-300 text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {transcribing
                    ? <><Loader2 className="w-3 h-3 animate-spin" /> Transcribing…</>
                    : recording
                    ? <><MicOff className="w-3 h-3" /> Stop</>
                    : <><Mic className="w-3 h-3" /> Dictate</>
                  }
                </button>
              )}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder="What's on your mind about your trading today?"
              className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary resize-none transition-colors duration-150"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !note.trim()}
            className="btn-primary py-3"
          >
            {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>
    </div>
  )
}
