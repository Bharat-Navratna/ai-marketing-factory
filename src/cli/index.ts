import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { Command } from "commander";
import { runCampaignPipeline } from "../pipeline";
import { saveCampaign } from "../utils/saveOutput";

const program = new Command();

program
  .name("ai-marketing-agent")
  .description("Generate AI-powered, research-backed marketing campaigns")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a full marketing campaign for a product")
  .requiredOption("--product <name>", "Product name to generate a campaign for")
  .requiredOption("--audience <description>", "Target audience description")
  .option("--no-save", "Skip saving the campaign output to disk")
  .option("--verbose", "Print the full campaign result as JSON", false)
  .action(async (options: { product: string; audience: string; save: boolean; verbose: boolean }) => {
    const { product, audience, save, verbose } = options;

    try {
      const result = await runCampaignPipeline(product, audience);

      if (save) {
        await saveCampaign(result);
      }

      if (verbose) {
        console.log("\nFull result:");
        console.dir(result, { depth: null });
      }

      const bar = "=".repeat(60);
      console.log(`\n${bar}`);
      console.log("CAMPAIGN SUMMARY");
      console.log(bar);
      console.log(`\nProduct:  ${result.product}`);
      console.log(`Audience: ${result.audience}`);
      console.log(`\nHeadline:         ${result.copy.headline}`);
      console.log(`Revised Headline: ${result.review.revisedHeadline}`);
      console.log(`\nReview Scores:`);
      console.log(`  Overall Score:        ${result.review.overallScore}/10`);
      console.log(`  Clarity:              ${result.review.clarityScore}/10`);
      console.log(`  Persuasiveness:       ${result.review.persuasivenessScore}/10`);
      console.log(`  Audience Alignment:   ${result.review.audienceAlignmentScore}/10`);
      console.log(`\nTop Improvement:`);
      console.log(`  ${result.review.improvements[0] ?? "—"}`);
      console.log(`\n${bar}\n`);
    } catch (error) {
      console.error("\nError:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv);
