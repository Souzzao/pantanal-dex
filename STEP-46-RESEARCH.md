# Passo 46/60 — persistência local resiliente

O contexto global foi reforçado para suportar volumes maiores de avistamentos sem depender de uma única string JSON monolítica. O armazenamento agora usa um manifesto versionado (`version: 2`) e blocos de 100 registros em `AsyncStorage`, com gravação dos blocos seguida da publicação do manifesto. O desenho evita que um estado parcial seja anunciado como completo e diminui o custo de reserializar o conjunto inteiro em cada alteração.

A leitura consulta o manifesto e carrega os blocos com `multiGet`. Dados legados encontrados na chave anterior `pantanal-dex:sightings` continuam sendo aceitos, permitindo migração sem apagar registros existentes. Após uma gravação bem-sucedida, a chave legada é removida e blocos excedentes são limpos.

A camada inclui uma fila de gravação compartilhada para serializar adições, edições e exclusões disparadas rapidamente. As mutações usam uma referência do estado mais recente, evitando o problema de closures obsoletas que poderia perder alterações concorrentes. O parser é defensivo: JSON inválido, manifesto malformado e registros que não atendem ao contrato `Sighting` são ignorados sem impedir que o aplicativo fique pronto.

| Item | Resultado |
|---|---|
| Formato | Manifesto v2 + chunks JSON |
| Tamanho do chunk | 100 avistamentos |
| Leitura | `multiGet` dos chunks declarados |
| Escrita | `multiSet` dos chunks, depois manifesto |
| Concorrência | Fila serializada de gravações |
| Migração | Array legado preservado como fallback |
| Dados inválidos | Filtrados por guard de runtime |

A implementação está em `contexts/AppContext.tsx`. O catálogo científico não foi alterado neste passo; suas auditorias continuam limpas: 76 espécies modulares em 29 lotes, 82 fontes estruturadas e 152 URLs GBIF, sem pendências de prioridade, conservação ou ocorrência regional.

A validação executada foi: `pnpm check`, `pnpm lint`, `pnpm test` (20 aprovados e 1 teste de logout ignorado), `pnpm catalog:priority-audit`, `pnpm catalog:source-audit`, `pnpm catalog:conservation-audit`, `pnpm catalog:regional-occurrence-audit` e `git diff --check`. Todos passaram. O lint mantém apenas o aviso não bloqueante sobre `type: module` no `package.json`.
