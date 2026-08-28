# Passo 54/60 — ordenação operacional de avistamentos

A listagem de avistamentos recebeu ordenação configurável integrada ao mecanismo de filtros do passo 53. O usuário pode ordenar por data do avistamento, espécie, local ou data de atualização, alternando entre direção ascendente e descendente.

A implementação está centralizada em `sortSightings`, no módulo `lib/sightings-filter.ts`. A função trabalha sobre uma cópia indexada da coleção, portanto não modifica o estado original. Quando dois registros possuem a mesma chave, o índice original é usado como desempate, garantindo estabilidade previsível e evitando que a interface reorganize registros equivalentes de maneira arbitrária.

A ordenação é aplicada somente depois dos filtros de busca, data, visibilidade e GPS. Dessa forma, o contador da tela continua representando o conjunto efetivamente filtrado, enquanto a ordem escolhida afeta apenas a apresentação. A `FlatList`, a memoização de `SightingRow` e o `useDeferredValue` permanecem ativos para suportar grandes volumes.

| Critério | Direções |
|---|---|
| Data do avistamento | Ascendente/descendente |
| Espécie | A–Z/Z–A, com comparação sensível a acentos normalizada |
| Local | A–Z/Z–A |
| Atualização | Mais recente/mais antiga |
| Empates | Ordem original preservada |
| Privacidade | Nenhuma alteração ou exposição adicional |
| Volume | Testado com 3.000 registros |

Foram adicionados testes para datas ascendentes e descendentes, estabilidade em empates e ordenação alfabética por espécie e local. A validação passou com `pnpm check`, `pnpm lint`, **38 testes aprovados e 1 ignorado**, todas as auditorias científicas e comerciais e `git diff --check`.

O catálogo permanece com 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos, sem estados pendentes e sem alterações na política de licenciamento comercial.
