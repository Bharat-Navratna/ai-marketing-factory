import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });

const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
const geminiApiKey = process.env.GEMINI_API_KEY;
const grokApiKey = process.env.GROK_API_KEY;
const apiKey = provider === "grok" ? grokApiKey : geminiApiKey || grokApiKey;

if (!apiKey) {
  console.error(
    "ERROR: No AI API key is set. Add GEMINI_API_KEY to your .env file, or set AI_PROVIDER=grok with GROK_API_KEY."
  );
  process.exit(1);
}

export const env = {
  AI_PROVIDER: provider,
  LLM_API_KEY: apiKey,
  LLM_BASE_URL:
    process.env.LLM_BASE_URL ||
    process.env.GEMINI_BASE_URL ||
    (provider === "grok"
      ? process.env.GROK_BASE_URL || "https://api.x.ai/v1"
      : "https://generativelanguage.googleapis.com/v1beta/openai/"),
  PORT: process.env.PORT || "3001",
  MODEL_NAME:
    process.env.MODEL_NAME || (provider === "grok" ? "grok-4.20-reasoning" : "gemini-2.5-flash"),
  STITCH_API_KEY: process.env.STITCH_API_KEY || "",
  KLING_API_KEY: process.env.KLING_API_KEY || "",
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",
  META_GRAPH_API_KEY: process.env.META_GRAPH_API_KEY || "",
  WHATSAPP_CLOUD_API_KEY: process.env.WHATSAPP_CLOUD_API_KEY || "",
};
