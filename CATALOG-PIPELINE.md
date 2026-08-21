# PantanalDex — arquitetura modular e pipeline de catálogo

## Estado do Ciclo 2

O catálogo público mantém os registros legados e passa a incorporar lotes em `shared/catalog/batches/`. O índice em `shared/catalog/index.ts` reúne os lotes, calcula a validação agregada e expõe `catalogSpecies`. O índice de descoberta em `shared/catalog.ts` combina o catálogo legado com os lotes modulares por meio de deduplicação por `id`, preservando as funções usadas pelas telas existentes.

| Lote piloto | Grupo | Espécies | Estado |
|---|---:|---:|---|
| `catalog-mammals-01` | Mamíferos | 3 | `pending-review` |
| `catalog-birds-01` | Aves | 3 | `pending-review` |
| `catalog-reptiles-01` | Répteis | 2 | `pending-review` |
| `catalog-amphibians-01` | Anfíbios | 2 | `pending-review` |
| **Total** | **4 grupos** | **10** | **validado automaticamente** |

## Pipeline de lote

Cada lote declara `batchId`, ciclo, grupo, estado, fontes, notas pendentes e espécies. A validação verifica o formato do identificador, ciclo entre 1 e 20, grupo coerente, campos textuais obrigatórios, ambientes permitidos, três imagens, URLs HTTP, crédito, licença comercial, fontes aprovadas e IDs únicos dentro e entre lotes. A regra de licenciamento está detalhada em `LICENSES.md`.

O estado `pending-review` é intencional: indica que o lote passou pelas validações estruturais, mas ainda possui pendências editoriais que precisam ser confirmadas manualmente antes de ser promovido a `verified`. Nenhum lote pendente deve ser usado como comprovação de status de conservação.

## Vazão e recalibração

O lote piloto entregou **10 espécies em quatro módulos** e passou com 21 testes no conjunto do projeto. Essa vazão é a métrica inicial para o Ciclo 3. Após a revisão de licenças e fontes, a Conta 2 pode aumentar o lote gradualmente, sempre mantendo PRs pequenos, IDs únicos e relatório de pendências. O objetivo de 3.000+ espécies será alcançado por lotes independentes, não por um arquivo monolítico.

## Compatibilidade

As funções `filterSpeciesCatalog`, `sortSpeciesCatalog` e `paginateSpeciesCatalog` continuam públicas. A busca é normalizada sem acentos, os resultados são paginados e o loader não renderiza todos os registros de uma vez. O catálogo legado continua sendo a origem usada pelos contratos de persistência; a migração de `Sighting` para o registro unificado de lotes deve ocorrer em ciclo próprio, com teste de migração e sem apagar dados locais.
