'use client'
import { useState, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

export default function VoiceInput({ onTranscript }: { onTranscript: (t: string) => void }) {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const mediaRef  = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setLoading(true)
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('audio', blob, 'audio.webm')
        try {
          const res = await fetch('/api/whisper', { method: 'POST', body: form })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
          onTranscript(data.transcript)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Transcription failed')
        }
        setLoading(false)
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
    } catch {
      setError('Microphone access denied')
    }
  }

  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-2 rounded-[4px] border text-sm font-medium transition-all duration-150 ${
          recording
            ? 'border-loss/40 bg-loss/10 text-loss-text animate-pulse'
            : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
        }`}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : recording
          ? <MicOff className="w-4 h-4" />
          : <Mic className="w-4 h-4" />
        }
        {loading ? 'Transcribing…' : recording ? 'Release to stop' : 'Hold to speak'}
      </button>
      {error && <p className="text-danger-text text-xs">{error}</p>}
    </div>
  )
}
