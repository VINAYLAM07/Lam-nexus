import type { ModelConfig } from '../types'

export const models: ModelConfig[] = [
  {
    id: 'gpt',
    provider: 'GPT',
    model: 'gpt-4.1',
    tone: 'Structured and practical',
    accent: '#6ae6ff',
  },
  {
    id: 'claude',
    provider: 'Claude',
    model: 'claude-3.5-sonnet',
    tone: 'Careful and nuanced',
    accent: '#ff9f6e',
  },
  {
    id: 'gemini',
    provider: 'Gemini',
    model: 'gemini-1.5-pro',
    tone: 'Broad and exploratory',
    accent: '#b8ff6a',
  },
  {
    id: 'llama',
    provider: 'Llama',
    model: 'llama-3.1-70b',
    tone: 'Concise and open-source',
    accent: '#d98cff',
  },
]
