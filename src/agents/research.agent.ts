import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "../config/llm";
import { ResearchOutputSchema, ResearchOutput, CampaignInput } from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are an expert market research analyst with deep expertise in consumer psychology,
competitive analysis, and market positioning.

When given a brand, product description, target audience, and competitors, you will:
- Build a detailed audience profile (demographics, psychographics, behaviors, platforms they use)
- Uncover 4-6 specific pain points the audience experiences related to the product category
- Identify 3-5 desires and aspirations that motivate this audience to buy
- Research and name 3-5 real competitors in the market
- Pinpoint 2-4 weaknesses of those competitors this brand can exploit
- Define the market opportunity and the best open positioning
- Extract 4-6 key insights that directly inform campaign strategy

Be specific and evidence-based. Every insight must be actionable for a strategist.`;

export async function runResearchAgent(input: CampaignInput): Promise<ResearchOutput> {
  const model = createChatModel(0.3);

  const competitorContext = input.competitors
    ? `Known competitors: ${input.competitors}`
    : "No competitors specified — identify the main ones.";

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Conduct thorough market research for this campaign:

Brand: {brandName}
Product/Service: {productDescription}
Industry: {industry}
Target Audience: {targetAudience}
Region: {region}
Campaign Objective: {objective}
{competitorContext}

Provide comprehensive market research insights the strategy team can act on immediately.`,
    ],
  ]);

  const structured = model.withStructuredOutput(ResearchOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({
    brandName: input.brandName,
    productDescription: input.productDescription,
    industry: input.industry,
    targetAudience: input.targetAudience,
    region: input.region,
    objective: input.objective,
    competitorContext,
  });
}
