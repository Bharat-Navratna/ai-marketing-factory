import { CampaignResult } from "./schemas/campaign.schemas";
import { runCampaignOrchestrator } from "./orchestrator/campaignOrchestrator";

/**
 * Legacy 3-field interface kept for CLI and backwards-compatible API endpoint.
 * Internally delegates to the full 5-agent orchestrator.
 */
export async function runCampaignPipeline(
  product: string,
  audience: string
): Promise<CampaignResult> {
  console.log("\nStarting AI Campaign Pipeline");
  console.log(`Product:  ${product}`);
  console.log(`Audience: ${audience}\n`);

  const campaign = await runCampaignOrchestrator({
    brandName: product,
    productDescription: product,
    industry: "General",
    objective: "brand_awareness",
    targetAudience: audience,
    region: "Global",
    tone: "professional",
    platforms: ["meta_ads", "instagram"],
  });

  console.log("Pipeline completed successfully.\n");

  return {
    product,
    audience,
    generatedAt: campaign.generatedAt,
    research: campaign.research,
    copy: campaign.copy,
    review: campaign.review,
  };
}
