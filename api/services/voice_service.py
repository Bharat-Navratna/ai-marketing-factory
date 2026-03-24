from pathlib import Path
from datetime import datetime
from gtts import gTTS


BASE_DIR = Path(__file__).resolve().parents[2]
OUTPUT_DIR = BASE_DIR / "outputs" / "audio"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _build_voice_text(text: str) -> str:
    return text.strip()


def generate_voice_file(text: str, prefix: str, lang: str = "fr") -> str:
    clean_text = _build_voice_text(text)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"{prefix}_{timestamp}.mp3"

    tts = gTTS(text=clean_text, lang=lang)
    tts.save(str(output_path))

    return str(output_path)


def generate_campaign_voice_files(campaign_data: dict) -> dict:
    merchant_script = campaign_data["merchant"].get(
        "primary_script",
        "Withdraw your funds instantly with YQN Pay."
    )

    consumer_script = campaign_data["consumer"].get(
        "primary_script",
        "Get instant access to your money with YQN Pay."
    )

    merchant_audio = generate_voice_file(
        text=merchant_script,
        prefix="merchant_voice",
        lang="fr"
    )

    consumer_audio = generate_voice_file(
        text=consumer_script,
        prefix="consumer_voice",
        lang="ar"
    )

    return {
        "merchant": merchant_audio,
        "consumer": consumer_audio
    }