# YQN Pay — AI Marketing Factory

A Proof of Concept that turns a single business update into fully localized, ready-to-post marketing content for the Moroccan market — automatically.

You type one sentence like *"YQN Pay now allows merchants to withdraw cash instantly from any local agency with zero fees"* and the system produces:
- Localized ad copy in French and Moroccan Darija
- High-fidelity app screen mockups (merchant + consumer)
- Voiceover audio files in both languages
- Finished video ads (Facebook/WhatsApp format + TikTok/Reels format)
- Distribution-ready drafts with targeting profiles
- A weekly R&D comparison report

All from a single API call.

---

## How It Works (Simple Version)

```
 Business Update (one sentence)
          │
          ▼
   ┌──────────────┐
   │  AI "Brain"  │   Groq LLM (Llama 3.3 70B)
   │ Localization │   Splits input into 2 campaigns:
   │    Agent     │   Merchant (French + Darija)
   └──────┬───────┘   Consumer (pure Darija)
          │
    ┌─────┴─────┐
    ▼           ▼
 Merchant   Consumer
 Campaign   Campaign
    │           │
    ├── UI mockup (Playwright screenshot of HTML template)
    ├── Voice audio (gTTS: French for merchant, Arabic for consumer)
    ├── Video (FFmpeg: background clip + UI overlay + audio)
    └── Distribution draft (captions, hashtags, targeting, channel routing)
```

Think of it as an assembly line: the AI writes the marketing copy, then the system automatically builds every asset a social media manager would need — in the right language, for the right platform, for the right audience.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| API Server | **FastAPI** (Python) | Fast, type-safe, auto-generates API docs |
| AI / LLM | **Groq** running **Llama 3.3 70B** | Free-tier friendly, fast inference, strong multilingual output |
| UI Mockups | **Playwright** + **Jinja2** HTML templates | Renders pixel-perfect app screens as PNG screenshots |
| Voice / TTS | **gTTS** (Google Text-to-Speech) | Zero-cost prototype voice generation |
| Video Compositing | **FFmpeg** | Combines background clip + UI overlay + audio into finished video |
| Validation | **Pydantic** | Enforces data shape at every pipeline stage |
| Orchestration | **n8n** | Visual workflow engine connecting all API endpoints |

---

## Project Structure

```
yqp-pay-poc/
│
├── api/
│   ├── app.py                  ← FastAPI app with all endpoints
│   ├── schemas/
│   │   ├── campaign.py         ← Pydantic models for campaign data
│   │   └── ui_payload.py       ← Pydantic model for UI template data
│   ├── services/
│   │   ├── llm_service.py      ← Groq LLM client (the "brain")
│   │   ├── localization.py     ← Prompt engineering + JSON normalization
│   │   ├── ui_payload_service.py ← Maps campaign data to UI templates
│   │   ├── render_service.py   ← Playwright HTML-to-PNG renderer
│   │   ├── voice_service.py    ← Text-to-speech audio generation
│   │   ├── video_service.py    ← FFmpeg video compositing
│   │   ├── distribution_service.py ← Channel routing + draft builder
│   │   ├── rd_agent_service.py ← Weekly R&D comparison agent
│   │   ├── file_service.py     ← JSON save/load utilities
│   │   └── targeting.py        ← (reserved for targeting agent)
│   └── prompts/                ← (reserved for external prompt files)
│
├── assets/
│   ├── bg_clips/               ← Background video loops for compositing
│   │   ├── merchant_bg.mp4
│   │   └── consumer_bg.mp4
│   └── ui/
│       ├── merchant/           ← HTML + CSS template (1200×1200 square)
│       └── consumer/           ← HTML + CSS template (1080×1920 vertical)
│
├── outputs/
│   ├── json/                   ← Saved campaign JSON files
│   ├── rendered_ui/            ← PNG screenshots of app mockups
│   ├── audio/                  ← Generated voiceover MP3 files
│   ├── final_videos/           ← Finished MP4 video ads
│   └── logs/                   ← (reserved for pipeline logs)
│
├── n8n/                        ← (reserved for n8n workflow exports)
├── .env                        ← API keys (not committed)
└── requirements.txt
```

---

## API Endpoints

