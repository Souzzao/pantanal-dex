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


## Candidatos de peixes — consulta Commons

Arquivos consultados por espécie no Wikimedia Commons, com licenças compatíveis: `Hoplias malabaricus 172871761.jpeg` — Tiago Lubiana — CC0 — https://commons.wikimedia.org/wiki/File:Hoplias_malabaricus_172871761.jpeg; `Hoplias malabaricus.jpg` — Cláudio D. Timm — CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Hoplias_malabaricus.jpg; `Hoplias malabaricus2.jpg` — J. F. Hennig — Public domain — https://commons.wikimedia.org/wiki/File:Hoplias_malabaricus2.jpg; `Prochilodus lineatus cropped.jpg` — João D'Andretta — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Prochilodus_lineatus_cropped.jpg; `Prochilodus lineatus 351939209.jpg` — dariocrosa — CC0 — https://commons.wikimedia.org/wiki/File:Prochilodus_lineatus_351939209.jpg; `Prochilodus lineatus in-situ.jpg` — João D'Andretta — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Prochilodus_lineatus_in-situ.jpg; `Leporinus friderici.jpg` — Citron — CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Leporinus_friderici.jpg; `Leporinus friderici 60892985.jpg` — Gerry van Tonder — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Leporinus_friderici_60892985.jpg; `Leporinus friderici 325924873.jpg` — Douglas Lopes — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Leporinus_friderici_325924873.jpg.

Os nomes científicos do próximo lote devem ser validados no GBIF antes da integração. As licenças acima não contêm NC ou ND. As imagens não constituem, por si só, confirmação de ocorrência no recorte do Pantanal ou de conservação oficial.


## Fish-03 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Brycon hilarii`, `Myloplus tiete` e `Gymnotus carapo`. Metadados Commons consultados: `Brycon hilarii.jpg` — David Morimoto — CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Brycon_hilarii.jpg; `Brycon hilarii - Piraputanga no Monumento Natural do Rio Formoso.jpg` — BRASIL AQUA — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Brycon_hilarii_-_Piraputanga_no_Monumento_Natural_do_Rio_Formoso.jpg; `Brycon hilarii 632830884.jpg` — Nicola Crockford — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Brycon_hilarii_632830884.jpg; `Myloplus tiete.jpg` — Douglas Lopes — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Myloplus_tiete.jpg; `Fish fauna (10.3897-zookeys.875.31977) Figure 6.jpg` — Ribeiro et al. — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Fish_fauna_(10.3897-zookeys.875.31977)_Figure_6.jpg; `Peixes da planície de inundação do alto rio Paraná (3678425).png` — Ota et al. — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Peixes_da_planície_de_inundação_do_alto_rio_Paraná_(3678425).png; `Gymnotus carapo.png` — domínio público — https://commons.wikimedia.org/wiki/File:Gymnotus_carapo.png; `Gymnotus Carapo en aquarium.jpg` — aquaportail.com — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Gymnotus_Carapo_en_aquarium.jpg; `Gymnotus-carapo.jpg` — Francisco molas — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Gymnotus-carapo.jpg.

Nenhuma licença contém NC ou ND. As referências e imagens não comprovam, sozinhas, ocorrência no recorte do Pantanal ou situação de conservação; manter `pending-review`.

## Invertebrates-07 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Anartia jatrophae`, `Battus polydamas` e `Vanessa myrinna`. A API Commons identificou CC0 e CC BY-SA 4.0 nos nove arquivos selecionados. As nove URLs `Special:FilePath` foram verificadas com User-Agent, timeout e retentativas e retornaram HTTP 200; uma primeira resposta vazia para `White peacock ... underside.JPG` foi confirmada como HTTP 200 na retentativa. Ocorrência no recorte do Pantanal e conservação oficial permanecem pendentes.

## Fish-06 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Salminus brasiliensis`, `Pseudoplatystoma corruscans` e `Leporinus obtusidens`. A API Commons identificou licenças CC0, CC BY 4.0, CC BY-SA 2.0/2.5/4.0 e domínio público nos nove arquivos selecionados. Todas as URLs `Special:FilePath` retornaram HTTP 200 com User-Agent e retentativas. Os IDs novos foram sufixados com `-fish06` porque os dois primeiros nomes já possuíam registros legados no catálogo; essa correção foi coberta pelos testes. Ocorrência no recorte do Pantanal e conservação oficial permanecem pendentes.

