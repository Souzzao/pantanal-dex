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
- [ ] Adicionar testes determinísticos para persistência, validação e exportação

## Quadro de trabalho — próxima consolidação

### Frente A — Auditoria e arquitetura
- [x] Auditar todas as rotas existentes e eliminar telas ou botões sem ação
- [x] Criar matriz de requisitos da especificação versus implementação atual
- [ ] Definir contratos compartilhados para Species, Sighting, Settings, filtros e exportação
- [ ] Separar dados, componentes visuais, serviços nativos e regras de negócio
- [x] Criar uma política de fallback para web, iOS, Android e uso sem conexão

### Frente B — Conteúdo científico e acervo de espécies
- [ ] Expandir o catálogo para pelo menos 20 espécies representativas do Pantanal
- [ ] Completar os grupos mamíferos, aves, répteis, anfíbios, peixes e invertebrados
- [ ] Completar os ambientes rios e corixos, áreas alagadas, campos, matas e bordas de mata
- [ ] Validar nomes populares, nomes científicos, distribuição e situação de conservação
- [ ] Garantir três imagens por espécie com crédito, licença e URL de origem
- [ ] Criar validação automática para detectar campos científicos ou créditos ausentes
- [ ] Adicionar fontes estruturadas por espécie e registrar a data da revisão editorial

### Frente C — Catálogo e descoberta
- [x] Refinar cards, estados de carregamento, estado vazio e fallback visual de imagem
- [x] Criar filtros combinados e possibilidade de limpar todos os filtros
- [x] Adicionar ordenação por nome popular e grupo
- [x] Criar barra rápida de idioma dentro da ficha da espécie
- [x] Exibir claramente quando uma tradução não estiver disponível
- [ ] Revisar a ficha para leitura rápida em campo e acessibilidade

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
- [ ] Melhorar fallback, erro e carregamento das imagens do catálogo
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
