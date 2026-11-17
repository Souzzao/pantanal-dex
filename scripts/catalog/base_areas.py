"""Raio do círculo/elipse no mapa (km) para as 102 espécies escritas à mão, com a mesma regra do build.py:
massa corporal (EltonTraits) para aves e mamíferos, senão a classe da família, senão o padrão do grupo."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import area_km, ROOT, load_traits  # noqa: E402
from families import FAMILIES  # noqa: E402

GROUP_DEFAULT = {"Aves": 0.6, "Mamíferos": 1.2, "Répteis": 0.6, "Anfíbios": 0.3, "Peixes": 1.2}
base = json.load(open(os.path.join(ROOT, "data", "inat", "catalogo-atual.json"), encoding="utf8"))
raw = json.load(open(os.path.join(ROOT, "data", "inat", "pantanal-vertebrados-raw.json"), encoding="utf8"))
raw = raw if isinstance(raw, list) else raw.get("species", [])
fam_by_sci = {r["sci"]: (r.get("family") or [None])[0] for r in raw}
traits = load_traits()
out = {}
for s in base:
    fam = fam_by_sci.get(s["sci"])
    t = traits.get(s["sci"])
    info = FAMILIES.get(fam) if fam else None
    if (t and (t.get("mass_g") or t.get("size_mm"))) or info:
        out[s["id"]] = area_km(s["group"], fam, t, info[2] if info else None)
    else:
        out[s["id"]] = GROUP_DEFAULT.get(s["group"], 0.3)
json.dump(out, open(os.path.join(ROOT, "shared", "catalog", "base-areas.json"), "w", encoding="utf8"), ensure_ascii=False, indent=0, sort_keys=True)
print(len(out), {k: out[k] for k in list(out)[:12]})
