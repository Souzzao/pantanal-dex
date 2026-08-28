# Auditoria GBIF das espécies legadas — passo 7/50

Consulta executada em 2026-08-28T01:32:53.323Z contra as URLs GBIF versionadas nos registros do catálogo.

| ID | Nome esperado | Canonical name GBIF | Usage key | Status | Match type | Confiança | Resultado |
|---|---|---|---:|---|---|---:|---|
| `pintado` | Pseudoplatystoma corruscans | Pseudoplatystoma corruscans | 2338660 | ACCEPTED | EXACT | 99 | PASS |
| `pacu` | Piaractus mesopotamicus | Piaractus mesopotamicus | 2353219 | ACCEPTED | EXACT | 99 | PASS |
| `piraputanga` | Brycon hilarii | Brycon hilarii | 2353507 | ACCEPTED | EXACT | 99 | PASS |
| `caranguejo-agua-doce` | Dilocarcinus pagei | Dilocarcinus pagei | 2224021 | ACCEPTED | EXACT | 99 | PASS |
| `camarao-agua-doce` | Macrobrachium amazonicum | Macrobrachium amazonicum | 2224710 | ACCEPTED | EXACT | 99 | PASS |

**Resultado geral:** PASS. 5/5 registros consultados; 0 erro(s).

## Regra de promoção

A correspondência taxonômica GBIF confirma apenas identidade e status taxonômico. Ela não confirma ocorrência regional no Pantanal, conservação, licença de imagem ou revisão editorial; essas trilhas permanecem separadas e podem bloquear a promoção a `verified`.

Nenhum erro taxonômico foi encontrado.
