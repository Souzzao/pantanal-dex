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
- [x] Implementar modo mapa para registros com coordenadas
- [x] Implementar exportação JSON e CSV sem apagar registros
- [x] Garantir leitura do catálogo e edição dos registros sem conexão
- [x] Criar testes determinísticos para validação, persistência e exportação
- [x] Executar verificação TypeScript, lint e testes
- [x] Abrir a prévia do projeto no navegador do usuário

- [ ] Refinar a hierarquia visual, espaçamento e estados de interação das telas principais
- [x] Melhorar o carregamento e o fallback das imagens do catálogo
- [x] Adicionar modo mapa funcional para avistamentos com coordenadas
- [x] Implementar edição completa de avistamentos
- [x] Adicionar testes determinísticos para persistência, validação e exportação

## Quadro de trabalho — próxima consolidação

### Frente A — Auditoria e arquitetura
- [x] Auditar todas as rotas existentes e eliminar telas ou botões sem ação
- [x] Criar matriz de requisitos da especificação versus implementação atual
- [x] Definir contratos compartilhados para Species, Sighting, Settings, filtros e exportação
- [x] Separar dados, componentes visuais, serviços nativos e regras de negócio
- [x] Criar uma política de fallback para web, iOS, Android e uso sem conexão

### Frente B — Conteúdo científico e acervo de espécies
- [x] Expandir o catálogo para pelo menos 20 espécies representativas do Pantanal
- [x] Completar os grupos mamíferos, aves, répteis, anfíbios, peixes e invertebrados
- [x] Completar os ambientes rios e corixos, áreas alagadas, campos, matas e bordas de mata
- [ ] Validar nomes populares, nomes científicos, distribuição e situação de conservação
- [x] Garantir três imagens por espécie com crédito, licença e URL de origem
- [x] Criar validação automática para detectar campos científicos ou créditos ausentes
- [ ] Adicionar fontes estruturadas por espécie e registrar a data da revisão editorial

### Frente C — Catálogo e descoberta
- [x] Refinar cards, estados de carregamento, estado vazio e fallback visual de imagem
- [x] Criar filtros combinados e possibilidade de limpar todos os filtros
- [x] Adicionar ordenação por nome popular e grupo
- [x] Criar barra rápida de idioma dentro da ficha da espécie
- [x] Exibir claramente quando uma tradução não estiver disponível
- [x] Revisar a ficha para leitura rápida em campo e acessibilidade

### Frente D — Avistamentos e caderno de campo
- [x] Implementar edição completa de avistamentos existentes
- [x] Validar data, horário, quantidade, visibilidade e precisão da localização
- [x] Permitir escolher a espécie pelo formulário com busca
- [x] Implementar captura pela câmera além da seleção da galeria
- [x] Melhorar confirmação de salvamento, edição e exclusão
- [x] Criar filtros de avistamentos por espécie, grupo, ambiente, período e texto
- [x] Implementar modo mapa funcional com marcadores e abertura do detalhe
- [x] Adicionar proteção de localização exata ao compartilhar registros sensíveis

### Frente E — Offline, idiomas e exportação
- [x] Criar camada de armazenamento local versionada e resiliente a dados corrompidos
- [ ] Garantir catálogo, imagens disponíveis, registros e preferências sem conexão
- [x] Adicionar indicador não intrusivo de disponibilidade do mapa offline
- [x] Implementar seleção, ordem e remoção de idiomas preferidos
- [x] Validar esquema do JSON exportado e compatibilidade do CSV com planilhas
- [x] Garantir que exportar nunca altere ou apague os dados locais

### Frente F — Qualidade e entrega
- [x] Criar testes determinísticos para modelos, validação, persistência e exportação
- [x] Executar TypeScript, lint e testes após cada frente concluída
- [x] Testar fluxos Início → ficha → avistamento → detalhe → edição/exclusão
- [ ] Testar fluxo sem conexão e fallback de permissões nativas
- [x] Revisar a interface em portrait 9:16 para uso com uma mão
- [x] Fazer revisão visual das telas Início, Animais, Avistamentos, Mapa e Configurações
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

