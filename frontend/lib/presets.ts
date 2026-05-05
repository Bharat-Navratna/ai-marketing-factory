import type { CampaignInput } from "./types";

export interface Preset {
  label: string;
  emoji: string;
  description: string;
  input: CampaignInput;
}

export const PRESETS: Preset[] = [
  {
    label: "Luxury Skincare",
    emoji: "✨",
    description: "Premium anti-aging serum",
    input: {
      brandName: "Lumière",
      productDescription:
        "A luxury anti-aging serum with gold microparticles and retinol complex that visibly reduces wrinkles in 28 days. Priced at $180 per bottle.",
      industry: "Beauty & Skincare",
      objective: "sales_conversion",
      targetAudience:
        "Women aged 35-55, disposable income $80k+, interested in premium beauty, sustainability, and self-care rituals",
      region: "United States",
      tone: "luxury",
      platforms: ["meta_ads", "instagram"],
      competitors: "La Mer, SK-II, SkinCeuticals",
      budget: "$5,000/month",
      duration: "4 weeks",
    },
  },
  {
    label: "Fitness App",
    emoji: "💪",
    description: "AI-powered workout planner",
    input: {
      brandName: "FitFlow AI",
      productDescription:
        "An AI-powered fitness app that creates personalized workout and nutrition plans that adapt weekly based on your progress. $14.99/month.",
      industry: "Health & Fitness",
      objective: "app_installs",
      targetAudience:
        "Millennials 25-40 who want to get fit but struggle with consistency, gym-goers and home workout enthusiasts",
      region: "United Kingdom",
      tone: "inspirational",
      platforms: ["tiktok", "instagram", "meta_ads"],
      competitors: "MyFitnessPal, Nike Training Club, Peloton",
      budget: "$3,000/month",
      duration: "4 weeks",
    },
  },
  {
    label: "Coffee Brand",
    emoji: "☕",
    description: "Specialty single-origin coffee",
    input: {
      brandName: "Altitude Roast",
      productDescription:
        "Specialty single-origin coffee sourced directly from Ethiopian highland farms. Subscription boxes from $32/month. Roasted to order and shipped within 24 hours.",
      industry: "Food & Beverage",
      objective: "lead_generation",
      targetAudience:
        "Coffee enthusiasts aged 28-45, WFH professionals, foodies who value quality and ethical sourcing over mass-market brands",
      region: "United States",
      tone: "professional",
      platforms: ["instagram", "facebook", "meta_ads"],
      competitors: "Blue Bottle Coffee, Stumptown, Trade Coffee",
      budget: "$2,000/month",
      duration: "6 weeks",
    },
  },
  {
    label: "SaaS Tool",
    emoji: "⚡",
    description: "AI productivity platform",
    input: {
      brandName: "Taskflow AI",
      productDescription:
        "An AI-native project management tool that auto-prioritizes tasks, writes status updates, and predicts blockers before they happen. $29/seat/month.",
      industry: "SaaS / Productivity",
      objective: "lead_generation",
      targetAudience:
        "Engineering and product managers at Series A-C startups, teams of 10-50 people drowning in Slack noise and context-switching",
      region: "Global",
      tone: "professional",
      platforms: ["linkedin", "meta_ads"],
      competitors: "Linear, Notion, Asana, Monday.com",
      budget: "$4,000/month",
      duration: "4 weeks",
    },
  },
];
