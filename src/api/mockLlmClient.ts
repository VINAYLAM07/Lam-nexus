import type { ModelConfig } from '../types'

const sampleInsights = [
  'Start by separating the user prompt, provider routing, and response rendering. That keeps the UI calm even when one model fails.',
  'The strongest pattern is parallel execution with independent panel states. A single timeout should never erase another provider result.',
  'Keep provider keys only in the Spring AI service. The frontend should call your backend and render normalized results.',
  'For comparison workflows, store each run with a run id so responses can be revisited, copied, and later compared.',
]

const delay = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })

export const runMockModel = async (
  model: ModelConfig,
  prompt: string,
): Promise<string> => {
  const latency = 900 + Math.random() * 1800
  await delay(latency)

  if (prompt.toLowerCase().includes('fail') && model.id === 'claude') {
    throw new Error('Provider timeout. The request can be retried.')
  }

  const insight = sampleInsights[Math.floor(Math.random() * sampleInsights.length)]

  return `${model.provider} (${model.model}) response\n\n${insight}\n\nPrompt focus: "${prompt.slice(
    0,
    160,
  )}${prompt.length > 160 ? '...' : ''}"`
}
