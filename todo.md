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
| 1 | Contrato e índice de lotes (`shared/catalog`) | [x] Implementado e validado. |
| 2–3 | Mamíferos | [x] `catalog-mammals-01` adicionado com três espécies; revisão final pendente. |
| 4–6 | Aves | [x] `catalog-birds-01` a `05` adicionados com quinze espécies; revisão regional e conservação pendentes. |
| 7–8 | Répteis e anfíbios | [x] `catalog-reptiles-01` e `catalog-amphibians-01` adicionados; revisão final pendente. |
| 9–11 | Peixes | [x] `catalog-fish-01` a `06` adicionados com dezoito espécies; revisão regional e conservação pendentes. |
| 12–14 | Invertebrados | [x] `catalog-invertebrates-01` a `06` adicionados com doze espécies no total; revisão regional e conservação pendentes. |
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
14. `[ ]` Implementar `catalog-invertebrates-07` ou `catalog-birds-06` com três espécies novas e evidência Commons/GBIF.
10. `[ ]` Fechar pacote final do catálogo com contagem, IDs globais, fontes, pendências e PR descritivo.

Ao concluir uma tarefa, marcar imediatamente o item correspondente como `[x]` e iniciar a primeira pendência desbloqueada. Auditorias já concluídas não devem ser repetidas sem evidência nova.

### Política de bloqueio e escalonamento

Todo bloqueio deve registrar causa, evidência, alternativa executável e agente responsável. Fonte indisponível deve gerar pipeline, fixture ou teste; PR stale deve gerar tentativa de rebase coordenada; conflito deve ser resolvido por integração seletiva pelo Agente 1; falha deve ser corrigida e validada novamente. Só bloqueios reais permanecem como `[ ]`.
