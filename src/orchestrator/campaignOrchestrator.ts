import { randomUUID } from "crypto";
import { CampaignInput, FullCampaign } from "../schemas/campaign.schemas";
import { runResearchAgent } from "../agents/research.agent";
import { runStrategyAgent } from "../agents/strategy.agent";
import { runCopyAgent } from "../agents/copy.agent";
import { runChannelPlanningAgent } from "../agents/channelPlanning.agent";
import { runReviewAgent } from "../agents/review.agent";

export type PipelineStage =
  | "research"
  | "strategy"
  | "copywriting"
  | "channel_planning"
  | "review"
  | "complete";

export type StageCallback = (stage: PipelineStage, message: string) => void;

/**
 * Custom TypeScript orchestrator replacing the original n8n workflow.
 * Originally prototyped with workflow automation, refactored into a custom
 * TypeScript engine for better ownership, portability, and scalability.
 *
 * Pipeline: Research → Strategy → Copywriting → Channel Planning → Review
 */
export async function runCampaignOrchestrator(
  input: CampaignInput,
  onStage?: StageCallback
): Promise<FullCampaign> {
  const id = randomUUID();
  const generatedAt = new Date().toISOString();

  // ─── Stage 1: Research ────────────────────────────────────────────────────
  onStage?.("research", "Analyzing market, audience, and competitors...");
  const research = await runResearchAgent(input).catch((err) => {
    throw new Error(`Research agent failed: ${(err as Error).message}`);
  });

  // ─── Stage 2: Strategy ────────────────────────────────────────────────────
  onStage?.("strategy", "Building positioning, messaging angles, and persona...");
  const strategy = await runStrategyAgent(input, research).catch((err) => {
    throw new Error(`Strategy agent failed: ${(err as Error).message}`);
  });

  // ─── Stage 3: Copywriting ─────────────────────────────────────────────────
  onStage?.("copywriting", "Writing headlines, ad copy, email, and social posts...");
  const copy = await runCopyAgent(input, research, strategy).catch((err) => {
    throw new Error(`Copy agent failed: ${(err as Error).message}`);
  });

  // ─── Stage 4: Channel Planning ────────────────────────────────────────────
  onStage?.("channel_planning", "Building Meta Ads and TikTok Ads packages...");
  const channelPlan = await runChannelPlanningAgent(input, research, strategy, copy).catch(
    (err) => {
      throw new Error(`Channel planning agent failed: ${(err as Error).message}`);
    }
  );

  // ─── Stage 5: Review ──────────────────────────────────────────────────────
  onStage?.("review", "Scoring and quality-checking the campaign...");
  const review = await runReviewAgent(input.brandName, input.targetAudience, copy).catch((err) => {
    throw new Error(`Review agent failed: ${(err as Error).message}`);
  });

  const campaign: FullCampaign = {
    id,
    generatedAt,
    input,
    research,
    strategy,
    copy,
    channelPlan,
    review,
    exportPackage: {
      meta: channelPlan.metaPackage,
      tiktok: channelPlan.tiktokPackage,
      campaignJson: JSON.stringify({ id, input, research, strategy, copy, channelPlan }, null, 2),
    },
  };

  onStage?.("complete", "Campaign generated successfully.");
  return campaign;
}
