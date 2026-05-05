"use client";

import { useState, useEffect, useRef } from "react";
import type { CampaignInput, FullCampaign, PipelineStage } from "@/lib/types";
import { generateCampaign } from "@/lib/api";
import CampaignForm from "@/components/CampaignForm";
import PipelineProgress from "@/components/PipelineProgress";
import CampaignDashboard from "@/components/CampaignDashboard";

// Simulated stage progression while waiting for the real API response
const STAGE_SEQUENCE: PipelineStage[] = [
  "research",
  "strategy",
  "copywriting",
  "channel_planning",
  "review",
];
const STAGE_DURATION = 8_000; // ms per stage (approx 40s total for 5 stages)

export default function StudioPage() {
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [campaign, setCampaign] = useState<FullCampaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startStageSimulation() {
    let idx = 0;
    setStage(STAGE_SEQUENCE[0]);
    stageTimerRef.current = setInterval(() => {
      idx++;
      if (idx < STAGE_SEQUENCE.length) {
        setStage(STAGE_SEQUENCE[idx]);
      } else {
        clearInterval(stageTimerRef.current!);
      }
    }, STAGE_DURATION);
  }

  function stopStageSimulation() {
    if (stageTimerRef.current) {
      clearInterval(stageTimerRef.current);
      stageTimerRef.current = null;
    }
  }

  useEffect(() => () => stopStageSimulation(), []);

  async function handleGenerate(input: CampaignInput) {
    setError(null);
    setCampaign(null);
    startStageSimulation();

    try {
      const result = await generateCampaign(input);
      stopStageSimulation();
      setStage("complete");
      setCampaign(result);
    } catch (err) {
      stopStageSimulation();
      setStage("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const isLoading = stage !== "idle" && stage !== "complete" && stage !== "error";

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Header */}
      <header className="border-b border-surface-700 sticky top-0 z-50 bg-surface-900/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">AI</span>
            </div>
            <span className="font-bold text-white tracking-tight">AI Campaign Studio</span>
            <span className="badge-gold hidden sm:inline-flex">Beta</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>5-Agent Pipeline</span>
            <span className="hidden sm:block">·</span>
            <span className="hidden sm:block">Meta + TikTok Export</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex gap-6 min-h-[calc(100vh-56px)]">
        {/* Left panel — Form */}
        <aside className="w-[360px] flex-shrink-0">
          <div className="sticky top-[78px] max-h-[calc(100vh-94px)] overflow-y-auto pr-1 pb-4">
            <div className="mb-4">
              <h1 className="text-lg font-bold text-white">Campaign Brief</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Fill in the details or pick a demo preset to get started.
              </p>
            </div>
            <CampaignForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
        </aside>

        {/* Right panel — Output */}
        <main className="flex-1 min-w-0">
          {stage === "idle" && <EmptyState />}
          {isLoading && <PipelineProgress currentStage={stage} />}
          {stage === "complete" && campaign && <CampaignDashboard campaign={campaign} />}
          {stage === "error" && <ErrorState message={error} onRetry={() => setStage("idle")} />}
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-600/30 flex items-center justify-center text-4xl mb-6">
        ⚡
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Your Campaign Awaits</h2>
      <p className="text-gray-400 max-w-sm leading-relaxed text-sm mb-8">
        Fill in your brand details or pick a demo preset on the left. A 5-agent AI pipeline
        will generate a complete, export-ready marketing campaign.
      </p>

      {/* Pipeline visualization */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {["🔬 Research", "🎯 Strategy", "✍️ Copy", "📱 Channels", "⭐ Review"].map(
          (label, i, arr) => (
            <div key={label} className="flex items-center gap-2">
              <span className="bg-surface-700 border border-surface-600 rounded-lg px-2.5 py-1.5">
                {label}
              </span>
              {i < arr.length - 1 && <span className="text-surface-500">→</span>}
            </div>
          )
        )}
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg text-left">
        {[
          { icon: "🎯", title: "Research-backed", desc: "Market analysis, persona, competitor gaps" },
          { icon: "📱", title: "Platform-ready", desc: "Meta Ads + TikTok export packages" },
          { icon: "⬇", title: "Exportable", desc: "Download JSON or copy to Ads Manager" },
        ].map((f) => (
          <div key={f.title} className="card-sm text-center">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-xs font-semibold text-white mb-1">{f.title}</p>
            <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-4">
        ⚠
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
      <p className="text-red-400 text-sm max-w-sm mb-6">{message ?? "An unexpected error occurred."}</p>
      <button onClick={onRetry} className="btn-secondary">
        Try Again
      </button>
    </div>
  );
}
