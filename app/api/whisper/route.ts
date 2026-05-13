import { NextRequest } from 'next/server'
import { transcribeAudio } from '@/lib/whisper'

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'Integration not configured' }, { status: 503 })
  }

  try {
    const form = await request.formData()
    const file = form.get('audio')

    if (!file || !(file instanceof Blob)) {
      return Response.json({ error: 'Missing audio field' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const transcript = await transcribeAudio(buffer, 'audio.webm')

    return Response.json({ transcript })
  } catch (err) {
    console.error('Whisper error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Transcription failed' },
      { status: 500 }
    )
  }
}
