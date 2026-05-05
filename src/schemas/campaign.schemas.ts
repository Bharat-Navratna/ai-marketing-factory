import { z } from "zod";

// ─── Campaign Input ────────────────────────────────────────────────────────────

export const CampaignInputSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  productDescription: z.string().min(10, "Product description must be at least 10 characters"),
  industry: z.string().min(1, "Industry is required"),
  objective: z.enum([
    "brand_awareness",
    "lead_generation",
    "sales_conversion",
    "app_installs",
    "engagement",
    "retargeting",
  ]),
  targetAudience: z.string().min(5, "Target audience description is required"),
  region: z.string().min(1, "Region is required"),
  tone: z.enum(["professional", "playful", "luxury", "urgent", "inspirational", "educational"]),
  platforms: z.array(
    z.enum(["meta_ads", "instagram", "facebook", "tiktok", "linkedin"])
  ).min(1, "Select at least one platform"),
  competitors: z.string().optional(),
  budget: z.string().optional(),
  duration: z.string().optional(),
});

export type CampaignInput = z.infer<typeof CampaignInputSchema>;

// ─── Agent 1: Research Output ──────────────────────────────────────────────────

export const ResearchOutputSchema = z.object({
  audienceProfile: z.string(),
  painPoints: z.array(z.string()),
  desires: z.array(z.string()),
  competitors: z.array(z.string()),
  competitorWeaknesses: z.array(z.string()),
  marketOpportunity: z.string(),
  marketPositioning: z.string(),
  keyInsights: z.array(z.string()),
  targetAudience: z.string(),
});

export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;

// ─── Agent 2: Strategy Output ──────────────────────────────────────────────────

export const StrategyOutputSchema = z.object({
  coreMessage: z.string(),
  uniqueValueProposition: z.string(),
  positioningStatement: z.string(),
  messagingAngles: z.array(z.string()),
  funnelStrategy: z.object({
    awareness: z.string(),
    consideration: z.string(),
    conversion: z.string(),
  }),
  customerPersona: z.object({
    name: z.string(),
    age: z.string(),
    occupation: z.string(),
    goals: z.array(z.string()),
    frustrations: z.array(z.string()),
    favoriteApps: z.array(z.string()),
    buyingBehavior: z.string(),
  }),
  campaignTheme: z.string(),
  suggestedHashtags: z.array(z.string()),
});

export type StrategyOutput = z.infer<typeof StrategyOutputSchema>;

// ─── Agent 3: Copy Output ──────────────────────────────────────────────────────

export const AdVariantSchema = z.object({
  platform: z.enum(["google", "meta", "instagram", "tiktok", "linkedin", "facebook"]),
  copy: z.string(),
  characterCount: z.number(),
});

export const CopyOutputSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  bodyText: z.string(),
  callToAction: z.string(),
  emailSubjectLine: z.string(),
  emailBody: z.string(),
  socialPostIdeas: z.array(z.string()),
  adVariants: z.array(AdVariantSchema),
});

export type CopyOutput = z.infer<typeof CopyOutputSchema>;

// ─── Agent 4: Channel Plan Output ─────────────────────────────────────────────

export const MetaAdSchema = z.object({
  campaignObjective: z.string(),
  adFormat: z.string(),
  primaryText: z.string(),
  headline: z.string(),
  description: z.string(),
  callToAction: z.string(),
  audienceTargeting: z.object({
    ageRange: z.string(),
    genders: z.string(),
    interests: z.array(z.string()),
    behaviors: z.array(z.string()),
    locations: z.array(z.string()),
  }),
  budgetRecommendation: z.string(),
  placementRecommendation: z.string(),
  estimatedReach: z.string(),
});

export const TikTokAdSchema = z.object({
  campaignObjective: z.string(),
  adFormat: z.string(),
  videoScript: z.string(),
  hookLine: z.string(),
  onScreenText: z.string(),
  callToAction: z.string(),
  audienceTargeting: z.object({
    ageRange: z.string(),
    interests: z.array(z.string()),
    behaviors: z.array(z.string()),
    locations: z.array(z.string()),
  }),
  budgetRecommendation: z.string(),
  trendingSounds: z.string(),
  estimatedReach: z.string(),
});

export const ContentCalendarEntrySchema = z.object({
  week: z.string(),
  platform: z.string(),
  contentType: z.string(),
  topic: z.string(),
  caption: z.string(),
});

export const ChannelPlanOutputSchema = z.object({
  metaPackage: MetaAdSchema,
  tiktokPackage: TikTokAdSchema,
  contentCalendar: z.array(ContentCalendarEntrySchema),
  budgetBreakdown: z.object({
    meta: z.string(),
    tiktok: z.string(),
    contentCreation: z.string(),
    totalRecommended: z.string(),
  }),
  kpis: z.array(
    z.object({
      metric: z.string(),
      target: z.string(),
      platform: z.string(),
    })
  ),
});

export type ChannelPlanOutput = z.infer<typeof ChannelPlanOutputSchema>;

// ─── Agent 3 Review (kept for backwards compat) ───────────────────────────────

export const ReviewOutputSchema = z.object({
  overallScore: z.number(),
  clarityScore: z.number(),
  persuasivenessScore: z.number(),
  audienceAlignmentScore: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  revisedHeadline: z.string(),
});

export type ReviewOutput = z.infer<typeof ReviewOutputSchema>;

// ─── Full Campaign Result ──────────────────────────────────────────────────────

export const FullCampaignSchema = z.object({
  id: z.string(),
  generatedAt: z.string(),
  input: CampaignInputSchema,
  research: ResearchOutputSchema,
  strategy: StrategyOutputSchema,
  copy: CopyOutputSchema,
  channelPlan: ChannelPlanOutputSchema,
  review: ReviewOutputSchema,
  exportPackage: z.object({
    meta: MetaAdSchema,
    tiktok: TikTokAdSchema,
    campaignJson: z.string(),
  }),
});

export type FullCampaign = z.infer<typeof FullCampaignSchema>;

// ─── Legacy: simple 3-agent result (CLI / old API endpoint) ───────────────────

export const CampaignResultSchema = z.object({
  product: z.string(),
  audience: z.string(),
  generatedAt: z.string(),
  research: ResearchOutputSchema,
  copy: CopyOutputSchema,
  review: ReviewOutputSchema,
});

export type CampaignResult = z.infer<typeof CampaignResultSchema>;
