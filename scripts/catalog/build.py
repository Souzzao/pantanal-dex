#!/usr/bin/env python3
"""Gera o catálogo ampliado de vertebrados do Pantanal.

Entradas (em data/):
- inat/pantanal-vertebrados-raw.json  espécies com nomes (pt/en/es/de), família, fotos, resumo da Wikipédia (iNaturalist)
- inat/catalogo-atual.json            espécies que já têm ficha escrita à mão (não são geradas de novo)
- traits/*.json (opcional)            dieta e massa corporal por espécie (EltonTraits, AmphiBIO)

Saída: shared/catalog/generated/vertebrados.json

Regras: nada é inventado sobre a espécie. O que é da própria espécie vem de fonte citada
(iNaturalist, Wikipédia, EltonTraits/AmphiBIO); o que vem da família é escrito como "como outras
espécies da família…".
"""
import json, math, os, re, sys, unicodedata

sys.path.insert(0, os.path.dirname(__file__))
from families import AREA_KM, DIETS, DOMESTIC, EXOTIC, FAMILIES  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LANGS = ["pt", "en", "es", "de"]
# Famílias marinhas: registro no polígono do Pantanal é erro de coordenada.
MARINE_FAMILIES = {"Scombridae", "Carangidae", "Lutjanidae", "Serranidae", "Mugilidae"}
INAT_LOC = {"pt": "pt-BR", "en": "en", "es": "es", "de": "de"}

GROUP = {"Aves": "Aves", "Mammalia": "Mamíferos", "Reptilia": "Répteis", "Squamata": "Répteis", "Testudines": "Répteis",
         "Crocodylia": "Répteis", "Amphibia": "Anfíbios", "Actinopterygii": "Peixes", "Elasmobranchii": "Peixes",
         "Dipnoi": "Peixes", "Sarcopterygii": "Peixes", "Chondrichthyes": "Peixes"}
ENV = {"R": "Rios e corixos", "A": "Áreas alagadas", "C": "Campos", "M": "Matas", "B": "Bordas de mata"}
ENV_T = {
    "Rios e corixos": ("rios e corixos", "rivers and channels", "ríos y canales", "Flüsse und Wasserläufe"),
    "Áreas alagadas": ("áreas alagadas", "flooded areas", "áreas inundadas", "überschwemmte Gebiete"),
    "Campos": ("campos", "grasslands", "campos", "Grasland"),
    "Matas": ("matas", "forests", "bosques", "Wälder"),
    "Bordas de mata": ("bordas de mata", "forest edges", "bordes de bosque", "Waldränder"),
}
GROUP_T = {"Aves": ("ave", "bird", "ave", "Vogel"), "Mamíferos": ("mamífero", "mammal", "mamífero", "Säugetier"),
           "Répteis": ("réptil", "reptile", "reptil", "Reptil"), "Anfíbios": ("anfíbio", "amphibian", "anfibio", "Amphibie"),
           "Peixes": ("peixe", "fish", "pez", "Fisch")}
IUCN = {
    "LC": ("Pouco preocupante (IUCN)", "Least Concern (IUCN)", "Preocupación menor (UICN)", "Nicht gefährdet (IUCN)"),
    "NT": ("Quase ameaçada (IUCN)", "Near Threatened (IUCN)", "Casi amenazada (UICN)", "Potenziell gefährdet (IUCN)"),
    "VU": ("Vulnerável (IUCN)", "Vulnerable (IUCN)", "Vulnerable (UICN)", "Gefährdet (IUCN)"),
    "EN": ("Em perigo (IUCN)", "Endangered (IUCN)", "En peligro (UICN)", "Stark gefährdet (IUCN)"),
    "CR": ("Criticamente em perigo (IUCN)", "Critically Endangered (IUCN)", "En peligro crítico (UICN)", "Vom Aussterben bedroht (IUCN)"),
    "DD": ("Dados insuficientes (IUCN)", "Data Deficient (IUCN)", "Datos insuficientes (UICN)", "Unzureichende Datenlage (IUCN)"),
}
LICENSE = {"cc0": "CC0", "cc-by": "CC BY 4.0", "cc-by-sa": "CC BY-SA 4.0", "cc-by-nc": "CC BY-NC 4.0", "cc-by-nc-sa": "CC BY-NC-SA 4.0", "cc-by-nd": "CC BY-ND 4.0", "cc-by-nc-nd": "CC BY-NC-ND 4.0"}
COMMERCIAL = {"cc0", "cc-by", "cc-by-sa"}


