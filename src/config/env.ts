import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
  console.error("Failed to load .env file from:", envPath);
  console.error(result.error);
} else {
  console.log("Loaded .env from:", envPath);
  console.log("Loaded env keys:", Object.keys(result.parsed ?? {}));
}

export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  STITCH_API_KEY: process.env.STITCH_API_KEY || "",
  KLING_API_KEY: process.env.KLING_API_KEY || "",
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",
  META_GRAPH_API_KEY: process.env.META_GRAPH_API_KEY || "",
  WHATSAPP_CLOUD_API_KEY: process.env.WHATSAPP_CLOUD_API_KEY || "",
};