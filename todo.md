# Project TODO

- [x] Ler e consolidar a especificação básica do PantanalDex
- [x] Criar o plano de design da interface mobile em `design.md`
- [x] Gerar identidade visual e configurar ícone, splash, favicon e branding do app
- [x] Configurar tema PantanalDex e navegação inferior com quatro áreas
- [x] Criar modelo `Species` e catálogo JSON local com espécies iniciais
- [x] Implementar tela inicial com busca rápida, destaques e atalhos funcionais
- [x] Implementar catálogo com busca por nome popular/científico
- [x] Implementar filtros de animais por grupo e ambiente
- [x] Implementar ficha detalhada com galeria de três imagens, créditos, licenças e fontes
- [x] Implementar barra rápida de idioma e preferências de idiomas
- [x] Criar modelo `Sighting` e persistência local com AsyncStorage
- [x] Implementar formulário de novo avistamento com foto opcional, data, local e observações
- [x] Implementar localização opcional e precisão da localização
- [x] Implementar lista de avistamentos com estados vazio, filtros, edição e exclusão confirmada
- [ ] Implementar modo mapa para registros com coordenadas
- [x] Implementar exportação JSON e CSV sem apagar registros
- [x] Garantir leitura do catálogo e edição dos registros sem conexão
- [ ] Criar testes determinísticos para validação, persistência e exportação
- [x] Executar verificação TypeScript, lint e testes
- [x] Abrir a prévia do projeto no navegador do usuário

- [ ] Refinar a hierarquia visual, espaçamento e estados de interação das telas principais
- [ ] Melhorar o carregamento e o fallback das imagens do catálogo
- [ ] Adicionar modo mapa funcional para avistamentos com coordenadas
- [ ] Implementar edição completa de avistamentos
- [ ] Adicionar testes determinísticos para persistência, validação e exportação

## Quadro de trabalho — próxima consolidação

### Frente A — Auditoria e arquitetura
- [ ] Auditar todas as rotas existentes e eliminar telas ou botões sem ação
- [ ] Criar matriz de requisitos da especificação versus implementação atual
- [ ] Definir contratos compartilhados para Species, Sighting, Settings, filtros e exportação
- [ ] Separar dados, componentes visuais, serviços nativos e regras de negócio
- [ ] Definir uma política de fallback para web, iOS, Android e uso sem conexão

### Frente B — Conteúdo científico e acervo de espécies
- [ ] Expandir o catálogo para pelo menos 20 espécies representativas do Pantanal
- [ ] Completar os grupos mamíferos, aves, répteis, anfíbios, peixes e invertebrados
- [ ] Completar os ambientes rios e corixos, áreas alagadas, campos, matas e bordas de mata
- [ ] Validar nomes populares, nomes científicos, distribuição e situação de conservação
- [ ] Garantir três imagens por espécie com crédito, licença e URL de origem
- [ ] Criar validação automática para detectar campos científicos ou créditos ausentes
- [ ] Adicionar fontes estruturadas por espécie e registrar a data da revisão editorial

### Frente C — Catálogo e descoberta
- [ ] Refinar cards, estados de carregamento, estado vazio e fallback visual de imagem
- [ ] Implementar filtros combinados e possibilidade de limpar todos os filtros
- [ ] Adicionar ordenação por nome popular e grupo
- [ ] Criar barra rápida de idioma dentro da ficha da espécie
- [ ] Exibir claramente quando uma tradução não estiver disponível
- [ ] Revisar a ficha para leitura rápida em campo e acessibilidade

### Frente D — Avistamentos e caderno de campo
- [ ] Implementar edição completa de avistamentos existentes
- [ ] Validar data, horário, quantidade, visibilidade e precisão da localização
- [ ] Permitir escolher a espécie pelo formulário com busca
- [ ] Implementar captura pela câmera além da seleção da galeria
- [ ] Melhorar confirmação de salvamento, edição e exclusão
- [ ] Criar filtros de avistamentos por espécie, grupo, ambiente, período e texto
- [ ] Implementar modo mapa funcional com marcadores e abertura do detalhe
- [ ] Adicionar proteção de localização exata ao compartilhar registros sensíveis

### Frente E — Offline, idiomas e exportação
- [ ] Criar camada de armazenamento local versionada e resiliente a dados corrompidos
- [ ] Garantir catálogo, imagens disponíveis, registros e preferências sem conexão
- [ ] Adicionar indicador não intrusivo de disponibilidade do mapa offline
- [ ] Implementar seleção, ordem e remoção de idiomas preferidos
- [ ] Validar esquema do JSON exportado e compatibilidade do CSV com planilhas
- [ ] Garantir que exportar nunca altere ou apague os dados locais

