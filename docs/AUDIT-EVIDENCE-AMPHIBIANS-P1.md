
## Evidências taxonômicas e de licenciamento — Passo 11/50

A API GBIF confirmou `Boana albopunctata (Spix, 1824)` como `ACCEPTED`, `rank=SPECIES`, `matchType=EXACT`, confidence 99 e usageKey `10881038`, na família Hylidae e classe Amphibia.

Também confirmou `Phyllomedusa sauvagii Boulenger, 1882` como `ACCEPTED`, `rank=SPECIES`, `matchType=EXACT`, confidence 99 e usageKey `2427978`, na família Phyllomedusidae e classe Amphibia.

As seis páginas individuais do Wikimedia Commons retornaram HTTP 200. A verificação direta dos arquivos no `upload.wikimedia.org` respondeu HTTP 429 (rate limit) nesta rodada, portanto isso foi tratado como limitação transitória do endpoint, não como 404. Os três arquivos originalmente usados para *Phyllomedusa sauvagii* foram substituídos por alternativas cujas páginas individuais confirmam licenças comerciais permitidas: Jutta234 (CC BY-SA 3.0), Ltshears (CC BY-SA 3.0) e Cliff from Arlington, Virginia, USA (CC BY 2.0). O arquivo anteriormente rotulado como Public domain e os arquivos que exibiam GFDL foram removidos do lote.

## Conservação e ocorrência

A Portaria MMA nº 1.704/2026 foi consultada como fonte oficial brasileira, mas nenhuma categoria individual foi registrada para os dois táxons nesta etapa. Não foi preenchido status por inferência. A ocorrência regional deve ser confirmada separadamente, com registros e localidade reproduzíveis, antes de qualquer promoção para `verified`.

## Evidências taxonômicas — Passo 12/50

A API GBIF confirmou *Rhinella schneideri* como `SYNONYM` de *Rhinella diptycha*, com `usageKey=5216849`, `acceptedUsageKey=5216992`, confidence 98 e matchType EXACT. Confirmou *Leptodactylus chaquensis* como `ACCEPTED`, usageKey 5217514, confidence 99 e matchType EXACT. Confirmou *Scinax fuscomarginatus* como `ACCEPTED`, usageKey 5217879, confidence 99 e matchType EXACT. Confirmou *Phyllomedusa azurea* como `SYNONYM` de *Pithecopus azureus*, com `usageKey=2427989`, `acceptedUsageKey=10838752`, confidence 98 e matchType EXACT.

A divergência entre o nome científico armazenado e o nome aceito no GBIF é uma pendência editorial que deve ser corrigida antes da promoção. O lote não deve afirmar que os quatro nomes armazenados são aceitos sem registrar a relação de sinonímia ou migrar para os nomes aceitos com alias histórico preservado.

Fontes consultadas: https://api.gbif.org/v1/species/match?name=Rhinella%20schneideri; https://api.gbif.org/v1/species/match?name=Leptodactylus%20chaquensis; https://api.gbif.org/v1/species/match?name=Scinax%20fuscomarginatus; https://api.gbif.org/v1/species/match?name=Phyllomedusa%20azurea.

## Inventário Commons — Passo 12/50

A categoria `Scinax fuscomarginatus` contém quatro arquivos: os dois já usados no lote e duas figuras de artigos científicos. Como as figuras são material editorial/gráfico e não foram aprovadas como imagem principal de campo nesta etapa, o lote continua com somente duas imagens específicas para esse táxon. A categoria antiga `Phyllomedusa azurea` é uma categoria redirecionada para `Pithecopus azureus` e não contém arquivos; isso confirma a necessidade de tratar o nome aceito e de não buscar ou duplicar arquivos a partir da categoria obsoleta.

Não foi inserida terceira imagem por aproximação taxonômica, gráfico ou fonte não auditada. Essa limitação permanece registrada como bloqueio editorial.
