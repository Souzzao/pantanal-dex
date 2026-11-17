"""Dados precisos para as 102 fichas escritas à mão: dieta (EltonTraits/AmphiBIO, com %) e massa,
nos 4 idiomas. Vira shared/catalog/base-traits.json e é acrescentado ao fim da ficha."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT, LANGS, load_traits, diet_text  # noqa: E402

base = json.load(open(os.path.join(ROOT, "data", "inat", "catalogo-atual.json"), encoding="utf8"))
traits = load_traits()
out = {}
for s in base:
    t = traits.get(s["sci"])
    if not t:
        continue
    row = {}
    for i, lang in enumerate(LANGS):
        diet = diet_text(t, i, None, None)
        mass = t.get("mass_g")
        phys = ""
        if mass:
            w = (f"{mass/1000:.1f}".rstrip("0").rstrip(".") + " kg") if mass >= 1000 else f"{mass:.0f} g"
            if lang != "en":
                w = w.replace(".", ",")
            phys = {"pt": f"Massa corporal média: cerca de {w} ({t['source']}).", "en": f"Average body mass: about {w} ({t['source']}).",
                    "es": f"Masa corporal media: unos {w} ({t['source']}).", "de": f"Durchschnittliche Körpermasse: etwa {w} ({t['source']})."}[lang]
        if diet or phys:
            row[lang] = {"diet": diet, "physical": phys}
    if row:
        out[s["id"]] = row
json.dump(out, open(os.path.join(ROOT, "shared", "catalog", "base-traits.json"), "w", encoding="utf8"), ensure_ascii=False)
print(len(out), "de", len(base), "fichas com dados de traços")
print(out.get("onca-pintada", {}).get("pt"))
