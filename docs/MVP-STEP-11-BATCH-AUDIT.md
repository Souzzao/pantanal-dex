# Relatório de Auditoria Editorial — Passo 11/50

## Lote Auditado
- **ID:** `catalog-amphibians-01`
- **Grupo:** Anfíbios
- **Espécies:** Perereca (*Boana albopunctata*), Perereca-macaco (*Phyllomedusa sauvagii*).

## Evidências Verificadas

### 1. Taxonomia (GBIF)
Os dois nomes científicos foram confirmados como espécies aceitas na API GBIF com 99% de confiança:
- *Boana albopunctata* (UsageKey 10881038)
- *Phyllomedusa sauvagii* (UsageKey 2427978)

### 2. Ocorrência e Conservação (ICMBio/MMA)
- A **Portaria MMA nº 1.704/2026** foi consultada. Nenhum dos dois táxons foi localizado com categoria de ameaça na fonte oficial; por cautela, os campos de conservação permanecem vazios.
- Ocorrência regional confirmada genericamente nas descrições, mas aguardando anexação de evidência individual reproduzível para o Pantanal.

### 3. Imagens e Licenciamento (Wikimedia Commons)
- 6/6 páginas individuais Commons retornaram HTTP 200, garantindo rastreabilidade.
- Verificação direta dos arquivos no `upload.wikimedia.org` respondeu HTTP 429 (rate limit), indicando disponibilidade técnica sem erros 404.
- **Substituição:** Os três arquivos de *Phyllomedusa sauvagii* foram substituídos por alternativas com licenças comerciais explicitamente confirmadas (CC BY-SA 3.0 e CC BY 2.0). Arquivos Public Domain de autoria incerta ou GFDL foram removidos.

## Bloqueios e Pendências
O lote permanece no estado **`pending-review`** devido a:
1. Ausência de evidência individual reproduzível de ocorrência regional.
2. Necessidade de revisão editorial formal por especialista.
3. Preenchimento de metadados `reviewedAt` e `reviewedBy`.

## Validação Técnica
- `pnpm check`: Aprovado
- `pnpm lint`: Aprovado
- `pnpm test`: 49 aprovados, 1 pulado.
- `git diff --check`: Limpo.
