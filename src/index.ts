import { env } from "./config/env";
import { generateLocalizedCampaign } from "./agents/localizationAgent";

async function main() {
  console.log("AI Campaign Factory is starting...");
  console.log("process.cwd():", process.cwd());
  console.log("OPENAI_API_KEY exists:", !!env.OPENAI_API_KEY);
  console.log(
    "OPENAI_API_KEY preview:",
    env.OPENAI_API_KEY ? env.OPENAI_API_KEY.slice(0, 7) + "..." : "EMPTY"
  );

  const businessUpdate =
    "YQN Pay now allows merchants to withdraw cash instantly from any local agency with zero fees.";

  try {
    const result = await generateLocalizedCampaign(businessUpdate);

    console.log("\n=== LOCALIZED CAMPAIGN OUTPUT ===\n");
    console.dir(result, { depth: null });
  } catch (error) {
    console.error("\nError while generating localized campaign:");
    console.error(error);
  }
}

main();