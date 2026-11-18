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

Autor: Felipe de Souza Aquino (PantanalDex)
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
MAX_PHOTOS = 6  # fotos por espécie (galeria da ficha)
# O app é vendido: só entram fotos que permitem uso comercial (CC0, CC BY, CC BY-SA).
# Fotos CC BY-NC / BY-ND ficam de fora mesmo que sejam as únicas da espécie.
COMMERCIAL_ONLY = True

# Mesma espécie com nome científico antigo/de outra região: fica só a versão do Pantanal.
# (o id que sai é redirecionado em shared/species-aliases.ts)
SYNONYM_DROP = {
    "Chelonoidis carbonarius": "Chelonoidis carbonaria",
    "Pseudoplatystoma fasciatum": "Pseudoplatystoma reticulatum",  # cachara do Pantanal é P. reticulatum
    "Pipile cumanensis": "Pipile grayi",          # a forma do Pantanal foi separada como P. grayi
    "Mazama americana": "Mazama rufa",            # veado-mateiro do Pantanal após a revisão do gênero
    "Rhinella marina": "Rhinella diptycha",       # o cururu do Pantanal é R. diptycha
    "Daptrius chimachima": "Milvago chimachima",  # carrapateiro (gênero mudou)
    "Pithecopus azureus": "Phyllomedusa azurea",  # perereca-de-folhagem-azul (gênero mudou)
}

# Nomes populares próprios para espécies que o iNaturalist chama pelo nome do grupo.
NAME_FIX = {
    "Piaractus brachypomus": "Pirapitinga",
    "Metynnis maculatus": "Pacu-peva",
    "Trachelyopterus galeatus": "Cangati",
    "Galeocharax humeralis": "Saicanga",
    "Pimelodus pantaneiro": "Mandi-pantaneiro",
    "Philodryas nattereri": "Corre-campo",
    "Pithecopus hypochondrialis": "Perereca-de-pernas-laranja",
    "Metynnis mola": "Pacu-peva",
    "Bothrops neuwiedi": "Jararaca-pintada",
    "Clelia clelia": "Muçurana",
    "Synbranchus marmoratus": "Mussum",
    "Xenodon merremii": "Boipeva",
    "Scinax fuscovarius": "Perereca-de-banheiro",
    "Leptodactylus latrans": "Rã-manteiga",
}


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
    """Raio da elipse do mapa (km), da própria espécie sempre que há dado:
    - aves e mamíferos: área de vida cresce com a massa (raio ∝ √massa, ou seja área ∝ massa, como nas
      relações alométricas de área de vida); quanto mais vertebrados na dieta (EltonTraits), maior;
    - anfíbios: massa ou comprimento do AmphiBIO;
    - répteis e peixes: massa/comprimento quando houver base (traits), senão a classe da família.
    """
    t = t or {}
    mass_g, size_mm = t.get("mass_g"), t.get("size_mm")
    diet = t.get("diet") or {}
    vert = sum(diet.get(k, 0) for k in ("Vend", "Vect", "Vfish", "Vunk")) / 100.0
    if mass_g and group in ("Mamíferos", "Aves"):
        kg = mass_g / 1000
        base = (0.35 if group == "Aves" else 0.6) * math.pow(max(kg, 0.002), 0.5) * (1 + 1.5 * vert)
        return round(min(max(base, 0.03), 15.0), 3 if base < 1 else 2)
    if group == "Anfíbios" and (mass_g or size_mm):
        r = 0.04 * math.sqrt(mass_g) if mass_g else 0.004 * size_mm
        return round(min(max(r, 0.02), 1.0), 3)
    if group in ("Répteis", "Peixes") and (mass_g or size_mm):
        if mass_g:
            r = (0.25 if group == "Répteis" else 0.4) * math.pow(max(mass_g / 1000, 0.001), 0.5)
        else:
            r = (0.003 if group == "Répteis" else 0.004) * size_mm
        return round(min(max(r, 0.02), 8.0), 3 if r < 1 else 2)
    return AREA_KM.get(fam_area or "s", 0.6)

GBIF_LANG = {"pt": "por", "en": "eng", "es": "spa", "de": "deu"}


def nice(name):
    """'Cobra-de-Duas-Cabeças' -> 'Cobra-de-duas-cabeças' (padrão dos nomes populares em pt)."""
    name = name.strip()
    parts = re.split(r"([- ])", name)
    return "".join([parts[0][:1].upper() + parts[0][1:]] + [p.lower() if i % 2 == 0 else p for i, p in enumerate(parts[1:], 1)]) if name else name


