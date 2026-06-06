# LAM NEXUS

Minimal multi-model LLM response workspace built with Vite, React, TypeScript,
Tailwind CSS, Zustand, React Hook Form, TanStack Query, and lucide-react.

The first version uses mock model responses so the UI can be designed and
verified before connecting to the future Spring AI backend.

## Run Locally

```powershell
npm install
npm run dev
```

## Backend Direction

The frontend is prepared for a later Spring AI backend. Provider API keys should
live only in the backend, never in the browser.
