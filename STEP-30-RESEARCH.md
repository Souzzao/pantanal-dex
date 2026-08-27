

# Pesquisa do passo 30/50 — jaú

## Identidade taxonômica

O GBIF/Catalogue of Life apresenta *Zungaro jahu* (Ihering, 1898) como espécie aceita e registra os usos históricos `Paulicea jahu` e `Paulicea gigantea` como combinações ou nome original. O GBIF também exibe avaliação global Near Threatened; essa informação não é automaticamente usada como categoria nacional no catálogo.

Fonte: [1]

## Ocorrência regional

O estudo indexado no PubMed descreve o parasita *Myxobolus cordeiroi* em 50 exemplares de jaú coletados no Pantanal brasileiro. A identificação explícita do hospedeiro como *Zungaro jahu* documenta ocorrência regional direta, ainda que o objetivo primário do artigo seja parasitológico.

Fonte: [2]

## Conservação e limite de promoção

O registro será criado em `review-ready`. A indicação Near Threatened do GBIF é contexto de avaliação global e não substitui validação normativa nacional; por isso, nenhuma categoria do ledger brasileiro será preenchida neste passo.

## Referências

[1]: https://www.gbif.org/taxon/5D95D "GBIF — Zungaro jahu"
[2]: https://pubmed.ncbi.nlm.nih.gov/19372007/ "PubMed — Myxobolus cordeiroi em Zungaro jahu no Pantanal brasileiro"


---

# Registro técnico do passo 30/60 — refinamento da busca indexada

## Implementação

A busca pública passou a usar um índice pré-normalizado para os registros reais do catálogo. O índice reúne nome comum, nome científico e aliases documentados, convertendo os termos uma única vez com normalização Unicode NFD, remoção de diacríticos e caixa baixa em `pt-BR`.

A função `speciesMatchesCatalogSearch` agora consulta o texto indexado durante a busca. Para registros clonados ou aliases temporários fornecidos por consumidores e testes, ela mantém um caminho de fallback que reconstrói os termos a partir do próprio objeto. O catálogo público também passou a expor `catalogSpeciesWithSynonyms`, fazendo com que os sinônimos taxonômicos documentados no GBIF sejam efetivamente pesquisáveis sem substituir o nome científico aceito.

A tela `app/(tabs)/animals.tsx` foi conectada a essa função indexada e continua usando `useDeferredValue`, `FlatList` virtualizada e linhas memoizadas dos passos anteriores.

## Validação

| Verificação | Resultado |
|---|---|
| TypeScript (`pnpm check`) | PASS |
| Lint (`pnpm lint`) | PASS; permanece aviso preexistente de módulo do ESLint |
| Testes (`pnpm test`) | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 23 registros, 0 pendências |
| Auditoria regional | PASS; 7 registros, 0 pendências |
| `git diff --check` | PASS |

## Preservação científica e comercial

Nenhuma espécie nova foi adicionada neste passo. Nenhum nome aceito foi substituído por sinônimo, nenhuma categoria de conservação foi inferida e nenhuma licença ou imagem foi alterada. O Lote 01 V3 continua `pending-review` conforme registrado no passo 29.

## Conclusão

O passo 30/60 está concluído. A busca agora é indexada, tolerante a acentos, compatível com nomes científicos e aliases documentados, e permanece integrada à estratégia de virtualização e filtragem adiada.
