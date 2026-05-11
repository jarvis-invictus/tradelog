// M4.3 — OpenAI Whisper voice-to-text (server-side only)
// Language hints: hi, mr, en (Hinglish handled automatically)
// NEVER store audio — process and discard
// TODO: Build in M4.3 milestone session
export async function transcribeAudio(_audioBlob: Blob): Promise<string> {
  throw new Error('Not implemented')
}
