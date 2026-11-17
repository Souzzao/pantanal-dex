#!/usr/bin/env python3
"""Translate only the missing public catalog descriptions; keep complete text.

Uses Google's public translation endpoint (network required), no API key.
Output is plain text. Scientific names are protected before translation.
Review output before publishing; this does not update the generated catalog.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
from pathlib import Path
import re
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
INPUT = ROOT / "data/inat/descricoes-para-traduzir.json"
OUTPUT = ROOT / "data/inat/traducoes-descricoes.json"
REVIEWS = ROOT / "data/inat/traducoes-descricoes-revisoes.json"
CACHE = ROOT / ".tmp/description-translations"
ENDPOINT = "https://translate.googleapis.com/translate_a/single"


def translate(item, language, names):
    source = item["en"]
    key = hashlib.sha256((language + "\0" + source).encode()).hexdigest()
    cached = CACHE / (key + ".json")
    if cached.exists():
        return item["id"], language, json.loads(cached.read_text(encoding="utf-8"))
    if not re.search(r"[A-Za-z]", source):
        # E.g. the source for manduve is only "..."; never invent a description.
        cached.write_text(json.dumps(source, ensure_ascii=False), encoding="utf-8")
        return item["id"], language, source
    protected = [name for name in names if name in source]
    protected.sort(key=len, reverse=True)
    text = source
    tokens = {}
    for index, name in enumerate(protected):
        token = f"ZXQ{index:04d}ZXQ"
        tokens[token] = name
        text = text.replace(name, token)
    last_error = None
    for attempt in range(5):
        try:
            params = urlencode({"client": "gtx", "sl": "en", "tl": language, "dt": "t", "q": text})
            request = Request(ENDPOINT + "?" + params, headers={"User-Agent": "Mozilla/5.0 PantanalDex"})
            with urlopen(request, timeout=40) as response:
                result = json.load(response)
            translated = "".join(segment[0] for segment in result[0] if segment and segment[0])
            for token, name in tokens.items():
                if token.lower() not in translated.lower():
                    raise ValueError(f"Scientific-name placeholder lost: {token}")
                translated = re.sub(re.escape(token), lambda _: name, translated, flags=re.I)
            translated = re.sub(r"\s+", " ", translated).strip()
            if not translated or translated == source:
                raise ValueError("Empty or untranslated text")
            for name in protected:
                if translated.count(name) != source.count(name):
                    raise ValueError(f"Scientific name changed: {name}")
            if "ZXQ" in translated or "<" in translated or "**" in translated:
                raise ValueError("Unexpected markup or placeholder")
            cached.write_text(json.dumps(translated, ensure_ascii=False), encoding="utf-8")
            time.sleep(0.25)
            return item["id"], language, translated
        except Exception as error:
            last_error = error
            time.sleep(min(30, 2 ** attempt))
    raise RuntimeError(f"{item['id']} ({language}): {last_error}")


def main():
    items = json.loads(INPUT.read_text(encoding="utf-8"))
    names = {item["sci"] for item in items}
    # Also preserve secondary binomials explicitly mentioned in parentheses.
    for item in items:
        names.update(re.findall(r"\(([A-Z][a-z]+ [a-z]+(?: [a-z]+)?)\)", item["en"]))
    CACHE.mkdir(parents=True, exist_ok=True)
    translated = {item["id"]: {} for item in items}
    tasks = [(item, language) for item in items for language in item["faltam"]]
    errors = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(translate, item, language, names) for item, language in tasks]
        for count, future in enumerate(as_completed(futures), 1):
            try:
                species_id, language, text = future.result()
                translated[species_id][language] = text
            except Exception as error:
                print(f"FAILED: {error}", flush=True)
                errors.append(str(error))
            if count % 25 == 0 or count == len(tasks):
                print(f"{count}/{len(tasks)} translations; {len(errors)} errors", flush=True)
    if errors:
        raise RuntimeError("Translation incomplete; cached successes preserved. " + "; ".join(errors))
    for item in items:
        if set(translated[item["id"]]) != set(item["faltam"]):
            raise ValueError(f"Missing/extra languages: {item['id']}")
    ordered = {item["id"]: {lang: translated[item["id"]][lang] for lang in item["faltam"]} for item in items}
    if REVIEWS.exists():
        sources = {item["id"]: item for item in items}
        for species_id, review in json.loads(REVIEWS.read_text(encoding="utf-8")).items():
            if sources[species_id]["en"] != review["en"]:
                raise ValueError(f"Source changed; re-review {species_id}")
            for language, text in review.items():
                if language == "en":
                    continue
                if language not in sources[species_id]["faltam"]:
                    raise ValueError(f"Unexpected review language: {species_id}/{language}")
                ordered[species_id][language] = text
    OUTPUT.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"DONE: {len(items)} species, {len(tasks)} complete translations", flush=True)


if __name__ == "__main__":
    main()
