import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { env } from "../config/env";

const merchantSchema = z.object({
  platforms: z.array(z.string()),
  tone: z.string(),
  languages: z.array(z.string()),
  headline: z.string(),
  cta: z.string(),
  scriptFrench: z.string(),
  scriptDarija: z.string(),
  hashtags: z.array(z.string()),
});

const consumerSchema = z.object({
  platforms: z.array(z.string()),
  tone: z.string(),
  languages: z.array(z.string()),
  headline: z.string(),
  cta: z.string(),
  scriptDarija: z.string(),
  hashtags: z.array(z.string()),
});

const localizationSchema = z.object({
  merchant: merchantSchema,
  consumer: consumerSchema,
});

export type LocalizationOutput = z.infer<typeof localizationSchema>;

function getModel() {
  return new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: "gpt-4.1-mini",
    temperature: 0.7,
  });
}

export async function generateLocalizedCampaign(
  businessUpdate: string
): Promise<LocalizationOutput> {
  const prompt = `
You are an AI marketing strategist for YQN Pay.

Your task is to convert one business update into two campaign variants for the Morocco market.

AUDIENCE RULES:
1. Merchant campaign
- Audience: merchants and business owners in Morocco
- Platforms: Facebook and WhatsApp
- Tone: professional, trustworthy, clear
- Languages: French + Moroccan Darija
- Must include:
  - headline
  - CTA
  - short French script
  - short Moroccan Darija script
  - 3 to 5 relevant hashtags

2. Consumer campaign
- Audience: everyday consumers in Morocco
- Platforms: TikTok and Instagram Reels
- Tone: energetic, street-smart, exciting
- Language: Moroccan Darija only
- Must include:
  - headline
  - CTA
  - short Darija script
  - 3 to 5 relevant hashtags

BUSINESS UPDATE:
${businessUpdate}

IMPORTANT OUTPUT RULES:
- Return only valid JSON.
- No markdown.
- No explanation text.
- Keep scripts concise and ad-ready.
- Make the copy sound localized for Morocco.
- Do not invent features beyond the business update.

Return JSON with exactly this shape:
{
  "merchant": {
    "platforms": ["Facebook", "WhatsApp"],
    "tone": "string",
    "languages": ["French", "Moroccan Darija"],
    "headline": "string",
    "cta": "string",
    "scriptFrench": "string",
    "scriptDarija": "string",
    "hashtags": ["string", "string", "string"]
  },
  "consumer": {
    "platforms": ["TikTok", "Instagram Reels"],
    "tone": "string",
    "languages": ["Moroccan Darija"],
    "headline": "string",
    "cta": "string",
    "scriptDarija": "string",
    "hashtags": ["string", "string", "string"]
  }
}
`;

  const model = getModel();
  const response = await model.invoke(prompt);

  const rawText =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    console.error("Failed to parse model response as JSON:");
    console.error(rawText);
    throw new Error("Model did not return valid JSON.");
  }

  const validated = localizationSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Zod validation failed:");
    console.error(validated.error.format());
    throw new Error("Model returned JSON, but it did not match the expected schema.");
  }

  return validated.data;
}