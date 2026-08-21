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
