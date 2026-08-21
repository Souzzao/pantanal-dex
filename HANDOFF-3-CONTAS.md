# PantanalDex — documentação de colaboração entre três contas Manus

## 1. Objetivo deste documento

Este documento deve ser enviado integralmente às outras duas contas Manus que participarão do desenvolvimento do PantanalDex. Ele define o contexto do produto, o estado atual, a divisão de responsabilidades, as regras para evitar conflitos e o protocolo que cada conta deve seguir antes de editar ou entregar qualquer coisa.

O objetivo é trabalhar como um pequeno time coordenado, com três contas colaborando no mesmo projeto, sem três versões incompatíveis do aplicativo.

## 2. Resumo do produto

O **PantanalDex** é um aplicativo mobile em Expo, React Native e TypeScript dedicado exclusivamente aos animais do Pantanal. Ele deve permitir consultar um catálogo de espécies e registrar avistamentos pessoais durante passeios, viagens, atividades escolares, turismo, fotografia de natureza e trabalhos de campo.

A primeira versão é local-first. O catálogo instalado, as imagens disponíveis, os avistamentos e as preferências devem continuar acessíveis sem conexão. Não adicionar autenticação, conta de usuário, sincronização em nuvem ou banco remoto sem aprovação explícita do responsável pelo projeto.

As quatro áreas principais são **Início**, **Animais**, **Avistamentos** e **Configurações**. O aplicativo também possui fichas de espécies, formulário de novo avistamento, detalhe de avistamento e uma rota de mapa/fallback.

## 3. Estado atual do projeto

| Item | Estado atual |
|---|---|
| Nome do projeto | PantanalDex |
| Tipo | Aplicativo mobile Expo |
| Stack | Expo SDK 54, React Native, Expo Router, TypeScript, NativeWind |
| Projeto | `pantanal-dex` |
| Último checkpoint estável | `fc9864e1` |
| Preview | `https://8081-iausgyir2g6c9aqyvcejb-f320377e.us3.manus.computer` |
| Verificação TypeScript | Sem erros no último ciclo verificado |
| Persistência | AsyncStorage local |
| Branding | Ícone, splash, favicon e foreground configurados |
| Documentos internos | `design.md`, `workboard.md`, `autonomous-workflow.md`, `todo.md` |

O checkpoint `fc9864e1` contém o fluxo operacional quase autônomo, o quadro de trabalho, a paleta visual refinada e a rota de mapa web estável. Antes de editar, cada conta deve abrir o projeto compartilhado e verificar se existe uma versão mais recente do checkpoint ou alteração feita por outra conta.

## 4. Arquivos e pastas importantes

| Caminho | Responsabilidade |
|---|---|
| `app/(tabs)/index.tsx` | Tela inicial |
| `app/(tabs)/animals.tsx` | Catálogo, busca e filtros de espécies |
| `app/(tabs)/sightings.tsx` | Lista de avistamentos |
| `app/(tabs)/settings.tsx` | Idiomas e exportação |
| `app/species/[id].tsx` | Ficha detalhada da espécie |
| `app/sightings/new.tsx` | Formulário de novo avistamento |
| `app/sightings/[id].tsx` | Detalhe e exclusão de avistamento |
| `app/map.tsx` | Fallback web da visualização geográfica |
| `shared/pantanal.ts` | Tipos, constantes e dados iniciais das espécies |
| `contexts/AppContext.tsx` | Estado local, AsyncStorage e exportação |
| `theme.config.js` | Paleta visual PantanalDex |
| `app.config.ts` | Nome, slug, ícone e configurações Expo |
| `todo.md` | Checklist histórico e backlog |
| `workboard.md` | Quadro de frentes, prioridades, dependências e critérios de pronto |
| `autonomous-workflow.md` | Fluxo de colaboração e portões de aprovação |
| `design.md` | Plano de design da interface mobile |

## 5. Divisão recomendada entre as três contas

### Conta 1 — Coordenação, arquitetura e integração

Esta conta é responsável por revisar o backlog, definir a ordem dos ciclos, resolver conflitos entre frentes, manter os contratos compartilhados e integrar as entregas. Também deve ser a única conta a alterar simultaneamente múltiplas áreas estruturais ou a criar o checkpoint consolidado do ciclo.

Responsabilidades principais: `todo.md`, `workboard.md`, `autonomous-workflow.md`, `shared/pantanal.ts`, `contexts/AppContext.tsx`, `app/_layout.tsx`, `app.config.ts` e integração final.

### Conta 2 — Conteúdo científico e catálogo

Esta conta é responsável por expandir o catálogo de espécies, validar nomes científicos, grupos, ambientes, descrições, comportamento, alimentação, distribuição, importância ecológica, situação de conservação, fontes e créditos de imagens.

