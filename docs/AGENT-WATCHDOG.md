# PantanalDex — Agent Watchdog

Este documento transforma a coordenação em um sistema verificável. O watchdog não mede velocidade por texto produzido; mede **mudança útil publicada**.

## Estado obrigatório de cada bloco

Um bloco só é `DONE` quando contém alteração de código, teste ou documentação operacional; TODO atualizado; HANDOFF atualizado quando houver risco; `pnpm check`, `pnpm lint`, `pnpm test` e `git diff --check` aprovados; commit publicado; e PR aberto ou atualizado. Sem qualquer item, o estado é `INCOMPLETE` e o agente deve continuar trabalhando.

## Meta de execução

Cada retomada deve executar o maior bloco seguro de tarefas dependentes. Um agente não pode encerrar depois de apenas auditar, planejar, atualizar uma linha ou relatar uma possibilidade. Se a tarefa principal estiver bloqueada por fonte, acesso ou dependência, deve implementar uma alternativa independente: validador, fixture determinística, teste, fallback, documentação, lote sem pendência proibitiva ou correção de fluxo.

## Fila anti-repetição

O TODO é a fila única. Ao terminar uma tarefa, o agente marca `[x]` imediatamente e escolhe a primeira `[ ]` desbloqueada por prioridade: erro/crash, fluxo quebrado, contrato, dependência, lote, teste, UX e polimento. Auditorias já concluídas não podem ser repetidas sem evidência nova. Cada handoff registra causa, evidência, alternativa executável, responsável e próxima tentativa.

## Watchdog do coordenador

O Agente 1 verifica, a cada retomada, `git status`, branches, PRs abertos, commits recentes, checks, TODO e HANDOFF. Branch sem commit/PR após um bloco recebe tarefa dividida e registro de cobrança. PR stale recebe rebase ou bloqueio explícito; nunca fica silenciosamente parado. PR sem licença, ID único, teste ou descrição é rejeitado com correção objetiva.

## Contrato de transparência do PR

Todo PR deve informar: ciclos executados; arquivos; funcionalidades; quantidade de espécies ou fluxos; fontes e licenças; testes; limitações nativas; riscos; pendências; e próximo bloco. A main só recebe PR testado e revisado. O agente nunca deve declarar conclusão apenas em mensagem: a evidência é commit, PR e checks no GitHub.

## Segurança de qualidade

A aceleração ocorre em lotes paralelos e pequenos, nunca relaxando licenças, fontes, IDs, testes, acessibilidade, fallback web ou preservação de dados. Proibidos `git reset --hard`, dados inventados, imagens sem licença confirmada, IUCN Red List API, status de conservação sem ICMBio/MMA e botões sem ação.

## Protocolo de retomada

Ao receber “continue”, o agente lê este arquivo, TODO, HANDOFF e PRs; identifica o primeiro item pendente; implementa vários itens até o limite seguro; valida; publica; e só então responde. A resposta deve conter apenas evidências: bloco/ciclos, commit, PR, testes, bloqueios reais e próximo bloco. Não pedir permissão para continuar uma tarefa já autorizada.
