# AI Campaign Studio

> A production-grade, multi-agent AI system that generates complete, export-ready marketing campaigns from a single brief.

Originally prototyped with a workflow automation tool, then refactored into a custom TypeScript orchestration engine for better ownership, portability, and scalability.

---

## What It Does

You enter a brand name, product description, target audience, and campaign settings. Five AI agents work in sequence to produce a full marketing campaign:

Each agent uses `withStructuredOutput()` with a Zod schema to guarantee typed, validated responses, no post-processing hacks.

- Research report (market positioning, persona, competitor gaps)
- Campaign strategy (core message, funnel, messaging angles)
- Ad copy (headlines, email, social posts, platform variants)
- Platform packages (Meta Ads + TikTok Ads, export-ready)
- Quality review (scored on clarity, persuasion, and audience alignment)

Everything is returned as structured JSON and displayed in a clean SaaS dashboard.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Campaign Studio                        │
│                   (Next.js + Tailwind)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │ POST /api/campaigns/generate
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Express API  (TypeScript / Node.js)             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│           Custom TypeScript Orchestrator                     │
│         (replaces the original n8n workflow)                 │
│                                                              │
│  1. Research Agent  ──►  Market, audience, competitors       │
│       │                                                      │
│       ▼                                                      │
│  2. Strategy Agent  ──►  Positioning, persona, funnel        │
│       │                                                      │
│       ▼                                                      │
│  3. Copy Agent      ──►  Headlines, email, ad variants       │
│       │                                                      │
│       ▼                                                      │
│  4. Channel Agent   ──►  Meta Ads + TikTok packages         │
│       │                                                      │
│       ▼                                                      │
│  5. Review Agent    ──►  Scores, strengths, improvements     │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
              FullCampaign JSON  +  Export Package
              (Meta-ready  ·  TikTok-ready  ·  Full JSON)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 · React 18 · Tailwind CSS |
| Backend | Node.js · Express 5 · TypeScript |
| AI / LLM | LangChain · Gemini 2.5 Flash via Google AI API (Grok/xAI supported as fallback) |
| Validation | Zod (all agent inputs and outputs) |
| CLI | Commander.js |
| Output | Structured JSON · Markdown reports |

---

## How It Works

### 1. Research Agent
Takes the brand brief and runs a deep market analysis. Output: audience profile, pain points, desires, competitor mapping, market opportunity, and key insights. Temperature: 0.3 (analytical).

### 2. Strategy Agent
Takes the research and builds campaign strategy. Output: core message, unique value proposition, positioning statement, messaging angles, funnel strategy (awareness → consideration → conversion), and a detailed customer persona. Temperature: 0.6 (strategic + creative).

### 3. Copy Agent
Takes the strategy and writes all copy assets. Output: headline, subheadline, body text, CTA, email (subject + body), social post ideas, and platform-specific ad variants with character counts enforced per platform (Google 90, Meta 125, TikTok 100, LinkedIn 150). Temperature: 0.7 (creative).

### 4. Channel Planning Agent
Takes everything above and builds export-ready ad packages. Output: Meta Ads package (creative brief, audience targeting, placements, budget), TikTok Ads package (hook, video script, on-screen text, sound strategy), 4-week content calendar, budget breakdown, and KPIs. Temperature: 0.5 (balanced).

### 5. Review Agent
Takes the copy and evaluates it. Output: scores (1–10) for clarity, persuasiveness, and audience alignment, with specific strengths, improvement suggestions, and a revised headline. Temperature: 0.3 (critical).

---

## Export Campaign Package

Since direct API publishing to Meta and TikTok is not implemented in this version, the system produces **export-ready packages** you can manually upload into Ads Manager:

- `{brand}-meta-ads.json`: Facebook + Instagram creative brief
- `{brand}-tiktok-ads.json`: TikTok Ads Manager structure
- `{brand}-campaign.json`: Full campaign JSON

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
FocusFlow Pro is not just noise cancellation, it's a productivity tool engineered specifically for remote work, combining hardware ANC with an AI soundscape layer that adapts to your work mode.

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
FocusFlow Pro blocks distractions before they reach your ears, so you can stay in flow, no matter what's happening around you.

##### Body Text
Remote work is great until the dog barks mid-Zoom or your partner starts a call in the next room. FocusFlow Pro combines adaptive active noise cancellation with AI-tuned soundscapes that respond to your work mode. The result: fewer interruptions, deeper focus, and calls where you sound like you're in a professional studio every time.

##### Call to Action
> Reclaim your focus, try FocusFlow Pro risk-free for 30 days

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
- Body text paragraph 2 is slightly technical, simplify for a broader audience