- [x] Habilitar o conector GitHub ou exportar o projeto pelo painel de desenvolvimento
- [x] Criar repositório privado compartilhado sem expor tokens ou segredos
- [x] Definir branches Conta 2, Conta 3 e coordenação
- [x] Documentar Pull Requests, revisão e integração do primeiro ciclo

## Acesso GitHub das contas colaboradoras

- [ ] Adicionar ou confirmar o convite da conta dark371star no repositório privado Souzzao/pantanal-dex
- [ ] Confirmar que dark371star aceitou o convite e consegue ver as branches conta-2-catalogo e conta-3-qualidade
- [ ] Iniciar a Conta 2 e a Conta 3 somente após validação do acesso ao repositório

- [x] Enviar convite GitHub para FelipeSouzao no repositório privado; aceite ainda pendente

## Diagnóstico final de acesso GitHub

- [x] Confirmar usuário autenticado, proprietário e URL exata do repositório
- [x] Verificar convite pendente para dark371star; convite já existe e não precisa ser reenviado
- [ ] Confirmar acesso efetivo antes de iniciar alterações na branch conta-2-catalogo

## Repositório público para colaboração

- [x] Alterar Souzzao/pantanal-dex de privado para público
- [x] Verificar acesso público às branches de trabalho
- [x] Atualizar as instruções para não depender de convite privado

## Pull Request da Conta 2

- [x] Liberar permissão de escrita para dark371star no repositório público
- [x] Enviar a branch conta-2-catalogo com o commit a59c3d3
- [x] Abrir, revisar, validar e integrar o Pull Request contra main

## Ciclo técnico da coordenação

- [x] Criar validações determinísticas para o catálogo expandido
- [x] Criar testes para persistência e exportação de avistamentos
- [ ] Auditar fluxos locais e botões sem ação
- [ ] Monitorar e integrar a entrega da Conta 3 quando publicada

## Ciclo de descoberta e mapa

- [x] Implementar filtros avançados por espécie, grupo, ambiente, período e texto
- [x] Implementar modo mapa web com cartões georreferenciados e navegação para detalhes
- [x] Melhorar fallback, erro e carregamento das imagens do catálogo
- [x] Executar QA integrado e abrir Pull Request da coordenação

## Revisão profunda em sete ciclos

- [x] Mapear todos os requisitos originais contra as telas e contratos atuais
- [x] Auditar rotas, dependências, permissões nativas, offline e acessibilidade
- [x] Registrar riscos, lacunas, casos extremos e decisões de arquitetura
- [x] Implementar melhorias funcionais prioritárias e corrigir inconsistências
- [x] Fazer segunda passagem crítica após a primeira implementação
- [ ] Executar validação prática, revisão visual e testes por plataforma disponível
- [ ] Polir UX, desempenho, documentação e preparar checkpoint consolidado

## Revisão pós-checkpoint — próximas lacunas

- [x] Auditar câmera, permissões nativas, localização e mapa por plataforma
- [x] Implementar captura pela câmera com fallback seguro na web
- [x] Melhorar seleção de espécie no formulário de avistamento
- [x] Completar mapa nativo apenas em configuração compatível sem quebrar a prévia web
- [x] Auditar acessibilidade, estados de erro e fluxos de recuperação
- [x] Criar testes determinísticos de persistência local e casos extremos de exportação
- [x] Fazer nova revisão visual e polimento final antes do próximo checkpoint

## Execução contínua — blocos de implementação

- [x] Implementar ordenação e descoberta refinadas nas fichas do catálogo
- [x] Implementar indicação clara de disponibilidade offline e estado de armazenamento
- [x] Implementar exportação com seleção de registros e confirmação de privacidade
- [x] Implementar melhorias adicionais no caderno de campo e recuperação de erros
- [x] Implementar acessibilidade e estados de carregamento nas telas restantes
- [x] Executar validações pontuais após cada bloco e consolidar o avanço

