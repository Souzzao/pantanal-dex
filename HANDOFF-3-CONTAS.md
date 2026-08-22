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

A Conta 2 deve selecionar e validar espécies adicionais, preferencialmente cobrindo todos os grupos: mamíferos, aves, répteis, anfíbios, peixes e invertebrados. Cada espécie deve incluir campos completos, fonte de informação e três imagens com crédito, licença e URL de origem.

A Conta 3 pode trabalhar em paralelo em validação do catálogo, estados de carregamento, fallback de imagens, testes de exportação e revisão da experiência de descoberta, desde que não altere o contrato de espécie de forma incompatível.

A Conta 1 deve preparar a integração, revisar dependências, comparar os dados recebidos, executar `pnpm check`, revisar o preview e consolidar o checkpoint.

## 10. Critérios de aceite do primeiro ciclo

O ciclo só será concluído quando o catálogo tiver espécies adicionais distribuídas pelos grupos e ambientes definidos, cada espécie estiver com dados essenciais e fonte, as imagens tiverem crédito e licença, a busca e os filtros continuarem funcionando, o TypeScript não apresentar erros e o preview abrir sem rota crítica quebrada.

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


## 14. Mecanismo permanente de segurança operacional

A definição de pronto para qualquer bloco é: alteração verificável de código ou dados, teste ou validador correspondente, `todo.md` atualizado, este HANDOFF atualizado quando houver regra operacional, `pnpm check`, `pnpm lint`, `pnpm test`, `git diff --check`, commit pequeno e PR descritivo. Sem todos esses elementos, o status é `INCOMPLETO` e não pode ser apresentado como concluído.

A Conta 1 deve verificar, a cada retomada, branches, commits, PRs, checks e TODO. Uma branch sem avanço deve receber handoff com tarefa dividida e prazo do próximo bloco. O TODO mantém uma fila priorizada; cada item concluído é marcado imediatamente e a primeira pendência desbloqueada passa a ser a próxima tarefa. Não repetir auditoria já concluída sem evidência nova.

Bloqueios precisam conter causa, evidência, alternativa executável e agente responsável. Fonte indisponível deve ser substituída por pipeline, dump, fixture ou teste; PR stale deve ser rebaseado de forma coordenada; conflitos devem ser resolvidos por integração seletiva pela Conta 1; falhas devem ser corrigidas e revalidadas. Um registro apenas dizendo “aguardando” é inválido.

A qualidade não pode ser reduzida para aumentar volume. Nenhum dado ou imagem sem fonte, licença comercialmente compatível, teste e ID único entra em `main`. Cada PR deve informar ciclos, commits, arquivos, contagem, fontes, riscos, pendências e próximo lote. Ao receber “continue”, cada agente deve ler o estado atual, escolher a primeira pendência desbloqueada e trabalhar até concluir o maior bloco seguro possível, sem pedir confirmação para decisões normais de implementação.


## 15. Manifesto de licenças por bloco

Todo bloco de conteúdo científico deve atualizar `LICENSES-credits.md`. O manifesto deve listar lote, grupo, contagem, fonte taxonômica, política de licença e localização dos créditos por arquivo. Ele cobre somente o catálogo público; não deve conter avistamentos, coordenadas, fotos pessoais ou qualquer dado do usuário.

A revisão comercial precisa confirmar individualmente `uri`, `author`, `license`, `sourceUrl` e `credit` de cada imagem. A existência de uma URL não é prova de licença. O contrato deve permanecer como barreira automatizada contra `NC`, `ND`, licença ausente, fontes IUCN e domínios não aprovados.


## 16. Bloco de invertebrados `catalog-invertebrates-03`

A Conta 2 adicionou `Paraponera clavata` e `Atta sexdens` em módulo separado, totalizando duas espécies e seis imagens Commons verificadas individualmente. As licenças usadas são CC BY 2.0/3.0/4.0 e CC BY-SA 2.0/3.0/4.0; não há NC, ND ou licença ausente. Cada imagem mantém autor, URL de distribuição, página de origem e crédito no lote.

A validação taxonômica usa consultas GBIF por espécie. O lote permanece `pending-review`: as imagens e a correspondência taxonômica não provam ocorrência no recorte do Pantanal nem situação de conservação. A alternativa executável para a próxima etapa é consultar SiBBr/ICMBio para ocorrência e Livro Vermelho/portarias MMA/ICMBio para conservação; sem confirmação, os campos continuam vazios.

O bloco foi entregue com índice, teste, manifesto `LICENSES-credits.md`, TODO, check, lint, test e diff check pendentes de commit final nesta rodada.


## 17. Auditoria comercial do catálogo legado

