// OpenAI Whisper voice-to-text (server-side only)
// Language hints: hi, mr, en (Hinglish handled automatically)
// NEVER stores audio — processes and discards immediately.

export async function transcribeAudio(audioBuffer: ArrayBuffer, filename = 'audio.webm'): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured')

  const form = new FormData()
  const blob = new Blob([audioBuffer], { type: 'audio/webm' })
  form.append('file', blob, filename)
  form.append('model', 'whisper-1')
  form.append('language', 'hi')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Whisper API error: ${err}`)
  }

  const data = await res.json() as { text: string }
  return data.text
}
