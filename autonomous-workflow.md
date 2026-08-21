# PantanalDex — fluxo operacional quase autônomo

## Como o trabalho será conduzido

O desenvolvimento será organizado como um pequeno time coordenado dentro do mesmo projeto. Em vez de abrir janelas independentes sem compartilhar contexto, cada frente terá uma responsabilidade clara, um conjunto de arquivos permitido e um critério de aceite. Isso evita que duas atividades sobrescrevam contratos ou criem soluções incompatíveis.

As frentes serão executadas em paralelo apenas quando forem independentes. Por exemplo, a pesquisa e organização de espécies pode avançar enquanto a interface de filtros é refinada; entretanto, a integração só será feita depois que o contrato de dados estiver validado. Cada ciclo termina com verificação técnica, revisão visual, atualização do TODO e um checkpoint.

## Frentes coordenadas

| Frente | Responsabilidade | Pode avançar sem aprovação? |
|---|---|---|
| Produto | Requisitos, prioridades e critérios de aceite | Sim, seguindo a especificação existente |
| Conteúdo | Espécies, fontes, imagens, créditos e traduções | Sim, usando fontes confiáveis e registrando pendências |
| Interface | Telas, componentes, navegação, acessibilidade e estados vazios | Sim, sem alterar o escopo aprovado |
| Dados locais | Tipos, AsyncStorage, migrações, validação e exportação | Sim, preservando compatibilidade |
| Recursos nativos | Foto, câmera, localização e mapa | Sim em protótipo; pedir aprovação para permissões ou serviços pagos |
| Qualidade | TypeScript, lint, testes, fluxos e revisão visual | Sim, bloqueando a entrega se houver falha crítica |
| Entrega | Checkpoints, changelog e relatório de marco | O checkpoint é criado após os critérios técnicos serem atendidos |

## Ciclo automático de trabalho

Cada ciclo seguirá seis etapas. Primeiro, o sistema seleciona itens prontos do backlog e verifica suas dependências. Depois, implementa as mudanças por frente, evitando editar simultaneamente arquivos que definem contratos compartilhados. Em seguida, executa TypeScript, lint e testes. A quarta etapa revisa as telas no preview e corrige problemas visíveis. A quinta atualiza `todo.md`, `workboard.md` e o resumo do marco. Por fim, salva um checkpoint e apresenta ao usuário apenas o que precisa de aprovação.

O usuário não precisará explicar novamente cada tarefa. Bastará responder **“OK, continue”** para autorizar o próximo marco, ou escolher uma prioridade, como “faça primeiro as espécies” ou “priorize o mapa”. O fluxo será interrompido apenas quando houver uma decisão que não possa ser inferida com segurança.

## Portões de aprovação

| Portão | Quando aparece | O que será apresentado |
|---|---|---|
| P0 — direção | Antes de alterar escopo ou identidade do produto | Opções curtas e impacto de cada escolha |
| P1 — conteúdo | Quando houver fontes ou espécies ambíguas | Lista de pendências e alternativa conservadora |
| P2 — permissões | Antes de câmera, localização ou compartilhamento | Permissão solicitada, fallback e efeito no uso |
| P3 — entrega | Antes de publicar ou gerar uma versão distribuível | Checklist de aceite e link do checkpoint |

## O que não será feito sem autorização explícita

Não serão enviados dados para serviços externos, não serão adicionadas contas de usuário, não serão criados custos recorrentes e não serão publicados artefatos. Também não serão tomadas decisões irreversíveis sobre exclusão de dados ou alteração de identidade visual sem aprovação.

## Opções para manter o fluxo avançando

| Abordagem | Trade-offs | Custo | Complexidade de configuração |
|---|---|---:|---:|
| Fluxo coordenado nesta conversa, com aprovação por marco | Maior controle e contexto; exige que o usuário volte para responder “OK” | Sem custo adicional de infraestrutura | Baixa |
| Rotina agendada de revisão do backlog e relatório | Pode revisar o estado em horários fixos; não substitui decisões de produto e consome uma execução por rodada | Variável por execução | Média |

A recomendação inicial é usar o primeiro formato para concluir a base do aplicativo com segurança. Depois que o backlog estiver estável, uma rotina agendada poderá produzir relatórios de progresso ou lembrar o usuário de aprovar o próximo marco. Ela não deve ser usada para executar alterações irreversíveis automaticamente.

## Próximo ciclo já preparado

O próximo ciclo deve começar pela validação do catálogo e pela correção dos fluxos de descoberta. Em paralelo, a frente de qualidade deve criar testes para persistência e exportação. Depois disso, a frente de avistamentos pode implementar edição completa e filtros combinados. O mapa será integrado somente após o contrato de coordenadas estar coberto pelos testes.

## Critério de autonomia

O fluxo será considerado suficientemente autônomo quando houver uma fila de itens prontos, dependências registradas, testes executáveis, revisão visual repetível e checkpoints recuperáveis. Nesse ponto, o usuário poderá apenas aprovar os marcos, escolher prioridades entre frentes e responder a decisões que envolvam produto, privacidade ou custos.
