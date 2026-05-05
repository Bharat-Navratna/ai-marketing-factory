"use client";

import { useState } from "react";
import type { FullCampaign } from "@/lib/types";
import ExportSection from "./ExportSection";

type Tab =
  | "overview"
  | "research"
  | "strategy"
  | "copy"
  | "meta"
  | "tiktok"
  | "email"
  | "calendar"
  | "kpis"
  | "export";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◉" },
  { id: "research", label: "Research", icon: "🔬" },
  { id: "strategy", label: "Strategy", icon: "🎯" },
  { id: "copy", label: "Ad Copy", icon: "✍️" },
  { id: "meta", label: "Meta Package", icon: "◈" },
  { id: "tiktok", label: "TikTok Package", icon: "♪" },
  { id: "email", label: "Email", icon: "✉" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "kpis", label: "KPIs", icon: "📊" },
  { id: "export", label: "Export", icon: "⬇" },
];

interface Props {
  campaign: FullCampaign;
}

export default function CampaignDashboard({ campaign }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { input, research, strategy, copy, channelPlan, review, exportPackage } = campaign;

  return (
    <div className="animate-slide-up">
      {/* Campaign header */}
      <div className="card mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-gold">Generated</span>
            <span className="text-xs text-gray-500">
              {new Date(campaign.generatedAt).toLocaleString()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{input.brandName}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{input.productDescription.slice(0, 100)}…</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreRing score={review.overallScore} label="Score" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-4 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-gold-500/15 text-gold-400 border border-gold-600/40"
                : "text-gray-500 hover:text-gray-300 hover:bg-surface-700"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && <OverviewTab campaign={campaign} />}
        {activeTab === "research" && <ResearchTab research={research} />}
        {activeTab === "strategy" && <StrategyTab strategy={strategy} />}
        {activeTab === "copy" && <CopyTab copy={copy} review={review} />}
        {activeTab === "meta" && <MetaTab meta={exportPackage.meta} />}
        {activeTab === "tiktok" && <TikTokTab tiktok={exportPackage.tiktok} />}
        {activeTab === "email" && <EmailTab copy={copy} />}
        {activeTab === "calendar" && <CalendarTab calendar={channelPlan.contentCalendar} />}
        {activeTab === "kpis" && <KpisTab kpis={channelPlan.kpis} budget={channelPlan.budgetBreakdown} />}
        {activeTab === "export" && <ExportSection campaign={campaign} />}
      </div>
    </div>
  );
}

// ─── Overview ──────────────────────────────────────────────────────────────────

