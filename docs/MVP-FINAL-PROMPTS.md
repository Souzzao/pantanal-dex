# PantanalDex — plano de fechamento do MVP final

## Estado real em 22/08/2026

O catálogo público atual tem **102 espécies**, sendo **36 em 12 lotes modulares** e o restante no acervo legado compatível. A distribuição pública é a seguinte:

| Grupo | Espécies atuais |
|---|---:|
| Mamíferos | 24 |
| Aves | 26 |
| Répteis | 14 |
| Anfíbios | 12 |
| Peixes | 16 |
| Invertebrados | 10 |
| **Total** | **102** |

Os lotes modulares possuem 108 imagens, todas aprovadas pelo padrão automático atual; o catálogo público total possui 306 imagens. Existem **12 lotes em `pending-review`**, **0 verificados**, **0 inválidos** e **0 lotes prontos para promoção**. A auditoria automática não substitui a conferência individual de cada arquivo Commons, fonte, ocorrência no Pantanal e situação de conservação.

## Definição do MVP final

O MVP será considerado funcional quando o usuário puder abrir o catálogo sem conexão, pesquisar e filtrar animais, abrir fichas com imagens e créditos auditáveis, registrar/editar/excluir avistamentos, usar câmera com fallback, solicitar GPS sem quebrar quando negado, visualizar o mapa, exportar/importar JSON e CSV, trocar PT/EN/ES e recuperar dados após falha de armazenamento. O MVP não será declarado pronto enquanto houver botão sem ação, imagem sem licença individual confirmada, fonte insegura, lote promovido sem checklist ou fluxo crítico sem estado de carregamento, vazio e erro.

## Espécies prioritárias para o MVP

A primeira prioridade é a fauna mais icônica, frequente ou útil para identificação de campo. A prioridade não significa aprovação automática: cada espécie precisa passar pelo mesmo contrato e pela mesma auditoria comercial.

| Prioridade | Mamíferos | Aves | Répteis | Anfíbios | Peixes | Invertebrados |
|---|---|---|---|---|---|---|
| P1 — núcleo | Onça-pintada, capivara, anta, tamanduá-bandeira, queixada, lobo-guará, veado-campeiro | Tuiuiú, arara-azul, arara-canindé, tucano-toco, seriema, anhuma, garça-branca, colhereiro | Jacaré-do-Pantanal, sucuri-verde, teiú, cágado-cabeçudo, cobra-d’água | Sapo-cururu, rã-pimenta, perereca | Dourado, pacu, piraputanga, cachara, jaú | Abelha-jataí, formiga-cortadeira, aranha-armadeira |
| P2 — cobertura | Cervo-do-Pantanal, cateto, ouriço-cacheiro, morcego-pescador | Mutum-de-penacho, gavião-belo, urubu-rei, urubu-de-cabeça-preta | Teiú-vermelho, cobra-cipó | Perereca-de-folhagem-azul, perereca-de-margem-escura, perereca-macaco | Pacupeva, peixe-cachorro | Novos polinizadores, odonatos e crustáceos somente após auditoria |

O núcleo P1 deve ser fechado primeiro. As 36 espécies modulares existentes já cobrem a maior parte do P1 e P2, mas permanecem em revisão até a conferência comercial. O alvo do MVP é **pelo menos 60 espécies aprovadas editorialmente**, sem remover as 102 espécies atuais do modo de trabalho; depois do MVP, a expansão seguirá em lotes até 3.000+.

## Ciclos de fechamento do MVP

| Ciclo | Entrega obrigatória | Agente principal |
|---|---|---|
| M1 | Congelar contratos, inventário real, matriz P1/P2 e fila de bugs | Agente 1 |
| M2 | Auditar imagens, créditos, fontes e ocorrência do P1 modular | Agente 2 |
| M3 | Completar checklist, promover somente lotes aprovados e registrar revisão | Agentes 1+2 |
| M4 | Verificar busca, filtros, ficha, paginação e imagem offline/fallback | Agente 3 |
| M5 | Verificar novo avistamento, edição, exclusão, importação/exportação e privacidade | Agente 3 |
| M6 | Verificar câmera, permissões, GPS, serviço desativado e mapa | Agente 3 |
| M7 | Verificar PT/EN/ES, acessibilidade e uso com uma mão | Agentes 1+3 |
| M8 | Rodar testes, preview, diff, lint, watchdog e corrigir regressões | Todos |
| M9 | Fazer segunda passagem apenas dos bugs encontrados, sem reauditoria improdutiva | Todos |
| M10 | Release candidate, handoff, PR, checkpoint e declaração objetiva do MVP | Agente 1 |

Um ciclo só conta quando tem alteração verificável, teste, documentação, TODO atualizado, handoff atualizado, commit e PR/checkpoint. Se uma licença ou fonte falhar, o ciclo não para: a espécie fica bloqueada e o agente continua com a próxima espécie auditável.