def slug(text):
    text = unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def sentences(text, limit):
    text = re.sub(r"\s+", " ", (text or "")).strip()
    text = re.sub(r"\s*\[[^\]]*\]", "", text)
    if not text:
        return ""
    parts = re.split(r"(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÀÇÄÖÜ])", text)
    out = ""
    for part in parts:
        if out and len(out) + len(part) + 1 > limit:
            break
        out = (out + " " + part).strip()
    if len(out) > limit + 120:
        out = out[:limit].rsplit(" ", 1)[0] + "…"
    return out


def cap(text):
    return text[:1].upper() + text[1:] if text else text


def join_list(items, lang):
    items = [i for i in items if i]
    if len(items) <= 1:
        return "".join(items)
    last = {"pt": " e ", "en": " and ", "es": " y ", "de": " und "}[lang]
    return ", ".join(items[:-1]) + last + items[-1]


def load_traits():
    """Lê data/traits/*.json gerados por traits.py: {nome científico: {...}}."""
    path = os.path.join(ROOT, "data", "traits", "traits-by-species.json")
    if not os.path.exists(path):
        return {}
    return json.load(open(path, encoding="utf8"))


DIET_PARTS = {  # chave do EltonTraits -> nome em cada idioma
    "Inv": ("invertebrados (insetos, aranhas, moluscos)", "invertebrates (insects, spiders, molluscs)", "invertebrados (insectos, arañas, moluscos)", "Wirbellose (Insekten, Spinnen, Weichtiere)"),
    "Vend": ("aves e mamíferos", "birds and mammals", "aves y mamíferos", "Vögel und Säugetiere"),
    "Vect": ("répteis e anfíbios", "reptiles and amphibians", "reptiles y anfibios", "Reptilien und Amphibien"),
    "Vfish": ("peixes", "fish", "peces", "Fische"),
    "Vunk": ("outros vertebrados", "other vertebrates", "otros vertebrados", "andere Wirbeltiere"),
    "Scav": ("carniça", "carrion", "carroña", "Aas"),
    "Fruit": ("frutos", "fruits", "frutos", "Früchte"),
    "Nect": ("néctar", "nectar", "néctar", "Nektar"),
    "Seed": ("sementes", "seeds", "semillas", "Samen"),
    "PlantO": ("folhas, brotos e outras partes de plantas", "leaves, shoots and other plant parts", "hojas, brotes y otras partes de plantas", "Blätter, Triebe und andere Pflanzenteile"),
}
STRATA = {
    "WatBelowSurf": ("mergulhando abaixo da superfície da água", "diving below the water surface", "buceando bajo la superficie del agua", "tauchend unter der Wasseroberfläche"),
    "WatAroundSurf": ("na superfície da água ou à beira dela", "on or at the edge of the water surface", "en la superficie del agua o en su orilla", "an oder auf der Wasseroberfläche"),
    "Ground": ("no chão", "on the ground", "en el suelo", "am Boden"),
    "Understory": ("no sub-bosque", "in the understorey", "en el sotobosque", "im Unterholz"),
    "MidHigh": ("na altura média das árvores", "at mid-height in the trees", "a media altura de los árboles", "in mittlerer Baumhöhe"),
    "Canopy": ("na copa das árvores", "in the canopy", "en la copa de los árboles", "in den Baumkronen"),
    "Aerial": ("em voo", "in flight", "en vuelo", "im Flug"),
}


