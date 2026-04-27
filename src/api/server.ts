import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express, { Request, Response } from "express";
import fs from "fs";
import { z } from "zod";
import { runCampaignPipeline } from "../pipeline";
import { saveCampaign } from "../utils/saveOutput";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const OUTPUT_DIR = path.resolve(process.cwd(), "output");

const GenerateRequestSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  audience: z.string().min(1, "Audience description is required"),
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/generate", async (req: Request, res: Response) => {
  const parsed = GenerateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      details: parsed.error.issues,
    });
    return;
  }

  try {
    const { product, audience } = parsed.data;
    const result = await runCampaignPipeline(product, audience);
    await saveCampaign(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Pipeline failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
});

app.get("/api/campaigns", async (_req: Request, res: Response) => {
  try {
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
    const files = await fs.promises.readdir(OUTPUT_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const campaigns = await Promise.all(
      jsonFiles.map(async (file) => {
        const raw = await fs.promises.readFile(path.join(OUTPUT_DIR, file), "utf-8");
        return JSON.parse(raw);
      })
    );

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({
      error: "Failed to read campaigns",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\nAI Marketing Agent API running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/generate   { product, audience }`);
  console.log(`  GET  /api/campaigns\n`);
});

export default app;