### Frente F — Qualidade e entrega
- [ ] Criar testes determinísticos para modelos, validação, persistência e exportação
- [ ] Executar TypeScript, lint e testes após cada frente concluída
- [ ] Testar fluxos Início → ficha → avistamento → detalhe → edição/exclusão
- [ ] Testar fluxo sem conexão e fallback de permissões nativas
- [ ] Revisar a interface em portrait 9:16 para uso com uma mão
- [ ] Fazer revisão visual das telas Início, Animais, Avistamentos, Mapa e Configurações
- [ ] Salvar checkpoint somente após todos os itens críticos estarem concluídos

## Operação coordenada — fluxo quase autônomo

- [ ] Criar painel de marcos com estado: backlog, em execução, bloqueado, revisão e concluído
- [ ] Definir ciclo padrão: planejar, implementar, verificar, revisar, checkpoint e aprovação
- [ ] Separar frentes sem conflito: conteúdo, interface, dados locais, recursos nativos, qualidade e documentação
- [ ] Registrar dependências entre frentes antes de iniciar cada ciclo
- [ ] Atualizar automaticamente o TODO ao concluir cada item validado
- [ ] Executar verificação TypeScript, lint e testes no final de cada ciclo
- [ ] Capturar revisão visual do preview em cada marco de interface
- [ ] Produzir relatório curto de marco com concluído, pendente, bloqueado e próxima aprovação
- [ ] Solicitar aprovação do usuário somente para decisões de produto, dados sensíveis ou mudanças irreversíveis
- [ ] Salvar checkpoint após cada marco aprovado e antes de iniciar mudanças arriscadas
- [ ] Manter uma fila de próximos itens prontos para execução sem nova orientação detalhada
- [ ] Avaliar futuramente uma rotina agendada de revisão do backlog, caso o usuário queira automação fora da sessão

## Ciclo 1 — Catálogo científico

- [ ] Selecionar as espécies adicionais do primeiro lote de expansão
- [ ] Validar nomes científicos, grupos e ambientes das espécies selecionadas
- [ ] Validar descrições, comportamento, alimentação, distribuição e importância ecológica
- [ ] Registrar situação de conservação e fonte por espécie
- [ ] Associar três imagens com crédito, licença e URL de origem por espécie
- [ ] Implementar o catálogo expandido sem alterar o contrato das telas existentes
- [ ] Criar validação automática para campos obrigatórios do catálogo
- [ ] Executar TypeScript, lint, testes e revisão visual do catálogo expandido

## Colaboração entre três contas Manus

- [x] Criar documentação de handoff com estado atual, divisão de frentes, regras de edição e protocolo de integração

## Pacote de colaboração entre contas

- [x] Montar ZIP com handoff, especificação, quadro de trabalho, design, workflow e links do projeto
- [x] Verificar se o ZIP contém instruções suficientes para as duas contas começarem sem contexto adicional

## Pacotes complementares por função

- [x] Criar ZIP específico da Conta 2 com guia de conteúdo científico e catálogo
- [x] Criar ZIP específico da Conta 3 com guia de avistamentos, interface e qualidade
- [x] Criar ZIP da Conta Coordenadora com protocolo de integração, revisão e checkpoints
- [x] Verificar os três pacotes e entregar os links corretos

## Painel temporário de desenvolvimento

- [x] Ler e alinhar o protocolo do pacote de coordenação enviado
- [x] Criar painel temporário de colaboração visível apenas em desenvolvimento
- [x] Exibir frentes, responsáveis, estado do ciclo e últimas atividades
- [ ] Registrar marcos e bloqueios sem misturar dados de colaboração com dados do usuário
- [ ] Adicionar rota de manutenção para remover o painel antes da entrega final
- [ ] Integrar e validar as contribuições das Contas 2 e 3 quando estiverem disponíveis

## Correção de acesso das contas colaboradoras

- [x] Criar novo guia da Conta 2 com ID do projeto, checkpoint 4c70b59c e instruções de permissão
- [x] Criar novo guia da Conta 3 com ID do projeto, checkpoint 4c70b59c e instruções de permissão
- [x] Montar novos ZIPs e orientar o usuário sobre como compartilhar o projeto no painel

## Colaboração por repositório

- [ ] Habilitar o conector GitHub ou exportar o projeto pelo painel de desenvolvimento
- [ ] Criar repositório privado compartilhado sem expor tokens ou segredos
- [ ] Definir branches Conta 2, Conta 3 e coordenação
- [ ] Documentar Pull Requests, revisão e integração do primeiro ciclo


