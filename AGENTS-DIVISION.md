# PantanalDex — divisão operacional dos agentes

Este documento registra o passo **5/50** do MVP e deve ser lido junto com `MVP-50-PASSOS.md`, `todo.md` e `HANDOFF-3-CONTAS.md`. A divisão evita sobrescrita entre agentes e mantém a `main` protegida até revisão e integração coordenadas.

## Branches e missão

| Agente | Branch operacional | Responsabilidade principal | Fora do escopo direto |
|---|---|---|---|
| Agente 1 — Coordenador | `integracao-ciclo-N` | Integração seletiva, decisões de release, backlog, conflitos, revisão de PRs e coordenação entre contas | Alterar dados científicos sem evidência ou absorver mudanças não auditadas |
| Agente 2 — Catálogo | `conta-2-catalogo` | Contratos do catálogo, lotes científicos modulares, taxonomia GBIF, ocorrência SiBBr/ICMBio, imagens, créditos, licenças e conservação oficial | Navegação, estado global, persistência, câmera, GPS, mapa e recursos nativos |
| Agente 3 — Qualidade e nativos | `conta-3-qualidade` | UX, acessibilidade, loading/vazio/erro/offline, busca, câmera, GPS, mapa, persistência e testes de experiência | Alterar taxonomia, textos científicos, imagens ou licenças do catálogo |

## Regras de isolamento

O Agente 2 trabalha exclusivamente na `conta-2-catalogo`. Não deve editar telas, navegação, estado global, persistência ou recursos nativos, salvo ajuste mínimo de tipo diretamente exigido pelo contrato do catálogo. O Agente 3 não deve modificar lotes científicos para corrigir falhas de UX. O Agente 1 integra por commits ou mudanças seletivas e não deve sobrescrever trabalho de uma conta com cópia integral de outra branch.

Dados de usuário, fixtures de colaboração e artefatos de auditoria devem permanecer separados. Nenhum pacote de colaboração deve ser tratado como dado de produção. A `main` só recebe mudanças após revisão do PR, validação completa e resolução explícita de conflitos.

## Dependências e ordem de trabalho

| Dependência | Responsável | Evidência exigida antes da integração |
|---|---|---|
| Contrato `Species` e lotes | Agente 2 com coordenação do Agente 1 | `shared/catalog/contract.ts`, tipos, testes e validação sem erros |
| Dados e fontes antes de telas dependentes | Agente 2 | Lote modular, GBIF/SiBBr/ICMBio quando aplicável, créditos e pendências |
| Busca, filtros e ficha | Agente 3 | Índices derivados estáveis e contrato preservado |
| Câmera, GPS e mapa | Agente 3 | Componentes nativos separados, fallback web e permissões testadas |
| Integração e release | Agente 1 | PR revisado, checks verdes, handoff e conflito resolvido seletivamente |

## Definição de pronto por branch

Cada bloco deve conter alteração verificável, teste ou evidência, atualização de `todo.md`, atualização de `HANDOFF-3-CONTAS.md`, execução de `pnpm check`, `pnpm lint`, `pnpm test` e `git diff --check`, commit pequeno e PR descritivo. O PR deve informar arquivos, contagem antes/depois, riscos, pendências e próximo passo.

Para o catálogo, nenhuma espécie pode ser promovida a `verified` apenas por possuir taxonomia ou imagem. A promoção exige prova real de ocorrência regional, licenças auditadas, fontes estruturadas, conservação oficial quando preenchida e checklist editorial completo. Licenças NC, ND, ausentes ou ambíguas bloqueiam a imagem; IUCN API não é fonte permitida para este produto.

## Protocolo de handoff

Um handoff deve informar causa, evidência, alternativa executável, agente responsável e próximo passo. “Aguardando” sem alternativa não é estado válido. Conflitos de integração devem ser resolvidos seletivamente pelo Agente 1; mudanças específicas do catálogo devem permanecer atribuíveis ao Agente 2 e não podem ser descartadas para resolver conflito de tela.

A fila anti-repetição em `todo.md` é a fonte de prioridade. Ao concluir uma tarefa, o agente marca o item imediatamente e escolhe a primeira pendência desbloqueada. O relatório `pnpm mvp:report` fornece a medição quantitativa; o catálogo não deve mascarar pendências para aumentar contagem.

## Estado deste passo

O passo 5/50 é considerado concluído quando este documento está versionado, `todo.md` e `HANDOFF-3-CONTAS.md` apontam para ele e os checks da branch passam. O próximo passo do plano é o passo 6/50: auditar IDs duplicados e campos científicos obrigatórios, sem misturar essa auditoria com alterações de UX ou nativos.
