import type { ModelConfig, ProviderId } from "../types";

export const models: ModelConfig[] = [
  {
    id: "gpt",
    displayName: "GPT",
    provider: "openrouter",
    model: "openai/gpt-oss-20b:free",
    tone: "Structured and practical",
    accent: "#6ae6ff",
  },
  {
    id: "claude",
    displayName: "Qwen",
    provider: "groq",
    model: "qwen/qwen3-32b",
    tone: "Reasoning focused",
    accent: "#ff9f6e",
  },
  {
    id: "gemini",
    displayName: "Gemini",
    provider: "gemini",
    model: "gemini-2.5-flash",
    tone: "Broad and exploratory",
    accent: "#b8ff6a",
  },
  {
    id: "llama",
    displayName: "Llama",
    provider: "groq",
    model: "llama-3.3-70b-versatile",
    tone: "Concise and open-source",
    accent: "#d98cff",
  },
];