## Birds-05 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Egretta thula`, `Pitangus sulphuratus` e `Sicalis flaveola`. A API Commons identificou licenças CC0 e CC BY-SA 3.0/4.0 nos nove arquivos selecionados. As nove URLs `Special:FilePath` foram verificadas com User-Agent e retentativas e retornaram HTTP 200. Ocorrência no recorte do Pantanal e conservação oficial permanecem pendentes.

## Invertebrates-06 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Heliconius erato`, `Papilio thoas` e `Bombus pauloensis`. A API Commons identificou licenças CC BY 4.0 e CC BY-SA 2.5/3.0/4.0 nos nove arquivos selecionados. Todas as URLs `Special:FilePath` foram verificadas com User-Agent e retentativas e retornaram HTTP 200. Ocorrência no recorte do Pantanal e conservação oficial permanecem pendentes.

## Fish-05 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Pseudoplatystoma reticulatum`, `Cichla piquiti` e `Piaractus brachypomus`. A API Commons identificou licenças CC BY 4.0, CC BY-SA 3.0/4.0 e domínio público nos nove arquivos. As nove URLs `Special:FilePath` retornaram HTTP 200 usando User-Agent e retentativas; uma resposta inicial 429 foi tratada como limitação temporária do serviço, não como URL inválida. Ocorrência no recorte do Pantanal e conservação oficial permanecem pendentes.

## Birds-04 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Syrigma sibilatrix`, `Megaceryle torquata` e `Ardea alba`. A API do Wikimedia Commons identificou licenças CC BY 2.0/4.0 e CC BY-SA 2.0/3.0/4.0 nos nove arquivos selecionados, e as URLs `Special:FilePath` retornaram HTTP 200. A confirmação de ocorrência no recorte do Pantanal e de conservação oficial permanece pendente.

## Invertebrates-05 — pesquisa Commons e GBIF

O GBIF retornou `ACCEPTED`/`EXACT` para `Morpho helenor`, `Ascalapha odorata` e `Dynastes hercules`. A API do Wikimedia Commons identificou licenças CC BY 3.0 ou CC BY-SA 4.0 para os nove arquivos selecionados, e todas as URLs `Special:FilePath` retornaram HTTP 200. A confirmação de ocorrência no recorte do Pantanal e de conservação oficial permanece pendente; não houve inferência desses atributos.


## Birds-03 — pesquisa Commons

Metadados consultados para o próximo lote: `Jabiru Mato Grosso Pantanal Brazil-3.jpg` — Andreas Trepte — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Jabiru_Mato_Grosso_Pantanal_Brazil-3.jpg; `Jabiru (Jabiru mycteria) 2.JPG` — Charles J. Sharp — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Jabiru_(Jabiru_mycteria)_2.JPG; `Jabirus (Jabiru mycteria) on nest.JPG` — Charles J. Sharp — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Jabirus_(Jabiru_mycteria)_on_nest.JPG; `Hyacinth Macaw (Anodorhynchus hyacinthinus), Parque Estadual Encontro das Águas Thomas-Fuhrmann 2.jpg` — Thomas Fuhrmann — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Hyacinth_Macaw_(Anodorhynchus_hyacinthus),_Parque_Estadual_Encontro_das_Águas_Thomas-Fuhrmann_2.jpg; `Anodorhynchus hyacinthinus -Hyacinth Macaw -side of head.jpg` — Randy — CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Anodorhynchus_hyacinthinus_-Hyacinth_Macaw_-side_of_head.jpg; `Arara Azul no Pantanal.jpg` — Leonardo Ramos — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Arara_Azul_no_Pantanal.jpg; `Tigrisoma lineatum portrait.jpg` — Paolo Costa Baldi — CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Tigrisoma_lineatum_portrait.jpg; `Rufescent tiger heron (Tigrisoma lineatum).JPG` — Charles J. Sharp — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Rufescent_tiger_heron_(Tigrisoma_lineatum).JPG; `Rufescent Tiger Heron, Berazategui, Buenos Aires, Argentina 1.jpg` — matiascabezas — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Rufescent_Tiger_Heron,_Berazategui,_Buenos_Aires,_Argentina_1.jpg.

