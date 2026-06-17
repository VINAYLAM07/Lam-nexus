import { useMemo, useState, type CSSProperties } from "react";
import { useForm } from "react-hook-form";
import {
  AlertTriangle,
  BrainCircuit,
  Check,
  Copy,
  Gem,
  LoaderCircle,
  Network,
  RefreshCw,
  Send,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { runMockModel } from "./api/mockLlmClient";
import { models } from "./config/models";
import { usePreferences } from "./stores/preferences";
import type { ModelConfig, ModelRunState, ProviderId } from "./types";
import "./App.css";

type PromptForm = {
  prompt: string;
};

const initialStates = models.reduce(
  (states, model) => ({
    ...states,
    [model.id]: { status: "idle" },
  }),
  {} as Record<ProviderId, ModelRunState>,
);

function App() {
  const [runs, setRuns] =
    useState<Record<ProviderId, ModelRunState>>(initialStates);
  const [lastPrompt, setLastPrompt] = useState("");
  const { backgroundUrl, fontFamily, setFontFamily } = usePreferences();
  const { register, handleSubmit, watch, resetField } = useForm<PromptForm>({
    defaultValues: { prompt: "" },
  });

  const promptValue = watch("prompt");
  const isAnyLoading = Object.values(runs).some(
    (run) => run.status === "loading",
  );

  const appStyle = useMemo<CSSProperties & Record<string, string>>(
    () => ({
      "--app-font":
        fontFamily === "System"
          ? 'system-ui, "Segoe UI", sans-serif'
          : `${fontFamily}, system-ui, "Segoe UI", sans-serif`,
      "--app-bg-image": backgroundUrl ? `url("${backgroundUrl}")` : "none",
    }),
    [backgroundUrl, fontFamily],
  );

  const runSingleModel = async (model: ModelConfig, prompt: string) => {
    const startedAt = performance.now();
    setRuns((current) => ({
      ...current,
      [model.id]: { status: "loading", startedAt },
    }));

    try {
      // const text = await runMockModel(model, prompt);
      // const response = await fetch(
      //   `http://localhost:8080/api/openai/${encodeURIComponent(prompt)}`,
      // );
      // const text = await response.text();
      console.log("Calling backend for:", model.id);
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: model.provider,
          model: model.model,
          prompt,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const text = await response.text();
      setRuns((current) => ({
        ...current,
        [model.id]: {
          status: "success",
          text,
          latencyMs: Math.round(performance.now() - startedAt),
        },
      }));
    } catch (error) {
      setRuns((current) => ({
        ...current,
        [model.id]: {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "The model did not return a readable response.",
          retryable: true,
        },
      }));
    }
  };

  const runPrompt = ({ prompt }: PromptForm) => {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      return;
    }

    setLastPrompt(cleanPrompt);

    models.forEach((model) => {
      console.log("Submitting:", model.id);
      void runSingleModel(model, cleanPrompt);
    });
  };

  return (
    <main className="app-shell" style={appStyle}>
      <section className="workspace">
        <section className="hero-stage">
          <div className="hero-topbar">
            <label className="font-control">
              <Type size={16} />
              <select
                value={fontFamily}
                onChange={(event) => setFontFamily(event.target.value)}
                aria-label="Select font"
              >
                <option>Inter</option>
                <option>Manrope</option>
                <option>Georgia</option>
                <option>System</option>
              </select>
            </label>
          </div>

          <header className="brand-bar">
            <h1 className="brand-title">LAM NEXUS</h1>
          </header>

          <form className="prompt-zone" onSubmit={handleSubmit(runPrompt)}>
            <div className="prompt-card">
              <textarea
                id="prompt"
                rows={3}
                placeholder="Ask LAM NEXUS anything..."
                {...register("prompt")}
              />
              <div className="prompt-actions">
                <button
                  type="button"
                  className="icon-button ghost"
                  onClick={() => resetField("prompt")}
                  title="Clear prompt"
                  aria-label="Clear prompt"
                >
                  <X size={18} />
                </button>
                <button
                  type="submit"
                  className="send-button"
                  disabled={!promptValue?.trim() || isAnyLoading}
                >
                  {isAnyLoading ? (
                    <LoaderCircle className="spin-icon" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  <span>{isAnyLoading ? "Running" : "Send"}</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="response-grid" aria-label="LLM responses">
          {models.map((model) => (
            <ResponsePanel
              key={model.id}
              model={model}
              state={runs[model.id]}
              canRetry={Boolean(lastPrompt)}
              onRetry={() => void runSingleModel(model, lastPrompt)}
            />
          ))}
        </section>
      </section>
    </main>
  );
}

type ResponsePanelProps = {
  model: ModelConfig;
  state: ModelRunState;
  canRetry: boolean;
  onRetry: () => void;
};

const ResponsePanel = ({
  model,
  state,
  canRetry,
  onRetry,
}: ResponsePanelProps) => {
  const copyResponse = async () => {
    if (state.status === "success") {
      await navigator.clipboard.writeText(state.text);
    }
  };

  return (
    <article
      className={`response-panel ${state.status}`}
      style={{ "--model-accent": model.accent } as CSSProperties}
    >
      <div className="panel-heading">
        <div className="model-title">
          <span className="model-icon">
            <ModelIcon id={model.id} />
          </span>
          <div>
            <span>{model.displayName}</span>
            <strong>{model.model}</strong>
          </div>
        </div>
        <StatusBadge state={state} />
      </div>

      <div className="panel-body">
        {state.status === "idle" && (
          <div className="empty-state">
            <ModelIcon id={model.id} />
            <p>{model.tone}</p>
          </div>
        )}

        {state.status === "loading" && (
          <div className="loading-state">
            <span />
            <span />
            <span />
            <p>{model.provider} is preparing a response.</p>
          </div>
        )}

        {state.status === "success" && <pre>{state.text}</pre>}

        {state.status === "error" && (
          <div className="error-state">
            <AlertTriangle size={24} />
            <strong>{model.provider} did not respond</strong>
            <p>{state.message}</p>
          </div>
        )}
      </div>

      <div className="panel-footer">
        {state.status === "success" && <span>{state.latencyMs} ms</span>}
        {state.status === "error" && state.retryable && (
          <button
            type="button"
            className="small-button"
            onClick={onRetry}
            disabled={!canRetry}
          >
            <RefreshCw size={15} />
            Retry
          </button>
        )}
        {state.status === "success" && (
          <button
            type="button"
            className="icon-button"
            onClick={copyResponse}
            title="Copy response"
            aria-label={`Copy ${model.provider} response`}
          >
            <Copy size={16} />
          </button>
        )}
      </div>
    </article>
  );
};

const StatusBadge = ({ state }: { state: ModelRunState }) => {
  if (state.status === "loading") {
    return (
      <span className="status-badge loading">
        <LoaderCircle size={14} />
        Loading
      </span>
    );
  }

  if (state.status === "success") {
    return (
      <span className="status-badge success">
        <Check size={14} />
        Ready
      </span>
    );
  }

  if (state.status === "error") {
    return (
      <span className="status-badge error">
        <AlertTriangle size={14} />
        Error
      </span>
    );
  }

  return <span className="status-badge">Idle</span>;
};

const ModelIcon = ({ id }: { id: ProviderId }) => {
  if (id === "gpt") {
    return <BrainCircuit size={20} />;
  }

  if (id === "claude") {
    return <Sparkles size={20} />;
  }

  if (id === "gemini") {
    return <Gem size={20} />;
  }

  return <Network size={20} />;
};

export default App;
