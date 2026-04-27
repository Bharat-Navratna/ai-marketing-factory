import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ResearchOutputSchema, ResearchOutput } from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are an expert market research analyst with deep expertise in consumer psychology,
competitive analysis, and market positioning. Your job is to analyze products and their target audiences
to produce actionable market research insights.

When given a product and target audience, you will:
- Identify the specific target audience characteristics, behaviors, and demographics
- Uncover key pain points and frustrations that audience experiences related to the product category
- Research and identify 3-5 main competitors in the market
- Define a clear market positioning strategy that differentiates this product
- Extract 4-6 key insights that should directly inform the marketing campaign copy

Be specific, evidence-based in your thinking, and provide insights that a copywriter can immediately use.`;

export async function runResearchAgent(product: string, audience: string): Promise<ResearchOutput> {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.3 });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Conduct thorough market research for the following:\n\nProduct: {product}\nTarget Audience: {audience}\n\nProvide comprehensive market research insights that a copywriter can use to craft compelling campaigns.`,
    ],
  ]);

  const structured = model.withStructuredOutput(ResearchOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({ product, audience });
}