As nove licenças são CC BY ou CC BY-SA. As URLs de origem são páginas individuais do Commons; a confirmação de ocorrência no Pantanal deve ser feita separadamente via SiBBr/ICMBio.


## Fish-04 — pesquisa Commons

Arquivos consultados: `Pimelodus maculatus.jpg` — Paul Louis Oudart — domínio público — https://commons.wikimedia.org/wiki/File:Pimelodus_maculatus.jpg; `Mandi – Pimelodus maculatus (5257144069).jpg` — Secretaria de Agricultura e Abastecimento — CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Mandi_–_Pimelodus_maculatus_(5257144069).jpg; `Pimelodus maculatus 469641789.jpg` — Rocío Esmeralda Pose — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Pimelodus_maculatus_469641789.jpg; `Loricariichthys anus.jpg` — Cláudio Dias Timm — CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Loricariichthys_anus.jpg; `Loricariichthys anus Orbigny.jpg` — Paul Louis Oudart — domínio público — https://commons.wikimedia.org/wiki/File:Loricariichthys_anus_Orbigny.jpg; `Species of fishes from the Chasqueiro Stream (Mirim Lagoon system).jpg` — Fabiano Corrêa et al. — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Species_of_fishes_from_the_Chasqueiro_Stream_(Mirim_Lagoon_system).jpg; `Corydoras paleatus by NiKo.jpg` — NiKo — domínio público — https://commons.wikimedia.org/wiki/File:Corydoras_paleatus_by_NiKo.jpg; `Corydoras paleatus 84869641.jpg` — Guillermo Debandi — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Corydoras_paleatus_84869641.jpg; `Corydoras paleatus 1.jpg` — Juan Carlos Palau Díaz — CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Corydoras_paleatus_1.jpg.

As licenças verificadas são compatíveis com uso comercial. A taxonomia e a ocorrência regional devem ser validadas separadamente; não preencher conservação sem ICMBio/MMA.

## Passo 7/50 — migração das cinco fontes legadas para GBIF

Em 2026-08-22, as cinco fontes públicas legadas fora da lista aprovada foram substituídas por endpoints GBIF Species Match, sem alterar os nomes científicos nem inventar URLs. As consultas ao endpoint público retornaram `matchType=EXACT` e `status=ACCEPTED` para todos os cinco nomes.

| ID legado | Nome científico | Referência substituta | Resultado GBIF |
|---|---|---|---|
| `pintado` | `Pseudoplatystoma corruscans` | `https://api.gbif.org/v1/species/match?name=Pseudoplatystoma%20corruscans` | `EXACT` / `ACCEPTED` |
| `pacu` | `Piaractus mesopotamicus` | `https://api.gbif.org/v1/species/match?name=Piaractus%20mesopotamicus` | `EXACT` / `ACCEPTED` |
| `piraputanga` | `Brycon hilarii` | `https://api.gbif.org/v1/species/match?name=Brycon%20hilarii` | `EXACT` / `ACCEPTED` |
| `caranguejo-agua-doce` | `Dilocarcinus pagei` | `https://api.gbif.org/v1/species/match?name=Dilocarcinus%20pagei` | `EXACT` / `ACCEPTED` |
| `camarao-agua-doce` | `Macrobrachium amazonicum` | `https://api.gbif.org/v1/species/match?name=Macrobrachium%20amazonicum` | `EXACT` / `ACCEPTED` |

A migração resolve a pendência de host não aprovado dos cinco registros. Ela não prova ocorrência específica no recorte do Pantanal nem situação de conservação; essas etapas continuam dependentes de SiBBr/ICMBio e de fontes oficiais brasileiras.

## Passo 9/50 — auditoria com dataset ICMBio/SISBio acessível

Foi localizado o recurso oficial `ICMBio | Dados de ocorrência de espécies do Sistema de Autorização e Informações de Biodiversidade (SISBio) do ICMBio`, publicado no SiBBr como `dr327`. A página do recurso descreve ocorrências em Unidades de Conservação Federais, aponta para o IPT oficial do ICMBio e informa licença CC BY 4.0: https://collectory.sibbr.gov.br/collectory/public/show/dr327. O índice de consulta associado é https://ala-hub.sibbr.gov.br/ala-hub/occurrence/search?q=data_resource_uid:dr327.

