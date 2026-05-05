import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express, { Request, Response } from "express";
import fs from "fs";
import { z } from "zod";
import { runCampaignPipeline } from "../pipeline";
import { saveCampaign, saveFullCampaign } from "../utils/saveOutput";
import { runCampaignOrchestrator } from "../orchestrator/campaignOrchestrator";
import { CampaignInputSchema } from "../schemas/campaign.schemas";

const app = express();
app.use(express.json());

const defaultAllowedOrigins = ["http://localhost:3002", "http://127.0.0.1:3002"];
const configuredAllowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredAllowedOrigins]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.has(origin) || allowedOrigins.has("*"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

const PORT = Number(process.env.PORT) || 3001;
const OUTPUT_DIR = path.resolve(process.cwd(), "output");

// ─── Legacy schema for the old /api/generate endpoint ─────────────────────────
const LegacyGenerateSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  audience: z.string().min(1, "Audience description is required"),
});

// ─── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── New: Full campaign generation (5-agent orchestrator) ─────────────────────
app.post("/api/campaigns/generate", async (req: Request, res: Response) => {
  const parsed = CampaignInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      details: parsed.error.issues,
    });
    return;
  }

  try {
    const campaign = await runCampaignOrchestrator(parsed.data);
    await saveFullCampaign(campaign);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({
      error: "Campaign generation failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ─── New: List saved full campaigns ───────────────────────────────────────────
app.get("/api/campaigns", async (_req: Request, res: Response) => {
  try {
    const dir = path.join(OUTPUT_DIR, "full");
    await fs.promises.mkdir(dir, { recursive: true });
    const files = await fs.promises.readdir(dir);
    const jsonFiles = files.filter((f) => f.endsWith(".json")).sort().reverse();

    const campaigns = await Promise.all(
      jsonFiles.map(async (file) => {
        const raw = await fs.promises.readFile(path.join(dir, file), "utf-8");
        return JSON.parse(raw);
      })
    );

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({
      error: "Failed to read campaigns",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ─── Legacy: 3-agent pipeline (kept for backwards compatibility) ───────────────
app.post("/api/generate", async (req: Request, res: Response) => {
  const parsed = LegacyGenerateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.issues });
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
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ─── Legacy: list old-format campaigns ────────────────────────────────────────
app.get("/api/campaigns/legacy", async (_req: Request, res: Response) => {
  try {
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
    const files = await fs.promises.readdir(OUTPUT_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json")).sort().reverse();

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
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Campaign Studio API — http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/campaigns/generate   { brandName, productDescription, ... }`);
  console.log(`  GET  /api/campaigns`);
  console.log(`  POST /api/generate             (legacy — product + audience)`);
  console.log(`  GET  /api/campaigns/legacy\n`);
});

export default app;
