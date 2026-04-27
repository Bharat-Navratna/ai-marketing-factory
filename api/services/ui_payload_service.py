from api.schemas.ui_payload import UIPayload


def build_merchant_ui_payload(campaign_data: dict) -> UIPayload:
    merchant = campaign_data["merchant"]

    headline = merchant.get("headline", "Fast merchant payments")
    primary_script = merchant.get(
        "primary_script",
        "Withdraw instantly from any local agency with zero fees."
    )

    return UIPayload(
        template_type="merchant",
        page_title="YQNPay Merchant Ad",
        app_name="YQNPay Merchant",
        headline=headline,
        primary_script=primary_script,
        cta_text="Withdraw Funds",
        badge_text="Available Now",
        market_label=campaign_data.get("currency", "MAD"),
        extra={
            "nav_button_text": "Support",
            "avatar_letter": "M",
            "section_title": "Merchant Offer",
            "highlight_tag": "Zero Fees",
            "supporting_title": "Key Benefits",
            "secondary_button_text": "View Details",
            "point_1_icon": "💸",
            "point_1_title": "Instant Cashout",
            "point_1_text": "Withdraw cash instantly from local agencies.",
            "point_1_badge": "Fast",
            "point_2_icon": "📍",
            "point_2_title": "Local Access",
            "point_2_text": "Available across nearby merchant-friendly locations.",
            "point_2_badge": "Nearby",
            "point_3_icon": "✅",
            "point_3_title": "Zero Fees",
            "point_3_text": "No extra withdrawal fee for merchants.",
            "point_3_badge": "0 MAD",
            "fab_label": "Create new action"
        }
    )


def build_consumer_ui_payload(campaign_data: dict) -> UIPayload:
    consumer = campaign_data["consumer"]

    headline = consumer.get("headline", "Cash out anytime")
    primary_script = consumer.get(
        "primary_script",
        "Get instant access to your money from any nearby agency."
    )

    return UIPayload(
        template_type="consumer",
        page_title="YQNPay Consumer Ad",
        app_name="YQNPay Consumer",
        headline=headline,
        primary_script=primary_script,
        cta_text="Top Up",
        badge_text="Main Offer",
        market_label=campaign_data.get("currency", "MAD"),
        extra={
            "greeting_text": "Special Update",
            "user_name": "Ahlan!",
            "profile_image_url": "https://api.dicebear.com/7.x/notionists/svg?seed=Youssef&backgroundColor=aaffdc",
            "profile_image_alt": "Profile",
            "secondary_cta_text": "Transfer",
            "section_title": "Quick Actions",
            "story_1_icon": "+",
            "story_1_label": "New",
            "story_2_image_url": "https://api.dicebear.com/7.x/notionists/svg?seed=Amina",
            "story_2_label": "Amina",
            "story_3_image_url": "https://api.dicebear.com/7.x/notionists/svg?seed=Karim",
            "story_3_label": "Karim",
            "story_4_image_url": "https://api.dicebear.com/7.x/notionists/svg?seed=Sara",
            "story_4_label": "Sara",
            "supporting_title": "Why Use It",
            "card_1_icon_class": "bg-netflix",
            "card_1_icon": "⚡",
            "card_1_title": "Instant Access",
            "card_1_text": primary_script,
            "card_1_badge": "Fast",
            "card_2_icon_class": "bg-transfer",
            "card_2_icon": "📍",
            "card_2_title": "Nearby Agencies",
            "card_2_text": "Cash withdrawal available through local agencies.",
            "card_2_badge": "Local",
            "card_3_icon_class": "bg-uber",
            "card_3_icon": "💰",
            "card_3_title": "Zero Fees",
            "card_3_text": "No extra fee on eligible withdrawals.",
            "card_3_badge": "0 MAD",
            "nav_icon_1": "🏠",
            "nav_icon_2": "📊",
            "nav_icon_3": "💳",
            "nav_icon_4": "⚙️",
            "scan_button_label": "Scan"
        }
    )


def build_ui_payloads(campaign_data: dict) -> dict:
    return {
        "merchant": build_merchant_ui_payload(campaign_data),
        "consumer": build_consumer_ui_payload(campaign_data),
    }