##### Revised Headline
**Stop losing hours to interruptions. FocusFlow Pro keeps you in the zone.**
=======
Each package includes audience targeting parameters, creative copy, budget recommendations, and estimated reach.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Gemini API key (Google AI Studio) or a Grok/xAI API key as alternative

### 1. Clone and install backend
```bash
git clone <repo>
cd ai-campaign-factory
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
```

### 2. Start the API
```bash
npm run api
# Runs on http://localhost:3001
```

### 3. Install and start the frontend
```bash
npm run frontend:install
npm run frontend
# Runs on http://localhost:3002
```

Open [http://localhost:3002](http://localhost:3002) to use the studio.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Primary provider (Gemini)
GEMINI_API_KEY=your-gemini-api-key
AI_PROVIDER=gemini
MODEL_NAME=gemini-2.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/

# Alternative provider (Grok/xAI)
# AI_PROVIDER=grok
# GROK_API_KEY=xai-...
# GROK_BASE_URL=https://api.x.ai/v1

PORT=3001
CORS_ORIGIN=http://localhost:3002
NEXT_PUBLIC_API_URL=http://localhost:3001

# Future integrations (not yet implemented)
ELEVENLABS_API_KEY=
META_GRAPH_API_KEY=
WHATSAPP_CLOUD_API_KEY=
KLING_API_KEY=
```

The `src/config/env.ts` module auto-detects the provider and selects the correct API key and base URL.

---

## API Reference

### POST /api/campaigns/generate

Generate a full campaign using the 5-agent orchestrator.

**Request body:**
```json
{
  "brandName": "Lumiere",
  "productDescription": "A luxury anti-aging serum...",
  "industry": "Beauty & Skincare",
  "objective": "sales_conversion",
  "targetAudience": "Women aged 35-55...",
  "region": "United States",
  "tone": "luxury",
  "platforms": ["meta_ads", "instagram"],
  "competitors": "La Mer, SK-II",
  "budget": "$5,000/month",
  "duration": "4 weeks"
}
```

**Valid objectives:** `brand_awareness` · `lead_generation` · `sales_conversion` · `app_installs` · `engagement` · `retargeting`

**Valid tones:** `professional` · `playful` · `luxury` · `urgent` · `inspirational` · `educational`

**Valid platforms:** `meta_ads` · `instagram` · `facebook` · `tiktok` · `linkedin`

**Response:** `FullCampaign` object (see `src/schemas/campaign.schemas.ts`)

---

### GET /api/campaigns
Returns all saved full campaigns from `output/full/`.

### GET /api/health
Returns `{ status: "ok", timestamp }`.

### POST /api/generate *(legacy)*
Simplified 3-field interface. Body: `{ product, audience }`. Returns `CampaignResult`.

### GET /api/campaigns/legacy *(legacy)*
Returns all campaigns saved via the legacy pipeline from `output/`.

---

## CLI Usage

```bash
npm run generate -- --product "Lumiere Serum" --audience "Women 35-55, luxury beauty enthusiasts"

# Options
--no-save    Skip saving output to disk
--verbose    Print full JSON to console
```

---

## Project Structure

```
ai-campaign-factory/
├── src/
│   ├── agents/
│   │   ├── research.agent.ts        # Agent 1: market research
│   │   ├── strategy.agent.ts        # Agent 2: campaign strategy
│   │   ├── copy.agent.ts            # Agent 3: copywriting
│   │   ├── channelPlanning.agent.ts # Agent 4: Meta + TikTok packages
│   │   ├── review.agent.ts          # Agent 5: quality review
│   │   └── localizationAgent.ts     # Morocco market localization (French + Darija)
│   ├── orchestrator/
│   │   └── campaignOrchestrator.ts  # Custom orchestrator (replaces n8n)
│   ├── schemas/
│   │   └── campaign.schemas.ts      # Zod schemas for all agent I/O
│   ├── api/
│   │   └── server.ts                # Express API
│   ├── cli/
│   │   └── index.ts                 # Commander CLI
│   ├── utils/
│   │   └── saveOutput.ts            # JSON + Markdown file output
│   ├── services/
│   │   ├── distributionService.ts   # Distribution integrations (WIP)
│   │   ├── elevenLabsService.ts     # ElevenLabs voice (WIP)
│   │   ├── klingService.ts          # Kling video (WIP)
│   │   └── stitchService.ts         # Video stitch (WIP)
│   ├── config/
│   │   ├── env.ts                   # Environment variable loader + provider detection
│   │   └── llm.ts                   # LangChain ChatOpenAI model factory
│   ├── index.ts                     # Entry point (localizationAgent demo)
│   └── pipeline.ts                  # Legacy 3-agent wrapper
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Studio main page
│   │   └── globals.css
│   ├── components/
│   │   ├── CampaignForm.tsx         # Input form + 4 demo presets
│   │   ├── PipelineProgress.tsx     # Live stage indicator
│   │   ├── CampaignDashboard.tsx    # 10-tab result dashboard
│   │   └── ExportSection.tsx        # Export JSON + download
│   └── lib/
│       ├── types.ts                 # Shared TypeScript types
│       ├── api.ts                   # API client
│       └── presets.ts               # Demo presets
├── api/                             # Python FastAPI (media gen, separate stack)
│   ├── app.py
│   ├── schemas/
│   ├── prompts/
│   └── services/
└── outputs/                         # Generated campaign files (gitignored)
```

---

## Demo Presets

| Preset | Industry | Objective | Tone |
|---|---|---|---|
| Lumiere (Luxury Skincare) | Beauty | Sales Conversion | Luxury |
| FitFlow AI (Fitness App) | Health & Fitness | App Installs | Inspirational |
| Altitude Roast (Coffee) | Food & Beverage | Lead Generation | Professional |
| Taskflow AI (SaaS) | Productivity | Lead Generation | Professional |

---

## Why I Built This

I wanted to build something that demonstrates the full stack of modern AI engineering: not just calling an LLM, but designing a multi-agent system with structured outputs, schema validation, sequential orchestration, a real API, and a production-quality UI.

The specific challenge I set myself: can a system turn a one-paragraph product brief into a campaign brief that a real media buyer could act on immediately?

The answer, after building this, is mostly yes. The gaps (real API publishing, budget optimization via real ad data) are well-defined engineering problems, not fundamental blockers.

---

## Future Improvements

- **Real Meta Ads API publishing**: Use the Meta Marketing API to push campaigns directly into Ads Manager. The export package structure is already aligned with the API's creative brief format.
- **TikTok Ads Manager API**: TikTok's marketing API supports the same campaign > ad group > ad creative hierarchy the output currently produces.
- **Streaming pipeline stages**: Use Server-Sent Events to push real stage updates from the orchestrator to the frontend in real time instead of the current client-side simulation.
- **Campaign history and editing**: Persist campaigns to a database and allow users to iterate on specific sections without regenerating everything.
- **RAG for competitive intelligence**: Ground the Research Agent in real-time web search results rather than relying solely on the model's training data.
- **Multi-language support**: Extend the localization agent (already built for Moroccan French + Darija) to additional markets.
- **Media generation**: Wire up the ElevenLabs, Kling, and video stitch services already scaffolded in `src/services/`.

---

## Resume Bullets

- Built a production-grade multi-agent AI system orchestrating 5 specialized LangChain agents (Research, Strategy, Copy, Channel Planning, Review) in a custom TypeScript pipeline, replacing a workflow automation dependency with a portable, type-safe orchestration engine
- Designed a schema-first architecture using Zod for end-to-end type safety across all LLM structured outputs, eliminating untyped JSON throughout the pipeline
- Built a full-stack SaaS application (Next.js 14 + Tailwind + Express) featuring campaign generation, a 10-section result dashboard, and export-ready Meta/TikTok ad packages downloadable as JSON
- Implemented platform-aware copywriting with enforced character limits (Google 90, Meta 125, TikTok 100) validated by the LLM at generation time, ensuring compliance with ad platform requirements

---

## Deployment

### AWS EC2 with Nginx + PM2

This project runs as two Node processes behind Nginx:

- Backend Express API: `http://127.0.0.1:3001`
- Frontend Next.js app: `http://127.0.0.1:3002`

Install dependencies and build both apps on the EC2 instance:

```bash
npm ci
npm run build

cd frontend
npm ci
npm run build
cd ..
```

Create a production `.env` in the project root:

```bash
GEMINI_API_KEY=your-gemini-api-key
AI_PROVIDER=gemini
MODEL_NAME=gemini-2.5-flash
PORT=3001
CORS_ORIGIN=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
```

Start the backend and frontend with PM2:

```bash
pm2 start npm --name ai-campaign-api -- start
pm2 start npm --name ai-campaign-frontend --prefix frontend -- start
pm2 save
pm2 startup
```

Example Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After enabling the site, reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Frontend (Next.js)
For a separate frontend host such as Vercel or Netlify, build from the `frontend/` folder:

```bash
cd frontend
npm run build
```

Set `NEXT_PUBLIC_API_URL` to the deployed backend URL and set backend `CORS_ORIGIN` to the frontend URL.

---

## License

ISC. See [LICENSE.txt](LICENSE.txt)
