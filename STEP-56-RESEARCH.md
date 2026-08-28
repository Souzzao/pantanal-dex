# Passo 56/60 — painel agregado de avistamentos

A tela de avistamentos recebeu um painel agregado com indicadores do caderno. O módulo `lib/sightings-summary.ts` calcula as métricas de forma determinística em uma única passagem pelos registros, sem alterar a coleção original.

O painel mostra somente informações agregadas: total de registros, quantidade de espécies, registros com GPS, registros compartilháveis, período coberto e espécie mais frequente. Notas, coordenadas, locais individuais e qualquer outro conteúdo sensível não são retornados pela agregação nem inseridos na interface do resumo.

A espécie mais frequente é apresentada com desempate alfabético estável. Para um caderno vazio, o resumo retorna zeros e não exibe período ou espécie. O cálculo foi testado com 3.000 registros para garantir comportamento adequado em grandes volumes.

| Métrica | Tratamento |
|---|---|
| Total | Contagem de registros |
| Espécies | IDs distintos |
| GPS | Registros com latitude |
| Visibilidade | Pessoais e compartilháveis |
| Período | Menor e maior data |
| Espécie mais frequente | Contagem agregada, sem dados individuais |
| Privacidade | Nenhum texto, local ou coordenada individual |

Foram adicionados quatro testes em `tests/sightings-summary.test.ts`, cobrindo contagens, privacidade, caderno vazio e volume elevado. A validação passou com `pnpm check`, `pnpm lint`, **46 testes aprovados e 1 ignorado**, todas as auditorias científicas e comerciais e `git diff --check`.

O catálogo permanece com 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos, sem estados pendentes e sem alterações na política de licenciamento comercial.