## Agente 2 — Expansão modular para 3.000+ espécies

| Ciclos | Escopo | Estado |
|---|---|---|
| 1. `[x]` Contrato e índice de lotes (`shared/catalog`) | [x] Implementado, congelado na versão `mvp-1` e validado. |
| 2–3 | Mamíferos | [x] `catalog-mammals-01` adicionado com três espécies; revisão final pendente. |
| 4–6 | Aves | [x] `catalog-birds-01` a `05` adicionados com quinze espécies; revisão regional e conservação pendentes. |
| 7–8 | Répteis e anfíbios | [x] `catalog-reptiles-01` e `catalog-amphibians-01` adicionados; revisão final pendente. |
| 9–11 | Peixes | [x] `catalog-fish-01` a `06` adicionados com dezoito espécies; revisão regional e conservação pendentes. |
| 12–14 | Invertebrados | [x] `catalog-invertebrates-01` a `07` adicionados com quinze espécies no total; revisão regional e conservação pendentes. |
| 15–16 | Índices por ambiente, sinônimos e busca | [x] Índices derivados e helper de nomes alternativos implementados; popular sinônimos documentados continua pendente. |
| 17–19 | Validação taxonômica, imagens, licenças, fontes e conservação | [x] 15 nomes modulares validados como ACCEPTED/EXACT no GBIF; ocorrência regional e conservação ICMBio/MMA ainda pendentes. |
| 20 | Pacote final e PR | [ ] Pendente. |

O lote `catalog-mammals-01` contém `Chrysocyon brachyurus`, `Tayassu pecari` e `Pecari tajacu`. Os registros têm três imagens HTTP do Wikimedia Commons por espécie, autoria, licença, origem e fonte GBIF. A conservação ainda aguarda fonte oficial do ICMBio ou portaria MMA/ICMBio. O lote permanece `pending-review` porque a nomenclatura aceita, o status de conservação e a ocorrência específica no Pantanal ainda precisam de revisão editorial especializada. Fotografias de zoológico ou de outras localidades não são evidência de ocorrência regional.


## Mecanismo permanente de segurança operacional — Agente 2

### Definição de pronto por bloco

Um bloco só recebe status `[x]` quando contém alteração verificável de código ou dados, teste/validador correspondente, atualização deste TODO e do HANDOFF, `pnpm check`, `pnpm lint`, `pnpm test`, `git diff --check`, commit pequeno e PR atualizado com ciclos, arquivos, contagem, fontes, licenças, riscos, pendências e próximo lote. Sem esse conjunto, o status permanece `[ ]` ou `INCOMPLETO`.

### Fila priorizada anti-repetição