| Endpoint | What It Does |
|---|---|
| `POST /generate-campaign` | Takes a business update → returns localized merchant + consumer campaign JSON |
| `POST /render-ui-from-latest-campaign` | Renders app mockup PNGs from the most recent campaign |
| `POST /generate-voice-from-latest-campaign` | Generates voiceover MP3s from the most recent campaign |
| `POST /generate-video-from-latest-campaign` | Full pipeline: UI render + voice + video compositing |
| `POST /generate-distribution-drafts-from-latest-campaign` | Full pipeline + channel routing drafts |
| `POST /generate-full-campaign-assets` | **One-shot**: campaign → UI → voice → video → distribution |
| `GET /rd-agent-report` | Returns the weekly R&D comparison report |

---

## n8n Workflow Orchestration

The full pipeline is orchestrated through an n8n workflow that connects all services end-to-end:

```
Webhook (trigger) → Edit Fields → HTTP Request (Campaign API) → Extract Outputs → Append row in Google Sheet
```

The workflow:
1. Receives a business update via webhook trigger
2. Passes it to the FastAPI `/generate-full-campaign-assets` endpoint
3. The API runs the full pipeline: localization → UI render → voice → video → distribution
4. The Set node extracts all output fields (video paths, audio paths, headlines, targeting, distribution status)
5. Appends a complete row to a Google Sheet with every asset path, campaign detail, and R&D recommendation

The R&D agent (`GET /rd-agent-report`) is an LLM-powered endpoint that generates a fresh comparison report each time it is called. It evaluates the current stack (FFmpeg + gTTS) against candidate models (Google Veo, Kling 3.0, ElevenLabs) and produces a recommendation with cost analysis. The n8n workflow calls this endpoint and logs the R&D recommendation alongside the campaign data in the Google Sheet.

Sample n8n output row (one workflow execution):

| Field | Value |
|---|---|
| merchant_video | `outputs/final_videos/merchant_video_20260324_165358.mp4` |
| consumer_video | `outputs/final_videos/consumer_video_20260324_165403.mp4` |
| merchant_headline | Nouvelles Opportunités pour les PME Marocaines |
| consumer_headline | اخبار سوق المغرب |
| merchant_channels | Facebook Group posting agent \| WhatsApp Business template |
| consumer_channels | TikTok/Instagram Reels draft agent |
| distribution_status | distribution_drafts_created |
| rd_recommendation | Upgrade voice layer first, keep current video pipeline |
| rd_voice_model | ElevenLabs Moroccan Darija voice |

---

## Weekly R&D Agent

The R&D agent is not a static report — it is an LLM-powered agent that reasons about our current stack vs. newer AI models every time it runs.

When you call `GET /rd-agent-report`, the agent:
1. Feeds the current stack details (FFmpeg, gTTS, their costs and weaknesses) to the LLM
2. Feeds the candidate models (Google Veo, Kling 3.0, Luma Dream Machine, ElevenLabs) with their costs and capabilities
3. Asks the LLM to compare them across Darija naturalness, lip-sync quality, cost at 100 videos/day, and automation reliability
4. Returns a structured recommendation with a "Video A vs Video B" narrative for non-technical stakeholders

The candidate model list is maintained in `rd_agent_service.py`. In production, this list would be updated automatically from API changelogs and model release feeds.

Sample R&D output (generated fresh by AI each time):
```json
{
  "comparison": {
    "darija_naturalness": "ElevenLabs significantly outperforms gTTS for Darija...",
    "cost_at_100_videos_per_day": "Current stack: $0/day. Candidate: ~$15-20/day..."
  },
  "recommendation": {
    "voice_model": "ElevenLabs Moroccan Darija voice",
    "video_model": "Keep FFmpeg for reliability, evaluate Veo quarterly",
    "upgrade_priority": "Voice layer first — biggest quality impact for lowest cost"
  },
  "sample_report_text": "Here is Video A (current) vs Video B (new model)..."
}
```

---

## How We Handled the Darija Nuance

Moroccan Darija is not standard Arabic. It is a spoken dialect with no single "correct" written form, heavy French loanwords, and regional variation. Most AI models default to Modern Standard Arabic (MSA) or Egyptian Arabic when asked for "Arabic" — which sounds foreign and robotic to a Moroccan audience.

Here is how we addressed this:

**1. Separate prompt strategies per persona**

The merchant campaign prompt explicitly requests *"French and Moroccan Darija"* content with a professional tone. The consumer campaign prompt explicitly requests *"pure Moroccan Darija"* with a street-smart, high-energy tone. This separation prevents the LLM from defaulting to a single generic Arabic voice.

**2. Darija-aware normalization layer**