## Execução contínua — próxima sequência

- [x] Implementar importação controlada de JSON exportado
- [x] Implementar confirmação, validação e merge seguro de dados importados
- [x] Implementar indicador de catálogo/imagens offline sem prometer cache remoto inexistente
- [x] Implementar ações avançadas no detalhe do avistamento
- [x] Implementar acessibilidade e recuperação nos fluxos restantes
- [x] Executar testes pontuais e consolidar os blocos implementados

## Protocolo de 20 ciclos — desenvolvimento contínuo

- [x] Ciclos 1–4: completar funcionalidades principais ainda faltantes
- [x] Ciclos 5–8: desenvolver funcionalidades secundárias e integrações
- [ ] Ciclos 9–12: melhorar UX/UI e fluxos de utilização
- [ ] Ciclos 13–16: reforçar robustez, erros, desempenho e casos extremos
- [ ] Ciclos 17–19: executar refinamento geral e corrigir lacunas restantes
- [ ] Ciclo 20: realizar revisão final e implementar as últimas melhorias relevantes

- [x] Implementar limpeza total do caderno local com confirmação destrutiva e preservação de backup por exportação

- [x] Adicionar resumo de avistamentos pessoais e atalho para o caderno na ficha de espécie
- [x] Adicionar resumo do caderno com registros, fotos e pontos no mapa

- [x] Conectar a ficha de espécie ao caderno filtrado pela espécie selecionada
- [x] Exibir resumo de registros, fotos e localizações no caderno de campo

- [x] Configurar permissão nativa de localização apenas durante o uso do app
- [x] Validar o fluxo ficha → caderno filtrado por espécie e os resumos de cobertura

- [x] Corrigir atualização de preferências para evitar estado visual divergente quando a gravação local falha

- [x] Recuperar resultado pendente do ImagePicker após reinicialização do Android
- [x] Detectar serviços de localização desativados antes de solicitar coordenadas

- [x] Permitir remover fotografia existente durante a edição de avistamentos

- [x] Localizar rótulos da navegação inferior conforme a preferência de idioma
- [x] Validar automaticamente imagens, créditos, fontes e campos obrigatórios do catálogo

- [x] Testar e rejeitar URLs editoriais inválidas no catálogo

- [x] Proteger a abertura de fontes e créditos contra esquemas de URL inseguros

- [x] Localizar rótulos principais da home conforme Português, English e Español

- [x] Localizar títulos e estado offline da tela de configurações

- [x] Exibir nas configurações a integridade do catálogo local e o número de espécies válidas

- [x] Migrar arrays legados para o envelope versionado sem substituir dados corrompidos por vazio

## Nova expansão coordenada — 20 ciclos e catálogo amplo

- [x] Criar três prompts compactos, um para cada agente, dentro do limite de caracteres da Manus
- [x] Definir 20 ciclos compartilhados com responsáveis, dependências, branches, PRs e critérios de aceite
- [x] Expandir o catálogo para novos lotes de fauna do Pantanal sem quebrar os contratos atuais
- [x] Validar cada lote por grupo, ambiente, imagens, créditos, fontes e situação de conservação
- [ ] Integrar os lotes dos Agentes 2 e 3 somente após testes e revisão da Conta 1
- [x] Atualizar testes, matriz de requisitos, documentação e checkpoint da expansão

## Meta de escala — catálogo com 3.000+ espécies e equipe de 3 agentes

- [x] Atualizar os três prompts para desenvolvimento real, não apenas documentação
- [x] Redefinir os 20 ciclos com lotes escaláveis e meta explícita de 3.000+ espécies
- [x] Criar contrato de lote científico, validação e registro de fontes
- [x] Preparar catálogo modular para não concentrar milhares de espécies em um único arquivo
- [x] Expandir espécies em lotes por grupos, biomas locais e ambientes
- [x] Implementar paginação, busca indexada e filtros eficientes para catálogo em escala
- [ ] Integrar PRs dos Agentes 2 e 3 com testes, revisão e checkpoints coordenados

