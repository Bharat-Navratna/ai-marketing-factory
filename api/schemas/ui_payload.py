from pydantic import BaseModel


class UIPayload(BaseModel):
    template_type: str

    page_title: str
    app_name: str
    headline: str
    primary_script: str
    cta_text: str
    badge_text: str
    market_label: str

    extra: dict