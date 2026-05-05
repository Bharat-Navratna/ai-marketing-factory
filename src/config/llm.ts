import { ChatOpenAI } from "@langchain/openai";
import { env } from "./env";

export function createChatModel(temperature: number) {
  return new ChatOpenAI({
    apiKey: env.LLM_API_KEY,
    model: env.MODEL_NAME,
    temperature,
    configuration: {
      baseURL: env.LLM_BASE_URL,
    },
  });
}