## Agente 1 — ciclo coordenado atual

- [x] Verificar estado de `main`, `conta-2-catalogo`, `conta-3-qualidade` e branches de integração
- [x] Confirmar quantidade, grupos e validação do catálogo atual
- [x] Implementar o próximo bloco escalável sem alterar branches dos agentes
- [ ] Preparar checklist de PR e handoff para os Agentes 2 e 3
- [ ] Validar e salvar checkpoint do ciclo coordenado

- [x] Revisar o PR 5 do Agente 2 e bloquear integração por diff stale destrutivo
- [ ] Solicitar novo PR do Agente 2 baseado na main atual, contendo somente lote científico

- [x] Integrar o lote coordenado seguinte com 8 espécies sem IDs duplicados
- [x] Validar o lote seguinte com TypeScript, lint, 16 testes e diff check

- [x] Integrar lote de 8 espécies com cutia, paca, gato-mourisco, aracuã, socó-boi, jaçanã, martim-pescador e curimbatá
- [x] Validar o lote de 45 espécies com TypeScript, lint, 16 testes e diff check

- [x] Integrar lote de 8 espécies com cágado-de-barbicha, cobra-verde, perereca-cabeçuda, rã-de-quatro-olhos, piranha-vermelha, tuvira, borboleta-morfo e besouro-rola-bosta
- [x] Validar o lote de 53 espécies com TypeScript, lint, 16 testes e diff check

- [x] Integrar lote de 8 espécies com biguá, garça-moura, socó-dorminhoco, coruja-buraqueira, lambari, mandi, pitu e libélula
- [x] Validar o lote de 61 espécies com TypeScript, lint, 16 testes e diff check

- [x] Ciclo coordenado: adicionar oito espécies (tamanduá-mirim, irara, quati, carrapateiro, gavião-caramujeiro, pica-pau-do-campo, tesourinha) e reforçar teste de IDs únicos; catálogo validado com 68 espécies.
- [x] Implementar carregador modular por lotes com deduplicação, busca indexada e paginação.
- [x] Ciclo coordenado: adicionar oito espécies de répteis, anfíbios, peixes e invertebrados; corrigir IDs duplicados detectados pela validação; catálogo validado com 75 espécies.
- [x] Validar carregador modular, TypeScript, lint, 18 testes (1 teste de autenticação pulado) e diff check.

## Ciclo 1 — governança comercial e fontes aprovadas
- [x] Auditar licenças de todas as imagens e fontes das 75 espécies atuais
- [x] Adicionar contrato de licença compatível com uso comercial e bloquear NC/ND/sem licença confirmada
- [x] Criar LICENSES.md com créditos, URLs, licença e política de revisão por fonte
- [x] Restringir dados de conservação a Livro Vermelho ICMBio ou Portarias MMA/ICMBio; deixar vazio quando ausente
- [x] Registrar no HANDOFF-3-CONTAS.md a regra de aprovação de PRs e o lote piloto de espécies
- [x] Validar governança com pnpm check, pnpm lint, pnpm test e git diff --check

## Ciclos 2 e 3 — arquitetura modular e pipeline licenciado
- [x] Auditar PR #7, estado das branches e divergências antes da integração
- [x] Separar o catálogo em módulos de lotes por grupo sem quebrar imports existentes
- [x] Criar pipeline de validação e relatório de lotes com licenças comerciais
- [x] Definir lote piloto inicial da Conta 2 e métrica de vazão para recalibração no Ciclo 3
- [x] Executar check, lint, testes e diff check; atualizar docs, commit e PR

## Ciclo 4 — índice, busca e expansão licenciada
- [x] Auditar PRs #7 e #8, branches e estado da main
- [x] Fortalecer índice derivado com contagem, filtros e paginação dos lotes
- [x] Adicionar lote modular de aves e peixes com licenças comerciais confirmadas
- [x] Validar cobertura, IDs, fontes, créditos e ausência de NC/ND/IUCN
- [x] Executar check, lint, testes e diff check; atualizar docs, commit e PR