def diet_text(t, lang_i, family, fam_diet):
    lang = LANGS[lang_i]
    if t and t.get("diet"):
        parts = sorted(((v, k) for k, v in t["diet"].items() if v and v >= 10 and k in DIET_PARTS), reverse=True)
        if parts:
            pieces = [f"{DIET_PARTS[k][lang_i]} ({v}%)" for v, k in parts]
            lead = {"pt": "Dieta estimada", "en": "Estimated diet", "es": "Dieta estimada", "de": "Geschätzte Nahrung"}[lang]
            src = t.get("source", "EltonTraits 1.0")
            text = f"{lead} ({src}): {join_list(pieces, lang)}."
            strata = [STRATA[k][lang_i] for k, v in sorted(t.get("strata", {}).items(), key=lambda kv: -kv[1]) if v and v >= 30 and k in STRATA]
            if strata:
                text += " " + {"pt": "Procura alimento principalmente ", "en": "Forages mainly ", "es": "Busca alimento sobre todo ", "de": "Sucht Nahrung vor allem "}[lang] + join_list(strata, lang) + "."
            return text
    if t and t.get("dietItems"):
        pieces = [DIET_PARTS[k][lang_i] for k in t["dietItems"] if k in DIET_PARTS]
        if pieces:
            lead = {"pt": "Itens da dieta registrados", "en": "Recorded diet items", "es": "Elementos de la dieta registrados", "de": "Nachgewiesene Nahrung"}[lang]
            return f"{lead} ({t.get('source', 'AmphiBIO')}): {join_list(pieces, lang)}."
    if fam_diet:
        food = DIETS[fam_diet][lang_i]
        return {
            "pt": f"Como outras espécies da família {family}, alimenta-se principalmente de {food}.",
            "en": f"Like other species in the family {family}, it feeds mainly on {food}.",
            "es": f"Como otras especies de la familia {family}, se alimenta principalmente de {food}.",
            "de": f"Wie andere Arten der Familie {family} ernährt sie sich vor allem von {food}.",
        }[lang]
    return ""


def area_km(group, family, t, fam_area):
    """Raio do círculo do mapa (km): pela massa corporal quando conhecida, senão pela família."""
    mass_g = (t or {}).get("mass_g")
    carnivore = bool(t and t.get("diet") and (t["diet"].get("Vend", 0) + t["diet"].get("Vect", 0) + t["diet"].get("Vfish", 0) + t["diet"].get("Vunk", 0)) >= 50)
    if mass_g and group in ("Mamíferos", "Aves"):
        kg = mass_g / 1000
        # Área de vida cresce com a massa (relação alométrica); carnívoros usam áreas maiores.
        base = (0.35 if group == "Aves" else 0.6) * math.pow(max(kg, 0.005), 0.5) * (2.5 if carnivore else 1.0)
        return round(min(max(base, 0.2), 15.0), 2)
    return AREA_KM.get(fam_area or "s", 0.6)


