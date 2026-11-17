"""Dados precisos para as 102 fichas escritas à mão: dieta (EltonTraits/AmphiBIO, com %) e massa,
nos 4 idiomas. Vira shared/catalog/base-traits.json e é acrescentado ao fim da ficha."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT, LANGS, IUCN, load_traits, diet_text  # noqa: E402

base = json.load(open(os.path.join(ROOT, "data", "inat", "catalogo-atual.json"), encoding="utf8"))
traits = load_traits()
raw = json.load(open(os.path.join(ROOT, "data", "inat", "pantanal-vertebrados-raw.json"), encoding="utf8"))
raw = raw if isinstance(raw, list) else raw["species"]
iucn = {r["sci"]: r.get("iucn") for r in raw}
out = {}
for s in base:
    t = traits.get(s["sci"]) or {}
    st = iucn.get(s["sci"])
    row = {}
    for i, lang in enumerate(LANGS):
        diet = diet_text(t, i, None, None) if t else ""
        mass = t.get("mass_g")
        phys = ""
        if mass:
            w = (f"{mass/1000:.1f}".rstrip("0").rstrip(".") + " kg") if mass >= 1000 else f"{mass:.0f} g"
            if lang != "en":
                w = w.replace(".", ",")
            phys = {"pt": f"Massa corporal média: cerca de {w} ({t['source']}).", "en": f"Average body mass: about {w} ({t['source']}).",
                    "es": f"Masa corporal media: unos {w} ({t['source']}).", "de": f"Durchschnittliche Körpermasse: etwa {w} ({t['source']})."}[lang]
        status = IUCN[st][i] if st in IUCN else ""
        if diet or phys or status:
            row[lang] = {"diet": diet, "physical": phys, "status": status}
    if row:
        out[s["id"]] = row
json.dump(out, open(os.path.join(ROOT, "shared", "catalog", "base-traits.json"), "w", encoding="utf8"), ensure_ascii=False)
print(len(out), "de", len(base), "fichas com dados de traços")
print(out.get("onca-pintada", {}).get("pt"))
