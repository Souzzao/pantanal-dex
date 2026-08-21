# PantanalDex — quadro de trabalho de desenvolvimento

## Objetivo operacional

Este quadro organiza o desenvolvimento em frentes independentes, com dependências explícitas e critérios objetivos de conclusão. A regra de execução é trabalhar em paralelo apenas quando duas frentes não alterarem os mesmos contratos ou arquivos centrais. Toda entrega deve passar por verificação TypeScript, lint, testes relacionados e revisão visual antes de ser marcada como concluída.

## Visão geral das frentes

| Frente | Objetivo | Dependências | Saída principal | Estado |
|---|---|---|---|---|
| A. Arquitetura | Consolidar rotas, tipos, armazenamento e contratos | Nenhuma | Mapa de módulos e matriz de requisitos | Em andamento |
| B. Conteúdo | Expandir espécies, fontes, imagens e traduções | Contrato `Species` | Catálogo científico versionado | Pendente |
| C. Catálogo | Refinar busca, filtros, cards e fichas | A + B | Fluxo de descoberta completo | Parcial |
| D. Campo | Completar formulário, edição, foto e localização | Contrato `Sighting` | Caderno de campo completo | Parcial |
| E. Mapa | Mostrar coordenadas, filtros e proteção de localização | D + biblioteca de mapas | Mapa nativo e fallback web | Em correção |
| F. Offline | Garantir funcionamento local e recuperação de dados | A + D | Camada de persistência resiliente | Parcial |
| G. Idiomas | Preferências, barra rápida e fallback de tradução | A + B | Sistema de idioma extensível | Parcial |
| H. Qualidade | Testes, acessibilidade, revisão visual e regressão | Todas | Relatório de aceite | Pendente |

## Backlog priorizado

### Agora — bloqueadores e fundação

| Item | Frente | Prioridade | Critério de pronto |
|---|---|---:|---|
| Corrigir a separação web/nativa do mapa | E | P0 | `pnpm check` sem erros e preview web sem importar módulo nativo |
| Validar todas as rotas e ações da navegação | A | P0 | Nenhum botão principal abre rota inexistente ou tela vazia |
| Criar fallback visual para imagens indisponíveis | C | P0 | Cada card e galeria tem placeholder contextual e crédito preservado |
| Definir schema versionado de catálogo e avistamentos | A/F | P0 | Dados antigos podem ser lidos ou migrados com segurança |

### Em seguida — valor principal para o usuário

| Item | Frente | Prioridade | Critério de pronto |
|---|---|---:|---|
| Expandir para 20 espécies verificadas | B | P1 | Cada espécie tem ficha mínima, fonte e três referências de imagem |
| Implementar edição de avistamentos | D | P1 | Usuário abre registro, altera campos, salva e vê atualização persistida |
| Adicionar filtros combinados nos avistamentos | D | P1 | Espécie, grupo, ambiente, período e texto podem ser combinados |
| Completar mapa nativo e fallback web | E | P1 | Marcador abre detalhe e registros sem coordenadas continuam na lista |
| Implementar câmera e galeria com permissões explicadas | D | P1 | Cancelamento e permissão negada não quebram o formulário |

### Depois — robustez e acabamento

| Item | Frente | Prioridade | Critério de pronto |
|---|---|---:|---|
| Adicionar testes de domínio e persistência | H | P1 | Casos de validação, CRUD e exportação cobrem cenários essenciais |
| Implementar migração e recuperação de armazenamento corrompido | F | P2 | App inicializa com dados válidos mesmo após JSON inválido |
| Melhorar traduções e fallback por espécie | G | P2 | Idioma ausente é indicado sem conteúdo vazio |
| Revisar acessibilidade e uso com uma mão | H | P2 | Alvos de toque, contraste, labels e retorno são consistentes |
| Criar revisão visual responsiva | H | P2 | Portrait mobile e navegador têm layout sem overflow crítico |

## Execução paralela controlada

A frente de conteúdo pode avançar em paralelo à frente de interface, desde que ambas usem o mesmo contrato `Species`. A frente de testes de domínio pode começar assim que `storage`, `validation` e `exportData` forem estabilizados. A frente de mapa só deve ser integrada depois que o tipo `Sighting` e o comportamento de registros sem coordenadas estiverem fechados.

Não devem ser executadas simultaneamente mudanças no contrato de dados e alterações de múltiplas telas consumidoras. Primeiro se atualiza o tipo e seus adaptadores; depois se atualizam as telas; por fim se executam os testes e a revisão visual.

## Definition of Done por item

Um item só pode ser marcado como concluído quando o fluxo principal funciona em estado preenchido, vazio e de erro. A implementação deve possuir tipagem sem erros, feedback de ação, retorno navegacional, tratamento de cancelamento e persistência quando aplicável. Recursos nativos devem ter fallback para web ou mensagem explícita de indisponibilidade. Conteúdo científico deve manter fonte e crédito, e imagens externas devem possuir alternativa visual quando não carregarem.

## Ciclo de trabalho recomendado

Em cada ciclo, primeiro se escolhe um conjunto pequeno de itens P0 ou P1 com uma mesma dependência. Em seguida, são atualizados os contratos e componentes compartilhados, depois as telas consumidoras. A etapa seguinte executa verificação técnica e fluxo manual no preview. Só então o TODO recebe a marcação de concluído. Ao terminar um conjunto de itens críticos, deve ser salvo um checkpoint recuperável.

## Critérios de aceite da consolidação

A consolidação será considerada pronta quando o usuário puder descobrir uma espécie, ler sua ficha, registrar um avistamento com ou sem localização, editar ou excluir o registro, visualizar registros localizados no mapa ou na lista, exportar os dados, alterar idiomas e continuar usando o catálogo e os registros sem conexão. Nenhuma tela crítica poderá depender de uma imagem remota sem fallback, e nenhuma ação principal poderá terminar em uma rota inexistente.
