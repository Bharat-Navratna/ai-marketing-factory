export type CampaignObjective =
  | "brand_awareness"
  | "lead_generation"
  | "sales_conversion"
  | "app_installs"
  | "engagement"
  | "retargeting";

export type Tone =
  | "professional"
  | "playful"
  | "luxury"
  | "urgent"
  | "inspirational"
  | "educational";

export type Platform =
  | "meta_ads"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin";

export interface CampaignInput {
  brandName: string;
  productDescription: string;
  industry: string;
  objective: CampaignObjective;
  targetAudience: string;
  region: string;
  tone: Tone;
  platforms: Platform[];
  competitors?: string;
  budget?: string;
  duration?: string;
}

export interface AdVariant {
  platform: string;
  copy: string;
  characterCount: number;
}

export interface ResearchOutput {
  audienceProfile: string;
  painPoints: string[];
  desires: string[];
  competitors: string[];
  competitorWeaknesses: string[];
  marketOpportunity: string;
  marketPositioning: string;
  keyInsights: string[];
  targetAudience: string;
}

export interface StrategyOutput {
  coreMessage: string;
  uniqueValueProposition: string;
  positioningStatement: string;
  messagingAngles: string[];
  funnelStrategy: { awareness: string; consideration: string; conversion: string };
  customerPersona: {
    name: string;
    age: string;
    occupation: string;
    goals: string[];
    frustrations: string[];
    favoriteApps: string[];
    buyingBehavior: string;
  };
  campaignTheme: string;
  suggestedHashtags: string[];
}

export interface CopyOutput {
  headline: string;
  subheadline: string;
  bodyText: string;
  callToAction: string;
  emailSubjectLine: string;
  emailBody: string;
  socialPostIdeas: string[];
  adVariants: AdVariant[];
}

export interface MetaAd {
  campaignObjective: string;
  adFormat: string;
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
  audienceTargeting: {
    ageRange: string;
    genders: string;
    interests: string[];
    behaviors: string[];
    locations: string[];
  };
  budgetRecommendation: string;
  placementRecommendation: string;
  estimatedReach: string;
}

export interface TikTokAd {
  campaignObjective: string;
  adFormat: string;
  videoScript: string;
  hookLine: string;
  onScreenText: string;
  callToAction: string;
  audienceTargeting: {
    ageRange: string;
    interests: string[];
    behaviors: string[];
    locations: string[];
  };
  budgetRecommendation: string;
  trendingSounds: string;
  estimatedReach: string;
}

export interface ContentCalendarEntry {
  week: string;
  platform: string;
  contentType: string;
  topic: string;
  caption: string;
}

export interface ChannelPlanOutput {
  metaPackage: MetaAd;
  tiktokPackage: TikTokAd;
  contentCalendar: ContentCalendarEntry[];
  budgetBreakdown: {
    meta: string;
    tiktok: string;
    contentCreation: string;
    totalRecommended: string;
  };
  kpis: Array<{ metric: string; target: string; platform: string }>;
}

export interface ReviewOutput {
  overallScore: number;
  clarityScore: number;
  persuasivenessScore: number;
  audienceAlignmentScore: number;
  strengths: string[];
  improvements: string[];
  revisedHeadline: string;
}

export interface FullCampaign {
  id: string;
  generatedAt: string;
  input: CampaignInput;
  research: ResearchOutput;
  strategy: StrategyOutput;
  copy: CopyOutput;
  channelPlan: ChannelPlanOutput;
  review: ReviewOutput;
  exportPackage: {
    meta: MetaAd;
    tiktok: TikTokAd;
    campaignJson: string;
  };
}

export type PipelineStage =
  | "idle"
  | "research"
  | "strategy"
  | "copywriting"
  | "channel_planning"
  | "review"
  | "complete"
  | "error";
