import type { ModelConfig } from '../types'

export const models: ModelConfig[] = [
  { id: 'gpt', provider: 'GPT', model: 'gpt-4.1', tone: 'Structured and practical' },
  {
    id: 'claude',
    provider: 'Claude',
    model: 'claude-3.5-sonnet',
    tone: 'Careful and nuanced',
  },
  {
    id: 'gemini',
    provider: 'Gemini',
    model: 'gemini-1.5-pro',
    tone: 'Broad and exploratory',
  },
  {
    id: 'llama',
    provider: 'Llama',
    model: 'llama-3.1-70b',
    tone: 'Concise and open-source',
  },
]