def gbif_names():
    """Nomes populares do GBIF (vernacularNames) para espécies sem nome no iNaturalist: escolhe o mais citado
    que não seja de outra espécie; nomes genéricos repetidos (ex.: 'Acará') ficam para a mais específica."""
    path = os.path.join(ROOT, "data", "inat", "gbif-vernaculares.json")
    if not os.path.exists(path):
        return {}
    raw = json.load(open(path, encoding="utf8"))
    out = {}
    for lang, code in GBIF_LANG.items():
        options = {}
        for sci, rows in raw.items():
            names = [nice(r[1]) for r in rows if r[0] == code and r[1] and len(r[1]) < 40]
            if names:
                counts = {}
                for n in names:
                    counts[n] = counts.get(n, 0) + 1
                options[sci] = sorted(counts, key=lambda n: (-counts[n], -len(n)))
        used = {}
        for sci, opts in options.items():
            for n in opts:
                used[n] = used.get(n, 0) + 1
        for sci, opts in options.items():
            unique = [n for n in opts if used[n] == 1]
            pick = unique[0] if unique else max(opts, key=len)
            out.setdefault(sci, {})[lang] = pick
    return out


def make_images(item, fotos_v2):
    """Fotos de uso livre da espécie (até MAX_PHOTOS), com crédito e link da fonte."""
    photos = item.get("photos") or []
    photos = [p for p in photos + (item.get("obsPhotos") or []) + fotos_v2.get(str(item["id"]), []) if p and p[0] and p[1] in LICENSE]
    seen, unique = set(), []
    for p in photos:  # a mesma foto pode vir das duas buscas
        key = (re.search(r"/photos/(\d+)/", p[0]) or re.search(r".*", p[0])).group(0)
        if key not in seen:
            seen.add(key); unique.append(p)
    commercial = [p for p in unique if p[1] in COMMERCIAL]
    chosen = (commercial if COMMERCIAL_ONLY else commercial + [p for p in unique if p[1] not in COMMERCIAL])[:MAX_PHOTOS]
    # Com COMMERCIAL_ONLY a espécie fica no catálogo mesmo sem foto (a ficha mostra um aviso).
    images = []
    for url, lic, attribution in chosen:
        if not url or not lic:
            continue
        author = re.sub(r"^\(c\)\s*", "", attribution or "").split(", some rights")[0].split(" (")[0].strip() or "iNaturalist"
        photo_id = re.search(r"/photos/(\d+)/", url)
        if "wikimedia.org" in url:
            author = author.replace(", Wikimedia Commons", "")
            file_name = urllib.parse.unquote(url.split("/")[-2] if "/thumb/" in url else url.split("/")[-1])
            source_url, site = f"https://commons.wikimedia.org/wiki/File:{urllib.parse.quote(file_name)}", "Wikimedia Commons"
        elif photo_id or "inaturalist" in url:
            source_url = f"https://www.inaturalist.org/photos/{photo_id.group(1)}" if photo_id else f"https://www.inaturalist.org/taxa/{item['id']}"
            site = "iNaturalist"
        else:
            author = author.replace(", GBIF", "")
            source_url, site = url, "GBIF"
        images.append({"uri": url, "author": author, "license": LICENSE.get(lic, lic.upper()),
                       "sourceUrl": source_url, "credit": f"{author} / {site}"})
    return images


