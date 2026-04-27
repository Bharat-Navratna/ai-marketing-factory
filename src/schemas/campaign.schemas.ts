import { z } from "zod";

export const ResearchOutputSchema = z.object({
  targetAudience: z.string(),
  painPoints: z.array(z.string()),
  competitors: z.array(z.string()),
  marketPositioning: z.string(),
  keyInsights: z.array(z.string()),
});

export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;

export const AdVariantSchema = z.object({
  platform: z.enum(["google", "meta", "linkedin"]),
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
  adVariants: z.array(AdVariantSchema),
});

export type CopyOutput = z.infer<typeof CopyOutputSchema>;

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

export const CampaignResultSchema = z.object({
  product: z.string(),
  audience: z.string(),
  generatedAt: z.string(),
  research: ResearchOutputSchema,
  copy: CopyOutputSchema,
  review: ReviewOutputSchema,
});

export type CampaignResult = z.infer<typeof CampaignResultSchema>;
