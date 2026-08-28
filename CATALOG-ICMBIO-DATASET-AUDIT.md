# Auditoria do dataset ICMBio/SISBio — passo 9/50

O dataset `dr327` foi auditado como fonte oficial de contexto para ocorrência em Unidades de Conservação Federais. A licença publicada no SiBBr é CC BY 4.0; a confirmação individual de ocorrência continua dependente de resposta estruturada dos filtros.

- Página de metadados: [SiBBr dr327](https://collectory.sibbr.gov.br/collectory/public/show/dr327)
- Referência do IPT: [SISBio v1.649](https://ipt.icmbio.gov.br/resource?r=sisbio_ocorrencia&v=1.649)
- Licença declarada: CC BY 4.0

## Probes executados

| Consulta | HTTP | Acessível | Estruturada | Observação |
|---|---:|---|---|---|
| Metadados do dataset ICMBio/SISBio dr327 | 200 | sim | não | resposta não estruturada para auditoria automática |
| Referência IPT ICMBio/SISBio v1.649 | 401 | não | não | resposta não estruturada para auditoria automática |
| Filtro Eudocimus ruber | 200 | sim | sim | resposta JSON |
| Filtro Eupsittula nenday | 200 | sim | sim | resposta JSON |
| Filtro Caracara plancus | 200 | sim | sim | resposta JSON |
| Filtro Synbranchus marmoratus | 200 | sim | sim | resposta JSON |
| Filtro Micrablepharus maximiliani | 200 | sim | sim | resposta JSON |
| Filtro Dilocarcinus pagei | 200 | sim | sim | resposta JSON |
| Filtro Phrynops geoffroanus | 200 | sim | sim | resposta JSON |
| Filtro Gymnotus inaequilabiatus | 200 | sim | sim | resposta JSON |
| Filtro Phoneutria nigriventer | 200 | sim | sim | resposta JSON |
| Filtro Podocnemis unifilis | 200 | sim | sim | resposta JSON |
| Filtro Hydrodynastes gigas | 200 | sim | sim | resposta JSON |
| Filtro Rhea americana | 200 | sim | sim | resposta JSON |
| Filtro Eigenmannia virescens | 200 | sim | sim | resposta JSON |
| Filtro Pteronura brasiliensis | 200 | sim | sim | resposta JSON |
| Filtro Pseudoplatystoma corruscans | 200 | sim | sim | resposta JSON |
| Filtro Crenicichla britskii | 200 | sim | sim | resposta JSON |
| Filtro Brycon hilarii | 200 | sim | sim | resposta JSON |
| Filtro Puma concolor | 200 | sim | sim | resposta JSON |
| Filtro Zungaro jahu | 200 | sim | sim | resposta JSON |
| Filtro Paleosuchus palpebrosus | 200 | sim | sim | resposta JSON |
| Filtro Serrasalmus maculatus | 200 | sim | sim | resposta JSON |
| Filtro Piaractus mesopotamicus | 200 | sim | sim | resposta JSON |
| Filtro Brycon orbignyanus | 200 | sim | sim | resposta JSON |
| Filtro Anhinga anhinga | 200 | sim | sim | resposta JSON |
| Filtro Loricariichthys platymetopon | 200 | sim | sim | resposta JSON |
| Filtro Macrobrachium amazonicum | 200 | sim | sim | resposta JSON |
| Filtro Hemisorubim platyrhynchos | 200 | sim | sim | resposta JSON |
| Filtro Rhamdia quelen | 200 | sim | sim | resposta JSON |
| Filtro Lontra longicaudis | 200 | sim | sim | resposta JSON |
| Filtro Serrasalmus marginatus | 200 | sim | sim | resposta JSON |
| Filtro Nasua nasua | 200 | sim | sim | resposta JSON |

**Resultado do contrato:** PASS. 31 registros regionais auditados; 0 usam o dataset dr327; 0 permanecem `pending-review`; ${errors.length} erro(s).

> Acesso ao dataset e licença não equivalem a confirmação de presença de uma espécie no Pantanal. Sem contagem ou resposta estruturada por filtro, o ledger não promove o registro e não infere ausência.