def main():
    raw = json.load(open(os.path.join(ROOT, "data", "inat", "pantanal-vertebrados-raw.json"), encoding="utf8"))
    extra_path = os.path.join(ROOT, "data", "inat", "pantanal-vertebrados-gbif-extra.json")
    if os.path.exists(extra_path):
        known = {x["sci"].lower() for x in raw}
        raw += [x for x in json.load(open(extra_path, encoding="utf8")) if x["sci"].lower() not in known]
    current = json.load(open(os.path.join(ROOT, "data", "inat", "catalogo-atual.json"), encoding="utf8"))
    traits = load_traits()
    # Fotos extras buscadas pelo GitHub Actions (scripts/catalog/fetch_photos.py), por id do táxon.
    v2_path = os.path.join(ROOT, "data", "inat", "fotos-v2.json")
    fotos_v2 = json.load(open(v2_path, encoding="utf8")) if os.path.exists(v2_path) else {}
    gnames = gbif_names()
    tpath = os.path.join(ROOT, "data", "inat", "traducoes-descricoes.json")
    translated = json.load(open(tpath, encoding="utf8")) if os.path.exists(tpath) else {}
    have_sci = {c["sci"].lower() for c in current}
    curated_by_sci = {c["sci"].lower(): c["id"] for c in current}
    curated_extra = {}
    used_ids = {c["id"] for c in current}
    missing_family = set()
    out = []
    for item in sorted(raw, key=lambda x: (-x.get("count", 0), x["sci"])):
        sci = item["sci"]
        if sci in SYNONYM_DROP:
            continue
        if sci in DOMESTIC or sci.lower() in have_sci or any(s for s in item.get("synAll", []) if s.lower() in have_sci):
            cid = curated_by_sci.get(sci.lower()) or next((curated_by_sci[s.lower()] for s in item.get("synAll", []) if s.lower() in curated_by_sci), None)
            if cid and cid not in curated_extra:
                curated_extra[cid] = make_images(item, fotos_v2)  # fotos extras para as fichas escritas à mão
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
        id_name = pt_name  # o id não muda quando o nome é corrigido (registros antigos usam o id)
        pt_name = NAME_FIX.get(sci, pt_name)
        base_id = slug(id_name) if names.get("pt-BR") else slug(sci)
        sid = base_id
        if sid in used_ids:
            sid = f"{base_id}-{slug(sci.split()[-1])}"
        n = 2
        while sid in used_ids:
            sid = f"{base_id}-{n}"; n += 1
        used_ids.add(sid)
        t = traits.get(sci) or traits.get(sci.lower())

        images = make_images(item, fotos_v2)

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
            name = NAME_FIX[sci] if lang == "pt" and sci in NAME_FIX else (names.get(INAT_LOC[lang]) or (gnames.get(sci) or {}).get(lang) or (pt_name if lang == "pt" else names.get("en") or pt_name))
            wiki = sentences((item.get("wiki") or {}).get(INAT_LOC[lang], ""), 460)
            gword = GROUP_T[group][i]
            fam_label = f"{family_pt} ({family})" if (lang == "pt" and family_pt and family_pt != family) else family
            envs = join_list([ENV_T[e][i] for e in environments], lang)
            if not wiki and (translated.get(sid) or {}).get(lang):
                wiki = translated[sid][lang].strip()
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
    # Nomes repetidos: cada espécie precisa de um nome que dê para distinguir na busca.
    # Fica com o nome puro a espécie curada à mão ou, se não houver, a mais observada; as outras ganham
    # o epíteto entre parênteses, ex.: "Tuvira (omarorum)".
    import unicodedata
    norm = lambda n: re.sub(r"[\s’'-]+", "", "".join(c for c in unicodedata.normalize("NFD", n.strip().lower()) if unicodedata.category(c) != "Mn"))
    for x in out:  # padroniza: inicial maiúscula e apóstrofo reto ("Cobra-D’água" → "Cobra-d'água")
        name = x["t"]["pt"]["name"].replace("’", "'").replace("-D'", "-d'")
        x["t"]["pt"]["name"] = name[:1].upper() + name[1:]
    taken = {norm(c["name"]) for c in current if c.get("name")}
    renamed = 0
    for x in sorted(out, key=lambda x: (x["sci"] not in NAME_FIX, -x["count"])):
        name = x["t"]["pt"]["name"]
        if norm(name) in taken:
            name = f"{name} ({x['sci'].split()[-1]})"
            x["t"]["pt"]["name"] = name
            renamed += 1
        taken.add(norm(name))
    print("nomes desambiguados:", renamed)

    dest = os.path.join(ROOT, "shared", "catalog", "generated")
    os.makedirs(dest, exist_ok=True)
    json.dump(out, open(os.path.join(dest, "vertebrados.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    for c in current:  # fichas fora das listas de vertebrados: fotos achadas pelo nome científico
        tid = (fotos_v2.get("_curated_taxa") or {}).get(c["sci"])
        if tid and not curated_extra.get(c["id"]):
            curated_extra[c["id"]] = make_images({"id": tid, "photos": []}, fotos_v2)
    json.dump(curated_extra, open(os.path.join(dest, "fotos-curadas.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    print("fichas curadas com fotos extras:", sum(1 for v in curated_extra.values() if v), "de", len(current))
    # Capas embutidas no app (scripts/catalog/embed_covers.py baixa e reduz): primeira foto + reservas.
    covers_path = os.path.join(ROOT, "data", "inat", "capas-para-embutir.json")
    if os.path.exists(covers_path):
        generated = {x["id"]: x for x in out}
        covers = []
        for entry in json.load(open(covers_path, encoding="utf8")):
            sp = generated.get(entry["id"])
            if sp is None:
                covers.append(entry)  # espécie curada à mão: mantém a capa escolhida
            elif sp["images"]:
                urls = [img["uri"] for img in sp["images"]]
                covers.append({"id": sp["id"], "url": urls[0], "alternativas": urls[1:3]})
        known = {c["id"] for c in covers}
        covers += [{"id": x["id"], "url": x["images"][0]["uri"], "alternativas": [i["uri"] for i in x["images"][1:3]]}
                   for x in out if x["images"] and x["id"] not in known]
        json.dump(covers, open(covers_path, "w", encoding="utf8"), ensure_ascii=False, indent=2)
        print("capas para embutir:", len(covers), "| espécies sem foto comercial:", sum(1 for x in out if not x["images"]))
    by = {}
    for x in out:
        by[x["group"]] = by.get(x["group"], 0) + 1
    print(len(out), "espécies geradas", by, "| com traits:", sum(1 for x in out if x["t"]["pt"]["physical"]))
    if missing_family:
        print("famílias sem mapa:", sorted(missing_family))


if __name__ == "__main__":
    main()
