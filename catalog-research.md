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
