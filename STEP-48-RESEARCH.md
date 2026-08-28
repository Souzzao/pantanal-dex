# Passo 48/60 — transferência robusta de avistamentos

O passo 48 criou `lib/sightings-transfer.ts`, uma camada independente para exportação e importação de avistamentos. A exportação JSON agora usa o envelope versionado `2.0`, mantém os dados necessários ao registro e continua disponível pela função pública `createExportJson` do `AppContext`.

A importação aceita tanto o envelope versionado quanto o array legado. Cada item é validado contra o contrato `Sighting`; itens inválidos são rejeitados com índice, motivo e ID quando disponível, enquanto os registros válidos continuam sendo processados. IDs repetidos no mesmo arquivo também são reportados sem interromper o restante do lote.

A importação reconstrói explicitamente os campos permitidos do registro, removendo propriedades desconhecidas. Assim, tokens, metadados acidentais e campos não pertencentes ao modelo não são persistidos. Coordenadas, notas e visibilidade permanecem intactas para registros válidos, inclusive quando a visibilidade é privada.

| Recurso | Resultado |
|---|---|
| Exportação | Envelope JSON versão 2.0 |
| Compatibilidade | Arrays legados aceitos |
| Validação | Campos obrigatórios e enums de `Sighting` |
| Rejeições | Registro inválido e ID duplicado, com relatório |
| Sanitização | Apenas campos permitidos são reconstruídos |
| Falha de JSON | Resultado controlado, sem exceção ao chamador |

Foram adicionados cinco testes em `tests/sightings-transfer.test.ts`, cobrindo exportação, sanitização, arrays legados, rejeições parciais e JSON inválido. A suíte completa passou com **30 testes aprovados e 1 ignorado**. Também passaram `pnpm check`, `pnpm lint`, as auditorias de prioridades, fontes, conservação e ocorrência regional, além de `git diff --check`.

As métricas científicas permaneceram estáveis em 76 espécies modulares, 29 lotes, 82 fontes estruturadas, 152 URLs GBIF, 38 registros de conservação e 31 registros regionais, todos sem pendências.
