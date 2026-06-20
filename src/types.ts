export type ProviderId = "gpt" | "claude" | "gemini" | "llama";

export type ModelConfig = {
  id: ProviderId;
  displayName: string;
  provider: string;
  model: string;
  availableModels?: {
    label: string;
    value: string;
  }[];
  tone: string;
  accent: string;
};

export type ModelRunState =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; text: string; latencyMs: number }
  | { status: "error"; message: string; retryable: boolean };
