# Auditoria do ledger de ocorrência regional — passo 18/50

O ledger registra a validação individual de ocorrência para cinco espécies legadas. `pintado` foi confirmado por estudo regional da Embrapa e `pacu` por artigo SciELO; ambos têm identidade taxonômica confirmada pelo GBIF. As demais três espécies permanecem em revisão com o dataset ICMBio/SISBio `dr327`.

| ID | Região | Estado | Fonte | Evidência conservadora |
|---|---|---|---|---|
| `pintado` | Pantanal | `confirmed` | [Embrapa-CPAP — estudo da bacia do rio Miranda, Pantanal de Mato Grosso do Sul](https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558) | A publicação da Embrapa analisa explicitamente Pseudoplatystoma corruscans na bacia hidrográfica do rio Miranda, Pantanal do Mato Grosso do Sul, e descreve sua migração, desova nos rios Miranda e Aquidauana e dispersão pelas áreas alagadas. O GBIF/Catalogue of Life confirma Pseudoplatystoma corruscans (Spix & Agassiz, 1829) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida. |
| `pacu` | Pantanal | `confirmed` | [SciELO — estudo de rendimento por recruta do pacu no Pantanal de Mato Grosso do Sul](https://www.scielo.br/j/bjb/a/dNGnkpjV7M9Fx7GtyGBD7zg/?format=html&lang=en&ilang=pt_BR) | O artigo publicado no Brazilian Journal of Biology informa que Piaractus mesopotamicus é uma das espécies mais capturadas no Pantanal de Mato Grosso do Sul e analisa dados de peixes capturados na região. O GBIF/Catalogue of Life confirma Piaractus mesopotamicus (Holmberg, 1887) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida. |
| `piraputanga` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `caranguejo-agua-doce` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `camarao-agua-doce` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |

**Resultado:** PASS. 5/5 registros cobertos; 2 confirmado(s); 3 permanecem pendentes; 0 erro(s).

> `pending-review` significa que ainda não há evidência individual suficiente para promoção. Não significa ausência de ocorrência; a confirmação de `pintado` foi feita por uma fonte regional independente e uma fonte taxonômica estruturada.

## Limite da evidência

A publicação da Embrapa descreve explicitamente Pseudoplatystoma corruscans na bacia do rio Miranda, no Pantanal de Mato Grosso do Sul. O artigo SciELO informa que Piaractus mesopotamicus é uma das espécies mais capturadas no Pantanal de Mato Grosso do Sul. O GBIF/Catalogue of Life apresenta ambos os nomes como espécies aceitas. Para as outras três espécies, o dataset oficial ICMBio/SISBio foi localizado, mas a consulta filtrada não forneceu contagem estruturada confiável; por isso, nenhuma outra espécie foi promovida e nenhuma ausência foi inferida.
## Referências

[1]: https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558 "Embrapa Infoteca-e — estudo do pintado na bacia do rio Miranda"
[2]: https://www.gbif.org/taxon/4P84P "GBIF — Pseudoplatystoma corruscans (Spix & Agassiz, 1829)"
[3]: https://www.scielo.br/j/bjb/a/dNGnkpjV7M9Fx7GtyGBD7zg/?format=html&lang=en&ilang=pt_BR "SciELO — estudo do pacu no Pantanal de Mato Grosso do Sul"
[4]: https://www.gbif.org/taxon/4HPL3 "GBIF — Piaractus mesopotamicus (Holmberg, 1887)"
