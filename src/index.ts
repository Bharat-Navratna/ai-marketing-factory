import "./config/env";
import { generateLocalizedCampaign } from "./agents/localizationAgent";

async function main() {
  const businessUpdate =
    "YQN Pay now allows merchants to withdraw cash instantly from any local agency with zero fees.";

  try {
    const result = await generateLocalizedCampaign(businessUpdate);
    console.log("\n=== LOCALIZED CAMPAIGN OUTPUT ===\n");
    console.dir(result, { depth: null });
  } catch (error) {
    console.error("\nError while generating localized campaign:");
    console.error(error);
    process.exit(1);
  }
}

main();
