# Auditoria do ledger de ocorrência regional — passo 8/50

O ledger registra consultas oficiais do dataset ICMBio/SISBio `dr327` no SiBBr para cinco espécies legadas.

| ID | Região | Estado | Fonte | Evidência conservadora |
|---|---|---|---|---|
| `pintado` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `pacu` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `piraputanga` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `caranguejo-agua-doce` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |
| `camarao-agua-doce` | Pantanal | `pending-review` | [ICMBio/SISBio — dataset de ocorrências no SiBBr](https://collectory.sibbr.gov.br/collectory/public/show/dr327) | Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional. |

**Resultado:** PASS. 5/5 registros cobertos; 5 permanecem pendentes; 0 erro(s).

> `pending-review` significa que a consulta não forneceu evidência estruturada suficiente nesta execução. Não significa ausência de ocorrência.

## Limite da evidência

O dataset oficial foi localizado e sua licença CC BY 4.0 foi confirmada. A consulta filtrada no ALA-Hub/SiBBr não forneceu contagem estruturada confiável no ambiente de execução; por isso, nenhuma espécie foi promovida a `confirmed`, e nenhuma ausência foi inferida.
