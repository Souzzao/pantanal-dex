
## Evidências taxonômicas — Passo 9/50

A página GBIF de `Salvator merianae` identificou o táxon como espécie aceita, com autoridade Duméril & Bibron, 1839, classificação em Reptilia/Squamata/Teiidae e 10.126 ocorrências globais exibidas pela fonte. A página GBIF de `Oxybelis aeneus` identificou o táxon como espécie aceita, com autoridade Wagler, 1824, classificação em Reptilia/Squamata/Colubridae e 4.638 ocorrências globais exibidas. Esses totais globais não são tratados como prova de ocorrência no Pantanal. A política do projeto mantém ambos os registros como `pending-review` até haver evidência regional individual e checklist editorial completo.

## Auditoria de imagens e páginas de origem

As seis imagens declaradas no `catalog-reptiles-01` retornaram HTTP 200 com conteúdo de imagem após seguir redirecionamentos: três de *Salvator merianae* e três de *Oxybelis aeneus*. Na verificação das páginas individuais, cinco retornaram HTTP 200 e a primeira página do teiú retornou 404 por divergência entre o título registrado e o nome real do arquivo. O título correto é `Argentine_Black-and-white_Tegu_(Salvator_merianae),_Parque_Estadual_Encontro_das_Águas_Thomas-Fuhrmann.jpg`; ele foi confirmado com HTTP 200 e substituído no lote. A autoria e as licenças declaradas foram preservadas; não foi aceita licença NC, ND, ausente ou ambígua.

## Evidências taxonômicas — Passo 10/50

A API GBIF confirmou `Acanthochelys macrocephala (Rhodin, Mittermeier & Mcmorris, 1984)` como `ACCEPTED`, `rank=SPECIES`, `matchType=EXACT`, confidence 99 e usageKey `2441991`, na família Chelidae e classe Testudines.

Também confirmou `Helicops infrataeniatus Jan, 1865` como `ACCEPTED`, `rank=SPECIES`, `matchType=EXACT`, confidence 99 e usageKey `2457678`, na família Colubridae e classe Squamata.

Essas confirmações são taxonômicas. Elas não substituem a evidência de ocorrência no Pantanal nem autorizam o preenchimento de conservação sem fonte oficial brasileira.

A API GBIF confirmou `Caiman yacare (Daudin, 1801)` como `ACCEPTED`, `rank=SPECIES`, `matchType=EXACT`, confidence 99 e usageKey `5220210`, na família Alligatoridae e classe Crocodylia.

Também confirmou `Salvator rufescens (Günther, 1871)` como `ACCEPTED`, `rank=SPECIES`, `matchType=EXACT`, confidence 99 e usageKey `8285095`, na família Teiidae e classe Squamata.

Os quatro registros do lote têm correspondência taxonômica exata. A promoção editorial continua bloqueada até completar a prova regional individual, o status oficial brasileiro quando aplicável e a revisão editorial formal.

## Conservação oficial — fonte brasileira

A página oficial do ICMBio informa que a Lista Nacional Oficial de Espécies da Fauna Ameaçadas foi atualizada em 2026 pela Portaria MMA nº 1.704/2026 para Invertebrados terrestres, Aves, Anfíbios, Répteis e Mamíferos. A página do DOU da Portaria MMA nº 1.704, de 16 de junho de 2026, retornou uma ocorrência explícita de `Acanthochelys macrocephala` no Anexo I, com categoria `VU` (Vulnerável). Esse status é a única categoria oficial individual confirmada nesta etapa até o momento; os demais táxons não serão preenchidos sem ocorrência explícita e reproduzível na mesma fonte.

## Triagem regional e conservação — Passo 10/50

Foi feita uma consulta de triagem no GBIF com `has_coordinate=true`, `limit=0` e caixa operacional `decimalLongitude=-58,-54` / `decimalLatitude=-23,-15`. Essa caixa é apenas um recorte de trabalho aproximado, não um limite oficial do Pantanal. Os contadores retornados foram: *Acanthochelys macrocephala* 33 registros; *Helicops infrataeniatus* 2; *Caiman yacare* 3.519; *Salvator rufescens* 0. Esses resultados ajudam a priorizar revisão, mas não substituem a checagem de localidade, dataset e identificação de cada registro.

A página oficial do ICMBio confirma que a Portaria MMA nº 1.704/2026 é a lista nacional vigente para répteis, entre outros grupos. A busca no texto integral oficial localizou *Acanthochelys macrocephala* no Anexo I com categoria VU (Vulnerável). Não foram localizados os outros três nomes no texto pesquisado; por isso nenhum status foi inventado para eles. A fonte usada foi o ICMBio/DOU, e não a IUCN.
