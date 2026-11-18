#!/usr/bin/env python3
"""Busca mais fotos de cada espécie no iNaturalist, dando preferência às licenças
que permitem qualquer uso (CC0, CC BY, CC BY-SA).

Roda no GitHub Actions (workflow "Fotos do catálogo"), porque precisa de acesso livre à
API do iNaturalist. Resultado: data/inat/fotos-v2.json  →  {taxon_id: [[url, licença, crédito], ...]}

Respeita o limite da API (cerca de 1 pedido por segundo).

Autor: Felipe de Souza Aquino (PantanalDex)
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "data", "inat")
OUT = os.path.join(DATA, "fotos-v2.json")
API = "https://api.inaturalist.org/v1"
OPEN = {"cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa", "cc-by-nd", "cc-by-nc-nd"}
COMMERCIAL = {"cc0", "cc-by", "cc-by-sa"}
MAX_PER_TAXON = 8
HEADERS = {"User-Agent": "PantanalDex/3.8 (github.com/Souzzao/pantanal-dex)"}


def get(path, params=None):
    url = f"{API}{path}" + (f"?{urllib.parse.urlencode(params)}" if params else "")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=40) as res:
                data = json.load(res)
            time.sleep(1.05)
            return data
        except Exception as error:  # noqa: BLE001
            print(f"  erro ({attempt + 1}/4) {url[:90]}: {error}", file=sys.stderr)
            time.sleep(5 * (attempt + 1))
    return {"results": []}


def medium(url):
    return url.replace("/square.", "/medium.").replace("/small.", "/medium.")


def add(store, taxon_id, photo, attribution=None):
    lic = (photo.get("license_code") or "").lower()
    url = photo.get("url") or ""
    if lic not in OPEN or not url:
        return
    item = [medium(url), lic, attribution or photo.get("attribution") or ""]
    bucket = store.setdefault(str(taxon_id), [])
    if all(existing[0] != item[0] for existing in bucket):
        bucket.append(item)


def main():
    taxa = []
    for name in ("pantanal-vertebrados-raw.json", "pantanal-vertebrados-gbif-extra.json"):
        for row in json.load(open(os.path.join(DATA, name), encoding="utf-8")):
            if isinstance(row.get("id"), int):
                taxa.append(row["id"])
    taxa = sorted(set(taxa))
    print(f"{len(taxa)} táxons")
    store = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}

    # 1) Fotos escolhidas pela comunidade para o táxon (até ~12 por espécie)
    for start in range(0, len(taxa), 30):
        batch = taxa[start:start + 30]
        data = get(f"/taxa/{','.join(map(str, batch))}")
        for result in data.get("results", []):
            for tp in result.get("taxon_photos") or []:
                add(store, result["id"], tp.get("photo") or {})
        print(f"  táxons {start + len(batch)}/{len(taxa)}")

    # 2) Onde faltam fotos de uso livre, busca observações com licença comercial (preferindo o Brasil)
    for index, taxon_id in enumerate(taxa):
        photos = store.get(str(taxon_id), [])
        if sum(1 for p in photos if p[1] in COMMERCIAL) >= 4:
            continue
        for place in ("6878", None):  # 6878 = Brasil
            params = {"taxon_id": taxon_id, "photo_license": "cc0,cc-by,cc-by-sa", "quality_grade": "research",
                      "photos": "true", "per_page": 12, "order_by": "votes"}
            if place:
                params["place_id"] = place
            for obs in get("/observations", params).get("results", []):
                for photo in (obs.get("photos") or [])[:1]:
                    add(store, taxon_id, photo)
            if sum(1 for p in store.get(str(taxon_id), []) if p[1] in COMMERCIAL) >= 4:
                break
        if index % 50 == 0:
            print(f"  observações {index}/{len(taxa)}")
            json.dump(store, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)

    # Ordena: uso livre primeiro e limita por espécie
    for key, photos in store.items():
        photos.sort(key=lambda p: (p[1] not in COMMERCIAL))
        store[key] = photos[:MAX_PER_TAXON]
    json.dump(store, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    total = sum(len(v) for v in store.values())
    commercial = sum(1 for v in store.values() for p in v if p[1] in COMMERCIAL)
    print(f"fim: {len(store)} táxons, {total} fotos, {commercial} de uso livre")


if __name__ == "__main__":
    main()
