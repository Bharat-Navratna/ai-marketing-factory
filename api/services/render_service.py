import asyncio
from datetime import datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright

from api.schemas.ui_payload import UIPayload


BASE_DIR = Path(__file__).resolve().parents[2]
ASSETS_DIR = BASE_DIR / "assets" / "ui"
OUTPUT_DIR = BASE_DIR / "outputs" / "rendered_ui"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _build_render_context(payload: UIPayload) -> dict:
    context = payload.model_dump()
    extra = context.pop("extra", {})
    context.update(extra)
    return context


def _get_template_dir(template_type: str) -> Path:
    return ASSETS_DIR / template_type


def _get_viewport(template_type: str) -> dict:
    if template_type == "consumer":
        return {"width": 1080, "height": 1920}
    return {"width": 1200, "height": 1200}


async def _render_html_to_png(payload: UIPayload) -> str:
    template_dir = _get_template_dir(payload.template_type)

    env = Environment(loader=FileSystemLoader(str(template_dir)))
    template = env.get_template("template.html")

    context = _build_render_context(payload)
    context["css_file_uri"] = (template_dir / "styles.css").resolve().as_uri()

    rendered_html = template.render(**context)

    temp_html_path = OUTPUT_DIR / f"temp_{payload.template_type}.html"
    temp_html_path.write_text(rendered_html, encoding="utf-8")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"{payload.template_type}_{timestamp}.png"

    viewport = _get_viewport(payload.template_type)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport=viewport)

        await page.goto(temp_html_path.resolve().as_uri())
        await page.screenshot(path=str(output_path))
        await browser.close()

    return str(output_path)


def render_ui_to_png(payload: UIPayload) -> str:
    return asyncio.run(_render_html_to_png(payload))


def render_multiple_ui(payloads: dict) -> dict:
    results = {}
    for key, payload in payloads.items():
        results[key] = render_ui_to_png(payload)
    return results