Responsabilidades principais: dados de espécies em `shared/pantanal.ts` ou em um futuro arquivo separado `data/species.json`, validação dos campos científicos e melhorias em `app/(tabs)/animals.tsx` e `app/species/[id].tsx`.

Esta conta não deve alterar `AppContext`, navegação global ou configuração do Expo sem comunicar antes à Conta 1. Todo dado factual deve possuir fonte confiável; quando houver dúvida, registrar a dúvida em vez de inventar informação.

### Conta 3 — Recursos do usuário, qualidade e interface

Esta conta é responsável por avistamentos, edição, filtros, foto, localização, exportação, testes, acessibilidade e revisão visual. Pode trabalhar em `app/sightings/*`, `app/(tabs)/sightings.tsx`, `app/(tabs)/settings.tsx`, testes e componentes de interface, desde que preserve os tipos compartilhados.

Esta conta não deve substituir o contrato `Sighting` nem mudar chaves persistidas sem criar uma migração ou comunicar a Conta 1.

## 6. Regras de colaboração

A regra principal é: **uma conta por arquivo crítico por vez**. Antes de editar, a conta deve verificar o conteúdo atual do arquivo e procurar alterações recentes. Nunca substituir um arquivo inteiro baseado em uma cópia antiga sem comparar o estado atual.

Cada conta deve manter suas mudanças pequenas e relacionadas a uma frente. Não misturar expansão de espécies com refatoração de navegação, nem melhorias visuais com migração de armazenamento no mesmo conjunto de alterações, salvo quando a integração for indispensável.

Não usar comandos destrutivos de Git, não apagar dados do usuário, não remover arquivos existentes sem registrar a razão e não instalar dependências novas sem verificar compatibilidade com Expo SDK 54. Quando uma dependência nativa for necessária, criar também fallback web ou mensagem clara de indisponibilidade.

Toda alteração deve terminar com `pnpm check`. Alterações de lógica devem incluir ou atualizar testes determinísticos. Alterações de interface devem ser verificadas no preview em portrait. Conteúdo científico deve registrar fonte e crédito.

## 7. Protocolo antes de começar um ciclo

A conta que iniciar um ciclo deve enviar uma mensagem curta informando a frente, os arquivos que pretende alterar, os itens do TODO envolvidos e as dependências conhecidas. Em seguida, deve verificar o último checkpoint e o estado atual do projeto.

Se outra conta já estiver trabalhando nos mesmos arquivos, não iniciar uma segunda alteração paralela nesses arquivos. Em vez disso, escolher outro item independente ou aguardar a integração.

## 8. Protocolo de entrega de cada conta

Cada entrega deve conter quatro partes: resumo do que mudou, lista de arquivos alterados, verificações executadas e pendências ou riscos. A conta deve marcar no `todo.md` apenas os itens que realmente passaram pelo critério de pronto.

O formato recomendado é:

```text
Frente:
Itens concluídos:
Arquivos alterados:
Verificações:
Pendências:
Riscos ou decisões necessárias:
```

A Conta 1 integra as entregas, resolve conflitos, executa a verificação completa e cria o checkpoint. As Contas 2 e 3 não devem criar checkpoints concorrentes durante o mesmo ciclo sem coordenação.

## 9. Primeiro ciclo recomendado

O primeiro ciclo de colaboração deve expandir o catálogo científico e preparar os recursos para os próximos ciclos.

A Conta 2 deve selecionar e validar espécies adicionais, preferencialmente cobrindo todos os grupos: mamíferos, aves, répteis, anfíbios, peixes e invertebrados. Cada espécie deve incluir campos completos, fonte de informação e três imagens com crédito, licença comercial confirmada e URL do arquivo específico. Para imagens, aceitar somente CC0, CC BY ou CC BY-SA; rejeitar NC, ND, licença ausente ou ambígua. Para conservação, usar somente Livro Vermelho ICMBio ou Portarias MMA/ICMBio; sem fonte oficial, deixar o status vazio.

A Conta 3 pode trabalhar em paralelo em validação do catálogo, estados de carregamento, fallback de imagens, testes de exportação e revisão da experiência de descoberta, desde que não altere o contrato de espécie de forma incompatível.

A Conta 1 deve preparar a integração, revisar dependências, comparar os dados recebidos, executar `pnpm check`, revisar o preview e consolidar o checkpoint.

## 10. Critérios de aceite do primeiro ciclo