1. `[x]` Completar este bloco de invertebrados: `catalog-invertebrates-03` e `04` adicionaram quatro espécies com doze imagens Commons verificadas; novas espécies continuam na fila.
2. `[x]` Auditar e substituir as 15 fontes IUCN legadas por consultas GBIF; status de conservação removido até confirmação ICMBio/MMA.
3. `[x]` Criar validador automatizado de domínio/licença por arquivo e relatório `LICENSES/credits` por lote; contrato também exige IDs ASCII em kebab-case.
4. `[x]` Expandir lotes modulares: `catalog-birds-02`, `03`, `catalog-fish-02` a `04` e `catalog-invertebrates-05` adicionaram dezoito espécies; continuar novos lotes de aves, peixes e invertebrados.
6. `[x]` Implementar `catalog-invertebrates-05` com três espécies e nove imagens Commons; corrigir o ID duplicado `morpho-helenor` detectado pelos testes, substituindo-o por `morpho-menelaus`.
8. `[x]` Implementar `catalog-birds-04` com três espécies, nove imagens Commons, GBIF EXACT/ACCEPTED e URLs HTTP 200; atualizar teste para 40 espécies modulares.
9. `[x]` Implementar `catalog-fish-05` com três espécies novas, nove imagens Commons, GBIF EXACT/ACCEPTED e URLs HTTP 200 após retentativa.
11. `[x]` Implementar `catalog-invertebrates-06` com três espécies novas, nove imagens Commons, GBIF EXACT/ACCEPTED e URLs HTTP 200.
12. `[x]` Implementar `catalog-birds-05` com três espécies novas, nove imagens Commons, GBIF EXACT/ACCEPTED e URLs HTTP 200.
13. `[x]` Implementar `catalog-fish-06` com três espécies novas, nove imagens Commons, GBIF EXACT/ACCEPTED e URLs HTTP 200; corrigir IDs duplicados contra registros legados.
15. `[x]` Implementar `pnpm mvp:report`, pois o comando exigido pelos pacotes MVP não existia; relatório atual reproduzível: 20 espécies públicas, 52 modulares, 72 totais, 20 lotes pending-review, 0 verificados e 156 imagens modulares.
14. `[x]` Implementar `catalog-invertebrates-07` com três espécies novas, nove imagens Commons, GBIF EXACT/ACCEPTED e URLs HTTP 200.
16. `[ ]` Implementar `catalog-birds-06` ou `catalog-fish-07` com três espécies novas e evidência Commons/GBIF.
17. `[x]` Executar passo 1/50: congelar contrato do catálogo em `shared/catalog/contract.ts`, exportar `frozenCatalogContract`, adicionar teste de superfície e validar com `pnpm mvp:report`, check, lint, test e diff check.
18. `[x]` Executar passo 2/50: medir o catálogo real com `pnpm mvp:report` e expor o inventário na tela nativa de Configurações; medição de 2026-08-27: 20 espécies públicas, 55 modulares, 75 totais, 75 IDs únicos, 21 lotes pendentes, 0 verificados, 0 review-ready, 165 imagens e distribuição em memória por grupo (8/20/5/4/21/17).
19. `[x]` Executar passo 3/50: gerar `MVP-CATALOG-BASELINE.md` com `pnpm catalog:baseline`, consolidando grupos, ambientes, fontes, licenças, IDs, status e pendências; baseline: 75 espécies, 21 lotes, 165 imagens, 76 arrays de fontes, 0 IDs duplicados e 0 licenças NC/ND.
20. `[x]` Executar passo 4/50: criar `shared/catalog/priorities.ts` com matriz P1/P2, critérios e cobertura por grupo/ambiente; P1 mantém espécies ausentes como `speciesId=null`, P2 usa somente IDs modulares presentes; teste específico aprovado.
21. `[x]` Executar passo 5/50: registrar e atualizar `AGENTS-DIVISION.md` com branches reais (`conta-2-catalogo-ciclo-N`), responsabilidades, limites de escopo, dependências, definição de pronto, validação no My Browser e protocolo de handoff para os Agentes 1, 2 e 3; PR ativo: #11.
22. `[x]` Executar passo 6/50: adicionar `validateSpeciesRecord`/`validateSpeciesRecords` e `shared/catalog/scientific-audit.ts`, auditar IDs globais e campos científicos no catálogo combinado e expor o resultado na tela nativa; 75 registros, 75 IDs únicos, 0 duplicidades e 0 falhas de campos. Fontes FishBase legadas permanecem pendência de migração, enquanto lotes modulares continuam sob lista aprovada.
23. `[x]` Executar passo 7/50: auditar `pintado`, `pacu`, `piraputanga`, `caranguejo-agua-doce` e `camarao-agua-doce` com `pnpm catalog:legacy-gbif-audit`; 5/5 URLs GBIF responderam `EXACT`/`ACCEPTED`, confiança 99 e `usageKey` presente; evidência versionada em `CATALOG-LEGACY-GBIF-AUDIT.md`. FishBase/WoRMS não são usados nessas cinco fontes.
24. `[x]` Executar passo 8/50: atualizar o ledger `regional-occurrence.ts` para cinco consultas oficiais SiBBr, verificar o dataset ICMBio/SISBio `dr327` e criar `pnpm catalog:regional-occurrence-audit`; 5/5 registros cobertos, todos `pending-review`, 0 erros. Nenhuma ausência foi inferida e o status de conservação não foi alterado.
25. `[x]` Executar passo 9/50: auditar o dataset oficial ICMBio/SISBio `dr327` no SiBBr, licença CC BY 4.0, referência IPT v1.649 e cinco filtros por espécie com `pnpm catalog:icmbio-dataset-audit`; metadados HTTP 200, filtros HTTP 200 porém não estruturados, IPT HTTP 401, 5 registros `pending-review` e 0 confirmações individuais sem contagem confiável.
26. `[x]` Executar passo 10/50: atualizar `shared/catalog/conservation.ts` para 2026-08-27, auditar SALVE/Livro Vermelho/portarias MMA-ICMBio com `pnpm catalog:conservation-audit` e expor a trilha na tela nativa; 5 registros `pending-review`, 3 fontes oficiais, 0 categorias inventadas e resultado `PASS`.
27. `[x]` Executar passo 11/50: auditar as 165 imagens modulares com `catalog:image-audit` e gerar `CATALOG-IMAGE-LICENSE-AUDIT.md`; 165/165 licenças aprovadas, URLs e créditos presentes, 0 erros, 0 NC/ND e resultado `PASS`; cartão visual validado no My Browser.
28. `[x]` Executar passo 12/50: auditar 55 fontes estruturadas por espécie e 55 por lote com `catalog:source-audit`/`catalog:source-report`; 110 URLs GBIF, 110/110 títulos, HTTPS e hosts aprovados, 0 erros e resultado `PASS`; cartão visual validado no My Browser.
29. `[x]` Executar passo 13/50: consolidar 10 equivalências taxonômicas documentadas pelo GBIF para 5 espécies, auditar online com `pnpm catalog:synonym-audit` e expor a busca derivada na tela nativa; 10/10 sinônimos encontrados, 0 erros e 5 registros com aliases, sem duplicar espécies.
10. `[x]` Fechar pacote final do catálogo com contagem, IDs globais, fontes, pendências e PR descritivo; usar `pnpm mvp:report` como medição canônica da branch. O fechamento desta retomada está em `MVP-CATALOG-REPORT.md` e `CATALOG-PRIORITY-SELECTION.md`; a matriz passou `pnpm catalog:priority-audit`.

