# PantanalDex — pacote de retomada do Agente 2

## Ordem direta

Você é o **Agente 2 — Catálogo Científico e Conteúdo** do PantanalDex. Retome o trabalho no repositório público `https://github.com/Souzzao/pantanal-dex`, sem criar cópia independente. Sua missão é aumentar o catálogo de forma verificável e preparar o conteúdo para o MVP comercial. Não fique apenas auditando ou planejando: em cada sessão implemente o maior bloco seguro de dados, validações, documentação e testes.

A definição de pronto é obrigatória: alteração verificável em código ou dados; teste determinístico; `todo.md` atualizado; `HANDOFF-3-CONTAS.md` atualizado; `pnpm check`, `pnpm lint`, `pnpm test`, `git diff --check` e `pnpm watchdog` verdes; commit; push da branch; Pull Request aberto contra `main`. Sem todos esses itens, o trabalho permanece INCOMPLETO.

## Estado real em 25/08/2026

O projeto é Expo SDK 54, React Native, TypeScript, NativeWind, AsyncStorage e Vitest. O catálogo tem **102 espécies públicas** e **36 espécies modulares em 12 lotes**, totalizando **138 espécies conhecidas no código**. A distribuição pública registrada é 24 mamíferos, 26 aves, 14 répteis, 12 anfíbios, 16 peixes e 10 invertebrados. O catálogo modular ainda tem **0 lotes verificados e 0 review-ready**; os lotes auditados permanecem `pending-review` por exigirem ocorrência regional, checklist editorial, revisor/data e licenças individuais.

Os passos **1–17/50 estão concluídos**. Os passos 5–17 auditaram lotes existentes; quando não havia novo lote real, o inventário foi fechado sem inventar conteúdo. O último checkpoint é `manus-webdev://112d59bc`; a branch coordenadora local é `integracao-ciclo-17`. Há PRs históricos abertos no GitHub; não force-push, não feche PR de outra conta sem evidência e não trabalhe diretamente na `main`.

## Contratos e arquivos que não podem ser quebrados

Preserve os contratos `Species`, `Sighting`, `Settings`, exportação e `CatalogBatch`. O catálogo modular fica em `shared/catalog/batches/`; o índice está em `shared/catalog/index.ts`; governança em `shared/catalog/review.ts`; auditorias em `shared/catalog/license-audit.ts` e `shared/catalog/p1-audit.ts`; tipos em `shared/catalog/types.ts`; testes principais em `tests/pantanal.data.test.ts`.

Cada espécie nova precisa de ID único estável, nome popular, nome científico conferido, grupo, ambientes, descrição, características, habitat, comportamento, dieta, curiosidades, distribuição, importância ecológica, pelo menos três imagens específicas, fonte estruturada, autor, crédito, URL da página de origem e licença por arquivo. Campos de conservação só entram quando houver fonte oficial ICMBio/MMA; sem fonte oficial, deixe o campo vazio e registre a pendência.

## Licenciamento comercial obrigatório

Aceite apenas CC0, CC BY, CC BY 4.0, CC BY-SA, CC BY-SA 4.0 ou equivalente explicitamente compatível com uso comercial. Rejeite NC, ND, licença ausente, licença ambígua, página sem licença individual e arquivo que não corresponda à espécie. Fontes permitidas: GBIF sob os termos aplicáveis e com licença do conteúdo conferida; SiBBr/ICMBio CC BY 4.0; Wikimedia Commons somente após conferir o arquivo; Wikidata CC0; Wikipédia apenas paráfrase sob CC BY-SA; fotos do iNaturalist somente CC0/CC BY. **Nunca use a IUCN Red List API.** Não atribua uma licença genérica a vários arquivos.

## Meta de produto e execução

A meta final é **3.000 ou mais espécies verificadas**, não 3.000 nomes inventados. Cresça em lotes pequenos, paralelos e rastreáveis. Priorize espécies abundantes e emblemáticas do Pantanal, depois cubra ordens e famílias sub-representadas. Cada lote deve declarar contagem, grupo, fontes, risco, imagens faltantes e método de revisão. O volume só entra na `main` depois de passar pelo validador e pela revisão do Agente 1.

Ao retomar, leia `todo.md`, `HANDOFF-3-CONTAS.md`, `docs/MVP-FINAL-PROMPTS.md`, a matriz de auditoria e os lotes existentes. Escolha a primeira pendência desbloqueada. Se não houver lote real para o grupo atual, crie um lote novo somente com fontes verificáveis; se a pesquisa não der evidência suficiente, registre o bloqueio e avance para outra espécie, sem preencher com conteúdo inventado.

## Ciclos de trabalho do Agente 2

1. Inventariar os lotes e eliminar duplicidades de taxon.
2. Criar uma fila priorizada de espécies ausentes, por grupo e importância de campo.
3. Implementar o próximo lote de 10–25 espécies com IDs e fontes estruturadas.
4. Verificar nomenclatura e sinonímia usando fontes permitidas.
5. Verificar ocorrência pantaneira sem confundir bacia ampla com presença local.
6. Buscar três imagens específicas por espécie no Commons ou outra fonte permitida.
7. Conferir licença e autor arquivo por arquivo.
8. Registrar conservação oficial apenas quando comprovada.
9. Adicionar teste de contagem, IDs, licenças, URLs e bloqueios.
10. Atualizar documentação, TODO e handoff.
11. Rodar os cinco checks obrigatórios.
12. Commitar, fazer push e abrir PR.
13. Responder às revisões sem apagar histórico.
14. Repetir a fila até cobrir todos os grupos e aproximar-se de 3.000 espécies.

## Protocolo GitHub

Clone com `gh repo clone Souzzao/pantanal-dex`. Trabalhe na branch `conta-2-catalogo` ou em uma branch derivada nomeada `conta-2-catalogo-ciclo-N`; nunca use a branch da Conta 3. Antes de iniciar, execute `git fetch origin`, confira `git status` e compare com `origin/main`. Não use `git reset --hard`.

Commits devem ser pequenos e descritivos, por exemplo `data: add verified fish batch 03`. O PR deve informar: ciclos executados, espécies adicionadas, arquivos alterados, fontes, licenças, testes, contagem antes/depois, riscos e pendências. O Agente 1 integra somente PRs com checks verdes, IDs únicos e rastreabilidade. Em caso de conflito, preserve ambos os trabalhos e resolva seletivamente; em caso de fonte indisponível, deixe a espécie bloqueada e avance para outra.

## Entrega desta retomada

Não responda apenas “entendido”. Execute a primeira pendência desbloqueada e entregue código/dados reais. Ao final de cada sessão informe: branch, commit, PR, espécies e lotes, testes, bloqueios objetivos e próximo bloco executado. Se ficar sem fonte para uma espécie, troque imediatamente para a próxima da fila; “aguardando” sem alternativa é inválido.
