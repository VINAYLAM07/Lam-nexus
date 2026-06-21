import { useMemo, useState, type CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { exportResults } from "./utils/exportResults";
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
import Reactmarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const hasResults = Object.values(runs).some(
    (run) => run.status === "success" || run.status === "error",
  );
  const [selectedModels, setSelectedModels] = useState<
    Record<ProviderId, string>
  >(
    Object.fromEntries(models.map((m) => [m.id, m.model])) as Record<
      ProviderId,
      string
    >,
  );
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

  const successfulRuns = Object.entries(runs).filter(
    ([_, run]) => run.status === "success",
  ) as Array<
    [
      ProviderId,
      {
        status: "success";
        text: string;
        latencyMs: number;
      },
    ]
  >;

  let fastestModel: ProviderId | undefined;

  let fastestTime = Number.MAX_VALUE;

  Object.entries(runs).forEach(([id, run]) => {
    if (run.status === "success" && run.latencyMs < fastestTime) {
      fastestTime = run.latencyMs;
      fastestModel = id as ProviderId;
    }
  });

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
          model: selectedModels[model.id],
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
        {fastestModel && (
          <div className="top-actions">
            <div className="winner-banner">
              <strong>
                {models.find((m) => m.id === fastestModel)?.displayName}
              </strong>

              <span>{winnerMessage}</span>
            </div>
            <button
              type="button"
              className="export-button"
              onClick={() => exportResults(lastPrompt, runs, models)}
            >
              📥 Export Results
            </button>
          </div>
        )}
        {/* {hasResults && (
          <div className="comparison-toolbar">
            <button
              type="button"
              className="export-button"
              onClick={() => exportResults(lastPrompt, runs, models)}
            >
              Export Results
            </button>
          </div>
        )} */}
        <section className="response-grid" aria-label="LLM responses">
          {models.map((model) => (
            <ResponsePanel
              key={model.id}
              model={model}
              state={runs[model.id]}
              fastestModel={fastestModel}
              canRetry={Boolean(lastPrompt)}
              onRetry={() => void runSingleModel(model, lastPrompt)}
              selectedModel={selectedModels[model.id]}
              onModelChange={(value) =>
                setSelectedModels((current) => ({
                  ...current,
                  [model.id]: value,
                }))
              }
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
  fastestModel?: ProviderId;
  canRetry: boolean;
  onRetry: () => void;
  selectedModel: string;
  onModelChange: (value: string) => void;
};

const ResponsePanel = ({
  model,
  state,
  fastestModel,
  canRetry,
  onRetry,
  selectedModel,
  onModelChange,
}: ResponsePanelProps) => {
  const [copied, setCopied] = useState(false);
  const wordCount =
    state.status === "success" ? state.text.split(/\s+/).length : 0;
  const copyResponse = async () => {
    if (state.status === "success") {
      await navigator.clipboard.writeText(state.text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const getModelDisplayName = (model: string) => {
    return model.replace(/^[^/]+\//, "").replace(/:free$/, "");
  };
  return (
    <article
      className={`
  response-panel
  ${state.status}
  ${fastestModel === model.id ? "winner-card" : ""}
`}
      style={{ "--model-accent": model.accent } as CSSProperties}
    >
      <div className="panel-heading">
        <div className="model-title">
          <span className="model-icon">
            <ModelIcon id={model.id} />
          </span>
          {/* <div>
            <span>{model.displayName}</span>
            <strong>{getModelDisplayName(model.model)}</strong>
          </div> */}
          <div className="model-meta">
            <span>
              {model.displayName}
              {state.status === "success" && (
                <span className="latency-inline">
                  {" "}
                  ⚡ {(state.latencyMs / 1000).toFixed(1)}s
                </span>
              )}
            </span>
            {/* <strong>{getModelDisplayName(model.model)}</strong> */}
            {/* <strong>
              {model.availableModels?.find((m) => m.value === selectedModel)
                ?.label ?? getModelDisplayName(model.model)}
            </strong> */}
            <select
              className="model-select"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
            >
              {/* <option value={model.model}>
                {getModelDisplayName(model.model)}
              </option> */}
              {model.availableModels?.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="header-right">
          {/* {fastestModel === model.id && state.status === "success" && (
            <span className="title-winner">🏆</span>
          )} */}

          <>
            {/* {state.status === "success" && (
              <span className="latency-pill">
                ⚡ {formatLatency(state.latencyMs)} ms
              </span>
            )} */}

            <StatusBadge state={state} />
          </>
        </div>
      </div>

      <div className="panel-body">
        {state.status === "idle" && (
          <div className="empty-state">
            <ModelIcon id={model.id} />
            <p>{model.tone}</p>
          </div>
        )}

        {/* {state.status === "loading" && (
          <div className="loading-state">
            <span />
            <span />
            <span />
            <p>{model.provider} is preparing a response.</p>
          </div>
        )} */}
        {state.status === "loading" && (
          <div className="loading-skeleton">
            <div className="loading-line" />
            <div className="loading-line" />
            <div className="loading-line" />
            <div className="loading-line" />
            <div className="loading-line" />
          </div>
        )}
        {state.status === "success" && (
          <div className="markdown-content">
            <Reactmarkdown remarkPlugins={[remarkGfm]}>
              {state.text}
            </Reactmarkdown>
          </div>
        )}

        {state.status === "error" && (
          <div className="error-state">
            <AlertTriangle size={24} />
            <strong>{model.provider} did not respond</strong>
            <p>{state.message}</p>
          </div>
        )}
      </div>

      <div className="panel-footer">
        {/* {state.status === "success" && <span>{state.latencyMs} ms</span>} */}
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
          <>
            <span className="response-meta">📝 {wordCount} words</span>

            <button
              type="button"
              className="icon-button"
              onClick={copyResponse}
              title="Copy response"
            >
              {copied ? "✓ Copied" : <Copy size={16} />}
            </button>
          </>
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
        Thinking...
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
const formatLatency = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};
const winnerMessages = [
  `This time I'm faster 🚀`,
  `Speed matters ⚡`,
  `Leading the pack today 🏆`,
  `Fastest response this round 🎯`,
  `Blink and you'll miss me 😎`,
];

const winnerMessage =
  winnerMessages[Math.floor(Math.random() * winnerMessages.length)];
export default App;
