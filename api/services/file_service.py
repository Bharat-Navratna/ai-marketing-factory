import json
from pathlib import Path
from datetime import datetime


BASE_DIR = Path(__file__).resolve().parents[2]
OUTPUT_DIR = BASE_DIR / "outputs" / "json"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def save_campaign_output(data: dict) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = OUTPUT_DIR / f"campaign_{timestamp}.json"

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return str(file_path)


def load_latest_campaign_file() -> dict:
    json_files = sorted(OUTPUT_DIR.glob("campaign_*.json"), reverse=True)

    if not json_files:
        raise FileNotFoundError("No campaign JSON files found in outputs/json")

    latest_file = json_files[0]

    with open(latest_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "data" in data:
        return data["data"]

    return data