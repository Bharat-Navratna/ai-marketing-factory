import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "../config/llm";
import { ReviewOutputSchema, ReviewOutput, CopyOutput } from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are a senior direct-response copywriter and marketing strategist with 15+ years of experience
reviewing campaigns for Fortune 500 brands. You review marketing copy with a critical, data-informed eye.

Score each dimension from 1 to 10 (integers only):
- clarityScore: Is the message immediately clear? Does it pass the "5-second test"?
- persuasivenessScore: Does it create urgency, address objections, and compel action?
- audienceAlignmentScore: Does it use the right tone, language, and speak to real pain points?
- overallScore: Your holistic assessment weighted across all three dimensions

Provide:
- 3-5 concrete strengths (what's working and why)
- 3-5 specific, actionable improvements (with suggested rewrites where helpful)
- A revised headline that incorporates your top recommendations

Be direct, honest, and constructive. Vague feedback is unhelpful.`;

export async function runReviewAgent(
  brandName: string,
  audience: string,
  copy: CopyOutput
): Promise<ReviewOutput> {
  const product = brandName;
  const model = createChatModel(0.3);

  const copyContext = [
    `Headline: ${copy.headline}`,
    `Subheadline: ${copy.subheadline}`,
    `Body Text: ${copy.bodyText}`,
    `Call to Action: ${copy.callToAction}`,
    `Email Subject Line: ${copy.emailSubjectLine}`,
    `Ad Variants:`,
    ...copy.adVariants.map((v) => `  ${v.platform}: "${v.copy}" (${v.characterCount} chars)`),
  ].join("\n");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Review this marketing copy package:

Product: {product}
Target Audience: {audience}

Copy to Review:
{copyContext}

Score the copy, identify strengths and improvements, and provide a revised headline that demonstrates your recommendations.`,
    ],
  ]);

  const structured = model.withStructuredOutput(ReviewOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({ product, audience, copyContext });
}
