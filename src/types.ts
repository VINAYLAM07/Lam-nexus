export type ProviderId = 'gpt' | 'claude' | 'gemini' | 'llama'

export type ModelConfig = {
  id: ProviderId
  provider: string
  model: string
  tone: string
}

export type ModelRunState =
  | { status: 'idle' }
  | { status: 'loading'; startedAt: number }
  | { status: 'success'; text: string; latencyMs: number }
  | { status: 'error'; message: string; retryable: boolean }
