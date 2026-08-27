# Passo 36/50 — validação oficial de conservação da aranha-armadeira

## Alvo

A sequência pós-P1/P2 segue para a aranha-armadeira, `Phoneutria nigriventer`, incorporada no passo 31.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Phoneutria nigriventer`, `nigriventer`, `Phoneutria` e `Ctenus`. Não foi localizada correspondência exata para o táxon do catálogo. O documento contém outros gêneros e espécies de Ctenidae, mas esses resultados não foram confundidos com a espécie-alvo.

A ausência será registrada como `not-listed` limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Registro V3 do passo 36/60 — validação regional individualizada do Lote 02

## Escopo

O passo 36 consolidou a triagem regional dos 15 candidatos do Lote 02 com táxon confirmado no GBIF e busca de ocorrência no retângulo operacional `decimalLatitude=-22,-15` e `decimalLongitude=-61,-54`.

## Resultado por táxon

| Táxon | Chave GBIF | Ocorrências no recorte | Estado regional |
|---|---:|---:|---|
| *Brycon orbignyanus* | 2353463 | 1 | `pending-review` |
| *Serrasalmus maculatus* | 2354117 | 170 | `pending-review` |
| *Serrasalmus marginatus* | 2354121 | 183 | `pending-review` |
| *Gymnotus inaequilabiatus* | 5212821 | 39 | `pending-review` |
| *Eigenmannia virescens* | 2402039 | 64 | `pending-review` |
| *Rhamdia quelen* | 2343735 | 199 | `pending-review` |
| *Synbranchus marmoratus* | 2351979 | 148 | `pending-review` |
| *Crenicichla britskii* | 2371008 | 5 | `pending-review` |
| *Hemisorubim platyrhynchos* | 2338702 | 148 | `pending-review` |
| *Loricariichthys platymetopon* | 2339173 | 86 | `pending-review` |
| *Paleosuchus palpebrosus* | 2441396 | 47 | `pending-review` |
| *Micrablepharus maximiliani* | 5222394 | 48 | `pending-review` |
| *Phrynops geoffroanus* | 2442094 | 32 | `pending-review` |
| *Podocnemis unifilis* | 2442782 | 0 | `pending-review` |
| *Hydrodynastes gigas* | 2454428 | 101 | `pending-review` |

A consulta estruturada retorna sinais de ocorrência, mas não substitui uma fonte regional narrativa individualizada. Por isso os 15 registros foram adicionados ao ledger regional como `pending-review`. O zero de *Podocnemis unifilis* não foi interpretado como ausência.

## Conservação normativa relacionada

A mesma rodada consolidou a Portaria MMA nº 148/2022 para o Lote 02. *Brycon orbignyanus* permanece com correspondência exata e categoria CR. Os demais 14 táxons permanecem `not-listed` na lista consultada, sem inferência de LC ou de qualquer categoria de baixo risco.

## Mídias e licenças

Nenhuma imagem foi inserida ou aprovada. A validação comercial continua separada, com exigência de autoria, URL e licença compatível com uso comercial, sem NC/ND.

## Checks

| Verificação | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm lint` | PASS; aviso preexistente de módulo do ESLint |
| `pnpm test` | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 38 registros, 0 pendências |
| Auditoria regional | PASS; 22 registros, 7 confirmados e 15 pendentes |
| `git diff --check` | PASS |

## Referências

[1]: https://api.gbif.org/v1/species/match "GBIF Species Match API"
[2]: https://api.gbif.org/v1/occurrence/search "GBIF Occurrence Search API"
[3]: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal "ICMBio — Pantanal"
[4]: https://www.scielo.br/j/bjb/a/cTbDFzkGmpNjD4RKnsxfTwn/?lang=en "Alho — Biodiversity of the Pantanal"
[5]: https://checklist.pensoft.net/article/26813/ "Fischer et al. — Roadkill records of reptiles and birds in Cerrado and Pantanal landscapes"