function OverviewTab({ campaign }: { campaign: FullCampaign }) {
  const { input, strategy, copy, review, channelPlan } = campaign;
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Scores */}
      <div className="grid grid-cols-4 gap-3">
        <ScoreCard label="Overall" score={review.overallScore} />
        <ScoreCard label="Clarity" score={review.clarityScore} />
        <ScoreCard label="Persuasion" score={review.persuasivenessScore} />
        <ScoreCard label="Alignment" score={review.audienceAlignmentScore} />
      </div>

      {/* Core message */}
      <div className="card border-gold-600/30">
        <p className="section-title">Core Message</p>
        <p className="text-lg font-semibold text-white leading-snug">{strategy.coreMessage}</p>
        <p className="text-sm text-gray-400 mt-2">{strategy.uniqueValueProposition}</p>
      </div>

      {/* Headline */}
      <div className="card">
        <p className="section-title">Campaign Headline</p>
        <p className="text-xl font-bold text-gold-400">&quot;{copy.headline}&quot;</p>
        <p className="text-sm text-gray-400 mt-1">{copy.subheadline}</p>
        <div className="mt-3 pt-3 border-t border-surface-600">
          <p className="text-xs text-gray-500 mb-1">Revised Headline (after review)</p>
          <p className="text-sm text-emerald-400 font-medium">&quot;{review.revisedHeadline}&quot;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Platforms */}
        <div className="card">
          <p className="section-title">Platforms</p>
          <div className="flex flex-wrap gap-2">
            {input.platforms.map((p) => (
              <span key={p} className="badge-blue">
                {p.replace("_", " ")}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-surface-600 space-y-1">
            <InfoRow label="Objective" value={input.objective.replace("_", " ")} />
            <InfoRow label="Tone" value={input.tone} />
            <InfoRow label="Region" value={input.region} />
            {input.budget && <InfoRow label="Budget" value={input.budget} />}
            {input.duration && <InfoRow label="Duration" value={input.duration} />}
          </div>
        </div>

        {/* Budget */}
        <div className="card">
          <p className="section-title">Budget Breakdown</p>
          <div className="space-y-2">
            <BudgetRow label="Meta Ads" value={channelPlan.budgetBreakdown.meta} />
            <BudgetRow label="TikTok Ads" value={channelPlan.budgetBreakdown.tiktok} />
            <BudgetRow label="Content Creation" value={channelPlan.budgetBreakdown.contentCreation} />
            <div className="border-t border-surface-600 pt-2 mt-2">
              <BudgetRow label="Total Recommended" value={channelPlan.budgetBreakdown.totalRecommended} highlight />
            </div>
          </div>
        </div>
      </div>

      {/* Hashtags */}
      <div className="card">
        <p className="section-title">Suggested Hashtags</p>
        <div className="flex flex-wrap gap-2">
          {strategy.suggestedHashtags.map((tag) => (
            <span key={tag} className="badge bg-surface-600 text-gray-300 border border-surface-500">
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Research ─────────────────────────────────────────────────────────────────

function ResearchTab({ research }: { research: FullCampaign["research"] }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <InfoCard title="Audience Profile" text={research.audienceProfile} />
      <InfoCard title="Market Opportunity" text={research.marketOpportunity} />
      <InfoCard title="Market Positioning" text={research.marketPositioning} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title="Pain Points" items={research.painPoints} color="red" />
        <ListCard title="Desires & Aspirations" items={research.desires} color="green" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title="Competitors" items={research.competitors} color="blue" />
        <ListCard title="Competitor Weaknesses" items={research.competitorWeaknesses} color="gold" />
      </div>
      <ListCard title="Key Insights" items={research.keyInsights} color="purple" />
    </div>
  );
}

// ─── Strategy ─────────────────────────────────────────────────────────────────

function StrategyTab({ strategy }: { strategy: FullCampaign["strategy"] }) {
  const { customerPersona, funnelStrategy } = strategy;
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Core Message" text={strategy.coreMessage} highlight />
        <InfoCard title="Unique Value Proposition" text={strategy.uniqueValueProposition} />
      </div>
      <InfoCard title="Positioning Statement" text={strategy.positioningStatement} />
      <InfoCard title="Campaign Theme" text={strategy.campaignTheme} />
      <ListCard title="Messaging Angles" items={strategy.messagingAngles} color="gold" />

      {/* Funnel */}
      <div className="card">
        <p className="section-title">Funnel Strategy</p>
        <div className="space-y-3">
          <FunnelRow stage="Awareness" text={funnelStrategy.awareness} color="blue" />
          <FunnelRow stage="Consideration" text={funnelStrategy.consideration} color="purple" />
          <FunnelRow stage="Conversion" text={funnelStrategy.conversion} color="green" />
        </div>
      </div>

      {/* Persona */}
      <div className="card border-gold-600/30">
        <p className="section-title">Customer Persona</p>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/20 border border-gold-600/40 flex items-center justify-center text-2xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white">{customerPersona.name}</p>
            <p className="text-sm text-gray-400">
              {customerPersona.age} · {customerPersona.occupation}
            </p>
            <p className="text-xs text-gray-500 mt-1">{customerPersona.buyingBehavior}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <PersonaList label="Goals" items={customerPersona.goals} color="green" />
          <PersonaList label="Frustrations" items={customerPersona.frustrations} color="red" />
          <PersonaList label="Favourite Apps" items={customerPersona.favoriteApps} color="blue" />
        </div>
      </div>
    </div>
  );
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

function CopyTab({
  copy,
  review,
}: {
  copy: FullCampaign["copy"];
  review: FullCampaign["review"];
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card border-gold-600/30">
        <p className="section-title">Headline</p>
        <p className="text-xl font-bold text-gold-400">&quot;{copy.headline}&quot;</p>
        <p className="text-sm text-gray-300 mt-2">{copy.subheadline}</p>
      </div>
      <InfoCard title="Body Text" text={copy.bodyText} />
      <div className="card">
        <p className="section-title">Call to Action</p>
        <p className="text-lg font-semibold text-white">{copy.callToAction}</p>
      </div>

      {/* Ad Variants */}
      <div className="card">
        <p className="section-title">Platform Ad Variants</p>
        <div className="space-y-3">
          {copy.adVariants.map((variant) => (
            <div key={variant.platform} className="bg-surface-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="badge-blue capitalize">{variant.platform.replace("_", " ")}</span>
                <span className="text-xs text-gray-500">{variant.characterCount} chars</span>
              </div>
              <p className="text-sm text-white">{variant.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social post ideas */}
      <div className="card">
        <p className="section-title">Social Post Ideas</p>
        <div className="space-y-2">
          {copy.socialPostIdeas.map((idea, i) => (
            <div key={i} className="bg-surface-700 rounded-lg p-3 text-sm text-gray-300">
              {idea}
            </div>
          ))}
        </div>
      </div>

      {/* Review */}
      <div className="card">
        <p className="section-title">Copy Review</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <ScoreCard label="Overall" score={review.overallScore} />
          <ScoreCard label="Clarity" score={review.clarityScore} />
          <ScoreCard label="Persuasion" score={review.persuasivenessScore} />
          <ScoreCard label="Alignment" score={review.audienceAlignmentScore} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListCard title="Strengths" items={review.strengths} color="green" />
          <ListCard title="Improvements" items={review.improvements} color="gold" />
        </div>
        <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <p className="text-xs text-emerald-400 mb-1 font-semibold">Revised Headline</p>
          <p className="text-sm text-white font-medium">&quot;{review.revisedHeadline}&quot;</p>
        </div>
      </div>
    </div>
  );
}

// ─── Meta Package ─────────────────────────────────────────────────────────────

function MetaTab({ meta }: { meta: FullCampaign["exportPackage"]["meta"] }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Format" value={meta.adFormat} />
        <StatCard label="Objective" value={meta.campaignObjective} />
        <StatCard label="Est. Reach" value={meta.estimatedReach} />
        <StatCard label="Placement" value={meta.placementRecommendation} />
      </div>
      <div className="card border-blue-500/30">
        <p className="section-title">Primary Text</p>
        <p className="text-sm text-white leading-relaxed">{meta.primaryText}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InfoCard title="Headline" text={meta.headline} />
        <InfoCard title="Description" text={meta.description} />
        <InfoCard title="Call to Action" text={meta.callToAction} />
      </div>
      <div className="card">
        <p className="section-title">Audience Targeting</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatCard label="Age Range" value={meta.audienceTargeting.ageRange} />
          <StatCard label="Genders" value={meta.audienceTargeting.genders} />
        </div>
        <div className="mt-3 space-y-2">
          <TargetTagRow label="Interests" tags={meta.audienceTargeting.interests} color="blue" />
          <TargetTagRow label="Behaviors" tags={meta.audienceTargeting.behaviors} color="purple" />
          <TargetTagRow label="Locations" tags={meta.audienceTargeting.locations} color="green" />
        </div>
      </div>
      <div className="card">
        <p className="section-title">Budget Recommendation</p>
        <p className="text-sm text-white">{meta.budgetRecommendation}</p>
      </div>
    </div>
  );
}

// ─── TikTok Package ───────────────────────────────────────────────────────────

function TikTokTab({ tiktok }: { tiktok: FullCampaign["exportPackage"]["tiktok"] }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Format" value={tiktok.adFormat} />
        <StatCard label="Objective" value={tiktok.campaignObjective} />
        <StatCard label="Est. Reach" value={tiktok.estimatedReach} />
        <StatCard label="Trending Sounds" value={tiktok.trendingSounds} />
      </div>
      <div className="card border-purple-500/30">
        <p className="section-title">Hook Line</p>
        <p className="text-lg font-semibold text-white">&quot;{tiktok.hookLine}&quot;</p>
      </div>
      <div className="card">
        <p className="section-title">Video Script</p>
        <div className="bg-surface-700 rounded-lg p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
          {tiktok.videoScript}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InfoCard title="On-Screen Text" text={tiktok.onScreenText} />
        <InfoCard title="Call to Action" text={tiktok.callToAction} />
      </div>
      <div className="card">
        <p className="section-title">Audience Targeting</p>
        <StatCard label="Age Range" value={tiktok.audienceTargeting.ageRange} />
        <div className="mt-3 space-y-2">
          <TargetTagRow label="Interests" tags={tiktok.audienceTargeting.interests} color="purple" />
          <TargetTagRow label="Behaviors" tags={tiktok.audienceTargeting.behaviors} color="blue" />
          <TargetTagRow label="Locations" tags={tiktok.audienceTargeting.locations} color="green" />
        </div>
      </div>
    </div>
  );
}

// ─── Email ────────────────────────────────────────────────────────────────────

function EmailTab({ copy }: { copy: FullCampaign["copy"] }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card border-gold-600/30">
        <p className="section-title">Subject Line</p>
        <p className="text-lg font-semibold text-white">{copy.emailSubjectLine}</p>
      </div>
      <div className="card">
        <p className="section-title">Email Body</p>
        <div className="bg-surface-700 rounded-lg p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          {copy.emailBody}
        </div>
      </div>
    </div>
  );
}

// ─── Content Calendar ─────────────────────────────────────────────────────────

function CalendarTab({ calendar }: { calendar: FullCampaign["channelPlan"]["contentCalendar"] }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {calendar.map((entry, i) => (
        <div key={i} className="card-sm flex gap-4">
          <div className="flex-shrink-0 w-16 text-center">
            <p className="text-xs text-gold-500 font-semibold">{entry.week}</p>
            <p className="text-xs text-gray-500 mt-0.5">{entry.platform}</p>
          </div>
          <div className="border-l border-surface-500 pl-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-purple">{entry.contentType}</span>
            </div>
            <p className="text-sm font-medium text-white">{entry.topic}</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{entry.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

function KpisTab({
  kpis,
  budget,
}: {
  kpis: FullCampaign["channelPlan"]["kpis"];
  budget: FullCampaign["channelPlan"]["budgetBreakdown"];
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="card-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 text-sm font-bold flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{kpi.metric}</p>
              <p className="text-xs text-emerald-400">{kpi.target}</p>
              <p className="text-xs text-gray-500">{kpi.platform}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="section-title">Budget Breakdown</p>
        <div className="space-y-2">
          <BudgetRow label="Meta Ads" value={budget.meta} />
          <BudgetRow label="TikTok Ads" value={budget.tiktok} />
          <BudgetRow label="Content Creation" value={budget.contentCreation} />
          <div className="border-t border-surface-600 pt-2 mt-1">
            <BudgetRow label="Total Recommended" value={budget.totalRecommended} highlight />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Atoms ───────────────────────────────────────────────────────────

function ScoreRing({ score, label }: { score: number; label: string }) {
  const color =
    score >= 8 ? "border-emerald-500 text-emerald-400" :
    score >= 6 ? "border-gold-500 text-gold-400" :
    "border-red-500 text-red-400";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`score-ring ${color}`}>{score}</div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ScoreCard({ score, label }: { score: number; label: string }) {
  const color =
    score >= 8 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" :
    score >= 6 ? "text-gold-400 border-gold-600/30 bg-gold-500/5" :
    "text-red-400 border-red-500/30 bg-red-500/5";
  return (
    <div className={`card-sm border ${color} text-center`}>
      <p className="text-2xl font-bold">{score}<span className="text-sm">/10</span></p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function InfoCard({ title, text, highlight }: { title: string; text: string; highlight?: boolean }) {
  return (
    <div className={`card ${highlight ? "border-gold-600/30" : ""}`}>
      <p className="section-title">{title}</p>
      <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-sm">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}

function ListCard({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "red" | "green" | "blue" | "gold" | "purple";
}) {
  const dotColors = {
    red: "bg-red-500",
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    gold: "bg-gold-500",
    purple: "bg-purple-500",
  };
  return (
    <div className="card">
      <p className="section-title">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]} mt-1.5 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FunnelRow({
  stage,
  text,
  color,
}: {
  stage: string;
  text: string;
  color: "blue" | "purple" | "green";
}) {
  const colors = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    green: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  };
  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <p className="text-xs font-semibold mb-1">{stage}</p>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}

function PersonaList({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: "green" | "red" | "blue";
}) {
  const dotColors = { green: "bg-emerald-500", red: "bg-red-500", blue: "bg-blue-500" };
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
            <span className={`w-1 h-1 rounded-full ${dotColors[color]} mt-1.5 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TargetTagRow({
  label,
  tags,
  color,
}: {
  label: string;
  tags: string[];
  color: "blue" | "purple" | "green";
}) {
  const badgeColors = {
    blue: "badge-blue",
    purple: "badge-purple",
    green: "badge-green",
  };
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className={`badge ${badgeColors[color]}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 capitalize">{value}</span>
    </div>
  );
}

function BudgetRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={highlight ? "text-white font-semibold" : "text-gray-400"}>{label}</span>
      <span className={highlight ? "text-gold-400 font-bold" : "text-white"}>{value}</span>
    </div>
  );
}
