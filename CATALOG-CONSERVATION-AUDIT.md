# Auditoria da trilha oficial de conservação — passo 25/50

A trilha usa SALVE/ICMBio, Livro Vermelho da Fauna Brasileira e listas/portarias MMA/ICMBio como fontes elegíveis. No passo 22, `pintado` foi confirmado individualmente como VU pela Portaria MMA nº 148/2022. Nos passos 23 e 24, `pacu` e `piraputanga` foram confirmados como `not-listed` na mesma lista após busca exata; isso não equivale a LC e não representa uma avaliação de baixo risco. No passo 25, `caranguejo-agua-doce` recebeu a categoria LC em avaliação técnica oficial do ICMBio realizada entre 2010 e 2014.

| ID | Nome científico | Categoria | Fonte | Estado | Regra |
|---|---|---|---|---|---|
| `pintado` | Pseudoplatystoma corruscans | `VU` | [Portaria MMA/ICMBio](https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf) | `confirmed` | Promover somente com correspondência taxonômica exata na lista oficial aplicável. |
| `pacu` | Piaractus mesopotamicus | `—` | [Portaria MMA/ICMBio](https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf) | `confirmed` | Registrar como não listado somente após busca exata na lista nacional oficial vigente; não converter ausência em categoria LC. |
| `piraputanga` | Brycon hilarii | `—` | [Portaria MMA/ICMBio](https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf) | `confirmed` | Registrar como não listado somente após busca exata na lista nacional oficial vigente; não converter ausência em categoria LC. |
| `caranguejo-agua-doce` | Dilocarcinus pagei | `LC` | [Avaliação ICMBio](https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/biodiversidade-marinha-do-sudeste-e-sul/acervo-digital/trabalhos-tecnicos/pub_2016_avaliacao_crustaceos_2010_2014-1.pdf) | `confirmed` | Registrar a categoria somente quando a avaliação técnica oficial identificar individualmente o táxon e a categoria, preservando o período e o escopo metodológico da avaliação. |
| `camarao-agua-doce` | Macrobrachium amazonicum | `—` | [Portaria MMA/ICMBio](https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/biodiversidade1/conservacao-de-especies) | `pending-review` | Conferir a lista oficial aplicável a peixes/invertebrados aquáticos e só preencher com correspondência taxonômica exata. |

**Resultado:** PASS. 5/5 registros cobertos; 4 confirmado(s); 1 pendentes; 0 erro(s).

> Nenhuma categoria de ameaça foi inventada. `pintado` tem VU na Portaria MMA nº 148/2022; `pacu` e `piraputanga` têm finding `not-listed`; `caranguejo-agua-doce` tem LC na avaliação técnica oficial do ICMBio. A avaliação LC é datada e não deve ser confundida automaticamente com uma lista legal posterior; `camarao-agua-doce` segue `pending-review`.