The LLM sometimes returns headlines as nested objects (`{"fr": "...", "darija": "..."}`) and sometimes as flat strings. The `localization.py` normalization layer handles both cases gracefully — extracting the Darija-specific text for consumer content and building a bilingual format for merchant content. This ensures the pipeline never breaks regardless of how the LLM structures its response.

**3. Voice generation language routing**

The voice service uses `lang="fr"` for merchant voiceovers (French-primary audience on Facebook/WhatsApp) and `lang="ar"` for consumer voiceovers (Darija-primary audience on TikTok/Reels). While gTTS does not have a dedicated Darija voice model, using the Arabic setting produces more natural output for Darija-written scripts than using French TTS. The R&D agent recommends upgrading to ElevenLabs' Moroccan Darija voice profile for production.

**4. Tone enforcement through prompt design**

The merchant prompt enforces a *"professional, trust-based"* tone suitable for business owners on Facebook/WhatsApp. The consumer prompt enforces a *"high-energy, street-smart"* tone suitable for young consumers on TikTok. This distinction is critical because the same business update needs to feel completely different depending on who reads it.

**What we would improve in production:**
- Use ElevenLabs with a real Moroccan Darija voice profile for authentic-sounding audio
- Add a Darija spell-check or human review step, since LLMs can produce "MSA-flavored" Darija
- Include Darija transliteration (Latin script) for WhatsApp messages, where many Moroccans type Darija in Latin letters

---

## How the System Scales to 100 Videos a Day

The current POC runs sequentially — one campaign at a time. To scale to 100 videos per day, the architecture is designed to be parallelized at every stage:

**1. Stateless API design**

Every endpoint is stateless. The only shared state is the `outputs/` folder. This means you can run multiple instances of the API behind a load balancer without any code changes.

**2. Each pipeline stage is independent**

The pipeline is split into discrete services: `localization → UI render → voice → video → distribution`. Each service takes input and produces output with no side effects. This means:
- 10 campaigns can generate localized copy in parallel (LLM calls)
- 10 UI renders can run simultaneously (Playwright instances)
- 10 FFmpeg processes can composite videos at the same time
- A job queue (like Celery, BullMQ, or n8n) can orchestrate all of this

**3. Groq LLM is fast enough for batch generation**

Groq's inference speed (Llama 3.3 70B) returns campaign copy in 2–4 seconds per call. At 100 campaigns per day, total LLM time is under 7 minutes — well within any rate limit.

**4. FFmpeg scales linearly**

Video compositing with FFmpeg takes ~5–10 seconds per video. 100 videos = ~15 minutes sequentially, or ~2 minutes with 10 parallel workers. No GPU required — it runs on CPU.

**5. n8n or job queue for orchestration**

In production, n8n (or a similar workflow engine) would:
- Accept a batch of business updates
- Fan out to parallel campaign generation workers
- Collect results and trigger downstream steps
- Retry failures automatically
- Log every step for auditing

**Estimated throughput at 100 videos/day:**

| Stage | Time per unit | 100 units (sequential) | 100 units (10 workers) |
|---|---|---|---|
| LLM copy generation | ~3 sec | ~5 min | ~30 sec |
| UI rendering | ~2 sec | ~3 min | ~20 sec |
| Voice generation | ~2 sec | ~3 min | ~20 sec |
| Video compositing | ~8 sec | ~13 min | ~1.5 min |
| **Total** | | **~24 min** | **~3 min** |

The bottleneck is not compute — it is API rate limits on the LLM and TTS providers. The architecture handles this by queuing and retrying.

---

## Which AI Model We Recommend for 2026 and Why

**Recommended LLM: Llama 3.3 70B via Groq (current) → upgrade path to GPT-4.1-mini or Claude Sonnet for production**

We chose Llama 3.3 70B on Groq for the POC because:
- It is free-tier accessible during development
- Groq's inference is extremely fast (~2 second response times)
- The 70B model handles French + Darija bilingual generation well
- Structured JSON output is reliable with careful prompt design

For production in 2026, we recommend evaluating:
- **GPT-4.1-mini** for better Darija accuracy and structured output reliability (best price-to-quality ratio for marketing copy)
- **Claude Sonnet 4** for tasks requiring longer, nuanced cultural copy
- Keep Groq/Llama as the cost-effective default and use a premium model only when Darija quality checks fail

**Recommended Voice Model: ElevenLabs Moroccan Darija voice**

