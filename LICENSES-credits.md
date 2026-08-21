# PantanalDex — licenças e créditos do catálogo modular

Este manifesto cobre os lotes modulares do Agente 2 em `shared/catalog/batches/`. Ele não cobre dados de avistamentos nem arquivos locais do usuário.

## Política comercial

As imagens só podem usar `CC0`, `CC BY` ou `CC BY-SA`, em qualquer versão identificada no arquivo. Licenças `NC`, `ND`, equivalentes textuais, licença ausente, URL inventada ou fonte não verificável são rejeitadas pelo contrato em `shared/catalog/types.ts`. Texto científico é reescrito e não é copiado de páginas externas.

## Lotes atualmente registrados

| Lote | Grupo | Espécies | Fonte taxonômica | Imagens |
|---|---|---:|---|---|
| `catalog-mammals-01` | Mamíferos | 3 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-birds-01` | Aves | 3 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-birds-02` | Aves | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA/domínio público com créditos no módulo do lote |
| `catalog-reptiles-01` | Répteis | 2 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-amphibians-01` | Anfíbios | 2 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-fish-01` | Peixes | 3 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-invertebrates-01` | Invertebrados | 1 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-invertebrates-02` | Invertebrados | 1 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-invertebrates-03` | Invertebrados | 2 | GBIF Species Match | Wikimedia Commons; seis arquivos CC BY/CC BY-SA com créditos no módulo do lote |

Cada objeto `images` contém `uri`, `author`, `license`, `sourceUrl` e `credit`. A `sourceUrl` aponta para a página individual do arquivo no Wikimedia Commons; a URL de distribuição não substitui a origem nem o crédito.

## Limites e pendências

O manifesto não transforma uma licença permissiva em prova de ocorrência no Pantanal. Ocorrência regional, conservação e adequação da fotografia para identificação em campo permanecem pendentes quando não há confirmação SiBBr/ICMBio ou fonte oficial de conservação. Nenhum registro deve ser promovido a `verified` sem essa revisão.

A validação automatizada deve ser executada com `pnpm test`; a revisão de arquivo deve confirmar os metadados na página de origem antes da integração. O contrato não aceita IUCN como fonte aprovada e não aceita `NC`/`ND`.
