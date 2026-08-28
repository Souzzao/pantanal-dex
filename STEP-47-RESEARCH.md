# Passo 47/60 — testes de persistência local

O passo 47 adiciona uma suíte determinística para a persistência local de avistamentos em `tests/sightings-storage.test.ts`. O armazenamento em memória implementa o mesmo contrato usado pelo `AsyncStorage`, permitindo verificar a lógica sem depender de um dispositivo ou de estado externo.

| Cenário | Cobertura |
|---|---|
| Migração | Lê o array legado e conserva somente registros válidos |
| Recuperação | JSON corrompido não interrompe a inicialização |
| Volume | 201 registros são divididos em três blocos e reconstruídos na ordem |
| Concorrência | Duas gravações simultâneas são serializadas e a última permanece íntegra |
| Redução | Blocos excedentes são removidos quando o inventário diminui |

A validação defensiva cobre os campos obrigatórios de `Sighting`, os valores permitidos para precisão geográfica e visibilidade e os tipos dos campos opcionais. A suíte também verifica o manifesto versionado, o tamanho configurado de 100 registros por chunk e o comportamento de limpeza de dados antigos.

## Resultado

Passaram `pnpm check`, `pnpm lint`, `pnpm test` (25 testes aprovados, incluindo os cinco novos), `pnpm catalog:priority-audit`, `pnpm catalog:source-audit`, `pnpm catalog:conservation-audit`, `pnpm catalog:regional-occurrence-audit` e `git diff --check`. As auditorias científicas permaneceram sem pendências: 41 prioridades cobertas, 76 espécies em 29 lotes, 38 registros de conservação e 31 registros regionais.
