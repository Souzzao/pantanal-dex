# Pesquisa do passo 27/50 — veado-campeiro

## Seleção do alvo

A matriz de prioridades identifica `Veado-campeiro` — *Ozotoceros bezoarticus* — como a primeira entrada P1 ainda sem registro correspondente no catálogo. O passo 27 adiciona o registro em lote isolado, sem alterar conclusões de conservação não validadas neste passo.

## Identidade taxonômica

O GBIF apresenta *Ozotoceros bezoarticus* (Linnaeus, 1758) como espécie aceita. A resposta estruturada do GBIF é usada como confirmação taxonômica do nome nominal; a existência de subespécies não autoriza misturar automaticamente avaliações subespecíficas com a espécie nominal.

Fonte: [1]

## Ocorrência no Pantanal

A tese da Universidade de Brasília *Ecologia e estrutura social do veado-campeiro (Ozotoceros bezoarticus) no Pantanal* documenta estudo ecológico da espécie no Pantanal. O próprio ICMBio também lista *Ozotoceros bezoarticus* no Plano de Ação Nacional para Conservação dos Cervídeos, cuja área de atuação inclui o Pantanal. Essas fontes sustentam a inclusão regional do táxon no catálogo; imagens isoladas não foram usadas como prova de ocorrência.

Fontes: [2] [3] [4]

## Conservação e limite da promoção

O lote permanece `review-ready`. A literatura de avaliação do veado-campeiro registra histórico específico para a subespécie pantaneira *Ozotoceros bezoarticus leucogaster*, mas este passo não transfere sua categoria para a espécie nominal nem preenche o ledger de conservação sem uma correspondência oficial específica e uma decisão taxonômica documentada.

## Auditoria comercial das imagens

As três imagens são páginas do Wikimedia Commons com licenças compatíveis com uso comercial: duas imagens de Fedaro em CC BY-SA 4.0 e uma imagem de Scott Presnell em CC BY-SA 2.0. A segunda imagem identifica explicitamente o Pantanal brasileiro em seus metadados; as imagens permanecem apenas como recursos visuais e de crédito.

Fontes de crédito: [5] [6] [7]

## Referências

[1]: https://www.gbif.org/taxon/4BNWT "GBIF — Ozotoceros bezoarticus"
[2]: https://www.repositorio.unb.br/handle/10482/3665 "UnB — Ecologia e estrutura social do veado-campeiro no Pantanal"
[3]: https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-cervideos "ICMBio — PAN Cervídeos"
[4]: https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-cervideos/1-ciclo/pan-cervideos-portaria-aprovacao.pdf "ICMBio — Portaria de aprovação do PAN Cervídeos"
[5]: https://commons.wikimedia.org/wiki/File:Venado-UY-Ozotoceros_bezoarticus.jpg "Wikimedia Commons — Venado-UY-Ozotoceros bezoarticus.jpg"
[6]: https://commons.wikimedia.org/wiki/File:Pampas_deer_nursing_fwan.jpg "Wikimedia Commons — Pampas deer nursing fwan.jpg"
[7]: https://commons.wikimedia.org/wiki/File:Venado-Campo-UY-Ozotoceros_bezoarticus.jpg "Wikimedia Commons — Venado-Campo-UY-Ozotoceros bezoarticus.jpg"


---

# Registro técnico do passo 27/60 — otimização contínua da listagem

## Objetivo

Aprofundar a preparação da listagem para 3.000+ espécies, continuando o trabalho de virtualização iniciado no passo 26 e preservando os contratos científicos, de acessibilidade e de licenciamento comercial.

## Alterações realizadas

A busca textual passou a usar `useDeferredValue` do React 19. A atualização visual do campo permanece imediata, enquanto a filtragem e a ordenação do catálogo podem ser processadas de forma adiada quando o usuário digita rapidamente. Isso reduz a competição entre entrada de texto e trabalho de lista em catálogos grandes.

O callback de renderização da espécie foi estabilizado com `useCallback`, mantendo a linha `SpeciesRow` memoizada e evitando a criação de uma função de renderização diferente a cada renderização da tela. A arquitetura de `FlatList`, a janela de renderização, os lotes, os separadores, os filtros, a ordenação, a navegação, as labels de acessibilidade e o carregamento de imagens foram preservados.

## Decisão técnica

Não foi usado `getItemLayout`, pois o cabeçalho da lista tem altura dinâmica devido aos filtros horizontais, contador, busca e ordenação. Offsets fixos sem medição do cabeçalho poderiam gerar posições incorretas em operações de salto. A virtualização nativa da `FlatList` permanece ativa sem essa suposição insegura.

## Validação

| Verificação | Resultado |
|---|---|
| TypeScript (`pnpm check`) | PASS |
| Lint (`pnpm lint`) | PASS; aviso preexistente de módulo do `eslint.config.js` |
| Testes (`pnpm test`) | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 23 registros, 0 pendências |
| Auditoria regional | PASS; 7 registros, 0 pendências |
| `git diff --check` | PASS |

## Conclusão

O passo 27/60 está concluído. A listagem agora combina virtualização explícita, linhas memoizadas, callbacks estáveis e filtragem adiada durante a digitação, sem mudanças nos dados científicos ou nas regras comerciais.