O ciclo só será concluído quando o catálogo tiver espécies adicionais distribuídas pelos grupos e ambientes definidos, cada espécie estiver com dados essenciais e fonte aprovada, as imagens tiverem crédito e licença comercial confirmada, nenhum registro usar NC/ND ou IUCN Red List API, status de conservação estiver vazio ou apoiado por ICMBio/MMA, a busca e os filtros continuarem funcionando, o TypeScript não apresentar erros e o preview abrir sem rota crítica quebrada.

Itens incompletos devem permanecer como `[ ]` no `todo.md`. Não marcar um item como concluído apenas porque o código foi escrito; ele precisa estar validado no fluxo real.

## 11. Como pedir aprovação ao responsável

As outras contas devem solicitar aprovação apenas quando houver uma escolha de produto, privacidade, custo, fonte científica ambígua, permissão nativa ou mudança irreversível. Para decisões normais de implementação, seguir a especificação, o `design.md`, o `workboard.md` e este documento.

A solicitação deve ser curta e apresentar opções. Exemplo:

```text
Preciso de aprovação para escolher entre:
A) manter localização exata apenas como dado pessoal;
B) aproximar automaticamente a localização ao compartilhar.
Minha recomendação é B por proteção de áreas sensíveis. Nenhum dado será alterado até a aprovação.
```

## 12. Mensagem pronta para iniciar uma conta colaboradora

> Você está colaborando no projeto PantanalDex. Leia primeiro `HANDOFF-3-CONTAS.md`, `workboard.md`, `autonomous-workflow.md`, `design.md` e `todo.md`. Não altere arquivos fora da sua frente sem comunicar a Conta 1. Verifique o último checkpoint, preserve Expo SDK 54, execute `pnpm check` ao final e entregue um resumo com arquivos, testes, pendências e riscos. Sua frente atual é: [DESCREVER A FRENTE]. Itens do TODO autorizados: [LISTAR ITENS].

## 13. Regra de integração final

A Conta 1 é a responsável pela integração final e pelo checkpoint consolidado. Antes do checkpoint, ela deve revisar `todo.md`, confirmar que nenhum item foi marcado indevidamente, executar TypeScript, lint, testes e revisão visual, e registrar no relatório do marco o que foi concluído, o que ficou pendente e qual aprovação será necessária para o próximo ciclo.

## Bloco coordenador — contratos compartilhados

Estado: em implementação na branch integracao-ciclo-14.

Arquivos: `shared/contracts.ts`, `shared/types.ts` e `contexts/AppContext.tsx`.

Objetivo: centralizar `Settings`, filtros de catálogo e envelope de exportação sem duplicar tipos entre contexto, telas e serviços. O contrato preserva `Species` e `Sighting` e não altera dados persistidos.

Validação: executar `pnpm check`, `pnpm lint`, `pnpm test`, `git diff --check` e `pnpm watchdog` antes do PR.

Dependências: Agente 2 deve consumir os tipos compartilhados nos lotes/índice sem editar o contexto; Agente 3 pode usar `Settings` e `CatalogFilters` em telas e testes. Não há bloqueio real; o próximo bloco independente é cobertura de fluxos locais e fallback offline.

## Bloco massivo — fluxos de campo e catálogo modular

Estado: implementado na branch integracao-ciclo-14.

Alterações: Home e formulário de novo avistamento agora consultam o índice modular combinado; o formulário aceita espécies dos lotes escaláveis, evita duplo salvamento, mostra estado ocupado e trata falha de persistência sem perder o formulário. Adicionado teste de fluxo para descoberta modular, atualização, restauração, exportação e rejeição de importação antiga/malformada.

Riscos: permissões reais de câmera/GPS continuam dependentes de aparelho; web usa fallback existente. Nenhuma alteração destrutiva em dados locais.

Validação: 24 testes aprovados, 1 teste de autenticação pulado, TypeScript, lint, diff check e watchdog. Próximo bloco independente: revisão visual/portrait e cobertura offline/permissões.

## Revisão visual do bloco massivo

Preview portrait 390x844 revisado em Home e Animais. O contador modular mostra 102 espécies combinadas, a busca encontra lotes novos e a navegação inferior permanece acessível; não foram observados cortes críticos no viewport. A validação prática nativa de câmera/GPS continua pendente de aparelho físico.

## Bloco massivo 2 — offline, import/export e acessibilidade

Estado: implementado na branch integracao-ciclo-14.

Configurações agora usa o catálogo modular para contagens e nomes, bloqueia import/export/limpeza enquanto o caderno restaura, trata falhas de limpeza sem apagar dados e expõe labels/states de acessibilidade nos controles. Preview portrait 390x844 revisado sem cortes críticos; estado vazio de registros está legível.

Validação: TypeScript, lint, 24 testes aprovados, 1 autenticação pulado, diff check e watchdog. Pendência real: testar câmera/GPS e permissões em aparelho físico; não é bloqueio para o fluxo web/offline local.

