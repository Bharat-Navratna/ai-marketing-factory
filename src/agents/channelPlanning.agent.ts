import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "../config/llm";
import {
  ChannelPlanOutputSchema,
  ChannelPlanOutput,
  ResearchOutput,
  StrategyOutput,
  CopyOutput,
  CampaignInput,
} from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are a performance marketing expert and channel strategist specialising in
Meta Ads (Facebook + Instagram) and TikTok Ads.

Your job is to build export-ready campaign packages that a media buyer could load into Ads Manager
with minimal editing. You think in terms of:
- Audience segments and targeting parameters
- Ad formats best suited to the objective and platform
- Creative hooks that stop the scroll
- Budget allocation across placements
- 4-week content calendar with specific post topics
- KPIs tied to the campaign objective

Always produce specific, actionable numbers and recommendations — never vague placeholders.
If a budget isn't provided, give a recommended range based on the industry and objective.`;

export async function runChannelPlanningAgent(
  input: CampaignInput,
  research: ResearchOutput,
  strategy: StrategyOutput,
  copy: CopyOutput
): Promise<ChannelPlanOutput> {
  const model = createChatModel(0.5);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Build the full channel plan for this campaign:

CAMPAIGN BRIEF
--------------
Brand: {brandName}
Product: {productDescription}
Objective: {objective}
Platforms: {platforms}
Region: {region}
Budget: {budget}
Duration: {duration}
Tone: {tone}

STRATEGY
--------
Core Message: {coreMessage}
Unique Value Proposition: {uvp}
Funnel — Awareness: {funnelAwareness}
Funnel — Consideration: {funnelConsideration}
Funnel — Conversion: {funnelConversion}
Campaign Theme: {campaignTheme}

AUDIENCE
--------
Profile: {audienceProfile}
Pain Points: {painPoints}
Interests/Desires: {desires}
Competitors: {competitors}

COPY ASSETS
-----------
Headline: {headline}
CTA: {callToAction}

Produce:
1. A complete Meta Ads package (Facebook + Instagram) — export-ready
2. A complete TikTok Ads package — export-ready
3. A 4-week content calendar with specific topics per platform
4. Budget breakdown across Meta, TikTok, and content creation
5. 5-8 KPIs with specific targets tied to the objective

Note: Real API publishing is NOT implemented — these are export-ready packages
for manual upload into Ads Manager and TikTok Ads Manager.`,
    ],
  ]);

  const structured = model.withStructuredOutput(ChannelPlanOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({
    brandName: input.brandName,
    productDescription: input.productDescription,
    objective: input.objective,
    platforms: input.platforms.join(", "),
    region: input.region,
    budget: input.budget ?? "Not specified — recommend a suitable range",
    duration: input.duration ?? "4 weeks",
    tone: input.tone,
    coreMessage: strategy.coreMessage,
    uvp: strategy.uniqueValueProposition,
    funnelAwareness: strategy.funnelStrategy.awareness,
    funnelConsideration: strategy.funnelStrategy.consideration,
    funnelConversion: strategy.funnelStrategy.conversion,
    campaignTheme: strategy.campaignTheme,
    audienceProfile: research.audienceProfile,
    painPoints: research.painPoints.join(" | "),
    desires: research.desires.join(" | "),
    competitors: research.competitors.join(", "),
    headline: copy.headline,
    callToAction: copy.callToAction,
  });
}
