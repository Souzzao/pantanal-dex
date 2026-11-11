#!/usr/bin/env python3
"""Gera shared/i18n/species.<idioma>.ts a partir de arquivos .jsonl (uma espécie por linha)."""
import glob, json, sys
src, ids_file = sys.argv[1], sys.argv[2]
ids = [json.loads(l)[0] for l in open(ids_file, encoding="utf8") if l.strip()]
for code, name in (("en", "En"), ("es", "Es"), ("de", "De")):
    rows = {}
    for f in sorted(glob.glob(f"{src}/{code}-*.jsonl")):
        for n, line in enumerate(open(f, encoding="utf8"), 1):
            if not line.strip(): continue
            r = json.loads(line)
            assert len(r) == 10 and isinstance(r[7], list) and all(isinstance(x, str) and x.strip() for i, x in enumerate(r) if i != 7), (f, n)
            assert r[0] in ids, (f, n, r[0]); assert r[0] not in rows, (f, n, "dup")
            rows[r[0]] = r[1:]
    body = "\n".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}," for k, v in rows.items())
    open(f"shared/i18n/species.{code}.ts", "w", encoding="utf8").write(f'import type {{ SpeciesTranslation }} from "./index";\n\n// Gerado por scripts/build-i18n.py — não editar à mão.\nexport const species{name}: Record<string, SpeciesTranslation> = {{\n{body}\n}};\n')
    print(code, len(rows), "de", len(ids), "faltam:", [i for i in ids if i not in rows][:5])