Ao concluir uma tarefa, marcar imediatamente o item correspondente como `[x]` e iniciar a primeira pendência desbloqueada. Auditorias já concluídas não devem ser repetidas sem evidência nova.

### Política de bloqueio e escalonamento

Todo bloqueio deve registrar causa, evidência, alternativa executável e agente responsável. Fonte indisponível deve gerar pipeline, fixture ou teste; PR stale deve gerar tentativa de rebase coordenada; conflito deve ser resolvido por integração seletiva pelo Agente 1; falha deve ser corrigida e validada novamente. Só bloqueios reais permanecem como `[ ]`.

31. `[x]` Executar passo 14/50: criar `pnpm catalog:vocabulary-audit` e `CATALOG-VOCABULARY-AUDIT.md`; auditar 55 registros contra 6 grupos e 5 ambientes, com 0 grupos/ambientes inválidos, 0 lacunas e cobertura completa confirmada no My Browser.

32. `[x]` Executar passo 15/50 — arquitetura modular: criar `pnpm catalog:architecture-audit` e `CATALOG-ARCHITECTURE-AUDIT.md`; 21 lotes, 55 espécies, IDs de lote/espécie únicos, 6 grupos e 5 ambientes indexados, 0 falhas. Cartão nativo validado no My Browser.


## Auditoria do catálogo — passos 1–16/50

- [x] Passo 16/50: auditar disponibilidade HTTP de imagens e páginas de crédito
- [x] Classificar HTTP 429 como rate limiting temporário, separado de falhas definitivas
- [x] Corrigir a página Commons 404 de `Anodorhynchus hyacinthinus`
- [x] Gerar `CATALOG-IMAGE-AVAILABILITY-AUDIT.md` com contagem por tipo e pendências
- [ ] Rechecar as 192 URLs HTTP 429 com concorrência reduzida antes de promover disponibilidade plena
- [ ] Passo 17/50: iniciar a próxima pendência científica desbloqueada após integração da Conta 1


## Passo 17/50 — primeira validação científica

- [x] Validar a identidade aceita de `Pseudoplatystoma corruscans` no GBIF/Catalogue of Life
- [x] Confirmar ocorrência regional de `pintado` na bacia do rio Miranda, Pantanal de Mato Grosso do Sul, pela Embrapa
- [x] Promover somente a trilha de ocorrência de `pintado` para `confirmed`, sem inferir conservação
- [x] Atualizar `scripts/regional-occurrence-audit.ts`, `CATALOG-REGIONAL-OCCURRENCE-AUDIT.md` e `STEP-17-RESEARCH.md`
- [ ] Validar individualmente `pacu`, `piraputanga`, `caranguejo-agua-doce` e `camarao-agua-doce`


## Passo 18/50 — validação científica do pacu

- [x] Validar `Piaractus mesopotamicus` como espécie aceita no GBIF/Catalogue of Life
- [x] Confirmar ocorrência de `pacu` no Pantanal de Mato Grosso do Sul por artigo científico SciELO
- [x] Promover somente a trilha de ocorrência de `pacu` para `confirmed`, sem inferir conservação
- [x] Atualizar `scripts/regional-occurrence-audit.ts`, `CATALOG-REGIONAL-OCCURRENCE-AUDIT.md`, `STEP-18-RESEARCH.md` e o handoff
- [ ] Validar individualmente `piraputanga`, `caranguejo-agua-doce` e `camarao-agua-doce`


