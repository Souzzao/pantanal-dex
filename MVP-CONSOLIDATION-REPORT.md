# PantanalDex — consolidação do MVP

## Objetivo

Este pacote consolida o estado real disponível no repositório após o trabalho dos agentes. O escopo entregue é um **MVP Expo/React Native com versão web**, catálogo científico regional, avistamentos locais, câmera/galeria, GPS, edição, busca, filtros, ordenação, persistência, transferência e exportação agregada.

## Estado executável

O projeto é executável com Node.js, pnpm e Expo. A exportação web foi verificada com `npx expo export --platform web --output-dir /tmp/pantanal-dex-web-export`, gerando as rotas principais de catálogo, mapa, configurações, avistamentos, criação, edição e detalhe.

| Item | Estado |
|---|---|
| Plataforma | Expo SDK 54 / React Native / web |
| Catálogo | 76 espécies modulares, 29 lotes, 228 imagens |
| Registros científicos | 96 registros no catálogo consolidado |
| Avistamentos | Criação, câmera, galeria, GPS, edição e exclusão |
| Persistência | AsyncStorage versionado em chunks de 100, com fila serializada |
| Transferência | JSON 2.0, arrays legados, validação e relatório de rejeições |
| Busca | Espécie, nome científico, local e observações |
| Filtros | Datas, visibilidade e presença de GPS |
| Ordenação | Data, espécie, local e atualização, ascendente/descendente |
| Resumo | Contagens agregadas, período e espécie mais frequente |
| Exportação | Resumo agregado em JSON 1.0 e CSV |
| Privacidade | Busca não persistida; exportação agregada não contém registros individuais |
| Licenciamento de imagens | Política comercial: CC BY, CC BY-SA ou domínio público; sem NC/ND |

## O que foi consolidado

Os passos 26 a 57 do ciclo atual estão materializados por código, testes, relatórios ou commits. O passo 47 não aparece como título no trecho final do `todo.md`, mas está comprovado por `STEP-47-RESEARCH.md`, `lib/sightings-storage.ts` e `tests/sightings-storage.test.ts`; por isso foi tratado como realizado nesta consolidação.

| Área | Arquivos principais |
|---|---|
| Catálogo e auditorias | `shared/catalog/`, `shared/pantanal.ts`, `scripts/catalog-*`, `CATALOG-*.md` |
| Avistamentos | `app/sightings/`, `app/(tabs)/sightings.tsx`, `contexts/AppContext.tsx` |
| Persistência | `lib/sightings-storage.ts`, `lib/sightings-preferences.ts` |
| Transferência | `lib/sightings-transfer.ts`, `lib/sightings-summary-transfer.ts` |
| Busca e resumo | `lib/sightings-filter.ts`, `lib/sightings-summary.ts` |
| Testes | `tests/` |
| Dossiês | `STEP-17-RESEARCH.md` a `STEP-57-RESEARCH.md`, `STEP-50-FINAL-AUDIT.md` |

## O que ficou faltando

Os passos 58, 59 e 60 **não foram executados** nesta sessão e não foram inventados no pacote. Eles permanecem como próximos itens do Master Plan V3. Também existem checklists históricos não marcados no início do `todo.md`, referentes a planos anteriores, colaboração entre contas e rotinas operacionais; esses itens não devem ser confundidos com falhas do MVP atual.

| Lacuna | Impacto no MVP | Situação |
|---|---|---|
| Passo 58/60 | Próximo incremento do plano | Não implementado |
| Passo 59/60 | Próximo incremento do plano | Não implementado |
| Passo 60/60 | Fechamento final do ciclo V3 | Não implementado |
| Testes E2E em dispositivo físico | Não impede a execução web/unitária | Não realizados neste pacote |
| Publicação em lojas Android/iOS | Exige credenciais e pipeline externo | Fora do pacote |
| Backend sincronizado entre dispositivos | O MVP atual é local; transferência manual existe | Não implementado |
| Rechecagem futura de URLs HTTP 429 | É limitação de disponibilidade, não licença ausente | Registrada nos relatórios |

## Validação realizada

A suíte final executada neste estado passou com **49 testes aprovados e 1 ignorado**. Também passaram TypeScript, lint — com apenas o aviso não bloqueante sobre `type: module` —, exportação web, auditorias de arquitetura, vocabulário, prioridades, fontes, conservação, ocorrência regional, imagens, sinônimos, GBIF legado, ICMBio/SISBio e `git diff --check`.

A auditoria ICMBio/SISBio registra indisponibilidade observacional como limitação quando aplicável, sem promover ocorrência regional sem evidência estruturada. A auditoria de imagens mantém respostas HTTP 429 como limitação temporária explícita, sem classificá-las como licenças quebradas ou disponíveis sem verificação.

## Execução rápida

```bash
pnpm install
pnpm check
pnpm lint
pnpm test
pnpm dev
```

Para gerar a versão web estática:

```bash
npx expo export --platform web --output-dir dist-web
```

Para iniciar somente o Metro web:

```bash
pnpm dev:metro
```

## Commits finais relevantes

- `bcb86b5` — exportação agregada segura do resumo
- `27bb63a` — persistência segura de preferências
- `58d91f9` — painel agregado privado
- `15659e8` — ordenação estável
- `274dbec` — busca e filtros operacionais
- `95280c7` — edição segura de avistamentos
- `397bf7a` — compartilhamento individual seguro

## Conclusão

O ZIP entregue contém o **MVP consolidado e executável**, o código-fonte, testes, auditorias, dossiês e o registro transparente do que não foi concluído. Nenhuma lacuna dos passos 58 a 60 foi mascarada como pronta.