Foram tentadas consultas filtradas para `Pseudoplatystoma corruscans`, `Piaractus mesopotamicus`, `Brycon hilarii`, `Dilocarcinus pagei` e `Macrobrachium amazonicum`. O endpoint chegou a responder dados volumosos/HTML, mas não forneceu contagem estruturada confiável dentro do limite do ambiente para esses filtros. Assim, o dataset é uma fonte oficial acessível e a consulta fica registrada, porém nenhuma das cinco espécies foi promovida a ocorrência confirmada no Pantanal. `pending-review` não significa ausência.

A página oficial do ICMBio sobre o bioma Pantanal também foi registrada como contexto de delimitação, sem ser usada para afirmar presença de espécie individual: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal.

## Passo 8/50 — fonte regional SiBBr/ICMBio revisitada em 2026-08-27

A página oficial do recurso `dr327` identifica o conjunto como “Dados de ocorrência de espécies do Sistema de Autorização e Informações de Biodiversidade (SISBio) do ICMBio”, descreve ocorrências informadas por pesquisadores e informa licença **CC BY 4.0**. A página também aponta a consulta de registros no ALA-Hub/SiBBr: https://ala-hub.sibbr.gov.br/ala-hub/occurrence/search?q=data_resource_uid:dr327.

A página de metadados do recurso foi acessada com sucesso, mas a consulta filtrada de ocorrências não forneceu conteúdo estruturado nesta execução. Portanto, o ledger mantém os cinco registros como `pending-review`: a limitação de consulta não é tratada como ausência de ocorrência nem como confirmação regional.

Fonte consultada: https://collectory.sibbr.gov.br/collectory/public/show/dr327 — ICMBio/SISBio no SiBBr. A referência foi verificada em 2026-08-27.

## Passo 9/50 — revalidação do dataset ICMBio/SISBio em 2026-08-27

A página do recurso `dr327` no SiBBr foi reaberta e confirmou o título do conjunto do ICMBio/SISBio, a descrição de ocorrências informadas por pesquisadores, o recorte geográfico em Unidades de Conservação Federais do Brasil e a licença CC BY 4.0. A página informa a versão 1.649, última publicação verificada em 02 fev. 2026 e atualização de metadados em 19 ago. 2026: https://collectory.sibbr.gov.br/collectory/public/show/dr327.

A referência IPT indicada pelo próprio recurso (`https://ipt.icmbio.gov.br/resource?r=sisbio_ocorrencia&v=1.649`) e a consulta ALA-Hub (`https://ala-hub.sibbr.gov.br/ala-hub/occurrence/search?q=data_resource_uid:dr327`) não forneceram conteúdo estruturado nesta extração. Esta limitação foi registrada como resultado operacional, não como ausência de registros. As cinco consultas por espécie permanecem `pending-review` no ledger.

## Passo 10/50 — fontes oficiais de conservação revisitadas em 2026-08-27

O SALVE/ICMBio foi acessado e se apresenta como Sistema de Avaliação do Risco de Extinção da Biodiversidade; a própria página distingue o número de espécies em destaque da lista oficial e direciona às listas oficiais de fauna: https://salve.icmbio.gov.br/.

A página oficial do Livro Vermelho da Fauna Brasileira Ameaçada de Extinção 2018 foi acessada e disponibiliza sete volumes por grupo taxonômico, incluindo mamíferos, aves, répteis, anfíbios, peixes e invertebrados: https://www.gov.br/icmbio/pt-br/centrais-de-conteudo/publicacoes/publicacoes-diversas/livro-vermelho/livro-vermelho-da-fauna-brasileira-ameacada-de-extincao-2018.

A página do MMA sobre conservação de espécies foi acessada e confirma o SALVE como fonte de dados da fauna brasileira, além de listar as listas nacionais oficiais e portarias aplicáveis. A página informa atualizações de 2026 para peixes/invertebrados aquáticos e para mamíferos, aves, répteis, anfíbios e invertebrados terrestres: https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/biodiversidade1/conservacao-de-especies.

As páginas confirmam a trilha de fontes, mas não foram usadas para atribuir categoria individual às cinco espécies do ledger nesta execução. Os registros permanecem `pending-review` até existir correspondência taxonômica individual, categoria oficial e evidência citável.
