#!/usr/bin/env python3
"""Download the supplied licensed covers and export reproducible bundled JPEGs.

Requires Pillow. Run: python scripts/catalog/embed_covers.py [--workers 8]
Only supplied URLs/alternatives are used; attribution stays in the source catalog.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import io
import json
from pathlib import Path
import re
import threading
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
INPUT = ROOT / "data/inat/capas-para-embutir.json"
OUTPUT = ROOT / "assets/images/species"
REPORT = ROOT / "data/inat/capas-embutidas.json"
FAILURES = ROOT / "data/inat/capas-falhas.json"
CACHE = ROOT / ".tmp/species-cover-downloads"
COMMONS = threading.Semaphore(1)
USER_AGENT = "PantanalDex/1.3 (educational offline species covers; https://github.com/Souzzao/pantanal-dex)"
LIMIT = 30_000_000


def write_json(path, value):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(path)


def export(raw, destination, size=360, quality=72):
    with Image.open(io.BytesIO(raw)) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((size, size), Image.Resampling.LANCZOS)
        if image.mode == "RGBA" or "transparency" in image.info:
            rgba = image.convert("RGBA")
            image = Image.new("RGB", rgba.size, "white")
            image.paste(rgba, mask=rgba.getchannel("A"))
        else:
            image = image.convert("RGB")
        # Fresh Image object deliberately drops EXIF, ICC, comments and XMP.
        clean = Image.new("RGB", image.size)
        clean.paste(image)
        clean.save(destination, "JPEG", quality=quality, optimize=True)


def download(url):
    last = None
    for attempt in range(3):
        try:
            request = Request(url, headers={"User-Agent": USER_AGENT})
            with urlopen(request, timeout=35) as response:
                raw = response.read(25_000_001)
            if len(raw) > 25_000_000:
                raise ValueError("image exceeds 25 MB download limit")
            with Image.open(io.BytesIO(raw)) as image:
                image.verify()
            return raw
        except HTTPError as error:
            last = error
            if error.code not in (429, 500, 502, 503, 504):
                raise
            delay = error.headers.get("Retry-After", "")
            time.sleep(min(60, int(delay)) if delay.isdigit() else 3 * (attempt + 1))
        except Exception as error:
            last = error
            if attempt < 2:
                time.sleep(attempt + 1)
    raise last


def process(item, previous):
    species_id = item["id"]
    if not re.fullmatch(r"[^\W_]+(?:-[^\W_]+)*", species_id):
        raise ValueError(f"Unsafe species id: {species_id}")
    urls = list(dict.fromkeys([item["url"], *item.get("alternativas", [])]))
    destination = OUTPUT / f"{species_id}.jpg"
    old = previous.get(species_id)
    if old and old.get("url") in urls and destination.exists():
        if hashlib.sha256(destination.read_bytes()).hexdigest() == old.get("sha256"):
            return old, None
    attempts = []
    for url in urls:
        try:
            cache = CACHE / (hashlib.sha256(url.encode()).hexdigest() + ".img")
            if cache.exists():
                raw = cache.read_bytes()
            elif "wikimedia.org" in url:
                with COMMONS:
                    raw = download(url)
                    time.sleep(0.5)
                cache.write_bytes(raw)
            else:
                raw = download(url)
                cache.write_bytes(raw)
            export(raw, destination)
            return {"id": species_id, "url": url,
                    "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
                    "bytes": destination.stat().st_size, "maxSize": 360, "quality": 72}, None
        except Exception as error:
            attempts.append({"url": url, "error": str(error)})
    return None, {"id": species_id, "url": item["url"], "attempts": attempts}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()
    items = json.loads(INPUT.read_text(encoding="utf-8"))
    if len({item["id"] for item in items}) != len(items):
        raise ValueError("Duplicate species ids")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    previous = {x["id"]: x for x in json.loads(REPORT.read_text(encoding="utf-8"))} if REPORT.exists() else {}
    success, failures = {}, {}
    with ThreadPoolExecutor(max_workers=max(1, min(args.workers, 12))) as pool:
        jobs = {pool.submit(process, item, previous): item for item in items}
        for done, future in enumerate(as_completed(jobs), 1):
            try:
                ok, failure = future.result()
            except Exception as error:
                item = jobs[future]
                ok, failure = None, {"id": item["id"], "url": item["url"],
                                     "attempts": [{"url": item["url"], "error": str(error)}]}
            if ok:
                success[ok["id"]] = ok
            if failure:
                failures[failure["id"]] = failure
                print(f"FAILED {failure['id']}: {failure['attempts'][-1]['error']}", flush=True)
            if done % 25 == 0 or done == len(items):
                write_json(REPORT, [success[x["id"]] for x in items if x["id"] in success])
                write_json(FAILURES, [failures[x["id"]] for x in items if x["id"] in failures])
                print(f"{done}/{len(items)}: {len(success)} covers, {len(failures)} failures", flush=True)
    total = sum(p.stat().st_size for p in OUTPUT.glob("*.jpg"))
    if total >= LIMIT:
        for item in success.values():
            cache = CACHE / (hashlib.sha256(item["url"].encode()).hexdigest() + ".img")
            destination = OUTPUT / f"{item['id']}.jpg"
            if cache.exists():
                export(cache.read_bytes(), destination, 320, 68)
            else:
                export(destination.read_bytes(), destination, 320, 68)
            item.update(sha256=hashlib.sha256(destination.read_bytes()).hexdigest(),
                        bytes=destination.stat().st_size, maxSize=320, quality=68)
        write_json(REPORT, [success[x["id"]] for x in items if x["id"] in success])
        total = sum(p.stat().st_size for p in OUTPUT.glob("*.jpg"))
    if total >= LIMIT:
        raise RuntimeError(f"Cover folder still exceeds 30 MB: {total}")
    lines = ["/**\n * PantanalDex — Capas das espécies embutidas no app. Gerado por scripts/catalog/embed_covers.py — não editar à mão.\n *\n * @author Felipe de Souza Aquino\n */",
             "export const speciesCovers: Record<string, number> = {"]
    lines += [f'  "{x["id"]}": require("../assets/images/species/{x["id"]}.jpg"),' for x in items if x["id"] in success]
    lines += ["};", "", "export function hasBundledCover(id: string): boolean {", "  return id in speciesCovers;", "}", ""]
    (ROOT / "shared/species-covers.ts").write_text("\n".join(lines), encoding="utf-8")
    print(f"DONE: {len(success)}/{len(items)} covers; {total:,} bytes; {len(failures)} failures", flush=True)


if __name__ == "__main__":
    main()
