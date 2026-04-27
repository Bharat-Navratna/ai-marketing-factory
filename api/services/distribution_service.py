from pathlib import Path


def _build_merchant_caption(campaign_data: dict) -> str:
    merchant = campaign_data["merchant"]
    headline = merchant.get("headline", "")
    script = merchant.get("primary_script", "")
    hashtags = merchant.get("hashtags", [])

    hashtag_text = " ".join(hashtags[:5])
    return f"{headline}\n\n{script}\n\n{hashtag_text}".strip()


def _build_consumer_caption(campaign_data: dict) -> str:
    consumer = campaign_data["consumer"]
    headline = consumer.get("headline", "")
    script = consumer.get("primary_script", "")
    hashtags = consumer.get("hashtags", [])

    hashtag_text = " ".join(hashtags[:5])
    return f"{headline}\n\n{script}\n\n{hashtag_text}".strip()


def _normalize_targeting_profile(profile: dict) -> dict:
    return {
        "platforms": profile.get("platforms", []),
        "interests": profile.get("interests", []),
        "geo": profile.get("geo", []),
        "audience_notes": profile.get("audience_notes", []),
    }


def build_distribution_drafts(campaign_data: dict, video_files: dict) -> dict:
    merchant = campaign_data["merchant"]
    consumer = campaign_data["consumer"]

    merchant_targeting = _normalize_targeting_profile(
        merchant.get("targeting_profile", {})
    )
    consumer_targeting = _normalize_targeting_profile(
        consumer.get("targeting_profile", {})
    )

    merchant_distribution = {
        "persona": "merchant",
        "channels": [
            "Facebook Group posting agent",
            "WhatsApp Business template"
        ],
        "headline": merchant.get("headline", ""),
        "caption": _build_merchant_caption(campaign_data),
        "video_path": video_files.get("merchant", ""),
        "targeting_profile": merchant_targeting,
        "status": "draft_ready",
        "distribution_notes": [
            "Merchant content routed for Facebook/WhatsApp-ready usage.",
            "Tone optimized for trust-based SME communication.",
            "Use video asset in post draft or WhatsApp business send flow."
        ]
    }

    consumer_distribution = {
        "persona": "consumer",
        "channels": [
            "TikTok draft agent",
            "Instagram Reels draft agent"
        ],
        "headline": consumer.get("headline", ""),
        "caption": _build_consumer_caption(campaign_data),
        "video_path": video_files.get("consumer", ""),
        "targeting_profile": consumer_targeting,
        "status": "draft_ready",
        "distribution_notes": [
            "Consumer content routed for short-form social draft usage.",
            "Tone optimized for high-energy Darija-first content.",
            "Use vertical video asset for TikTok/Instagram Reels draft creation."
        ]
    }

    success_log = {
        "merchant_route_status": "success",
        "consumer_route_status": "success",
        "merchant_destination": "Facebook Group posting agent + WhatsApp Business template",
        "consumer_destination": "TikTok/Instagram Reels draft agent",
        "overall_status": "distribution_drafts_created"
    }

    return {
        "merchant_distribution": merchant_distribution,
        "consumer_distribution": consumer_distribution,
        "success_log": success_log
    }