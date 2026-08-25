# MVP — Passo 17/50: fechamento do inventário de peixes

**Decisão:** fechar a auditoria dos lotes de peixes atualmente disponíveis e não inventar um terceiro lote.

## Inventário verificado

A inspeção de `shared/catalog/batches` encontrou exatamente dois lotes reais de peixes:

| Lote | Espécies | Estado | Auditoria |
|---|---:|---|---|
| `catalog-fish-01` | 4 | `pending-review` | Passo 15/50 |
| `catalog-fish-02` | 3 | `pending-review` | Passo 16/50 |

O total da frente é de **7 espécies**. Não existe `fish-03` no repositório restaurado. O passo 17 registra o fechamento da fila auditável de peixes, sem repetir os lotes 01 e 02 e sem criar nomes, fontes, imagens ou licenças inexistentes.

## Bloqueios mantidos

Os sete registros permanecem `pending-review`; nenhum lote foi promovido. O fish-01 mantém a Cachara bloqueada por acervo incompleto. O fish-02 mantém o Jaú sem imagem específica segura e a Pacupeva com apenas uma imagem específica confirmada. Todos os demais bloqueios editoriais — ocorrência individual no Pantanal, checklist, `reviewedAt`, `reviewedBy` e conservação oficial quando aplicável — continuam exigidos.

## Proteção contra regressão

Foi adicionado teste determinístico que exige exatamente `catalog-fish-01` e `catalog-fish-02`, totalizando sete espécies e mantendo ambos como `pending-review`. O teste falha se um terceiro lote for inventado ou se a fila for alterada sem atualização explícita do inventário.

## Validação operacional

A primeira execução completa encontrou o repositório na `main`, condição rejeitada pelo watchdog. A branch de integração `integracao-ciclo-17` foi criada antes da conclusão e o watchdog passou. Resultado: **48 testes aprovados e 1 teste de autenticação pulado**, `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluídos com sucesso.

## Próxima fila

Com a frente de peixes fechada no inventário atual, a próxima unidade real deve ser o primeiro lote de invertebrados. A expansão deve ocorrer apenas por novo lote com IDs, fontes, imagens e licenças verificáveis.
