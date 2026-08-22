# MVP — Passo 5/50: auditoria inicial do lote de mamíferos

**Lote auditado:** `catalog-mammals-01`  
**Espécies:** Lobo-guará, Queixada e Cateto  
**Estado após auditoria:** `pending-review`  
**Decisão:** não promover neste passo.

## Evidências verificadas automaticamente

| Critério | Resultado |
|---|---|
| IDs e campos obrigatórios | Passam a validação estrutural |
| Três imagens por espécie | Presentes |
| Crédito e licença declarados | Presentes no registro |
| URL HTTP de imagem e fonte | Passam o guardião automático |
| Domínio de fonte permitido | Passa a lista de hosts aprovada |
| Checklist editorial do lote | Incompleto |
| Data e revisor | Não registrados |
| Ocorrência pantaneira individual | Não comprovada nesta auditoria |
| Situação de conservação e fonte oficial | Não comprovada nesta auditoria |

## Resultado por espécie

| Prioridade P1 | Espécie | Imagens | Fontes | Bloqueio atual |
|---:|---|---:|---:|---|
| 6 | Lobo-guará | 3 | 1 | checklist do lote, ocorrência e conservação individual |
| 7 | Queixada | 3 | 1 | checklist do lote, ocorrência e conservação individual |
| 8 | Cateto | 3 | 1 | checklist do lote, ocorrência e conservação individual |

A validação automática confirma apenas a forma e os padrões mínimos do registro. Ela não substitui a conferência da licença na página de cada arquivo, a confirmação de ocorrência no Pantanal ou uma fonte oficial de conservação. Enquanto essas evidências não estiverem anexadas ao PR, as três espécies permanecem pendentes.

## Evidência necessária para promoção

A Conta 2 deve anexar no PR a fonte taxonômica e de ocorrência para cada espécie, o registro individual de licença e crédito das três imagens, a fonte oficial de conservação quando houver status e a data/revisor do checklist. Depois disso, o guardião `isCatalogBatchReviewReady` poderá avaliar a promoção sem alteração manual de código.

## Referências de política

[1]: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal "ICMBio — Pantanal"
[2]: https://www.gbif.org/terms "GBIF — Terms of Use"
