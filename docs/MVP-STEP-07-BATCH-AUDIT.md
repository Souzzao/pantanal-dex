# MVP — Passo 7/50: auditoria do primeiro lote de aves

**Lote auditado:** `catalog-birds-01`  
**Espécies:** Seriema, Mutum-de-penacho e Anhuma  
**Estado:** `pending-review`  
**Decisão:** não promover neste passo.

## Resultado

| Critério | Resultado |
|---|---|
| Campos obrigatórios, grupo e ambientes | Validados automaticamente |
| IDs únicos | Validados automaticamente |
| Três imagens por espécie | Presentes |
| Crédito e licença declarados | Presentes no registro |
| URLs HTTP e hosts de fontes | Passam o guardião automático |
| Checklist editorial do lote | Incompleto |
| Revisor e data | Não registrados |
| Ocorrência específica no Pantanal | Não comprovada nesta auditoria |
| Conservação oficial | Não comprovada nesta auditoria |

## Espécies auditadas

| Prioridade P1 | Espécie | Nome científico | Imagens | Fontes | Bloqueio |
|---:|---|---|---:|---:|---|
| 17 | Seriema | *Cariama cristata* | 3 | 1 | checklist, ocorrência e conservação individual |
| — | Mutum-de-penacho | *Crax fasciolata* | 3 | 1 | revisão editorial do lote; fora do P1 atual |
| — | Anhuma | *Anhima cornuta* | 3 | 1 | revisão editorial do lote; fora do P1 atual |

As referências visuais, créditos e licenças declaradas passam a validação estrutural, mas ainda precisam ser conferidos na página individual de cada arquivo. A presença de uma fonte GBIF no lote não é, sozinha, comprovação de ocorrência no recorte do Pantanal.

## Critério de promoção

A Conta 2 deve anexar evidência por espécie para taxonomia, ocorrência, imagem/licença/crédito e conservação oficial quando houver status. Também deve preencher `reviewedAt`, `reviewedBy` e o checklist completo. Até lá, as três espécies permanecem pendentes e não entram como `verified`.

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal "ICMBio — Pantanal"
[2]: https://www.gbif.org/terms "GBIF — Terms of Use"