Foi identificado que `shared/pantanal.ts` continha 15 referências IUCN e status de conservação sem fonte aprovada para o produto comercial. O script `scripts/normalize-legacy-commercial.mjs` migrou as referências para consultas GBIF Species Match e removeu os status, sem inventar substitutos. Evidência: a execução reportou 15 migrações e zero referências IUCN restantes.

A regressão é protegida por teste que exige fontes públicas sem IUCN e `conservationStatus` vazio. A pendência real permanece com o responsável científico/Agente 1: consultar Livro Vermelho ICMBio ou portarias MMA/ICMBio por espécie e preencher somente os casos confirmados. Até lá, ausência de status é o comportamento correto.


## 18. Bloco de aves `catalog-birds-02`

A Conta 2 adicionou `Cairina moschata`, `Penelope superciliaris` e `Aramides cajaneus` em módulo separado, totalizando três espécies e nove imagens Commons verificadas individualmente. As licenças são CC BY, CC BY-SA e domínio público; não foram aceitas licenças NC, ND ou ausentes. Cada imagem mantém autor, URL de distribuição, página de origem e crédito no módulo.

A taxonomia usa consultas GBIF por espécie. O lote permanece `pending-review`: as imagens não provam ocorrência no recorte do Pantanal e a conservação exige consulta ao Livro Vermelho ICMBio ou portaria MMA/ICMBio. A alternativa executável é consultar SiBBr/ICMBio para ocorrência e registrar somente correspondências confirmadas.


## 19. Bloco de peixes `catalog-fish-02`

A Conta 2 adicionou `Hoplias malabaricus`, `Prochilodus lineatus` e `Leporinus friderici` em módulo separado, totalizando três espécies e nove imagens Commons verificadas individualmente. As licenças são CC0, CC BY, CC BY-SA e domínio público; não há NC, ND ou licença ausente. Cada imagem mantém autor, URL de distribuição, página de origem e crédito no lote.

As três consultas GBIF retornaram `matchType=EXACT` e `status=ACCEPTED`. O lote permanece `pending-review`: a correspondência taxonômica não prova ocorrência no recorte do Pantanal e a conservação depende de fonte ICMBio/MMA. A alternativa executável é consultar SiBBr/ICMBio por espécie e manter o campo de conservação vazio até confirmação oficial.


## 20. Bloco de peixes `catalog-fish-03`

A Conta 2 adicionou `Brycon hilarii`, `Myloplus tiete` e `Gymnotus carapo` em módulo separado, totalizando três espécies e nove imagens Commons verificadas individualmente. As licenças são CC0, CC BY, CC BY-SA e domínio público; não há NC, ND ou licença ausente. Cada imagem mantém autor, URL de distribuição, página de origem e crédito no lote.

As três consultas GBIF retornaram `matchType=EXACT` e `status=ACCEPTED`. O lote permanece `pending-review`: a correspondência taxonômica e as imagens não provam ocorrência no recorte do Pantanal nem conservação oficial. A alternativa executável é consultar SiBBr/ICMBio para ocorrência e Livro Vermelho/portarias MMA/ICMBio para conservação, mantendo os campos vazios até confirmação.


## 21. Bloco de invertebrados `catalog-invertebrates-04`

A Conta 2 adicionou `Caligo eurilochus` e `Danaus gilippus` em módulo separado, totalizando duas espécies e seis imagens Commons verificadas individualmente. As licenças são CC BY 2.5/3.0/4.0 e CC BY-SA 3.0/4.0; não há NC, ND ou licença ausente. Cada imagem mantém autor, URL de distribuição, página de origem e crédito no lote.

As duas consultas GBIF retornaram `matchType=EXACT` e `status=ACCEPTED`. O lote permanece `pending-review`: imagens e taxonomia não provam ocorrência no recorte do Pantanal nem conservação oficial. A alternativa executável é consultar SiBBr/ICMBio para ocorrência e Livro Vermelho/portarias MMA/ICMBio para conservação, mantendo o campo vazio até confirmação.


## 22. Bloco de aves `catalog-birds-03`

A Conta 2 adicionou `Jabiru mycteria`, `Anodorhynchus hyacinthinus` e `Tigrisoma lineatum`, em módulo separado, com nove imagens Commons verificadas individualmente. As licenças são CC BY e CC BY-SA; não há NC, ND ou licença ausente. Autores, URLs de distribuição, páginas de origem e créditos estão registrados no lote.

As três consultas GBIF retornaram `matchType=EXACT` e `status=ACCEPTED`. O lote permanece `pending-review`: a correspondência taxonômica e as imagens não substituem a confirmação de ocorrência no Pantanal. A alternativa executável é consultar SiBBr/ICMBio por espécie e usar Livro Vermelho/portarias MMA/ICMBio para conservação, mantendo o campo vazio até confirmação.


## 23. Bloco de peixes `catalog-fish-04`

