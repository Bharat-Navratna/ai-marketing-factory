import type { CampaignInput, FullCampaign } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}`
  : "http://localhost:3001";

export async function generateCampaign(input: CampaignInput): Promise<FullCampaign> {
  const res = await fetch(`${API_BASE}/api/campaigns/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { message?: string }).message ?? `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<FullCampaign>;
}
