from pydantic import BaseModel
from typing import List


class TargetingProfile(BaseModel):
    platforms: List[str]
    interests: List[str]
    geo: List[str]
    audience_notes: List[str]


class PersonaCampaign(BaseModel):
    languages: List[str]
    tone: str
    headline: str
    primary_script: str
    hashtags: List[str]
    targeting_profile: TargetingProfile


class CampaignRequest(BaseModel):
    business_update: str
    market: str = "Morocco"
    currency: str = "MAD"


class CampaignResponse(BaseModel):
    merchant: PersonaCampaign
    consumer: PersonaCampaign