## PROMPT PARA O AGENTE 1 — COORDENADOR

```text
Você é o Agente 1 e coordenador do PantanalDex. O objetivo imediato é fechar o MVP funcional, não adicionar volume sem revisão. O catálogo público tem 102 espécies: 24 mamíferos, 26 aves, 14 répteis, 12 anfíbios, 16 peixes e 10 invertebrados. Existem 36 espécies modulares em 12 lotes pending-review, 108 imagens modulares, 306 imagens no catálogo público, 0 lotes verificados e 0 review-ready.

Coordene M1–M10: congelar contratos e inventário; auditar P1; integrar apenas lotes com fontes, imagens, créditos, ocorrência, checklist completo e data ISO; verificar todas as rotas; corrigir bugs; executar pnpm check, pnpm lint, pnpm test, git diff --check e pnpm watchdog. Preserve Species, Sighting, Settings, import/export e privacidade. Nunca invente espécie, licença ou conservação. Em cada ciclo atualize TODO e HANDOFF-3-CONTAS.md, registre contagem, bloqueios e evidências, faça commit e PR/checkpoint. Não declare MVP pronto enquanto existir botão morto, licença não confirmada, fluxo sem loading/vazio/erro ou teste crítico ausente. Se o Agente 2 ou 3 não avançar, divida a tarefa, registre a cobrança no handoff e continue com trabalho independente. Trabalhe em blocos M1–M10, não pare após uma tarefa pequena.
```

## PROMPT PARA O AGENTE 2 — CATÁLOGO E LICENÇAS

```text
Você é o Agente 2 do PantanalDex, responsável pelo catálogo científico e licenciamento na branch conta-2-catalogo. O MVP prioriza P1: onça-pintada, capivara, anta, tamanduá-bandeira, queixada, lobo-guará, veado-campeiro, tuiuiú, araras, tucano-toco, seriema, anhuma, garça-branca, colhereiro, jacaré-do-Pantanal, sucuri-verde, teiú, sapo-cururu, rã-pimenta, pererecas, dourado, pacu, piraputanga, cachara, jaú, abelha-jataí, formiga-cortadeira e aranha-armadeira. Audite primeiro os lotes modulares existentes; não crie dados fictícios.

Para cada espécie confira ID único, nome científico, nome popular, grupo, ambiente, descrição, distribuição e ocorrência no Pantanal. Para cada imagem confira o arquivo individual, autor, URL, licença CC0/CC-BY/CC-BY-SA ou domínio público e crédito. Rejeite NC, ND, licença ausente, IUCN e conservação sem Livro Vermelho ICMBio ou ato oficial MMA/ICMBio. Preencha reviewedAt ISO, reviewedBy e os quatro itens do reviewChecklist somente após conferência real. Mantenha pending-review quando qualquer item falhar. Trabalhe em lotes pequenos e repetíveis; cada ciclo deve gerar dados ou testes, TODO, handoff, pnpm check/lint/test/diff check, commit e PR. Informe quantas espécies foram auditadas, aprovadas, bloqueadas e por quê. Não espere instruções entre ciclos.
```

## PROMPT PARA O AGENTE 3 — QUALIDADE, UX E RECURSOS NATIVOS

```text
Você é o Agente 3 do PantanalDex, responsável por qualidade, UX, acessibilidade e recursos nativos na branch conta-3-qualidade. O objetivo é transformar as rotas existentes em MVP confiável: Home, Animais, ficha, Avistamentos, Novo Avistamento, detalhe, Mapa e Configurações.

Execute ciclos M4–M9 sem ficar apenas auditando: verifique busca, filtros, paginação, ficha, fallback de imagem, estados loading/vazio/erro/offline, PT/EN/ES, labels acessíveis, uma mão, câmera, galeria, permissão negada, GPS negado, serviço de localização desligado, mapa sem coordenadas, importação/exportação e privacidade. Todo botão deve ter ação e feedback. Não use dados de usuário como fixture de colaboração. No web, preserve fallback seguro; no iOS/Android, use os contratos Expo existentes e não quebre quando a permissão for negada. Para cada ciclo implemente correções, adicione testes determinísticos, atualize TODO/HANDOFF, rode pnpm check/lint/test/diff check, faça commit e PR. Registre plataforma, rota, reprodução, correção e risco. Continue automaticamente até concluir o maior bloco seguro.
```

## Critério de encerramento do MVP

O MVP só pode ser anunciado quando os três agentes entregarem evidências convergentes: pelo menos 60 espécies com revisão editorial aprovada, imagens e fontes auditáveis, todas as rotas críticas funcionais, 100% dos testes verdes exceto testes explicitamente dependentes de autenticação, preview sem regressão, checklist de permissões concluído e checkpoint restaurável. As espécies restantes e a meta de 3.000+ continuam como expansão pós-MVP, em lotes versionados e licenciados.
