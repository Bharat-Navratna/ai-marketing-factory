import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "../config/llm";
import {
  CopyOutputSchema,
  CopyOutput,
  ResearchOutput,
  StrategyOutput,
  CampaignInput,
} from "../schemas/campaign.schemas";

const SYSTEM_PROMPT = `You are a world-class direct-response copywriter specializing in multi-platform digital marketing.
You write compelling, conversion-focused copy grounded in research and strategy.

STRICT PLATFORM CHARACTER LIMITS — stay within these or the copy is rejected:
- Google Ads: MAXIMUM 90 characters
- Meta (Facebook/Instagram): MAXIMUM 125 characters
- TikTok: MAXIMUM 100 characters
- LinkedIn: MAXIMUM 150 characters
- Facebook: MAXIMUM 125 characters

Before finalizing each ad variant, count every character including spaces.
The characterCount field must reflect the EXACT character count.

Write copy that:
- Uses the campaign's core message and tone
- Speaks the audience's language
- Addresses their specific pain points and desires
- Has a single, unmistakable call to action
- Generates 3-5 social post ideas that feel native to each platform`;

export async function runCopyAgent(
  input: CampaignInput,
  research: ResearchOutput,
  strategy: StrategyOutput
): Promise<CopyOutput> {
  const model = createChatModel(0.7);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    [
      "human",
      `Create the full copy package for this campaign:

BRAND & PRODUCT
---------------
Brand: {brandName}
Product: {productDescription}
Tone: {tone}
Platforms: {platforms}

STRATEGY
--------
Core Message: {coreMessage}
Unique Value Proposition: {uvp}
Campaign Theme: {campaignTheme}
Persona Name: {personaName} — {personaOccupation}, {personaAge}

RESEARCH CONTEXT
----------------
Audience Profile: {audienceProfile}
Pain Points: {painPoints}
Desires: {desires}
Key Insights: {keyInsights}

Deliver:
1. Headline (max 10 words, punchy)
2. Subheadline (1-2 sentences)
3. Body text (3-4 sentences, landing page style)
4. Call to action phrase (3-6 words)
5. Email subject line (max 60 characters)
6. Full email body (3-4 short paragraphs, warm + persuasive)
7. 3-5 social post ideas (native captions, not generic)
8. Ad variants for each requested platform:
   - One variant per platform in: {platforms}
   - Include characterCount equal to exact character count of the copy`,
    ],
  ]);

  const structured = model.withStructuredOutput(CopyOutputSchema);
  const chain = prompt.pipe(structured);

  return await chain.invoke({
    brandName: input.brandName,
    productDescription: input.productDescription,
    tone: input.tone,
    platforms: input.platforms.join(", "),
    coreMessage: strategy.coreMessage,
    uvp: strategy.uniqueValueProposition,
    campaignTheme: strategy.campaignTheme,
    personaName: strategy.customerPersona.name,
    personaOccupation: strategy.customerPersona.occupation,
    personaAge: strategy.customerPersona.age,
    audienceProfile: research.audienceProfile,
    painPoints: research.painPoints.join(" | "),
    desires: research.desires.join(" | "),
    keyInsights: research.keyInsights.join(" | "),
  });
}
