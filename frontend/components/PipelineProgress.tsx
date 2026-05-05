"use client";

import type { PipelineStage } from "@/lib/types";

const STAGES: { id: PipelineStage; label: string; detail: string; icon: string }[] = [
  {
    id: "research",
    label: "Research Agent",
    detail: "Analyzing market, audience & competitors",
    icon: "🔬",
  },
  {
    id: "strategy",
    label: "Strategy Agent",
    detail: "Building positioning & customer persona",
    icon: "🎯",
  },
  {
    id: "copywriting",
    label: "Copy Agent",
    detail: "Writing headlines, email & ad copy",
    icon: "✍️",
  },
  {
    id: "channel_planning",
    label: "Channel Agent",
    detail: "Assembling Meta & TikTok packages",
    icon: "📱",
  },
  {
    id: "review",
    label: "Review Agent",
    detail: "Scoring and quality-checking",
    icon: "⭐",
  },
];

const STAGE_ORDER: PipelineStage[] = [
  "research",
  "strategy",
  "copywriting",
  "channel_planning",
  "review",
  "complete",
];

function getStageIndex(stage: PipelineStage): number {
  return STAGE_ORDER.indexOf(stage);
}

interface Props {
  currentStage: PipelineStage;
}

export default function PipelineProgress({ currentStage }: Props) {
  const currentIndex = getStageIndex(currentStage);
  const isComplete = currentStage === "complete";

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 badge-gold px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase">Pipeline Running</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {isComplete ? "Campaign Generated" : "Generating Your Campaign"}
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          {isComplete
            ? "All 5 agents completed successfully"
            : "5 AI agents working in sequence..."}
        </p>
      </div>

      <div className="w-full max-w-lg space-y-3">
        {STAGES.map((stage, idx) => {
          const stageIndex = getStageIndex(stage.id);
          const isDone = isComplete || stageIndex < currentIndex;
          const isActive = stage.id === currentStage;
          const isPending = stageIndex > currentIndex && !isComplete;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : isActive
                  ? "border-gold-600/50 bg-gold-500/5"
                  : "border-surface-600 bg-surface-800 opacity-40"
              }`}
            >
              {/* Status icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                  isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isActive
                    ? "bg-gold-500/20 text-gold-400"
                    : "bg-surface-700 text-gray-600"
                }`}
              >
                {isDone ? (
                  <CheckIcon />
                ) : isActive ? (
                  <span className="w-3 h-3 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-base">{stage.icon}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isDone ? "text-emerald-400" : isActive ? "text-gold-400" : "text-gray-500"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-gray-500 truncate">{stage.detail}</p>
              </div>

              {/* Right badge */}
              <span
                className={`text-xs font-medium flex-shrink-0 ${
                  isDone
                    ? "text-emerald-500"
                    : isActive
                    ? "text-gold-500"
                    : "text-gray-600"
                }`}
              >
                {isDone ? "Done" : isActive ? "Running" : `${idx + 1}`}
              </span>
            </div>
          );
        })}
      </div>

      {!isComplete && (
        <p className="mt-8 text-xs text-gray-500 animate-pulse-gold">
          This typically takes 30–60 seconds...
        </p>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
