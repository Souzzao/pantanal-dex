# Pesquisa do lote mamíferos 1

## Wikimedia Commons

- `File:Maned wolf (Chrysocyon brachyurus) (92775971).jpg`: página confirmada; autor Pascal Vuylsteker; CC BY-SA 2.0; origem Flickr; arquivo fotográfico de lobo-guará.
- A página do Commons também confirma que o arquivo possui licença CC BY-SA 2.0 e requer atribuição e compartilhamento pela mesma licença.

## Fontes taxonômicas

- GBIF Species Match será usada para situação de conservação somente após confirmação da página da espécie.
- GBIF/Species API será usada para conferir o nome científico aceito e a autoria taxonômica antes da inclusão.

## Pendências

- Confirmar individualmente os metadados dos demais arquivos de cada espécie via API/página do Commons antes de commitar o lote.
- Não usar mapas, arquivos sem licença clara ou URLs que não tenham sido verificados.


## Pesquisa do lote de anfíbios

A API de correspondência taxonômica do GBIF retornou correspondência exata e status `ACCEPTED` para `Boana albopunctata`, `Phyllomedusa sauvagii` e `Physalaemus albonotatus`, mantendo esses nomes como candidatos para o ciclo 8. Nenhum status de conservação foi preenchido; essa informação deve vir exclusivamente do Livro Vermelho do ICMBio ou de portarias MMA/ICMBio.

O lote de anfíbios foi implementado com imagens Commons individualmente registradas; a revisão de ocorrência regional e a fonte oficial de conservação permanecem pendentes.


## Ciclo 17 — validação taxonômica GBIF

Em 21 de agosto de 2026, os quinze nomes científicos dos lotes modulares foram consultados individualmente no endpoint público `https://api.gbif.org/v1/species/match`. Todos retornaram `matchType=EXACT` e `status=ACCEPTED`: `Anhima cornuta`, `Boana albopunctata`, `Cariama cristata`, `Chrysocyon brachyurus`, `Crax fasciolata`, `Morpho helenor`, `Oxybelis aeneus`, `Pecari tajacu`, `Phyllomedusa sauvagii`, `Piaractus mesopotamicus`, `Pseudoplatystoma corruscans`, `Salminus brasiliensis`, `Salvator merianae`, `Tayassu pecari` e `Tetragonisca angustula`.

A confirmação é taxonômica e não prova, sozinha, ocorrência no recorte do Pantanal nem situação de conservação. Esses dois atributos permanecem pendentes até fonte SiBBr/ICMBio e Livro Vermelho/portaria oficial aplicável.


## Auditoria comercial do catálogo legado

Foi executada a migração controlada de 15 referências legadas da IUCN em `shared/pantanal.ts`. Cada referência foi substituída por consulta GBIF Species Match correspondente, sem usar a API IUCN. Os 15 campos `conservationStatus` legados foram removidos porque não havia, nesta execução, confirmação individual pelo Livro Vermelho ICMBio ou por portaria MMA/ICMBio. A ausência de status é intencional e deve permanecer até revisão oficial.

O script auditável `scripts/normalize-legacy-commercial.mjs` interrompe se não encontrar referências IUCN ou se alguma permanecer após a migração. O teste do catálogo também impede regressão de fontes IUCN e de status de conservação sem fonte aprovada.
