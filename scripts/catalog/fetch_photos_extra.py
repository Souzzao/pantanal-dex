#!/usr/bin/env python3
"""
PantanalDex — Segunda busca de fotos de USO COMERCIAL LIVRE para quem ainda tem menos de 5.

Fontes (só licenças CC0, CC BY e CC BY-SA, que permitem vender o app com crédito):
  1. iNaturalist: observações de qualquer lugar, mais páginas (a 1ª busca parou em 4 fotos).
  2. GBIF: mídias de ocorrências (museus, coleções, iNaturalist e outros) com licença CC0/CC BY.
  3. Wikimedia Commons: arquivos da categoria/busca pelo nome científico, conferindo a licença.

Lê data/inat/fotos-v2.json e acrescenta nele. Roda no GitHub Actions (.github/workflows/fotos.yml),
porque o ambiente de desenvolvimento não acessa esses sites.

@author Felipe de Souza Aquino
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "data", "inat")
OUT = os.path.join(DATA, "fotos-v2.json")
COMMERCIAL = {"cc0", "cc-by", "cc-by-sa"}
TARGET = 6
HEADERS = {"User-Agent": "PantanalDex/3.8 (catalogo educativo; https://github.com/Souzzao/pantanal-dex)"}


def get(url, params=None):
    if params:
        url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=40) as res:
                data = json.loads(res.read().decode("utf-8"))
            time.sleep(1.0)
            return data
        except Exception as error:  # noqa: BLE001 - rede instável: tenta de novo
            print("  erro", url[:90], error)
            time.sleep(5 * (attempt + 1))
    return {}


def commercial_count(photos):
    return sum(1 for p in photos if p[1] in COMMERCIAL)


def add(bucket, url, lic, attribution):
    if lic in COMMERCIAL and url and all(p[0] != url for p in bucket):
        bucket.append([url, lic, attribution])


def gbif_license(value):
    value = (value or "").lower()
    if "publicdomain/zero" in value or value in ("cc0_1_0", "cc0"):
        return "cc0"
    if "licenses/by-sa" in value:
        return "cc-by-sa"
    if "licenses/by/" in value or value.startswith("cc_by_4") or value == "cc-by":
        return "cc-by"
    return ""


def commons_license(meta):
    short = (meta.get("LicenseShortName", {}).get("value") or "").lower()
    if "nc" in short.split("-") or " nc" in short or "nd" in short.split("-"):
        return ""
    if short.startswith("cc0") or "public domain" in short or short == "pd":
        return "cc0"
    if short.startswith("cc by-sa") or short.startswith("cc-by-sa"):
        return "cc-by-sa"
    if short.startswith("cc by") or short.startswith("cc-by"):
        return "cc-by"
    return ""


def strip_html(text):
    return re.sub(r"<[^>]+>", "", text or "").strip()


def main():
    taxa = {}
    names_extra = {}
    for name in ("pantanal-vertebrados-raw.json", "pantanal-vertebrados-gbif-extra.json"):
        for row in json.load(open(os.path.join(DATA, name), encoding="utf-8")):
            if isinstance(row.get("id"), int) and row.get("sci"):
                taxa[row["id"]] = row["sci"]
    # Fichas escritas à mão que não estão nas listas de vertebrados (ex.: invertebrados): acha o táxon pelo nome.
    known = {sci.lower() for sci in taxa.values()}
    for row in json.load(open(os.path.join(DATA, "catalogo-atual.json"), encoding="utf-8")):
        if row["sci"].lower() in known:
            continue
        found = get("https://api.inaturalist.org/v1/taxa", {"q": row["sci"], "per_page": 1}).get("results", [])
        if found and found[0].get("name", "").lower() == row["sci"].lower():
            taxa[found[0]["id"]] = row["sci"]
            names_extra[row["sci"]] = found[0]["id"]
    store = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
    store["_curated_taxa"] = names_extra
    todo = [(tid, sci) for tid, sci in sorted(taxa.items()) if commercial_count(store.get(str(tid), [])) < TARGET]
    print(f"{len(todo)} táxons com menos de {TARGET} fotos de uso livre")

    for index, (tid, sci) in enumerate(todo):
        bucket = store.setdefault(str(tid), [])
        # 1) iNaturalist, qualquer lugar, até 3 páginas
        for page in (1, 2, 3):
            if commercial_count(bucket) >= TARGET:
                break
            data = get("https://api.inaturalist.org/v1/observations", {
                "taxon_id": tid, "photo_license": "cc0,cc-by,cc-by-sa", "photos": "true",
                "per_page": 30, "page": page, "order_by": "votes"})
            results = data.get("results", [])
            for obs in results:
                for photo in (obs.get("photos") or [])[:1]:
                    lic = (photo.get("license_code") or "").lower()
                    url = (photo.get("url") or "").replace("/square.", "/medium.")
                    add(bucket, url, lic, photo.get("attribution") or "")
            if len(results) < 30:
                break
        # 2) GBIF
        if commercial_count(bucket) < TARGET:
            match = get("https://api.gbif.org/v1/species/match", {"name": sci})
            key = match.get("usageKey")
            if key and match.get("matchType") != "NONE":
                data = get("https://api.gbif.org/v1/occurrence/search", {"taxonKey": key, "mediaType": "StillImage", "limit": 60})
                for occ in data.get("results", []):
                    for media in occ.get("media") or []:
                        lic = gbif_license(media.get("license") or occ.get("license"))
                        url = media.get("identifier") or ""
                        if not url.startswith("https://") or "inaturalist" in url:
                            continue  # iNaturalist já foi buscado direto
                        who = media.get("rightsHolder") or media.get("creator") or occ.get("recordedBy") or occ.get("institutionCode") or "GBIF"
                        add(bucket, url, lic, f"(c) {who}, GBIF")
                        if commercial_count(bucket) >= TARGET:
                            break
        # 3) Wikimedia Commons
        if commercial_count(bucket) < TARGET:
            data = get("https://commons.wikimedia.org/w/api.php", {
                "action": "query", "format": "json", "generator": "search", "gsrnamespace": 6,
                "gsrsearch": f'"{sci}" filetype:bitmap', "gsrlimit": 20,
                "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 500})
            for page in (data.get("query", {}).get("pages") or {}).values():
                info = (page.get("imageinfo") or [{}])[0]
                meta = info.get("extmetadata") or {}
                lic = commons_license(meta)
                who = strip_html(meta.get("Artist", {}).get("value")) or "Wikimedia Commons"
                add(bucket, info.get("thumburl") or info.get("url"), lic, f"(c) {who[:80]}, Wikimedia Commons")
                if commercial_count(bucket) >= TARGET:
                    break
        if index % 25 == 0:
            print(f"  {index}/{len(todo)}")
            json.dump(store, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)

    for key, photos in store.items():
        if key.startswith("_"):
            continue
        photos.sort(key=lambda p: p[1] not in COMMERCIAL)
        store[key] = photos[:12]
    json.dump(store, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    low = sum(1 for tid in taxa if commercial_count(store.get(str(tid), [])) < 5)
    print(f"fim: {low} táxons ainda com menos de 5 fotos de uso livre")


if __name__ == "__main__":
    main()
