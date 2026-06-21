import type { ModelConfig, ModelRunState, ProviderId } from "../types";

export function exportResults(
  prompt: string,
  runs: Record<ProviderId, ModelRunState>,
  models: ModelConfig[],
) {
  let markdown = `# LAM NEXUS Comparison\n\n`;

  markdown += `## Prompt\n\n${prompt}\n\n`;

  models.forEach((model) => {
    markdown += `---\n\n`;
    markdown += `## ${model.displayName}\n\n`;
    markdown += `Model: ${model.model}\n\n`;

    const state = runs[model.id];

    if (state.status === "success") {
      markdown += `${state.text}\n\n`;
      markdown += `Latency: ${state.latencyMs} ms\n\n`;
    } else if (state.status === "error") {
      markdown += `ERROR: ${state.message}\n\n`;
    } else if (state.status === "loading") {
      markdown += `Response was still loading.\n\n`;
    } else {
      markdown += `No response.\n\n`;
    }
  });

  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `lam-nexus-${Date.now()}.md`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
