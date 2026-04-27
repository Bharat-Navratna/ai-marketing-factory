import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CopyOutputSchema, CopyOutput, ResearchOutput } from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are a world-class direct-response copywriter specializing in multi-platform digital marketing.
You write compelling, conversion-focused copy that speaks directly to target audiences based on deep research insights.

STRICT PLATFORM CHARACTER LIMITS — you must stay within these:
- Google Ads: MAXIMUM 90 characters (count every character including spaces)
- Meta (Facebook/Instagram): MAXIMUM 125 characters (count every character including spaces)
- LinkedIn: MAXIMUM 150 characters (count every character including spaces)

Before finalizing each ad variant, count the characters and ensure compliance.
The characterCount field must reflect the EXACT character count of the copy string.

Write copy that:
- Addresses the audience's specific pain points directly
- Differentiates from competitors based on the positioning strategy
- Uses the audience's natural language and tone
- Has a clear, single call to action`;

export async function runCopyAgent(
  product: string,
  audience: string,
  research: ResearchOutput
): Promise<CopyOutput> {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });

  const researchContext = [
    `Target Audience Profile: ${research.targetAudience}`,
    `Pain Points: ${research.painPoints.join(" | ")}`,
    `Competitors: ${research.competitors.join(", ")}`,
    `Market Positioning: ${research.marketPositioning}`,
    `Key Insights: ${research.keyInsights.join(" | ")}`,
  ].join("\n");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Create a complete marketing copy package for:

Product: {product}
Target Audience: {audience}

Market Research Context:
{researchContext}

Deliver:
1. A punchy headline (max 10 words)
2. A supporting subheadline (1-2 sentences)
3. Body text (3-4 sentences for landing page)
4. A strong call-to-action phrase
5. An email subject line (max 60 characters, curiosity-driven)
6. A full email body (3-4 short paragraphs)
7. Three platform-specific ad variants:
   - Google: max 90 chars (set characterCount to actual char count)
   - Meta: max 125 chars (set characterCount to actual char count)
   - LinkedIn: max 150 chars (set characterCount to actual char count)`,
    ],
  ]);

  const structured = model.withStructuredOutput(CopyOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({ product, audience, researchContext });
}
