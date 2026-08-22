# MVP — Passo 6/50: auditoria do segundo lote P1

**Lote auditado:** `catalog-mammals-02`  
**Espécies:** Veado-campeiro, Morcego-pescador e Ouriço-cacheiro  
**Estado:** `pending-review`  
**Decisão:** não promover neste passo.

## Resultado da auditoria

| Critério | Resultado |
|---|---|
| Estrutura e campos obrigatórios | Validados automaticamente |
| IDs únicos e grupo do lote | Validados automaticamente |
| Três imagens por espécie | Presentes |
| Crédito e licença declarados | Presentes no registro |
| URLs de imagem e fonte | Passam o guardião automático |
| Checklist editorial | Incompleto |
| Revisor e data | Ausentes |
| Ocorrência individual no Pantanal | Não comprovada nesta auditoria |
| Conservação e fonte oficial | Não comprovadas nesta auditoria |

## Resultado por espécie

| Prioridade P1 | Espécie | Imagens | Fontes | Estado |
|---:|---|---:|---:|---|
| 9 | Veado-campeiro | 3 | 1 | bloqueado por evidência editorial |
| 19 | Ouriço-cacheiro | 3 | 1 | bloqueado por evidência editorial |
| — | Morcego-pescador | 3 | 1 | pendente; não está no núcleo P1 atual |

As imagens e fontes declaradas passam somente a validação automática de formato. A promoção exige conferência individual das páginas de origem, ocorrência pantaneira, nomenclatura, conservação oficial quando informada e checklist completo do lote. Portanto, o lote permanece pendente até que a Conta 2 registre as evidências no PR.

## Critério para promoção

Preencher `reviewedAt` com data ISO válida, `reviewedBy` com revisor identificado e o checklist de taxonomia, ocorrência, licenças e conservação. O guardião de promoção deve retornar verdadeiro apenas após todos esses itens e a revisão das três espécies.

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal "ICMBio — Pantanal"
[2]: https://www.gbif.org/terms "GBIF — Terms of Use"
