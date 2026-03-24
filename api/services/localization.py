import json
import re
from api.services.llm_service import generate_text


def extract_json(text: str) -> dict:
    """
    Removes markdown code fences and extracts the first JSON object.
    """
    cleaned = text.strip()

    # Remove triple backtick fences
    cleaned = re.sub(r"^```json\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"^```\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    # Try direct parse first
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Fallback: extract first {...} block
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        return json.loads(match.group(0))

    raise ValueError("No valid JSON object found in LLM response.")


def ensure_list(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        return [value]
    return []


def normalize_targeting_profile(tp: dict, default_platforms: list) -> dict:
    tp = tp or {}

    interests = ensure_list(tp.get("interests", []))

    geo = tp.get("geo")
    if geo is None:
        geo = tp.get("location", [])
    geo = ensure_list(geo)

    audience_notes = tp.get("audience_notes", [])
    audience_notes = ensure_list(audience_notes)

    platforms = tp.get("platforms", default_platforms)
    platforms = ensure_list(platforms)

    return {
        "platforms": platforms,
        "interests": interests,
        "geo": geo,
        "audience_notes": audience_notes,
    }


def normalize_merchant_response(data: dict) -> dict:
    headline = data.get("headline", "")
    if isinstance(headline, dict):
        headline = f'FR: {headline.get("fr", "")} | Darija: {headline.get("darija", "")}'

    primary_script = data.get("primary_script", "")
    if isinstance(primary_script, dict):
        primary_script = (
            f'FR: {primary_script.get("fr", "")}\n'
            f'Darija: {primary_script.get("darija", "")}'
        )

    return {
        "languages": ["French", "Moroccan Darija"],
        "tone": "professional, trust-based",
        "headline": headline,
        "primary_script": primary_script,
        "hashtags": ensure_list(data.get("hashtags", [])),
        "targeting_profile": normalize_targeting_profile(
            data.get("targeting_profile", {}),
            ["Facebook", "WhatsApp"]
        ),
    }


def normalize_consumer_response(data: dict) -> dict:
    headline = data.get("headline", "")
    if isinstance(headline, dict):
        headline = headline.get("darija", "") or headline.get("fr", "")

    primary_script = data.get("primary_script", "")
    if isinstance(primary_script, dict):
        primary_script = primary_script.get("darija", "") or primary_script.get("fr", "")

    return {
        "languages": ["Moroccan Darija"],
        "tone": "high-energy, street-smart",
        "headline": headline,
        "primary_script": primary_script,
        "hashtags": ensure_list(data.get("hashtags", [])),
        "targeting_profile": normalize_targeting_profile(
            data.get("targeting_profile", {}),
            ["TikTok", "Instagram Reels"]
        ),
    }


def build_merchant_campaign(update: str) -> dict:
    prompt = f"""
Convert this business update into a marketing campaign for Moroccan SME merchants.

Business update:
{update}

Return ONLY valid raw JSON with this exact structure:
{{
  "headline": "string",
  "primary_script": "string",
  "hashtags": ["string", "string", "string", "string", "string"],
  "targeting_profile": {{
    "interests": ["string"],
    "geo": ["string"],
    "audience_notes": ["string"]
  }}
}}

Rules:
- Tone: professional, trust-based
- Languages used in content: French and Moroccan Darija
- Do not wrap the JSON in markdown
- Do not include explanations
"""

    raw = generate_text(prompt)
    parsed = extract_json(raw)
    return normalize_merchant_response(parsed)


def build_consumer_campaign(update: str) -> dict:
    prompt = f"""
Convert this business update into a TikTok/Instagram Reels campaign for Moroccan consumers.

Business update:
{update}

Return ONLY valid raw JSON with this exact structure:
{{
  "headline": "string",
  "primary_script": "string",
  "hashtags": ["string", "string", "string", "string", "string"],
  "targeting_profile": {{
    "interests": ["string"],
    "geo": ["string"],
    "audience_notes": ["string"]
  }}
}}

Rules:
- Tone: high-energy, street-smart
- Language used in content: pure Moroccan Darija
- Do not wrap the JSON in markdown
- Do not include explanations
"""

    raw = generate_text(prompt)
    parsed = extract_json(raw)
    return normalize_consumer_response(parsed)