## Passo 19/50 — validação científica da piraputanga

- [x] Validar `Brycon hilarii` como espécie aceita no GBIF/Catalogue of Life
- [x] Confirmar ocorrência regional da piraputanga por estudos Springer e SciELO no Pantanal/Alto Paraguai
- [x] Promover somente a trilha de ocorrência de `piraputanga` para `confirmed`, sem inferir conservação
- [x] Atualizar `scripts/regional-occurrence-audit.ts`, `CATALOG-REGIONAL-OCCURRENCE-AUDIT.md`, `STEP-19-RESEARCH.md` e o handoff
- [ ] Validar individualmente `caranguejo-agua-doce` e `camarao-agua-doce`


## Passo 20/50 — validação científica do caranguejo-de-água-doce

- [x] Validar `Dilocarcinus pagei` como espécie aceita no GBIF/Catalogue of Life
- [x] Confirmar ocorrência regional por artigo SciELO sobre alagados do Pantanal Mato-Grossense e bacia do Alto Paraguai
- [x] Promover somente a trilha de ocorrência de `caranguejo-agua-doce` para `confirmed`, sem inferir conservação
- [x] Atualizar `scripts/regional-occurrence-audit.ts`, `CATALOG-REGIONAL-OCCURRENCE-AUDIT.md`, `STEP-20-RESEARCH.md` e o handoff
- [ ] Validar individualmente `camarao-agua-doce`


## Passo 21/50 — validação científica do camarão-de-água-doce

- [x] Validar `Macrobrachium amazonicum` como espécie aceita no GBIF/Catalogue of Life
- [x] Confirmar ocorrência regional por estudo PubMed com coleta no rio Miranda e na Lagoa Baiazinha, no Pantanal de Mato Grosso do Sul
- [x] Promover somente a trilha de ocorrência de `camarao-agua-doce` para `confirmed`, sem inferir conservação
- [x] Atualizar `scripts/regional-occurrence-audit.ts`, `CATALOG-REGIONAL-OCCURRENCE-AUDIT.md`, `STEP-21-RESEARCH.md` e o handoff
- [x] Fechar o ledger regional legado com 5 de 5 registros confirmados e 0 pendências


## Passo 22/50 — validação oficial de conservação do pintado

- [x] Localizar a Portaria MMA nº 148/2022 na fonte oficial do ICMBio
- [x] Confirmar a correspondência individual de `Pseudoplatystoma corruscans` na linha 448 do anexo de peixes
- [x] Registrar `category: VU` e `status: confirmed` somente para `pintado`
- [x] Atualizar `shared/catalog/conservation.ts`, `scripts/conservation-audit.ts`, `CATALOG-CONSERVATION-AUDIT.md`, `STEP-22-RESEARCH.md`, testes e handoff
- [ ] Validar individualmente as categorias oficiais de `pacu`, `piraputanga`, `caranguejo-agua-doce` e `camarao-agua-doce`


## Passo 23/50 — validação oficial de conservação do pacu

- [x] Confirmar no Portal de Dados Abertos do MMA que a Portaria MMA nº 148/2022 é a lista nacional vigente
- [x] Consultar a Portaria por busca exata de `Piaractus mesopotamicus` e `pacu`
- [x] Registrar `finding: not-listed` e `status: confirmed` para `pacu`, sem inventar `LC` ou outra categoria
- [x] Atualizar `shared/catalog/conservation.ts`, `scripts/conservation-audit.ts`, `CATALOG-CONSERVATION-AUDIT.md`, `STEP-23-RESEARCH.md`, testes e handoff
- [ ] Validar individualmente a conservação de `piraputanga`, `caranguejo-agua-doce` e `camarao-agua-doce`


## Passo 24/50 — validação oficial de conservação da piraputanga

- [x] Consultar a Portaria MMA nº 148/2022 no Diário Oficial e na cópia oficial do ICMBio
- [x] Verificar a busca exata por `Brycon hilarii` e `piraputanga`
- [x] Registrar `finding: not-listed` e `status: confirmed` para `piraputanga`, sem inventar `LC` ou outra categoria
- [x] Atualizar `shared/catalog/conservation.ts`, `scripts/conservation-audit.ts`, `CATALOG-CONSERVATION-AUDIT.md`, `STEP-24-RESEARCH.md`, testes e handoff
- [ ] Validar individualmente a conservação de `caranguejo-agua-doce` e `camarao-agua-doce`


