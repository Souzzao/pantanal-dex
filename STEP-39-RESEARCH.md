# Passo 39/50 — validação oficial de conservação da garça-branca-pequena

## Alvo

A sequência P2 segue para a garça-branca-pequena, `Egretta thula`, registro prioritário do catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Egretta thula`, `thula` e `Egretta`. Não foi localizada correspondência exata para o táxon no texto extraído. As ocorrências residuais de “Egretta” ou “thula” pertencem a outros termos botânicos ou não configuram a espécie-alvo; não foram usadas para inferir categoria.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Registro V3 do passo 39/60 — fechamento das pendências regionais

## Escopo

Foram pesquisados *Brycon orbignyanus*, *Rhamdia quelen*, *Crenicichla britskii* e *Podocnemis unifilis* em fontes acadêmicas e institucionais abertas, priorizando vínculo direto ao Pantanal ou à Bacia do Alto Paraguai.

## Resultado

Nenhuma das quatro fontes encontradas sustentou promoção regional individual direta no contrato vigente. *Brycon orbignyanus* apareceu em resultados associados a outras bacias, cultivo ou distribuição ampla, mas não em uma fonte primária pantaneira suficientemente específica. *Rhamdia quelen* e *Crenicichla britskii* apareceram em materiais de outras bacias ou em referências gerais, sem confirmação individual adequada para o Pantanal. *Podocnemis unifilis* permaneceu pendente porque a revisão estadual consultada a registra como espécie exótica para o Mato Grosso do Sul, associada à Amazônia e ao Cerrado; o retorno zero no recorte GBIF também não foi usado para inferir ausência.

| Táxon | Estado final | Motivo conservador |
|---|---|---|
| *Brycon orbignyanus* | `pending-review` | Sem fonte primária pantaneira individual direta nesta rodada |
| *Rhamdia quelen* | `pending-review` | Resultados encontrados não vinculam individualmente o táxon ao Pantanal |
| *Crenicichla britskii* | `pending-review` | Resultados regionais encontrados são de outras áreas ou não demonstram o recorte pantaneiro |
| *Podocnemis unifilis* | `pending-review` | Fonte estadual registra ressalva de espécie exótica no MS; contagem GBIF zero não é ausência |

## Estado consolidado

O ledger regional permanece com **22 registros**, sendo **18 confirmados** e **4 em `pending-review`**. Nenhuma ocorrência pendente foi promovida por inferência geográfica, fonte genérica ou contagem isolada do GBIF.

A conservação continua no ledger independente: *Brycon orbignyanus* está como CR na Portaria MMA nº 148/2022 e os outros 14 candidatos do Lote 02 como `not-listed`, sem conversão para LC. Nenhuma mídia ou licença foi inserida.

## Checks

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
[3]: https://checklist.pensoft.net/article/18852/download/pdf/286620 "Check List — Fishes from the Parque Nacional do Pantanal Matogrossense"
[4]: https://api.gbif.org/v1/species/match "GBIF Species Match API"
[5]: https://api.gbif.org/v1/occurrence/search "GBIF Occurrence Search API"
