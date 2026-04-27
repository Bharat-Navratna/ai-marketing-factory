import { CampaignResult } from "./schemas/campaign.schemas";
import { runResearchAgent } from "./agents/research.agent";
import { runCopyAgent } from "./agents/copy.agent";
import { runReviewAgent } from "./agents/review.agent";

export async function runCampaignPipeline(
  product: string,
  audience: string
): Promise<CampaignResult> {
  console.log("\nStarting AI Campaign Pipeline");
  console.log(`Product:  ${product}`);
  console.log(`Audience: ${audience}\n`);

  console.log("Running research agent...");
  let research;
  try {
    research = await runResearchAgent(product, audience);
  } catch (error) {
    throw new Error(
      `Research agent failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  console.log("Running copy agent...");
  let copy;
  try {
    copy = await runCopyAgent(product, audience, research);
  } catch (error) {
    throw new Error(
      `Copy agent failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  console.log("Running review agent...");
  let review;
  try {
    review = await runReviewAgent(product, audience, copy);
  } catch (error) {
    throw new Error(
      `Review agent failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  console.log("Pipeline completed successfully.\n");

  return {
    product,
    audience,
    generatedAt: new Date().toISOString(),
    research,
    copy,
    review,
  };
}
