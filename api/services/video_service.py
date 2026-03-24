import subprocess
from pathlib import Path
from datetime import datetime


BASE_DIR = Path(__file__).resolve().parents[2]
BG_DIR = BASE_DIR / "assets" / "bg_clips"
OUTPUT_DIR = BASE_DIR / "outputs" / "final_videos"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _get_timestamp() -> str:
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def _run_ffmpeg_command(command: list[str]) -> None:
    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(
            f"FFmpeg failed.\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
        )


def create_video_from_assets(
    image_path: str,
    audio_path: str,
    background_path: str,
    output_prefix: str,
    width: int,
    height: int
) -> str:
    timestamp = _get_timestamp()
    output_path = OUTPUT_DIR / f"{output_prefix}_{timestamp}.mp4"

    command = [
        "ffmpeg",
        "-y",
        "-stream_loop", "-1",
        "-i", background_path,
        "-i", image_path,
        "-i", audio_path,
        "-filter_complex",
        (
            f"[0:v]scale={width}:{height}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height}[bg];"
            f"[1:v]scale={width}:{height}:force_original_aspect_ratio=decrease[overlay];"
            f"[bg][overlay]overlay=(W-w)/2:(H-h)/2:format=auto[v]"
        ),
        "-map", "[v]",
        "-map", "2:a",
        "-c:v", "libx264",
        "-c:a", "aac",
        "-shortest",
        "-pix_fmt", "yuv420p",
        str(output_path)
    ]

    _run_ffmpeg_command(command)
    return str(output_path)


def generate_campaign_videos(rendered_files: dict, audio_files: dict) -> dict:
    merchant_video = create_video_from_assets(
        image_path=rendered_files["merchant"],
        audio_path=audio_files["merchant"],
        background_path=str(BG_DIR / "merchant_bg.mp4"),
        output_prefix="merchant_video",
        width=1200,
        height=1200
    )

    consumer_video = create_video_from_assets(
        image_path=rendered_files["consumer"],
        audio_path=audio_files["consumer"],
        background_path=str(BG_DIR / "consumer_bg.mp4"),
        output_prefix="consumer_video",
        width=1080,
        height=1920
    )

    return {
        "merchant": merchant_video,
        "consumer": consumer_video
    }