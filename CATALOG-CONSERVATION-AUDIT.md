# Auditoria da trilha oficial de conservação — passo 23/50

A trilha usa SALVE/ICMBio, Livro Vermelho da Fauna Brasileira e listas/portarias MMA/ICMBio como fontes elegíveis. No passo 22, `pintado` foi confirmado individualmente como VU pela Portaria MMA nº 148/2022. No passo 23, `pacu` foi confirmado como `not-listed` na mesma lista após busca exata; isso não equivale a LC e não representa uma avaliação de baixo risco.

| ID | Nome científico | Categoria | Fonte | Estado | Regra |
|---|---|---|---|---|---|
| `pintado` | Pseudoplatystoma corruscans | `VU` | [Portaria MMA/ICMBio](https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf) | `confirmed` | Promover somente com correspondência taxonômica exata na lista oficial aplicável. |
| `pacu` | Piaractus mesopotamicus | `—` | [Portaria MMA/ICMBio](https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf) | `confirmed` | Registrar como não listado somente após busca exata na lista nacional oficial vigente; não converter ausência em categoria LC. |
| `piraputanga` | Brycon hilarii | `—` | [Livro Vermelho ICMBio](https://www.gov.br/icmbio/pt-br/centrais-de-conteudo/publicacoes/publicacoes-diversas/livro-vermelho/livro-vermelho-da-fauna-brasileira-ameacada-de-extincao-2018) | `pending-review` | Preencher somente após localizar a espécie no volume taxonômico e conferir a categoria oficial. |
| `caranguejo-agua-doce` | Dilocarcinus pagei | `—` | [Livro Vermelho ICMBio](https://www.gov.br/icmbio/pt-br/centrais-de-conteudo/publicacoes/publicacoes-diversas/livro-vermelho/livro-vermelho-da-fauna-brasileira-ameacada-de-extincao-2018) | `pending-review` | Preencher somente após localizar a espécie no volume de invertebrados e conferir a categoria oficial. |
| `camarao-agua-doce` | Macrobrachium amazonicum | `—` | [Portaria MMA/ICMBio](https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/biodiversidade1/conservacao-de-especies) | `pending-review` | Conferir a lista oficial aplicável a peixes/invertebrados aquáticos e só preencher com correspondência taxonômica exata. |

**Resultado:** PASS. 5/5 registros cobertos; 2 confirmado(s); 3 pendentes; 0 erro(s).

> Nenhuma categoria de ameaça foi inventada. A promoção de `pintado` para `confirmed` exige categoria individual na Portaria MMA nº 148/2022. Para `pacu`, `not-listed` registra apenas a ausência de correspondência na lista nacional consultada; os demais registros seguem `pending-review`.
