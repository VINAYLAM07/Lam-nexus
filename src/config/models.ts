import type { ModelConfig } from "../types";

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
    displayName: "Claude",
    provider: "openrouter",
    model: "qwen/qwen3-next-80b-a3b-instruct:free",
    tone: "Careful and nuanced",
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
