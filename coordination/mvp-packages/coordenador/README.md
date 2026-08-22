# Pacote do Coordenador — PantanalDex MVP final

## Objetivo

Este pacote organiza os Agentes 1, 2 e 3 para entregar o MVP em 50 passos, sem reduzir qualidade. O MVP é uma versão funcional de campo; a meta de 3.000+ espécies continua como expansão posterior em lotes licenciados.

## Estado inicial

Use `pnpm mvp:report` no repositório. A medição atual registra 102 espécies públicas, 36 modulares, 24 mamíferos, 26 aves, 14 répteis, 12 anfíbios, 16 peixes e 10 invertebrados; 12 lotes `pending-review`, 0 verificados, 0 `review-ready`, 306 imagens públicas e 108 imagens nos lotes modulares.

## Divisão

| Agente | Branch | Missão |
|---|---|---|
| 1 | `integracao-ciclo-N` | Coordenação, integração, backlog, release e decisões |
| 2 | `conta-2-catalogo` | Dados científicos, fontes, imagens, créditos e licenças |
| 3 | `conta-3-qualidade` | UX, acessibilidade, testes, câmera, GPS e mapa |

## Ordem de execução

Dados e contratos precedem telas dependentes. Auditoria de imagens precede promoção. Recursos nativos mantêm fallback web. Testes precedem merge. A main só recebe PR revisado. Sem commit, PR, testes e handoff, o trabalho é incompleto.

## Protocolo anti-inércia

Ao receber “continue”, cada agente lê TODO, handoff, PRs e relatório do MVP, escolhe a primeira pendência desbloqueada e executa o maior bloco seguro. Não deve responder apenas com plano. Branch sem avanço gera handoff objetivo com causa, evidência, alternativa e tarefa dividida. Auditoria repetida sem alteração não conta como ciclo.

## Definição de pronto do MVP

O MVP passa somente com pelo menos 60 espécies aprovadas editorialmente, imagens e fontes auditáveis, rotas críticas funcionais, PT/EN/ES, loading/vazio/erro/offline, câmera, GPS, mapa, persistência, import/export, privacidade, acessibilidade e validação final. Bloqueios de licença, teste ou plataforma devem ser declarados, nunca mascarados.

## Como distribuir

Envie `MVP-50-PASSOS.md` junto com o README do agente correspondente. O Agente 1 recebe também este pacote. Após cada grupo de passos, compare `pnpm mvp:report`, PRs e handoff. Nunca misture dados de usuário com fixtures ou colaboração.
