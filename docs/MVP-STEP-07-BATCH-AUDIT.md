# MVP — Passo 7/50: auditoria do segundo lote de aves

## Escopo e reconciliação

A solicitação do passo cita Arara-canindé, Jabiru/Tuiuiú e Colhereiro. A inspeção do repositório mostrou que o lote numerado como segundo lote (`catalog-birds-02`) contém Gavião-belo (*Busarellus nigricollis*) e Urubu-rei (*Sarcoramphus papa*). Arara-canindé está em `catalog-birds-03`, Tuiuiú/Jabiru em `catalog-birds-04` e Colhereiro não existia no catálogo. A divergência foi registrada em vez de mover ou duplicar registros silenciosamente.

Para cumprir a frente de conteúdo solicitada sem corromper a sequência dos lotes, o Colhereiro foi acrescentado a `catalog-birds-04` como registro `pending-review`, enquanto os registros existentes foram mantidos em seus lotes originais.

## Auditoria do lote numerado `catalog-birds-02`

| Critério | Resultado |
|---|---|
| Espécies | Gavião-belo e Urubu-rei |
| Taxonomia | GBIF retornou nomes aceitos com correspondência exata |
| Imagens | 6 referências declaradas; URLs verificadas com redirecionamento e User-Agent, HTTP 200 |
| Licenças | CC BY-SA 4.0, CC BY 2.0, CC BY-SA 3.0 e CC BY 4.0; sem NC/ND declarado |
| Ocorrência específica no Pantanal | Não comprovada individualmente nesta auditoria |
| Conservação oficial brasileira | Não preenchida; a busca individual no SALVE/Portaria não foi reproduzível sem ficha/anexo específico |
| Checklist editorial | Incompleto |
| Decisão | Permanece `pending-review`; não promover |

A API GBIF confirmou `Busarellus nigricollis` como `ACCEPTED`, rank `SPECIES`, `matchType EXACT` e usageKey `2480692`. A origem de `Sarcoramphus papa` foi mantida no lote, mas não foi atribuído status de conservação sem evidência oficial individual. A página oficial do DOU da Portaria MMA nº 1.704/2026 foi aberta, porém a consulta textual não localizou os nomes e, por isso, a política do projeto exige deixar esse campo vazio.

## Conjunto P1 citado na solicitação

| Espécie | Nome científico | Local atual | Situação no Passo 7 |
|---|---|---|---|
| Arara-canindé | *Ara ararauna* | `catalog-birds-03` | Registro existente; lote continua pendente |
| Jabiru/Tuiuiú | *Jabiru mycteria* | `catalog-birds-04` | Registro existente; lote continua pendente |
| Colhereiro | *Platalea ajaja* | `catalog-birds-04` | Acrescentado com 3 imagens Commons auditadas; ocorrência pantaneira e conservação ainda pendentes |

A API GBIF retornou `Platalea ajaja Linnaeus, 1758` como `ACCEPTED`, rank `SPECIES`, `matchType EXACT`, confidence 99 e usageKey `2480803`. A fonte textual permitida da Wikipédia em português foi usada apenas para apoiar a descrição geral da ave, sem copiar conteúdo nem inferir conservação.

## Imagens do Colhereiro

| Arquivo | Autor | Licença | Verificação |
|---|---|---|---|
| `Platalea ajaja 5.jpg` | Riverbanks Outdoor Store / berichard | CC BY 2.0 | Página Commons individual e URL de arquivo retornaram conteúdo válido |
| `Roseate Spoonbill Platalea ajaja JG.jpg` | JeffreyGammon | CC BY 4.0 | Página Commons individual e URL de arquivo retornaram conteúdo válido |
| `Roseate Spoonbill Platalea ajaja National Aviary 2650px.jpg` | Derek Ramsey (Ram-Man) | CC BY-SA 2.5 | Página Commons individual e URL de arquivo retornaram conteúdo válido |

As três imagens foram gravadas usando URLs `Special:FilePath` com largura limitada e créditos individuais. A última licença exige preservação de atribuição e share-alike em eventual adaptação. Nenhuma imagem foi tratada como prova de ocorrência no Pantanal.

## Alterações técnicas

- Acrescentado o Colhereiro ao catálogo modular, elevando a contagem de 46 para 47 espécies.
- Mantidos `catalog-birds-02` e `catalog-birds-04` como `pending-review` por ausência de checklist editorial completo.
- Atualizados os testes de contrato para verificar taxonomia, três imagens, ID único, rastreabilidade P1 e estado pendente.
- Mantida a governança que rejeita promoção sem evidência de ocorrência e conservação oficial.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Platalea%20ajaja "GBIF — Platalea ajaja"
[2]: https://commons.wikimedia.org/wiki/File:Platalea_ajaja_5.jpg "Wikimedia Commons — Platalea ajaja 5.jpg"
[3]: https://commons.wikimedia.org/wiki/File:Roseate_Spoonbill_Platalea_ajaja_JG.jpg "Wikimedia Commons — Roseate Spoonbill Platalea ajaja JG.jpg"
[4]: https://commons.wikimedia.org/wiki/File:Roseate_Spoonbill_Platalea_ajaja_National_Aviary_2650px.jpg "Wikimedia Commons — Roseate Spoonbill Platalea ajaja National Aviary"
[5]: https://www.in.gov.br/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917 "DOU — Portaria MMA nº 1.704/2026"
[6]: https://pt.wikipedia.org/wiki/Colhereiro "Wikipédia — Colhereiro"