## Ciclos 5–6 — mamíferos e aves
- [x] Auditar PRs #7 e #8 e confirmar a base atual da expansão
- [x] Adicionar lote modular de mamíferos com fontes e licenças comerciais confirmadas
- [x] Adicionar lote modular de aves com fontes e licenças comerciais confirmadas
- [x] Validar IDs, créditos, fontes, conservação oficial e cobertura por grupo
- [x] Executar check, lint, testes e diff check; atualizar docs, commit e PR

## Ciclos 9–10 — répteis e anfíbios
- [x] Auditar PRs #7 e #8 e confirmar a base atual da expansão
- [x] Adicionar lote modular de répteis com fontes e licenças comerciais confirmadas
- [x] Adicionar lote modular de anfíbios com fontes e licenças comerciais confirmadas
- [x] Validar IDs, créditos, fontes, conservação oficial e cobertura por grupo
- [x] Executar check, lint, testes e diff check; atualizar docs, commit e PR

## Ciclos 11–12 — peixes e invertebrados
- [x] Auditar PR #8 e confirmar a base atual da expansão
- [x] Adicionar lote modular de peixes com fontes e licenças comerciais confirmadas
- [x] Adicionar lote modular de invertebrados com fontes e licenças comerciais confirmadas
- [x] Validar IDs, créditos, fontes, conservação oficial e cobertura por grupo
- [x] Executar check, lint, testes e diff check; atualizar docs, commit e PR

## Sistema Ultimate — produtividade, segurança e continuidade
- [x] Definir metas mínimas por bloco e proibir respostas sem implementação verificável
- [x] Criar watchdog de atividade: commit, PR, checks, TODO e handoff obrigatórios
- [x] Criar mecanismo anti-repetição com fila priorizada, dependências e retomada automática
- [x] Definir escalonamento entre agentes para bloqueios, PRs stale e branch sem atividade
- [x] Escrever três prompts Ultimate compactos com execução em blocos de ciclos
- [x] Criar pacote operacional com protocolo, métricas, comandos e instruções de ativação

## Bloco massivo pós-PR #10
- [ ] Auditar watchdog, TODO, handoff, PRs e fila sem repetir auditorias concluídas
- [x] Cobrir fluxo Início → ficha → avistamento → detalhe → edição/exclusão
- [x] Cobrir fluxo offline, fallback de imagem e recusa de permissões nativas
- [x] Corrigir falhas encontradas nos fluxos e melhorar feedback/estados de interação
- [ ] Revisar portrait 9:16, uso com uma mão e acessibilidade das telas principais
- [x] Atualizar documentação e handoff com arquivos, riscos e dependências
- [x] Executar check, lint, test, diff check e watchdog; publicar commit e PR

## Bloco massivo seguinte — offline, import/export e acessibilidade
- [ ] Auditar a fila atual, watchdog, PR #10 e estado da branch sem repetir auditorias concluídas
- [x] Garantir feedback seguro para falhas de leitura/gravação local e ações destrutivas
- [x] Ampliar testes de importação/exportação, corrupção e preservação de dados
- [x] Revisar accessibilityLabel, accessibilityState, foco e feedback dos fluxos principais
- [x] Revisar estados vazios, loading, erro e modo offline nas telas principais
- [x] Atualizar HANDOFF-3-CONTAS.md, validar, commitar, publicar PR e checkpoint

## Próximo bloco massivo — permissões, offline e idiomas
- [ ] Auditar watchdog, TODO, handoff, PR #10 e branches sem repetir auditorias concluídas
- [x] Criar helpers testáveis para estados de permissão de câmera e localização
- [x] Cobrir estados negado, serviço desativado, erro e sucesso sem quebrar o salvamento
- [x] Garantir labels e mensagens PT/EN/ES nos fluxos de erro e ações nativas
- [ ] Testar fallback offline, imagens indisponíveis e catálogo modular nas rotas restantes
- [x] Atualizar documentação, validar, commitar, publicar PR e checkpoint

