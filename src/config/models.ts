import type { ModelConfig } from "../types";

export const models: ModelConfig[] = [
  {
    id: "gpt",
    displayName: "GPT",
    provider: "openrouter",
    model: "openai/gpt-oss-20b:free",
    availableModels: [
      { label: "gpt-oss-20b", value: "openai/gpt-oss-20b:free" },
      { label: "gpt-oss-120b", value: "openai/gpt-oss-120b:free" },
    ],
    tone: "Structured and practical",
    accent: "#6ae6ff",
  },
  {
    id: "claude",
    displayName: "Qwen",
    provider: "groq",
    model: "qwen/qwen3-32b",
    availableModels: [
      { label: "qwen3-32b", value: "qwen/qwen3-32b" },
      { label: "qwen3.6-27b", value: "qwen/qwen3.6-27b" },
    ],
    tone: "Reasoning focused",
    accent: "#ff9f6e",
  },
  {
    id: "gemini",
    displayName: "Gemini",
    provider: "gemini",
    model: "gemini-2.5-flash",
    availableModels: [
      { label: "gemini-2.5-flash", value: "gemini-2.5-flash" },
      { label: "gemini-3.1-flash-lite", value: "gemini-3.1-flash-lite" },
      { label: "gemini-3.5-flash", value: "gemini-3.5-flash" },
      { label: "gemini-2.5-pro", value: "gemini-2.5-pro" },
    ],
    tone: "Broad and exploratory",
    accent: "#b8ff6a",
  },
  {
    id: "llama",
    displayName: "Llama",
    provider: "groq",
    model: "llama-3.3-70b-versatile",
    availableModels: [
      {
        label: "llama-3.3-70b-versatile",
        value: "llama-3.3-70b-versatile",
      },
      {
        label: "llama-3.1-8b-instant",
        value: "llama-3.1-8b-instant",
      },
    ],
    tone: "Concise and open-source",
    accent: "#d98cff",
  },
];