The current gTTS is a zero-cost prototype. For production:
- ElevenLabs offers Moroccan Arabic voice profiles that sound significantly more natural
- Lip-sync potential is better with ElevenLabs output
- Cost is manageable at 100 videos/day (~$30–50/month on their Growth plan)

**Recommended Video Model: Keep FFmpeg compositing pipeline (current) + evaluate Google Veo / Kling 3.0 as premium upgrade**

The current FFmpeg pipeline is:
- Reliable and deterministic (same input = same output)
- Fast (no GPU required, runs anywhere)
- Free (no API costs)

AI video generation (Veo, Kling) is better for motion realism and lip-sync, but:
- Higher cost per video
- Less predictable output
- Throughput constraints at 100 videos/day

**Our recommendation:** Upgrade the voice layer first (biggest quality impact for lowest cost), keep the current video pipeline for reliability, and run weekly evaluations on new video models. The R&D agent endpoint (`/rd-agent-report`) is built to automate this comparison process.

---

## Setup Instructions

### Prerequisites
- Python 3.12+
- FFmpeg installed and available in PATH
- Playwright browsers installed

### 1. Clone and install

```bash
git clone <repository-url>
cd yqp-pay-poc
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
playwright install chromium
```

### 2. Configure environment

Create a `.env` file:

```
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the API server

```bash
uvicorn api.app:app --reload --port 8000
```

### 4. Generate a full campaign

```bash
curl -X POST http://localhost:8000/generate-full-campaign-assets \
  -H "Content-Type: application/json" \
  -d '{"business_update": "YQN Pay now allows merchants to withdraw cash instantly from any local agency with zero fees."}'
```

Or open `http://localhost:8000/docs` for the interactive Swagger UI.

---

## Sample Output

### Campaign JSON (excerpt)
```json
{
  "merchant": {
    "languages": ["French", "Moroccan Darija"],
    "tone": "professional, trust-based",
    "headline": "Boostez vos ventes avec nos solutions de commerce électronique pour les PME marocaines",
    "primary_script": "As-salamu alaykum, les entrepreneurs marocains ! ...",
    "hashtags": ["#CommerceÉlectronique", "#PME-Maroc", ...],
    "targeting_profile": {
      "platforms": ["Facebook", "WhatsApp"],
      "interests": ["commerce électronique", "entrepreneuriat"],
      "geo": ["Maroc", "Casablanca", "Rabat"]
    }
  },
  "consumer": {
    "languages": ["Moroccan Darija"],
    "tone": "high-energy, street-smart",
    "headline": "خبار سوق المغرب!",
    "primary_script": "يا شباب، يا بنات! لقد جاء وقت للتغيير! ...",
    "targeting_profile": {
      "platforms": ["TikTok", "Instagram Reels"],
      "geo": ["المغرب"]
    }
  }
}
```

### Generated App Mockups

The system renders high-fidelity YQN Pay app screens using HTML/CSS templates and Playwright:
- **Merchant mockup** (1200×1200, square format for Facebook/WhatsApp)
- **Consumer mockup** (1080×1920, vertical format for TikTok/Reels)

Both mockups show a realistic "Withdrawal Success" screen localized for Morocco, displaying MAD currency and localized copy.

---

## Why We Chose Free Alternatives Over the Paid Spec

The assessment spec lists a paid tech stack: Google Stitch, Kling 3.0/Veo, ElevenLabs, Meta Graph API, WhatsApp Cloud API. **Every one of these is a paid service.** For a 4–5 hour POC, we deliberately chose zero-cost alternatives that demonstrate the same architecture and can be swapped to the paid versions with minimal code changes.

Here is the exact mapping:

| Assessment Spec (Paid) | What We Used (Free) | Why |
|---|---|---|
| Google Stitch | Google Stitch for **template design only** → Playwright + Jinja2 for rendering | Stitch generated the initial HTML/CSS mockups; Playwright makes them dynamic and automatable (see below) |
| Kling 3.0 / Google Veo | FFmpeg compositing | Deterministic, zero cost, no GPU, no API rate limits |
| ElevenLabs Darija voice | gTTS (Google Text-to-Speech) | Free, no API key required, good enough to prove the pipeline works |
| Meta Graph API | Distribution draft builder (JSON output) | Drafts are routed and structured for Facebook/WhatsApp, ready to plug into the real API |
| WhatsApp Cloud API | Distribution draft builder (JSON output) | Same — structured output ready for real API integration |
| n8n / Make.com | FastAPI endpoints (sequential orchestration) | Each endpoint is a pipeline stage; n8n can call them in sequence or parallel |