## Novo bloco massivo — offline, imagens, idiomas e acessibilidade
- [ ] Auditar fila, watchdog, PR #10 e estado do checkpoint sem repetir trabalho concluído
- [x] Garantir fallback determinístico para imagens indisponíveis em catálogo e avistamentos
- [ ] Cobrir catálogo, registros e preferências em restauração offline com testes
- [ ] Ampliar mensagens de estado vazio, erro e carregamento em PT/EN/ES
- [ ] Revisar labels, estados disabled/busy e foco dos fluxos principais
- [x] Atualizar handoff, validar, commitar, publicar PR e checkpoint

## Novo bloco massivo — offline, estados e acessibilidade
- [ ] Auditar fila, watchdog, PR #10 e estado atual sem repetir auditorias concluídas
- [x] Criar testes de restauração offline com envelope legado, corrupção e preferências
- [x] Validar estados de permissão e preservação do salvamento sem foto/GPS
- [ ] Corrigir estados vazios, loading, erro e labels acessíveis nas rotas restantes
- [x] Atualizar handoff, validar, commitar, publicar PR e checkpoint

## Bloco massivo seguinte — execução contínua
- [x] Implementar teste determinístico de restauração offline com armazenamento corrompido e versão desconhecida
- [x] Completar estados localizados de permissão negada e indisponibilidade nas rotas nativas
- [ ] Adicionar novo lote licenciado de espécies com IDs, fontes e créditos verificáveis
- [x] Ampliar testes de catálogo, estados vazios, acessibilidade e rotas modulares
- [x] Atualizar handoff com commits, riscos, bloqueios reais e métricas do bloco
- [ ] Executar check, lint, test, diff check e watchdog; publicar commit e PR

## Retomada massiva pós-checkpoint 8182d0da
- [x] Auditar checkpoint, PR #10, branches e fila sem repetir trabalho concluído
- [x] Implementar recuperação explícita de falhas de leitura e gravação no AppContext
- [x] Criar relatório operacional de lotes pendentes, verificados e bloqueados por licença
- [ ] Ampliar estados localizados de carregamento, vazio, erro e offline nas rotas restantes
- [x] Reforçar testes de acessibilidade, persistência e catálogo modular em escala
- [ ] Atualizar handoff, executar validações, publicar PR e salvar checkpoint

## Bloco de correção pós-preview — runtime e localização
- [x] Corrigir o nó de texto solto reportado no preview web de Avistamentos/Mapa
- [x] Confirmar ausência do erro no console após recarregar as rotas afetadas
- [x] Completar mensagens localizadas e estados de erro/vazio das rotas alteradas
- [x] Reforçar testes e labels acessíveis após a correção
- [x] Atualizar handoff, executar validações, publicar PR e salvar checkpoint

## Bloco massivo pós-checkpoint 93ddbc55
- [x] Auditar estado do checkpoint, branches, PRs e fila sem repetir trabalho concluído
- [x] Estruturar relatório de licenças, fontes e bloqueios por lote
- [ ] Expandir lote científico seguro sem inserir dados ou imagens sem licença confirmada
- [x] Reforçar restauração offline, permissões nativas e estados acessíveis
- [x] Adicionar testes de governança, catálogo e fluxos de campo
- [ ] Atualizar handoff, validar, publicar PR e salvar checkpoint

## Bloco massivo pós-checkpoint 93c2dd3d
- [x] Auditar lotes, fontes estruturadas, branches e pendências sem repetir trabalho concluído
- [x] Adicionar metadados de revisão editorial e datas de conferência por lote
- [ ] Expandir espécies somente com fontes e imagens comercialmente auditáveis
- [ ] Reforçar estados de campo, idiomas e acessibilidade nas rotas restantes
- [x] Adicionar testes de metadados, lote científico e fluxos nativos
- [x] Atualizar handoff, validar, publicar PR e salvar checkpoint

