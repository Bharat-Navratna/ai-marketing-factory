import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "../config/llm";
import {
  StrategyOutputSchema,
  StrategyOutput,
  ResearchOutput,
  CampaignInput,
} from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are a senior brand strategist and creative director with 20+ years experience
building campaigns for global brands.

Your job is to take market research and turn it into a razor-sharp campaign strategy. You:
- Craft a single, powerful core message the entire campaign revolves around
- Define the unique value proposition in one punchy sentence
- Write a positioning statement that differentiates the brand clearly
- Generate 3-5 distinct messaging angles the creative team can explore
- Design a simple funnel strategy (awareness → consideration → conversion)
- Build a vivid, detailed customer persona the entire team can rally around
- Choose a campaign theme that unifies all creative output
- Suggest 5-8 relevant hashtags

Every output must be specific to the brand, not generic marketing speak.`;

export async function runStrategyAgent(
  input: CampaignInput,
  research: ResearchOutput
): Promise<StrategyOutput> {
  const model = createChatModel(0.6);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Build a complete campaign strategy for this brand:

BRAND BRIEF
-----------
Brand: {brandName}
Product: {productDescription}
Industry: {industry}
Objective: {objective}
Tone: {tone}
Region: {region}
Platforms: {platforms}
Budget: {budget}
Duration: {duration}

RESEARCH INSIGHTS
-----------------
Audience Profile: {audienceProfile}
Pain Points: {painPoints}
Desires: {desires}
Market Opportunity: {marketOpportunity}
Positioning: {marketPositioning}
Key Insights: {keyInsights}
Competitors: {competitors}
Competitor Weaknesses: {competitorWeaknesses}

Build a strategy that turns these insights into a campaign that wins.`,
    ],
  ]);

  const structured = model.withStructuredOutput(StrategyOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({
    brandName: input.brandName,
    productDescription: input.productDescription,
    industry: input.industry,
    objective: input.objective,
    tone: input.tone,
    region: input.region,
    platforms: input.platforms.join(", "),
    budget: input.budget ?? "Not specified",
    duration: input.duration ?? "Not specified",
    audienceProfile: research.audienceProfile,
    painPoints: research.painPoints.join("; "),
    desires: research.desires.join("; "),
    marketOpportunity: research.marketOpportunity,
    marketPositioning: research.marketPositioning,
    keyInsights: research.keyInsights.join("; "),
    competitors: research.competitors.join(", "),
    competitorWeaknesses: research.competitorWeaknesses.join("; "),
  });
}
