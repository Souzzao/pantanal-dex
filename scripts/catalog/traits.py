"""Gera data/traits/traits-by-species.json a partir dos arquivos originais em data/traits/.

EltonTraits 1.0 (aves e mamíferos): dieta em % (estimativa semiquantitativa), estrato de forrageio,
atividade noturna e massa corporal. AmphiBIO v1 (anfíbios): itens alimentares presentes (1), sem %.
Cruzamento só por nome científico exato; nada é completado por suposição.

Autor: Felipe de Souza Aquino (PantanalDex)
"""
import csv, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = os.path.join(ROOT, "data", "traits")
DIET = ["Inv", "Vend", "Vect", "Vfish", "Vunk", "Scav", "Fruit", "Nect", "Seed", "PlantO"]
ELTON = ("EltonTraits 1.0, Wilman et al. 2014", "https://doi.org/10.1890/13-1917.1")
AMPHI = ("AmphiBIO v1, Oliveira et al. 2017", "https://doi.org/10.1038/sdata.2017.123")
BIRD_STRATA = {"ForStrat-watbelowsurf": "WatBelowSurf", "ForStrat-wataroundsurf": "WatAroundSurf", "ForStrat-ground": "Ground",
               "ForStrat-understory": "Understory", "ForStrat-midhigh": "MidHigh", "ForStrat-canopy": "Canopy", "ForStrat-aerial": "Aerial"}
MAM_STRATA = {"G": "Ground", "S": "MidHigh", "Ar": "Canopy", "A": "Aerial", "M": "WatBelowSurf"}


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def tsv(name):
    with open(os.path.join(T, name), encoding="latin-1", newline="") as f:
        yield from csv.DictReader(f, delimiter="\t")


out = {}
for r in tsv("BirdFuncDat.txt"):
    sci = (r.get("Scientific") or "").strip()
    if not sci:
        continue
    out[sci] = {
        "diet": {k: int(num(r.get(f"Diet-{k}")) or 0) for k in DIET},
        "strata": {v: int(num(r.get(k)) or 0) for k, v in BIRD_STRATA.items()},
        "mass_g": num(r.get("BodyMass-Value")),
        "nocturnal": r.get("Nocturnal") == "1",
        "source": ELTON[0], "sourceUrl": ELTON[1],
    }
for r in tsv("MamFuncDat.txt"):
    sci = (r.get("Scientific") or "").strip()
    if not sci:
        continue
    noc, diu = r.get("Activity-Nocturnal"), r.get("Activity-Diurnal")
    strat = MAM_STRATA.get((r.get("ForStrat-Value") or "").strip())
    out[sci] = {
        "diet": {k: int(num(r.get(f"Diet-{k}")) or 0) for k in DIET},
        "strata": {strat: 100} if strat else {},
        "mass_g": num(r.get("BodyMass-Value")),
        "nocturnal": (noc == "1" and diu != "1") if noc in ("0", "1") else None,
        "source": ELTON[0], "sourceUrl": ELTON[1],
    }
AMPHI_ITEMS = {"Arthro": "Inv", "Vert": "Vunk", "Fruits": "Fruit", "Seeds": "Seed", "Leaves": "PlantO", "Flowers": "PlantO"}
with open(os.path.join(T, "AmphiBIO_v1.csv"), encoding="cp1252", newline="") as f:
    for r in csv.DictReader(f):
        sci = (r.get("Species") or "").strip()
        if not sci:
            continue
        items = sorted({v for k, v in AMPHI_ITEMS.items() if r.get(k) == "1"})
        noc, diu = r.get("Noc"), r.get("Diu")
        out[sci] = {
            "dietItems": items,
            "mass_g": num(r.get("Body_mass_g")),
            "size_mm": num(r.get("Body_size_mm")),
            "nocturnal": True if (noc == "1" and diu != "1") else False if (diu == "1" and noc != "1") else None,
            "source": AMPHI[0], "sourceUrl": AMPHI[1],
        }

json.dump(out, open(os.path.join(T, "traits-by-species.json"), "w", encoding="utf8"), ensure_ascii=False)
print(len(out), "espécies com traços")