**The architecture is the same.** Every paid service maps to a single file in `api/services/`. Upgrading to ElevenLabs means changing `voice_service.py`. Upgrading to Veo means changing `video_service.py`. The rest of the pipeline does not change.

This was an intentional decision: prove the system design works end-to-end at zero cost, then upgrade individual layers when budget allows.

---

## How the UI Mockups Were Built (Google Stitch → Playwright Pipeline)

The assessment asks for Google Stitch to generate UI mockups. Here is exactly how we used it:

**Step 1: Template design with Google Stitch**

We used the Google Stitch MCP (Model Context Protocol) integration inside our code editor to generate high-fidelity HTML/CSS templates that look like real YQN Pay app screens. Google Cloud billing was enabled using the $300 free credit to access Stitch.

Stitch generated two templates:
- **Merchant template** (`assets/ui/merchant/`) — a 1200×1200 square layout mimicking a fintech merchant dashboard, designed for Facebook/WhatsApp ad format
- **Consumer template** (`assets/ui/consumer/`) — a 1080×1920 vertical layout mimicking a mobile payment app, designed for TikTok/Instagram Reels format

Both templates use Moroccan-market-specific design: MAD currency labels, Moroccan avatar names (Amina, Karim, Sara), Arabic-script headlines, and YQN Pay branding.

**Step 2: Dynamic rendering with Jinja2 + Playwright**

The static Stitch templates were converted into Jinja2 templates with `{{ placeholder }}` variables. Now, when a new campaign is generated, the system:
1. Takes the LLM-generated campaign copy (headlines, scripts, CTAs)
2. Injects it into the HTML template using Jinja2
3. Opens the HTML in a headless Chromium browser via Playwright
4. Takes a pixel-perfect screenshot as a PNG
5. Uses that PNG as the visual overlay in the final video

This means **every campaign gets a unique, dynamically generated app screen** — not a static image. The Stitch-designed template is the visual foundation; Jinja2 + Playwright make it automated and scalable.

---

## Design Decisions

**Architecture decisions:**
- **Separate services, not one monolith** — Each pipeline stage is a standalone function. This makes testing, debugging, and parallelization straightforward.
- **Pydantic schemas at every boundary** — Every data handoff between services is validated. If the LLM returns unexpected JSON, the normalization layer catches it before it breaks downstream.
- **LLM-agnostic design** — The AI logic lives in one file (`llm_service.py`). Switching from Groq to OpenAI or Anthropic means changing one file, not rewriting the pipeline.

**Cost-conscious decisions:**
- **Python over Node.js** — Groq SDK, gTTS, and Playwright all have mature Python support. FastAPI gives us type safety and auto-generated docs. All dependencies are free and open-source.
- **Groq (free tier) over OpenAI (paid)** — Groq offers free-tier access to Llama 3.3 70B with sub-2-second inference. This let us build and iterate without any API costs.
- **gTTS (free) over ElevenLabs (paid)** — gTTS produces acceptable prototype-quality voice output at zero cost. The code is structured so swapping to ElevenLabs is a single-file change.
- **FFmpeg (free) over Kling/Veo (paid)** — Deterministic output, no GPU needed, no API rate limits. AI video generation adds cost and unpredictability that is unnecessary for a POC.
- **Google Stitch (free $300 credit) for design, Playwright (free) for rendering** — We used Stitch to design the templates once, then Playwright automates screenshot generation indefinitely at zero ongoing cost.
- **Distribution drafts (free) over live Meta/WhatsApp API calls (paid + requires business verification)** — The distribution service generates fully structured, ready-to-send drafts. Plugging into the real APIs is a deployment step, not an architecture change.

**Total cost to build and run this POC: $0.**

---

## What Would Change in Production

- Replace gTTS with ElevenLabs Moroccan Darija voice (single-file swap in `voice_service.py`)
- Replace FFmpeg compositing with Kling 3.0 or Google Veo for motion-realistic video (single-file swap in `video_service.py`)
- Connect distribution drafts to live Meta Graph API and WhatsApp Cloud API
- Add n8n workflow orchestration for batch processing and visual monitoring
- Add Celery/Redis job queue for parallel video generation
- Add Darija quality scoring (human-in-the-loop or LLM-based review)
- Add cost tracking per campaign
- Add authentication and rate limiting on the API
- Containerize with Docker for cloud deployment
