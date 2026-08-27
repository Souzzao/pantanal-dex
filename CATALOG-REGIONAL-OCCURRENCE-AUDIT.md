# Auditoria do ledger de ocorrência regional — passo 17/50

O ledger registra a validação individual de ocorrência para cinco espécies legadas. `pintado` foi confirmado por estudo regional da Embrapa e identidade taxonômica do GBIF; as demais quatro espécies permanecem em revisão com o dataset ICMBio/SISBio `dr327`.

| ID | Região | Estado | Fonte | Evidência conservadora |
|---|---|---|---|---|
| `pintado` | Pantanal | `confirmed` | [Embrapa-CPAP — estudo da bacia do rio Miranda, Pantanal de Mato Grosso do Sul](https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558) | A publicação da Embrapa analisa explicitamente Pseudoplatystoma corruscans na bacia hidrográfica do rio Miranda, Pantanal do Mato Grosso do Sul, e descreve sua migração, desova nos rios Miranda e Aquidauana e dispersão pelas áreas alagadas. O GBIF/Catalogue of Life confirma Pseudoplatystoma corruscans (Spix & Agassiz, 1829) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida. |
| `pacu` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `piraputanga` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `caranguejo-agua-doce` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `camarao-agua-doce` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |

**Resultado:** PASS. 5/5 registros cobertos; 1 confirmado(s); 4 permanecem pendentes; 0 erro(s).

> `pending-review` significa que ainda não há evidência individual suficiente para promoção. Não significa ausência de ocorrência; a confirmação de `pintado` foi feita por uma fonte regional independente e uma fonte taxonômica estruturada.

## Limite da evidência

A publicação da Embrapa foi localizada e descreve explicitamente Pseudoplatystoma corruscans na bacia do rio Miranda, no Pantanal de Mato Grosso do Sul; o GBIF/Catalogue of Life apresenta o nome como espécie aceita. Para as outras quatro espécies, o dataset oficial ICMBio/SISBio foi localizado, mas a consulta filtrada não forneceu contagem estruturada confiável no ambiente de execução; por isso, nenhuma outra espécie foi promovida e nenhuma ausência foi inferida.
## Referências

[1]: https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558 "Embrapa Infoteca-e — estudo do pintado na bacia do rio Miranda"
[2]: https://www.gbif.org/taxon/4P84P "GBIF — Pseudoplatystoma corruscans (Spix & Agassiz, 1829)"
