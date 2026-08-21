# Revisão coordenadora — PR 5 do Agente 2

## Decisão

O PR 5 (`conta-2-catalogo-ciclo-2`) **não deve ser integrado diretamente** neste estado.

## Motivo técnico

A comparação com o estado coordenador atual mostra que o branch foi baseado em um ponto antigo e removeria mudanças já integradas, incluindo `PROMPTS-20-CICLOS-AGENTES.md`, `shared/catalog.ts`, `shared/persistence.ts`, componentes multiplataforma do mapa, fallback de imagens, documentação de requisitos e várias melhorias de persistência, importação, câmera, localização e exportação.

## Próxima ação obrigatória do Agente 2

Rebasear ou recriar a branch a partir da `main` atual, reaplicar somente o lote científico pretendido e abrir um novo PR. O novo PR deve listar espécies adicionadas, IDs, grupos, ambientes, fontes, imagens, créditos, licenças, testes executados e arquivos alterados. Não deve apagar arquivos da coordenação nem modificar UX, persistência ou recursos nativos.

## Critério para integração

A Conta 1 só integra após confirmar que o diff contém exclusivamente conteúdo científico do lote, que `pnpm check`, `pnpm lint`, `pnpm test` e `git diff --check` passam e que a validação editorial retorna zero erros.
