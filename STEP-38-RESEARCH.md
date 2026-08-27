# Passo 38/50 — validação oficial de conservação da dança-ninfas

## Alvo

A sequência P2 segue para a dança-ninfas, `Heliconius erato`, registro modular já incorporado ao catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Heliconius erato`, `erato phyllis` e variações do nome. Não foi localizada correspondência exata para a espécie ou para a subespécie brasileira `Heliconius erato phyllis` no texto extraído. O anexo contém outros Lepidoptera e Nymphalidae, que não foram confundidos com o táxon-alvo.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Registro V3 do passo 38/60 — fontes regionais dos táxons pendentes

## Resultado

A revisão de répteis do Mato Grosso do Sul, publicada em *Iheringia, Série Zoologia*, compila registros de literatura, coleções científicas e dados de campo. Sua tabela de composição indica ocorrência no domínio Pantanal (código PA) para quatro candidatos do Lote 02: *Paleosuchus palpebrosus*, *Micrablepharus maximiliani*, *Phrynops geoffroanus* e *Hydrodynastes gigas*. Esses quatro táxons foram promovidos para `confirmed` no ledger regional, sempre mantendo a identidade taxonômica GBIF separada da evidência regional.

| Táxon | Evidência | Estado |
|---|---|---|
| *Paleosuchus palpebrosus* | Tabela estadual com ocorrência no Pantanal (PA) | `confirmed` |
| *Micrablepharus maximiliani* | Tabela estadual com ocorrência no Pantanal (PA) | `confirmed` |
| *Phrynops geoffroanus* | Tabela estadual com ocorrência no Pantanal (PA) | `confirmed` |
| *Hydrodynastes gigas* | Tabela estadual com ocorrência no Pantanal (PA) e discussão de áreas alagadas | `confirmed` |
| *Podocnemis unifilis* | A própria revisão registra o táxon como espécie exótica para o MS, associada à Amazônia e ao Cerrado | `pending-review` |

Os três peixes restantes — *Brycon orbignyanus*, *Rhamdia quelen* e *Crenicichla britskii* — permanecem `pending-review` porque as fontes regionais consultadas nesta rodada não forneceram uma identificação individual direta no Pantanal compatível com o contrato de promoção.

A ressalva sobre *Podocnemis unifilis* é deliberadamente conservadora: o retorno zero no recorte GBIF não prova ausência, mas a fonte estadual também não autoriza promover a espécie como ocorrência pantaneira; portanto, o estado pendente é mantido.

## Estado consolidado do ledger

| Métrica | Resultado |
|---|---:|
| Registros regionais | 22 |
| Confirmados | 18 |
| `pending-review` | 4 |
| Erros do auditor | 0 |

## Conservação e licenciamento

A conservação normativa continua no ledger separado: *Brycon orbignyanus* permanece CR na Portaria MMA nº 148/2022 e os demais candidatos do Lote 02 permanecem `not-listed`, sem inferência de LC. Nenhuma imagem foi inserida ou promovida; a auditoria comercial continua exigindo metadados diretos e licença compatível com uso comercial, sem NC/ND.

## Checks finais

| Verificação | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm lint` | PASS; aviso preexistente de módulo do ESLint |
| `pnpm test` | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 38 registros, 0 pendências |
| Auditoria regional | PASS; 22 registros, 18 confirmados e 4 pendentes |
| `git diff --check` | PASS |

## Referências

[2]: https://www.scielo.br/j/isz/a/hXJx474GnYHQtqpLGtxXcWn/?lang=pt "SciELO — Répteis do Mato Grosso do Sul, Brasil"
[3]: https://api.gbif.org/v1/species/match "GBIF Species Match API"
[4]: https://api.gbif.org/v1/occurrence/search "GBIF Occurrence Search API"