## Passo 25/50 — validação oficial de conservação do caranguejo-de-água-doce

- [x] Localizar o estudo técnico oficial do ICMBio sobre avaliação de crustáceos
- [x] Confirmar a ficha individual de `Dilocarcinus pagei Stimpson, 1861`
- [x] Registrar `category: LC`, `sourceKind: Avaliação ICMBio` e `status: confirmed`
- [x] Preservar o período da avaliação (2010–2014; ficha avaliada em 2010–2012) e seu escopo metodológico
- [x] Atualizar `shared/catalog/conservation.ts`, `scripts/conservation-audit.ts`, `CATALOG-CONSERVATION-AUDIT.md`, `STEP-25-RESEARCH.md`, testes e handoff
- [ ] Validar individualmente a conservação de `camarao-agua-doce`


## Passo 26/50 — validação oficial de conservação do camarão-de-água-doce

- [x] Localizar a ficha individual de `Macrobrachium amazonicum` no estudo técnico oficial do ICMBio
- [x] Confirmar `category: LC` e o período da avaliação (2013–2014)
- [x] Preservar a ressalva sobre possível sobrepesca localizada e o escopo temporal da avaliação
- [x] Atualizar `shared/catalog/conservation.ts`, `scripts/conservation-audit.ts`, `CATALOG-CONSERVATION-AUDIT.md`, `STEP-26-RESEARCH.md`, testes e handoff
- [x] Fechar a trilha de conservação com 5 registros confirmados e 0 pendências


## Passo 27/50 — inclusão e validação do veado-campeiro

- [x] Identificar `Veado-campeiro` (`Ozotoceros bezoarticus`) como a primeira pendência P1 após o fechamento dos ledgers legados
- [x] Confirmar a identidade aceita no GBIF e a ocorrência pantaneira por tese da UnB e referências do PAN Cervídeos/ICMBio
- [x] Criar o lote isolado `catalog-mammals-02` em estado `review-ready`, com campos científicos completos e 3 imagens Commons licenciadas
- [x] Atualizar a matriz P1 para apontar ao ID `veado-campeiro`
- [x] Atualizar `STEP-27-RESEARCH.md`, métricas, allowlist, testes, auditorias e handoff
- [x] Reduzir as pendências P1/P2 de 5 para 4; permanecem `arara-canindé`, `tucano-toco`, `jaú` e `aranha-armadeira`


## Passo 28/50 — inclusão e validação da arara-canindé

- [x] Confirmar `Ara ararauna` como espécie aceita no GBIF
- [x] Confirmar ocorrência no Pantanal por estudo de movimentos sazonais e fonte oficial do ICMBio
- [x] Criar o lote isolado `catalog-birds-06` em estado `review-ready`, com campos científicos completos
- [x] Auditar licenças: rejeitar GFDL 1.2 e selecionar 2 imagens CC BY 2.0 e 1 CC BY-SA 4.0
- [x] Atualizar a matriz P1 para apontar ao ID `arara-caninde`
- [x] Atualizar `STEP-28-RESEARCH.md`, métricas, testes, auditorias e handoff
- [x] Reduzir as pendências P1/P2 para 3: `tucano-toco`, `jaú` e `aranha-armadeira`


## Passo 29/50 — inclusão e validação do tucano-toco

- [x] Confirmar `Ramphastos toco` como espécie aceita no GBIF/Catalogue of Life
- [x] Confirmar ocorrência no Pantanal Sul, sub-região de Miranda, por estudo primário indexado no PubMed
- [x] Criar o lote isolado `catalog-birds-07` em estado `review-ready`, com campos científicos completos
- [x] Auditar três imagens Commons: CC BY 2.0, CC BY-SA 3.0 e CC BY-SA 2.0
- [x] Atualizar a matriz P1 para apontar ao ID `tucano-toco`
- [x] Atualizar `STEP-29-RESEARCH.md`, allowlist PubMed, métricas, testes, auditorias e handoff
- [x] Reduzir as pendências P1/P2 para 2: `jaú` e `aranha-armadeira`

## Passo 30/50 — inclusão e validação do jaú

- [x] Confirmar `Zungaro jahu` como espécie aceita no GBIF/Catalogue of Life, incluindo nomes históricos
- [x] Confirmar ocorrência no Pantanal brasileiro por estudo primário indexado no PubMed
- [x] Criar o lote isolado `catalog-fish-07` em estado `review-ready`, com campos científicos completos
- [x] Auditar três figuras SciELO sob licença CC BY 4.0, comercialmente compatível com atribuição
- [x] Atualizar a matriz P1 para apontar ao ID `zungaro-jahu`
- [x] Atualizar o ledger regional, `STEP-30-RESEARCH.md`, métricas, testes e auditorias
- [x] Reduzir as pendências P1/P2 para 1: `aranha-armadeira`

