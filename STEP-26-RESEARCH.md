# Passo 26/60 — virtualização da listagem do catálogo

## Objetivo

O passo 26 inicia a Fase 1 do Master Plan V3: preparar a listagem para a meta de 3.000+ espécies sem alterar os contratos científicos, a taxonomia, a ocorrência regional, a conservação ou o licenciamento comercial.

## Implementação

A tela `app/(tabs)/animals.tsx` já utilizava `FlatList`, mas foi reorganizada para que o cabeçalho completo — busca, filtros, ordenação e contador — seja renderizado como `ListHeaderComponent` da própria lista vertical. Isso evita uma composição de conteúdo fora da lista principal e mantém uma única superfície de rolagem virtualizada.

Cada cartão de espécie foi extraído para `SpeciesRow`, memoizado com `React.memo`. O cartão usa altura fixa de 112 px e um separador independente de 12 px, reduzindo recomputações e mantendo métricas de layout estáveis. A lista recebeu parâmetros explícitos de janela e lote: `initialNumToRender={12}`, `maxToRenderPerBatch={12}`, `updateCellsBatchingPeriod={50}`, `windowSize={7}` e `removeClippedSubviews` habilitado fora da Web.

O `getItemLayout` inicialmente considerado foi removido porque o cabeçalho possui altura dinâmica em função da busca e dos filtros; manter offsets fixos sem medir esse cabeçalho poderia produzir posições incorretas em saltos programáticos. A lista continua virtualizada por `FlatList` sem introduzir uma suposição de layout incorreta.

## Preservação de contratos

A filtragem continua usando `normalizeCatalogSearch` sobre nome comum e nome científico. Os filtros por grupo e ambiente, a ordenação, a navegação para a ficha detalhada, os rótulos de acessibilidade e o componente `SpeciesImage` foram preservados. Nenhum registro de espécie, fonte, status de conservação, ocorrência ou licença foi alterado.

## Validação

| Verificação | Resultado |
|---|---|
| TypeScript (`pnpm check`) | PASS |
| Lint (`pnpm lint`) | PASS; permanece apenas aviso de módulo do `eslint.config.js` |
| Testes (`pnpm test`) | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 23 registros, 0 pendências |
| Auditoria regional | PASS; 7 registros, 0 pendências |
| `git diff --check` | PASS |

## Conclusão

O passo 26/60 está concluído. A listagem passa a ter uma arquitetura explicitamente preparada para grande volume, com cabeçalho integrado, linhas memoizadas e controle de janela de renderização, mantendo intacta a integridade científica e comercial do catálogo.