## Bloco massivo 2 — Avistamentos no índice modular

A tela de Avistamentos deixou de procurar espécies apenas no catálogo legado. Filtros, chip de espécie, nomes, imagens e busca agora usam um mapa memoizado do índice combinado, mantendo a ordenação e os estados vazios. Isso permite consultar registros criados para qualquer lote modular sem degradação por busca repetida.

Validação incremental: TypeScript, lint e 24 testes aprovados; diff check e watchdog devem ser executados novamente no commit final deste bloco. Sem bloqueio real.

## Bloqueio corrigido — watchdog do PR #10

Causa: o workflow exigia literalmente os marcadores `Arquivos` e `Riscos`, enquanto o PR atualizado usava `Entregas` e `Risco real`; o código e os checks estavam válidos, mas o check remoto falhou por falso negativo de documentação.

Evidência: statusCheckRollup do PR #10 registrou watchdog FAILURE; corpo do PR continha Bloco, Entregas, Testes, Risco real e Próximo bloco.

Correção: workflow agora aceita variantes semânticas (`Ciclos|Bloco`, `Arquivos|Entregas`, `Riscos|Risco`, `Próximo`) usando grep por expressão regular. Próximo passo é rerodar o check no GitHub; não há bloqueio de código.

## Bloco massivo 3 — permissões nativas localizadas

Criado `shared/native-permissions.ts` com cópias PT/EN/ES para câmera e localização nos estados negado, serviço desativado e erro. A tela de novo avistamento usa o helper conforme o idioma padrão, mantendo o salvamento sem coordenadas/foto quando a permissão falha. Adicionado teste determinístico com três idiomas e exportação pelo barrel `shared/types.ts`.

Também corrigido o falso negativo do workflow Agent Watchdog no PR #10: variantes de títulos do corpo agora são aceitas sem remover a exigência de evidências. Validação local atual: 27 testes aprovados, 1 autenticação pulado, TypeScript, lint e diff check. Próximo passo: rerodar o check remoto e validar offline/permissões em aparelho físico.

## Novo bloco massivo — fallback offline de imagens

Corrigido `RemoteImage` para não permanecer indefinidamente em loading quando uma espécie ou avistamento não possui URI. O componente agora entra diretamente no estado de fallback, mantém a inicial do nome e deixa a ausência visual explícita; quando a fonte muda, o estado é reiniciado de forma determinística. Isso cobre catálogo local incompleto e imagens não disponíveis sem impedir navegação ou registro.

Validação incremental: TypeScript, lint, 27 testes aprovados, 1 autenticação pulado e diff check. Pendências continuam sendo teste físico de permissões e revisão editorial científica.

## Bloco massivo — persistência, ficha e mapa

Settings agora usa envelope versionado compartilhado, aceita formato legado sanitizado e rejeita versões desconhecidas/corrupção com fallback seguro. A ficha de espécie e o mapa passaram a resolver nomes e registros pelo catálogo modular combinado; o mapa também trata falha ao abrir serviço externo sem perder dados e mantém a privacidade de coordenadas.

Validação atual: TypeScript, lint, 28 testes aprovados, 1 autenticação pulado e diff check. Pendência real: teste físico de câmera/GPS/permissões e fluxo offline em aparelho sem rede.

## Revisão visual portrait do bloco

Mapa em 390x844 mostra o estado offline, cartão web e estado vazio de coordenadas sem corte crítico. Ficha de Tuiuiú resolve corretamente pelo catálogo modular, exibe fallback de imagem, idioma, tags, conteúdo e CTA em uma mão; a leitura segue clara até o início do conteúdo. Não foram encontrados botões mortos nesta revisão.

## Bloco massivo seguinte — diagnóstico offline e transparência editorial

Implementado diagnóstico de restauração offline em `shared/persistence.ts`, distinguindo `empty`, `restored`, `legacy-migrated`, `corrupted` e `unsupported-version`. O `AppContext` expõe esses estados sem substituir silenciosamente dados corrompidos; Configurações mostra aviso localizado PT/EN/ES e recomenda exportar backup. O índice modular agora expõe `catalogReview`, com contagem de lotes e espécies pendentes/verificados, e Configurações informa quando lotes ainda aguardam auditoria comercial.

Validação concluída: `pnpm check`, `pnpm test` (29 aprovados, 1 autenticação pulado), `pnpm lint` e `git diff --check`.

Risco real: os 12 lotes modulares ainda estão `pending-review`; não devem ser promovidos a `verified` sem auditoria arquivo a arquivo das licenças e ocorrência local. Não foram inventadas novas fontes ou imagens neste bloco.