## Reorientação para MVP final
- [x] MVP passo 1/50 — congelar contratos-base, medir estado real e registrar evidências
- [x] MVP passo 2/50 — gerar matriz real do catálogo e fila de auditoria P1
- [x] MVP passo 3/50 — definir núcleo P1 e checklist de validação por espécie
- [x] MVP passo 4/50 — criar fila rastreável de auditoria P1 e bloqueios por evidência
- [x] MVP passo 5/50 — auditar primeiro lote P1 com fontes, imagens e checklist
- [x] MVP passo 6/50 — auditar segundo lote P1 com fontes, imagens e checklist
- [x] MVP passo 7/50 — auditar primeiro lote de aves com fontes, imagens e checklist
- [x] MVP passo 8/50 — auditar segundo lote de aves, corrigir URLs de imagem e rastrear licenças por arquivo
- [x] MVP passo 9/50 — auditar terceiro lote de aves, fontes, imagens, ocorrência e licenças
- [x] MVP passo 10/50 — auditar primeiro lote de répteis, fontes, imagens, ocorrência e licenças
- [x] MVP passo 11/50 — auditar segundo lote de répteis, fontes, imagens, ocorrência e licenças
- [x] MVP passo 12/50 — fechar auditoria e inventário dos lotes de répteis, sem inventar um terceiro lote
- [x] MVP passo 13/50 — auditar primeiro lote de anfíbios, fontes, imagens, ocorrência e licenças
- [x] MVP passo 14/50 — auditar próximo lote de anfíbios, fontes, imagens, ocorrência e licenças
- [x] MVP passo 15/50 — auditar o próximo lote real de animais, fontes, imagens, ocorrência e licenças
- [x] MVP passo 16/50 — auditar o próximo lote real de peixes, fontes, imagens, ocorrência e licenças
- [x] MVP passo 17/50 — fechar auditoria e inventário dos lotes de peixes, sem inventar um terceiro lote
- [x] Medir contagem real por grupo, lotes, imagens, licenças e pendências
- [x] Definir conjunto prioritário de espécies para o MVP e critérios de inclusão
- [x] Criar prompts curtos e metas executáveis para Agentes 1, 2 e 3
- [x] Criar três pacotes ZIP individuais e um pacote coordenador com 50 passos do MVP
- [x] Verificar integridade, conteúdo e instruções dos quatro pacotes
- [x] Ler e comparar os ZIPs Coordenador e Agente 1 enviados pelo usuário
- [x] Registrar no handoff a divisão correta: eu sou Agente 1/Coordenador
- [x] Implementar primeiro ciclo de fechamento do MVP
- [ ] Verificar rotas, imagens, fontes, idiomas, offline, câmera, GPS, mapa e exportação
- [ ] Atualizar handoff, relatório do MVP, validações e checkpoint

## Bloco massivo pós-checkpoint fe3f6f3f
- [x] Auditar lote candidato, checklist, fontes, branches e PRs
- [ ] Promover somente lote com checklist editorial e licenças confirmadas
- [ ] Reforçar estados de campo, idiomas e acessibilidade nas rotas restantes
- [x] Adicionar testes de promoção, escala do catálogo e fluxos nativos
- [ ] Atualizar handoff, validar, publicar PR e salvar checkpoint

- [x] Reconstruir e entregar dois pacotes ZIP de retomada para os Agentes 2 e 3, com estado real do MVP, backlog e protocolo GitHub

- [x] Recalibrar o MVP para no mínimo 500 espécies verificadas e criar checklists operacionais de 300 pontos para os três agentes

- [x] Executar passo 1/50 a partir do pacote do Agente 1: extrair, comparar contratos, medir estado e registrar evidências
- [x] Criar apresentação premium Motion do PantanalDex como uma cena visual contínua (GSAP + FLIP)
