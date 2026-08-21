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
| `catalog-birds-03` | Aves | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA com créditos no módulo do lote |
| `catalog-birds-04` | Aves | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA com créditos no módulo do lote |
| `catalog-reptiles-01` | Répteis | 2 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-amphibians-01` | Anfíbios | 2 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-fish-01` | Peixes | 3 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-fish-02` | Peixes | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC0/CC BY/CC BY-SA/domínio público com créditos no módulo do lote |
| `catalog-fish-03` | Peixes | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC0/CC BY/CC BY-SA/domínio público com créditos no módulo do lote |
| `catalog-fish-04` | Peixes | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA/domínio público com créditos no módulo do lote |
| `catalog-fish-05` | Peixes | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA/domínio público com créditos no módulo do lote |
| `catalog-invertebrates-01` | Invertebrados | 1 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-invertebrates-02` | Invertebrados | 1 | GBIF Species Match | Wikimedia Commons; créditos e licenças no módulo do lote |
| `catalog-invertebrates-03` | Invertebrados | 2 | GBIF Species Match | Wikimedia Commons; seis arquivos CC BY/CC BY-SA com créditos no módulo do lote |
| `catalog-invertebrates-04` | Invertebrados | 2 | GBIF Species Match | Wikimedia Commons; seis arquivos CC BY/CC BY-SA com créditos no módulo do lote |
| `catalog-invertebrates-05` | Invertebrados | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA com créditos no módulo do lote |
| `catalog-invertebrates-06` | Invertebrados | 3 | GBIF Species Match | Wikimedia Commons; nove arquivos CC BY/CC BY-SA com créditos no módulo do lote |

Cada objeto `images` contém `uri`, `author`, `license`, `sourceUrl` e `credit`. A `sourceUrl` aponta para a página individual do arquivo no Wikimedia Commons; a URL de distribuição não substitui a origem nem o crédito.

## Limites e pendências

O manifesto não transforma uma licença permissiva em prova de ocorrência no Pantanal. Ocorrência regional, conservação e adequação da fotografia para identificação em campo permanecem pendentes quando não há confirmação SiBBr/ICMBio ou fonte oficial de conservação. Nenhum registro deve ser promovido a `verified` sem essa revisão.

O lote `catalog-invertebrates-06` usa três espécies e nove arquivos Commons selecionados a partir de metadados de licença consultados na API pública. Os autores e licenças declarados são Charles J. Sharp (CC BY-SA 4.0), Richard Bartz (CC BY-SA 2.5), Didier Descouens (CC BY-SA 4.0), Tubifex (CC BY-SA 3.0), NasserHalaweh (CC BY-SA 4.0), WikiMedia Commons (CC BY-SA 4.0), Megustanlasframbuesas (CC BY-SA 4.0) e Nayara (CC BY 4.0). As páginas individuais estão nas `sourceUrl` dos registros.

O lote `catalog-fish-05` usa três espécies e nove arquivos Commons selecionados a partir de metadados de licença consultados na API pública. Os autores e licenças declarados são Brancolini et al. (CC BY 4.0), Tomcather e Klaus (domínio público), CHUCAO (CC BY-SA 3.0), Douglas (CC BY 4.0), Bartolette et al. (CC BY 4.0), Cedricguppy (CC BY-SA 4.0), Хомелка (CC BY-SA 3.0) e Mahufi (CC BY-SA 3.0). As páginas individuais estão nas `sourceUrl` dos registros.

O lote `catalog-birds-04` usa três espécies e nove arquivos Commons selecionados a partir de metadados de licença consultados na API pública. Os autores e licenças declarados são Jimmy Baikovicius (CC BY-SA 2.0), rodrigo_lazaro (CC BY 4.0), Charles J. Sharp (CC BY-SA 4.0), Giles Laurent (CC BY-SA 4.0), Andreas Trepte (CC BY-SA 4.0), Calibas (CC BY-SA 3.0) e Mike Baird (CC BY 2.0). As páginas individuais estão nas `sourceUrl` dos registros.

O lote `catalog-invertebrates-05` usa três espécies e nove arquivos Commons selecionados a partir de metadados de licença consultados na API pública. Os autores e licenças declarados no lote são: Charles J. Sharp (CC BY-SA 4.0), Didier Descouens (CC BY-SA 4.0), André Ribeiro Cardoso (CC BY-SA 4.0), Forest & Kim Starr (CC BY 3.0), Hans Hillewaert (CC BY-SA 4.0) e Fungus Guy (CC BY-SA 4.0). As páginas individuais estão nas `sourceUrl` dos registros.

A validação automatizada deve ser executada com `pnpm test`; a revisão de arquivo deve confirmar os metadados na página de origem antes da integração. O contrato não aceita IUCN como fonte aprovada e não aceita `NC`/`ND`.