def main():
    raw = json.load(open(os.path.join(ROOT, "data", "inat", "pantanal-vertebrados-raw.json"), encoding="utf8"))
    extra_path = os.path.join(ROOT, "data", "inat", "pantanal-vertebrados-gbif-extra.json")
    if os.path.exists(extra_path):
        known = {x["sci"].lower() for x in raw}
        raw += [x for x in json.load(open(extra_path, encoding="utf8")) if x["sci"].lower() not in known]
    current = json.load(open(os.path.join(ROOT, "data", "inat", "catalogo-atual.json"), encoding="utf8"))
    traits = load_traits()
    have_sci = {c["sci"].lower() for c in current}
    used_ids = {c["id"] for c in current}
    missing_family = set()
    out = []
    for item in sorted(raw, key=lambda x: (-x.get("count", 0), x["sci"])):
        sci = item["sci"]
        if sci in DOMESTIC or sci.lower() in have_sci or any(s for s in item.get("synAll", []) if s.lower() in have_sci):
            continue
        group = GROUP.get(item["cls"])
        if not group:
            continue
        family, family_pt = (item.get("family") or [None, None])[:2]
        if family in MARINE_FAMILIES:
            continue
        fam = FAMILIES.get(family or "")
        if not fam:
            missing_family.add(f"{item['cls']}:{family}")
        env_codes, fam_diet, fam_area = fam if fam else ("B", None, "s")
        environments = [ENV[c] for c in env_codes.split()]
        names = item.get("names") or {}
        pt_name = names.get("pt-BR") or names.get("pt") or sci
        base_id = slug(pt_name) if names.get("pt-BR") else slug(sci)
        sid = base_id
        if sid in used_ids:
            sid = f"{base_id}-{slug(sci.split()[-1])}"
        n = 2
        while sid in used_ids:
            sid = f"{base_id}-{n}"; n += 1
        used_ids.add(sid)
        t = traits.get(sci) or traits.get(sci.lower())

        photos = item.get("photos") or []
        photos = [p for p in photos if p and p[0] and p[1] in LICENSE] + [p for p in (item.get("obsPhotos") or []) if p and p[0] and p[1] in LICENSE]
        commercial = [p for p in photos if p[1] in COMMERCIAL]
        chosen = (commercial + [p for p in photos if p[1] not in COMMERCIAL])[:3]
        if not chosen:
            continue  # sem nenhuma foto com licença aberta: fica de fora até haver foto
        images = []
        for url, lic, attribution in chosen:
            if not url or not lic:
                continue
            author = re.sub(r"^\(c\)\s*", "", attribution or "").split(", some rights")[0].split(" (")[0].strip() or "iNaturalist"
            photo_id = re.search(r"/photos/(\d+)/", url)
            images.append({"uri": url, "author": author, "license": LICENSE.get(lic, lic.upper()),
                           "sourceUrl": f"https://www.inaturalist.org/photos/{photo_id.group(1)}" if photo_id else f"https://www.inaturalist.org/taxa/{item['id']}",
                           "credit": f"{author} / iNaturalist"})

        sources = [{"title": f"iNaturalist — {sci}", "url": f"https://www.inaturalist.org/taxa/{item['id']}"}]
        if item.get("wikiUrl"):
            sources.append({"title": "Wikipédia", "url": item["wikiUrl"].replace("http://", "https://").replace(" ", "_")})
        sources.append({"title": f"GBIF — {sci}", "url": f"https://www.gbif.org/species/search?q={sci.replace(' ', '%20')}"})
        if t and t.get("source"):
            sources.append({"title": t["source"], "url": t.get("sourceUrl", "https://doi.org/10.1890/13-1917.1")})

        exotic = sci in EXOTIC
        count = item.get("count", 0)
        mass = (t or {}).get("mass_g")
        texts = {}
        for i, lang in enumerate(LANGS):
            name = names.get(INAT_LOC[lang]) or (pt_name if lang == "pt" else names.get("en") or pt_name)
            wiki = sentences((item.get("wiki") or {}).get(INAT_LOC[lang], ""), 460)
            gword = GROUP_T[group][i]
            fam_label = f"{family_pt} ({family})" if (lang == "pt" and family_pt and family_pt != family) else family
            envs = join_list([ENV_T[e][i] for e in environments], lang)
            if wiki:
                description = wiki
            else:
                description = {
                    "pt": f"{cap(gword)} da família {fam_label}, registrado no Pantanal.",
                    "en": f"A {gword} of the family {family}, recorded in the Pantanal.",
                    "es": f"{cap(gword)} de la familia {family}, registrado en el Pantanal.",
                    "de": f"{cap(gword)} aus der Familie {family}, im Pantanal nachgewiesen.",
                }[lang]
            if exotic:
                description += {"pt": " Espécie exótica: foi introduzida pelo ser humano e vive solta no Pantanal.",
                                "en": " Exotic species: introduced by people and now living wild in the Pantanal.",
                                "es": " Especie exótica: introducida por el ser humano, vive en libertad en el Pantanal.",
                                "de": " Gebietsfremde Art: vom Menschen eingeführt, lebt heute frei im Pantanal."}[lang]
            physical = ""
            size = (t or {}).get("size_mm")
            if size and not mass:
                physical = {"pt": f"Comprimento corporal de cerca de {size:.0f} mm.", "en": f"Body length of about {size:.0f} mm.",
                            "es": f"Longitud corporal de unos {size:.0f} mm.", "de": f"Körperlänge von etwa {size:.0f} mm."}[lang]
            if mass:
                weight = f"{mass/1000:.1f} kg" if mass >= 1000 else f"{mass:.0f} g"
                if lang != "en":
                    weight = weight.replace(".", ",")
                physical = {"pt": f"Massa corporal média de cerca de {weight}.", "en": f"Average body mass of about {weight}.",
                            "es": f"Masa corporal media de unos {weight}.", "de": f"Durchschnittliche Körpermasse von etwa {weight}."}[lang]
            habitat = {"pt": f"No Pantanal, típico de {envs}.", "en": f"In the Pantanal, typical of {envs}.",
                       "es": f"En el Pantanal, típico de {envs}.", "de": f"Im Pantanal typisch für {envs}."}[lang] if envs else ""
            if not fam:
                habitat = ""
            behavior = ""
            if t and t.get("nocturnal") is not None:
                behavior = ({"pt": "Ativo principalmente à noite.", "en": "Active mainly at night.", "es": "Activo sobre todo de noche.", "de": "Vor allem nachtaktiv."} if t["nocturnal"]
                            else {"pt": "Ativo principalmente de dia.", "en": "Active mainly by day.", "es": "Activo sobre todo de día.", "de": "Vor allem tagaktiv."})[lang]
            distribution = {"pt": f"Registrada no Pantanal brasileiro: {count} observações confirmadas no iNaturalist.",
                            "en": f"Recorded in the Brazilian Pantanal: {count} confirmed observations on iNaturalist.",
                            "es": f"Registrada en el Pantanal brasileño: {count} observaciones confirmadas en iNaturalist.",
                            "de": f"Im brasilianischen Pantanal nachgewiesen: {count} bestätigte Beobachtungen auf iNaturalist."}[lang] if count else {
                            "pt": "Registrada no Pantanal brasileiro em coleções científicas (GBIF).",
                            "en": "Recorded in the Brazilian Pantanal in scientific collections (GBIF).",
                            "es": "Registrada en el Pantanal brasileño en colecciones científicas (GBIF).",
                            "de": "In wissenschaftlichen Sammlungen aus dem brasilianischen Pantanal belegt (GBIF)."}[lang]
            texts[lang] = {"name": name, "description": description, "physical": physical, "habitat": habitat, "behavior": behavior,
                           "diet": diet_text(t, i, family, fam_diet), "distribution": distribution}
        status = item.get("iucn")
        out.append({
            "id": sid, "sci": sci, "group": group, "env": environments, "family": family, "familyPt": family_pt,
            "order": (item.get("order") or [None])[0], "inat": item["id"], "count": count, "exotic": exotic,
            "areaKm": area_km(group, family, t, fam_area), "status": status, "statusText": list(IUCN[status]) if status in IUCN else None,
            "images": images, "sources": sources, "t": texts,
        })
    dest = os.path.join(ROOT, "shared", "catalog", "generated")
    os.makedirs(dest, exist_ok=True)
    json.dump(out, open(os.path.join(dest, "vertebrados.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    by = {}
    for x in out:
        by[x["group"]] = by.get(x["group"], 0) + 1
    print(len(out), "espécies geradas", by, "| com traits:", sum(1 for x in out if x["t"]["pt"]["physical"]))
    if missing_family:
        print("famílias sem mapa:", sorted(missing_family))


if __name__ == "__main__":
    main()
