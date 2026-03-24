from fastapi import FastAPI
from api.schemas.campaign import CampaignRequest
from api.services.localization import build_merchant_campaign, build_consumer_campaign
from api.services.file_service import save_campaign_output, load_latest_campaign_file
from api.services.ui_payload_service import build_ui_payloads
from api.services.render_service import render_multiple_ui
from api.services.voice_service import generate_campaign_voice_files
from api.services.video_service import generate_campaign_videos
from api.services.distribution_service import build_distribution_drafts
from api.services.rd_agent_service import generate_rd_comparison_report

app = FastAPI(title="YQN Pay AI Marketing Factory")


@app.get("/")
def root():
    return {"message": "YQN Pay POC API is running"}


@app.post("/generate-campaign")
def generate_campaign(payload: CampaignRequest):
    merchant = build_merchant_campaign(payload.business_update)
    consumer = build_consumer_campaign(payload.business_update)

    response = {
        "merchant": merchant,
        "consumer": consumer
    }

    saved_path = save_campaign_output(response)

    return {
        "data": response,
        "saved_to": saved_path
    }


@app.post("/render-ui-from-latest-campaign")
def render_ui_from_latest_campaign():
    campaign_data = load_latest_campaign_file()
    payloads = build_ui_payloads(campaign_data)
    rendered_files = render_multiple_ui(payloads)

    return {
        "message": "UI rendered successfully",
        "rendered_files": rendered_files
    }


@app.post("/generate-voice-from-latest-campaign")
def generate_voice_from_latest_campaign():
    campaign_data = load_latest_campaign_file()
    audio_files = generate_campaign_voice_files(campaign_data)

    return {
        "message": "Voice files generated successfully",
        "audio_files": audio_files
    }


@app.post("/generate-video-from-latest-campaign")
def generate_video_from_latest_campaign():
    campaign_data = load_latest_campaign_file()
    payloads = build_ui_payloads(campaign_data)
    rendered_files = render_multiple_ui(payloads)
    audio_files = generate_campaign_voice_files(campaign_data)
    video_files = generate_campaign_videos(rendered_files, audio_files)

    return {
        "message": "Videos generated successfully",
        "rendered_files": rendered_files,
        "audio_files": audio_files,
        "video_files": video_files
    }


@app.post("/generate-distribution-drafts-from-latest-campaign")
def generate_distribution_drafts_from_latest_campaign():
    campaign_data = load_latest_campaign_file()
    payloads = build_ui_payloads(campaign_data)
    rendered_files = render_multiple_ui(payloads)
    audio_files = generate_campaign_voice_files(campaign_data)
    video_files = generate_campaign_videos(rendered_files, audio_files)
    distribution = build_distribution_drafts(campaign_data, video_files)

    return {
        "message": "Distribution drafts generated successfully",
        "distribution": distribution,
        "video_files": video_files
    }


@app.post("/generate-full-campaign-assets")
def generate_full_campaign_assets(payload: CampaignRequest):
    merchant = build_merchant_campaign(payload.business_update)
    consumer = build_consumer_campaign(payload.business_update)

    campaign_data = {
        "merchant": merchant,
        "consumer": consumer
    }

    saved_path = save_campaign_output(campaign_data)
    payloads = build_ui_payloads(campaign_data)
    rendered_files = render_multiple_ui(payloads)
    audio_files = generate_campaign_voice_files(campaign_data)
    video_files = generate_campaign_videos(rendered_files, audio_files)
    distribution = build_distribution_drafts(campaign_data, video_files)

    return {
        "message": "Full campaign asset pipeline completed successfully",
        "data": campaign_data,
        "saved_to": saved_path,
        "rendered_files": rendered_files,
        "audio_files": audio_files,
        "video_files": video_files,
        "distribution": distribution
    }


@app.get("/rd-agent-report")
def rd_agent_report():
    report = generate_rd_comparison_report()

    return {
        "message": "R&D agent report generated successfully",
        "report": report
    }