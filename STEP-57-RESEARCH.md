# Passo 57/60 — exportação agregada do resumo

O painel de resumo dos avistamentos agora pode ser exportado em JSON ou CSV por meio de ações integradas ao cartão **Resumo do caderno**. A exportação usa `expo-file-system/legacy` para criar um arquivo temporário e `expo-sharing` quando o sistema oferece compartilhamento nativo; em plataformas sem esse recurso, o caminho do arquivo é informado como fallback controlado.

O contrato JSON é versionado como `1.0` e inclui somente as métricas agregadas: totais, contagens de GPS e visibilidade, número de espécies, intervalo de datas e distribuição por espécie. O CSV usa linhas de métricas e linhas de distribuição, permitindo análise em planilhas sem incluir avistamentos individuais.

A privacidade foi mantida por construção. Nenhum `id` de avistamento, nota, coordenada, local individual, fotografia ou campo privado é serializado. A contagem `privateCount` existe apenas como indicador agregado do caderno e não revela o conteúdo de qualquer registro.

| Formato | Conteúdo |
|---|---|
| JSON 1.0 | Métricas e distribuição agregadas |
| CSV | Métricas e contagem por espécie |
| Dados individuais | Não incluídos |
| Notas e locais | Não incluídos |
| Coordenadas e fotos | Não incluídas |
| Compartilhamento | Nativo quando disponível |
| Fallback | Caminho do arquivo informado |
| Resumo vazio | Formato válido com zeros |

Foram adicionados três testes em `tests/sightings-summary-transfer.test.ts`, cobrindo versão JSON, linhas CSV, ausência de conteúdo individual e resumo vazio. A validação passou com `pnpm check`, `pnpm lint`, **49 testes aprovados e 1 ignorado**, todas as auditorias científicas e comerciais e `git diff --check`.

O catálogo permanece com 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos, sem estados pendentes e sem alterações na política de licenciamento comercial.