A Conta 2 adicionou `Pimelodus maculatus`, `Loricariichthys anus` e `Corydoras paleatus`, em módulo separado, com nove imagens Commons verificadas individualmente. As licenças são CC BY, CC BY-SA e domínio público; não há NC, ND ou licença ausente. Autores, URLs de distribuição, páginas de origem e créditos estão registrados no lote.

As três correspondências GBIF foram validadas antes da inclusão. O lote permanece `pending-review`: ocorrência no recorte do Pantanal e conservação oficial continuam sem confirmação. Alternativa executável: consultar SiBBr/ICMBio por espécie e o Livro Vermelho/portarias MMA/ICMBio para conservação, mantendo o campo vazio até evidência oficial.

## 28. Bloco de peixes `catalog-fish-06`

A Conta 2 adicionou `Salminus brasiliensis`, `Pseudoplatystoma corruscans` e `Leporinus obtusidens`, em módulo separado, com nove imagens Commons. As três consultas GBIF retornaram `EXACT`/`ACCEPTED`. As licenças são CC0, CC BY 4.0, CC BY-SA 2.0/2.5/4.0 e domínio público; as nove URLs retornaram HTTP 200 após retentativas.

A primeira validação encontrou IDs duplicados para `salminus-brasiliensis` e `pseudoplatystoma-corruscans`, já presentes nos registros legados. Os IDs novos foram corrigidos para `salminus-brasiliensis-fish06` e `pseudoplatystoma-corruscans-fish06`; após a correção, check, lint, testes, diff check, auditoria global e política comercial passaram. O lote permanece `pending-review` para ocorrência regional e conservação oficial. Próxima tarefa: `catalog-invertebrates-07`.

## 27. Bloco de aves `catalog-birds-05`

A Conta 2 adicionou `Egretta thula`, `Pitangus sulphuratus` e `Sicalis flaveola`, em módulo separado, totalizando três espécies e nove imagens Commons. As três consultas GBIF retornaram `EXACT`/`ACCEPTED`. As licenças são CC0 e CC BY-SA 3.0/4.0; não há NC, ND ou licença ausente. As nove URLs `Special:FilePath` foram verificadas com User-Agent e retentativas e retornaram HTTP 200.

O lote permanece `pending-review` para ocorrência específica no Pantanal e conservação oficial. Próxima tarefa desbloqueada: `catalog-fish-06` ou `catalog-invertebrates-07`.

## 26. Bloco de invertebrados `catalog-invertebrates-06`

A Conta 2 adicionou `Heliconius erato`, `Papilio thoas` e `Bombus pauloensis`, em módulo separado, totalizando três espécies e nove imagens Commons. As três consultas GBIF retornaram `EXACT`/`ACCEPTED`. As licenças são CC BY 4.0 e CC BY-SA 2.5/3.0/4.0; não há NC, ND ou licença ausente. As nove URLs `Special:FilePath` foram verificadas com User-Agent e retentativas e retornaram HTTP 200.

O lote permanece `pending-review` para ocorrência específica no Pantanal e conservação oficial. Próxima tarefa desbloqueada: `catalog-birds-05` ou `catalog-fish-06`.

## 25. Bloco de peixes `catalog-fish-05`

A Conta 2 adicionou `Pseudoplatystoma reticulatum`, `Cichla piquiti` e `Piaractus brachypomus`, em módulo separado, totalizando três espécies e nove imagens Commons. O GBIF retornou `EXACT`/`ACCEPTED` para os três nomes. As licenças são CC BY, CC BY-SA e domínio público; nenhuma imagem NC/ND ou sem licença foi aceita. As URLs `Special:FilePath` retornaram HTTP 200 após User-Agent e retentativas; a resposta inicial 429 do Commons foi registrada como limitação temporária, não como falha de origem.

O lote permanece `pending-review` para ocorrência específica no Pantanal e conservação oficial. Próxima tarefa desbloqueada: `catalog-invertebrates-06`.

## 24. Bloco de invertebrados `catalog-invertebrates-05`

A Conta 2 adicionou `Morpho menelaus`, `Ascalapha odorata` e `Dynastes hercules`, em módulo separado, com nove imagens Commons verificadas individualmente. As licenças são CC BY 3.0 e CC BY-SA 4.0; não há NC, ND ou licença ausente. As três consultas GBIF retornaram `matchType=EXACT` e `status=ACCEPTED`, e as nove URLs `Special:FilePath` retornaram HTTP 200.

Durante a validação foi encontrado um conflito global porque `morpho-helenor` já existia em `invertebrates-01`. O erro foi corrigido substituindo o registro novo por `morpho-menelaus`; os 11 testes voltaram a passar. O lote permanece `pending-review` para ocorrência específica no Pantanal e conservação oficial. Próxima tarefa desbloqueada: `birds-04` ou `fish-05`.
