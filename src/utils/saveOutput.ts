import fs from "fs";
import path from "path";
import { CampaignResult } from "../schemas/campaign.schemas";

const OUTPUT_DIR = path.resolve(process.cwd(), "output");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function buildMarkdown(result: CampaignResult): string {
  const { product, audience, generatedAt, research, copy, review } = result;

  const platformLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);

  return `# AI Campaign Report: ${product}

**Generated:** ${new Date(generatedAt).toLocaleString()}
**Target Audience:** ${audience}

---

## Research Insights

**Target Audience Profile**
${research.targetAudience}

**Pain Points**
${research.painPoints.map((p) => `- ${p}`).join("\n")}

**Competitors**
${research.competitors.map((c) => `- ${c}`).join("\n")}

**Market Positioning**
${research.marketPositioning}

**Key Insights**
${research.keyInsights.map((i) => `- ${i}`).join("\n")}

---

## Ad Copy

### Headline
**${copy.headline}**

### Subheadline
${copy.subheadline}

### Body Text
${copy.bodyText}

### Call to Action
> ${copy.callToAction}

### Email Campaign

**Subject Line:** ${copy.emailSubjectLine}

**Email Body:**

${copy.emailBody}

### Platform Ad Variants

${copy.adVariants
  .map(
    (v) => `#### ${platformLabel(v.platform)} Ads
> ${v.copy}

*${v.characterCount} characters*`
  )
  .join("\n\n")}

---

## Review Scores

| Dimension | Score |
|-----------|-------|
| Overall | ${review.overallScore}/10 |
| Clarity | ${review.clarityScore}/10 |
| Persuasiveness | ${review.persuasivenessScore}/10 |
| Audience Alignment | ${review.audienceAlignmentScore}/10 |

### Strengths
${review.strengths.map((s) => `- ${s}`).join("\n")}

### Improvements
${review.improvements.map((i) => `- ${i}`).join("\n")}

### Revised Headline
**${review.revisedHeadline}**
`;
}

export async function saveCampaign(result: CampaignResult): Promise<void> {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const slug = slugify(result.product);
  const baseName = `${timestamp}-${slug}`;

  const jsonPath = path.join(OUTPUT_DIR, `${baseName}.json`);
  const mdPath = path.join(OUTPUT_DIR, `${baseName}.md`);

  await Promise.all([
    fs.promises.writeFile(jsonPath, JSON.stringify(result, null, 2), "utf-8"),
    fs.promises.writeFile(mdPath, buildMarkdown(result), "utf-8"),
  ]);

  console.log(`\nCampaign saved:`);
  console.log(`  JSON:     ${jsonPath}`);
  console.log(`  Markdown: ${mdPath}`);
}
