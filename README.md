# AI Marketing Agent

A multi-agent AI pipeline that generates research-backed marketing campaigns using LangChain and OpenAI.

---

## How It Works

```
Input (product + audience)
        │
        ▼
┌─────────────────┐
│  Research Agent │  ──► market insights (audience, pain points,
│  gpt-4o-mini    │       competitors, positioning, key insights)
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Copy Agent    │  ──► full copy package (headline, body, email,
│  gpt-4o-mini    │       platform ad variants for Google/Meta/LinkedIn)
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Review Agent   │  ──► scores (clarity, persuasiveness, audience
│  gpt-4o-mini    │       alignment) + improvements + revised headline
└─────────────────┘
        │
        ▼
Output (JSON + Markdown files in output/)
```

Each agent uses `withStructuredOutput()` with a Zod schema to guarantee typed, validated responses — no post-processing hacks.

---

## Features

- **3-agent pipeline**: Research → Copy → Review, each with a focused system prompt
- **Structured outputs**: Every agent response is validated against a Zod schema via LangChain
- **Platform-specific ad copy**: Google (90 chars), Meta (125 chars), LinkedIn (150 chars)
- **Scored review**: Clarity, persuasiveness, and audience alignment scored 1–10 with actionable feedback
- **Dual file output**: JSON (for programmatic use) and Markdown (for human reading)
- **CLI interface**: Run campaigns from the terminal with `npm run generate`
- **REST API**: Express server for integrating into other apps
- **Past campaign browser**: `GET /api/campaigns` returns all previously generated campaigns

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Type-safe development |
| LangChain (`@langchain/core`, `@langchain/openai`) | Agent orchestration and chain composition |
| OpenAI (`gpt-4o-mini`) | Language model for all three agents |
| Zod | Schema definition and structured output validation |
| Commander | CLI argument parsing |
| Express | HTTP API server |
| dotenv | Environment variable management |

---

## Example Output

Below is a sample Markdown report generated for a fictional product.

---

### AI Campaign Report: FocusFlow Pro

**Generated:** 4/27/2026, 10:14:32 AM
**Target Audience:** Remote workers who struggle with home office distractions

---

#### Research Insights

**Target Audience Profile**
Remote knowledge workers aged 25–40, primarily in tech and creative fields, who work from home full-time. They share a home office with family members or roommates, struggle to maintain deep focus during video calls, and feel guilty about their declining productivity.

**Pain Points**
- Constant interruptions from household members destroy flow state
- Background noise bleeds into video calls, causing professional embarrassment
- Context-switching between tasks adds mental fatigue throughout the day
- Existing solutions (headphones, white noise) only partially solve the problem

**Competitors**
- Bose QuietComfort 45
- Sony WH-1000XM5
- Apple AirPods Pro
- Jabra Evolve2 85

**Market Positioning**
FocusFlow Pro is not just noise cancellation — it's a productivity tool engineered specifically for remote work, combining hardware ANC with an AI soundscape layer that adapts to your work mode.

**Key Insights**
- Remote workers don't buy headphones, they buy back their concentration
- Professional credibility on video calls is an underserved emotional driver
- "Deep work" language resonates strongly with this audience
- Price sensitivity is low when the ROI is framed as hours of productivity recovered

---

#### Ad Copy

##### Headline
**Your home office just got a focus upgrade.**

##### Subheadline
FocusFlow Pro blocks distractions before they reach your ears — so you can stay in flow, no matter what's happening around you.

##### Body Text
Remote work is great until the dog barks mid-Zoom or your partner starts a call in the next room. FocusFlow Pro combines adaptive active noise cancellation with AI-tuned soundscapes that respond to your work mode. The result: fewer interruptions, deeper focus, and calls where you sound like you're in a professional studio — every time.

##### Call to Action
> Reclaim your focus — try FocusFlow Pro risk-free for 30 days

##### Platform Ad Variants

###### Google Ads
> Block distractions. Stay in flow. FocusFlow Pro ANC headphones.

*60 characters*

###### Meta Ads
> Your home is full of distractions. FocusFlow Pro eliminates them so you can actually get work done.

*99 characters*

###### LinkedIn Ads
> Remote workers lose 2+ hours daily to distractions. FocusFlow Pro gives them back. Built for deep work.

*103 characters*

---

#### Review Scores

| Dimension | Score |
|-----------|-------|
| Overall | 8/10 |
| Clarity | 9/10 |
| Persuasiveness | 8/10 |
| Audience Alignment | 9/10 |

##### Strengths
- Headline immediately communicates a benefit, not a feature
- Pain point framing ("dog barks mid-Zoom") is highly specific and relatable
- LinkedIn copy uses a data point to build credibility with a professional audience
- CTA reduces purchase risk with the 30-day trial mention

##### Improvements
- Google ad could lead with the problem rather than the solution for higher CTR
- Email subject line should test a question format to boost open rates
- Body text paragraph 2 is slightly technical — simplify for a broader audience

##### Revised Headline
**Stop losing hours to interruptions. FocusFlow Pro keeps you in the zone.**

---

## Getting Started

**Prerequisites:** Node.js 18+, an OpenAI API key

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ai-marketing-agent.git
cd ai-marketing-agent

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and add your OPENAI_API_KEY

# 4. Generate your first campaign
npm run generate -- --product "Your Product" --audience "Your Audience"
```

### CLI Options

```
Usage: npm run generate -- [options]

Required:
  --product <name>        Product name
  --audience <desc>       Target audience description

Optional:
  --no-save               Skip saving output files
  --verbose               Print full JSON result to console
  -V, --version           Display version number
  -h, --help              Display help
```

**Example:**
```bash
npm run generate -- --product "Wireless Earbuds" --audience "Gen Z fitness enthusiasts"
```

---

## API Usage

Start the server:
```bash
npm run api
# Server running at http://localhost:3000
```

### POST /api/generate

Generate a campaign and save it to disk.

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"product": "Wireless Earbuds", "audience": "Gen Z fitness enthusiasts"}'
```

**Response:** Full `CampaignResult` JSON object.

**Error responses:**
- `400` — missing or invalid `product` / `audience` fields
- `500` — pipeline failure (check server logs for which agent failed)

### GET /api/health

```bash
curl http://localhost:3000/api/health
# {"status":"ok","timestamp":"2026-04-27T10:00:00.000Z"}
```

### GET /api/campaigns

Returns an array of all previously generated campaigns from the `output/` directory.

```bash
curl http://localhost:3000/api/campaigns
```

---

## Project Structure

```
ai-marketing-agent/
├── src/
│   ├── agents/
│   │   ├── research.agent.ts   # Market research agent
│   │   ├── copy.agent.ts       # Copywriting agent
│   │   └── review.agent.ts     # Copy review & scoring agent
│   ├── api/
│   │   └── server.ts           # Express HTTP API
│   ├── chains/                 # LangChain chain definitions (extensible)
│   ├── cli/
│   │   └── index.ts            # Commander CLI entry point
│   ├── prompts/                # Prompt templates (extensible)
│   ├── schemas/
│   │   └── campaign.schemas.ts # Zod schemas for all structured outputs
│   ├── utils/
│   │   └── saveOutput.ts       # File saving utility (JSON + Markdown)
│   └── pipeline.ts             # Pipeline orchestrator
├── output/                     # Generated campaigns (gitignored)
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```
