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
| Filtro Brycon hilarii | 200 | sim | não | resposta não estruturada para auditoria automática |
| Filtro Pseudoplatystoma corruscans | 200 | sim | não | resposta não estruturada para auditoria automática |
| Filtro Dilocarcinus pagei | 200 | sim | não | resposta não estruturada para auditoria automática |
| Filtro Piaractus mesopotamicus | 200 | sim | não | resposta não estruturada para auditoria automática |
| Filtro Macrobrachium amazonicum | 200 | sim | não | resposta não estruturada para auditoria automática |

**Resultado do contrato:** PASS. Cinco filtros regionais presentes; 5 permanecem `pending-review`; ${errors.length} erro(s).

> Acesso ao dataset e licença não equivalem a confirmação de presença de uma espécie no Pantanal. Sem contagem ou resposta estruturada por filtro, o ledger não promove o registro e não infere ausência.
