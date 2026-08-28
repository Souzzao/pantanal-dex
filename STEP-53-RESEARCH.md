# Passo 53/60 — busca e filtros operacionais

A listagem de avistamentos foi ampliada com um mecanismo de busca e filtragem adequado ao uso de campo. O novo módulo `lib/sightings-filter.ts` é determinístico, não muta a entrada e centraliza as regras para que a interface e os testes usem o mesmo contrato.

A busca aceita nome popular, nome científico, local e observações, com normalização de acentos e caixa. Também foram adicionados filtros independentes para visibilidade (`Todos`, `Pessoais` e `Compartilháveis`), presença de coordenadas GPS e intervalo inclusivo de datas no formato `AAAA-MM-DD`. A interface informa a quantidade de resultados, mostra estado vazio específico para filtros sem correspondência e oferece limpeza de todos os critérios em uma ação.

A performance da listagem anterior foi preservada: a tela continua usando `FlatList`, as linhas são memoizadas em `SightingRow` e a consulta textual passa por `useDeferredValue`. O teste de volume aplica o filtro a 3.000 registros e confirma que a coleção de entrada permanece intacta.

| Capacidade | Implementação |
|---|---|
| Busca textual | Espécie, nome científico, local e observação |
| Datas | De/até com limites inclusivos |
| Visibilidade | Todos, pessoais e compartilháveis |
| Localização | Somente registros com GPS |
| Privacidade | Filtros não alteram dados nem expõem registros novos |
| Performance | FlatList, memoização e consulta deferida |
| Estado vazio | Mensagem contextual e limpeza de filtros |

A validação passou com `pnpm check`, `pnpm lint`, **36 testes aprovados e 1 ignorado**, auditorias de arquitetura, vocabulário, prioridades, fontes, conservação, ocorrência regional, imagens, sinônimos, GBIF legado e ICMBio/SISBio, além de `git diff --check`.

O catálogo permanece com 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos. Não foram introduzidos estados pendentes nem alterações na política de licenciamento comercial.
