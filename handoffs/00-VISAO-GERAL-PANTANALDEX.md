# PantanalDex — visão geral de retomada

## Produto

O PantanalDex é um guia de campo mobile, visual e offline-first para fauna do Pantanal. O produto deve permitir consultar fichas de espécies, pesquisar e filtrar animais, registrar avistamentos pessoais, anexar fotografias, capturar localização opcional, visualizar registros no mapa, alternar Português/English/Español e importar/exportar dados sem perder registros locais.

A meta de longo prazo é um catálogo com **3.000 ou mais espécies verificadas**. O MVP não pode sacrificar a qualidade: nenhum registro entra como verificado sem taxonomia, ocorrência, fonte, imagem, crédito, licença e revisão editorial auditáveis.

## Arquitetura atual

O projeto usa Expo SDK 54, React Native, TypeScript, Expo Router, NativeWind, AsyncStorage e Vitest. O código é separado entre `app/`, `components/`, `hooks/`, `lib/`, `shared/`, `server/`, `tests/` e `docs/`. Dados científicos modulares ficam em `shared/catalog/batches/`; o índice derivado fica em `shared/catalog/index.ts`; contratos e validadores ficam em `shared/catalog/types.ts` e `shared/catalog/review.ts`; persistência está em `shared/persistence.ts`.

Contratos estáveis: `Species`, `Sighting`, `Settings`, `ExportEnvelope` e `CatalogBatch`. Não altere sem coordenação do Agente 1 e sem atualizar testes de compatibilidade.

## Estado dos 50 passos

Os passos **1–17/50 estão concluídos**. Os passos 1–4 congelaram contratos, inventário, núcleo P1 e fila de auditoria. Os passos 5–11 auditaram mamíferos, aves e répteis. O passo 12 fechou o inventário de répteis, porque não existe terceiro lote. Os passos 13–14 auditaram anfíbios. Os passos 15–16 auditaram dois lotes de peixes. O passo 17 fechou o inventário de peixes, porque não existe terceiro lote real.

A próxima unidade real de conteúdo é `catalog-invertebrates-01`. A próxima sequência de produto deve combinar auditoria de invertebrados, correções de UX, robustez offline, acessibilidade, integração dos PRs das Contas 2 e 3 e preparação do MVP.

## Métricas de referência

| Métrica | Estado registrado |
|---|---:|
| Espécies públicas | 102 |
| Espécies modulares | 36 |
| Espécies conhecidas no código | 138 |
| Lotes modulares | 12 |
| Lotes verificados | 0 |
| Lotes review-ready | 0 |
| Testes aprovados no último checkpoint | 48 |
| Teste de autenticação | 1 pulado |
| Último checkpoint | `manus-webdev://112d59bc` |
| Branch coordenadora | `integracao-ciclo-17` |

Os números devem ser recalculados antes de qualquer PR de conteúdo. Não trate “espécies conhecidas” como “espécies verificadas”.

## Licenças e fontes

Uso comercial exige licença confirmada por arquivo. Aceite CC0, CC BY, CC BY 4.0, CC BY-SA e equivalentes comerciais compatíveis. Rejeite NC, ND, licença ausente ou ambígua. Wikimedia Commons exige conferência da página individual. GBIF, SiBBr/ICMBio, Wikidata, Wikipédia e iNaturalist só podem ser usados conforme as regras registradas em `LICENSES.md` e nos handoffs. **IUCN Red List API é proibida.** Conservação sem fonte oficial ICMBio/MMA permanece vazia.

## Coordenação

O Agente 1 coordena e integra. O Agente 2 trabalha em dados científicos e lotes. O Agente 3 trabalha em UX, testes, persistência e recursos nativos. Cada agente possui branch própria e abre PR contra `main`. A `main` só recebe alterações após checks verdes e revisão.

Fluxo obrigatório: ler TODO e handoff; atualizar o TODO com a tarefa; trabalhar em branch; implementar; testar; documentar; atualizar handoff; rodar `pnpm check`, `pnpm lint`, `pnpm test`, `git diff --check` e `pnpm watchdog`; commitar; fazer push; abrir PR; informar evidências. Não use `git reset --hard`. Bloqueios precisam de causa, evidência, alternativa e responsável.

## Retomada imediata

O Agente 2 deve começar auditando ou expandindo o primeiro lote real de invertebrados e corrigindo lacunas de licenças e fontes. O Agente 3 deve começar pela auditoria dos fluxos existentes e implementar a primeira correção funcional desbloqueada, com teste determinístico e fallback web/native. Ambos devem trabalhar em blocos grandes, sem parar em planejamento, e deixar commits/PRs visíveis no GitHub.