## Passo 31/50 — inclusão e validação da aranha-armadeira

- [x] Confirmar `Phoneutria nigriventer` como espécie aceita no GBIF/Catalogue of Life, incluindo combinações históricas
- [x] Confirmar ocorrência no Mato Grosso do Sul e no recorte do Pantanal Sul por estudo SciELO de araneofauna
- [x] Criar o lote isolado `catalog-invertebrates-08` em estado `review-ready`, com campos científicos completos
- [x] Auditar três imagens Commons: CC BY-SA 3.0, CC BY 2.0 e CC BY-SA 4.0
- [x] Atualizar a matriz P1 para apontar ao ID `phoneutria-nigriventer`
- [x] Atualizar o ledger regional, `STEP-31-RESEARCH.md`, métricas, testes e auditorias
- [x] Encerrar as pendências P1/P2: nenhuma espécie prioritária permanece pendente

## Passo 32/50 — validação oficial de conservação do veado-campeiro

- [x] Identificar o primeiro alvo pós-cobertura P1/P2: `Ozotoceros bezoarticus`
- [x] Confirmar na ficha oficial ICMBio/SALVE a categoria Vulnerável (VU) para `O. b. bezoarticus`
- [x] Registrar explicitamente no ledger o escopo taxonômico da subespécie avaliada
- [x] Atualizar `STEP-32-RESEARCH.md`, `CATALOG-CONSERVATION-AUDIT.md` e o auditor de conservação
- [x] Executar TypeScript, testes, auditoria de conservação e `git diff --check`

## Passo 33/50 — validação oficial de conservação da arara-canindé

- [x] Confirmar a espécie-alvo `Ara ararauna` e a Portaria MMA nº 148/2022 como fonte normativa
- [x] Pesquisar o PDF oficial por `Ara ararauna` e `arara-canindé`, incluindo conferência de termos relacionados do gênero
- [x] Registrar `arara-caninde` como `not-listed`, sem converter ausência em LC ou em avaliação de baixo risco
- [x] Atualizar `STEP-33-RESEARCH.md`, `shared/catalog/conservation.ts`, o auditor e os testes
- [x] Executar TypeScript, testes, auditoria de conservação e `git diff --check`

## Passo 34/50 — validação oficial de conservação do tucano-toco

- [x] Confirmar a ficha oficial específica de `Ramphastos toco` no ICMBio/SALVE
- [x] Confirmar correspondência taxonômica exata, sem restringir a avaliação a subespécie
- [x] Registrar a categoria oficial `LC` (Menos Preocupante), datada de 05/10/2018
- [x] Atualizar `STEP-34-RESEARCH.md`, `shared/catalog/conservation.ts`, o auditor e os testes
- [x] Executar TypeScript, testes, auditoria de conservação e `git diff --check`

## Passo 35/50 — validação oficial de conservação do jaú

- [x] Confirmar `Zungaro jahu` como alvo e distinguir o táxon de `Zungaro zungaro`
- [x] Consultar a Portaria MMA nº 148/2022 por extração textual e busca de variações de `Zungaro jahu`
- [x] Registrar `zungaro-jahu` como `not-listed`, sem promover NT/VU por grafia divergente em publicação secundária
- [x] Preservar a ressalva sobre a menção oficial do ICMBio à grafia `Zungaru jahu`
- [x] Atualizar `STEP-35-RESEARCH.md`, `shared/catalog/conservation.ts`, o auditor e os testes
- [x] Executar TypeScript, testes, auditoria de conservação e `git diff --check`

## Passo 36/50 — validação oficial de conservação da aranha-armadeira

- [x] Confirmar `Phoneutria nigriventer` como alvo taxonômico
- [x] Pesquisar a Portaria MMA nº 148/2022 por `Phoneutria nigriventer`, `nigriventer`, `Phoneutria` e `Ctenus`
- [x] Registrar `phoneutria-nigriventer` como `not-listed`, sem converter ausência em LC
- [x] Evitar inferência de risco a partir de fontes médicas, distribuição geral ou táxons de Ctenidae distintos
- [x] Atualizar `STEP-36-RESEARCH.md`, `shared/catalog/conservation.ts`, o auditor e os testes
- [x] Executar TypeScript, testes, auditoria de conservação e `git diff --check`
