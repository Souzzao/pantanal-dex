# Relatório de Auditoria Editorial — Passo 12/50

## Lote Auditado
- **ID:** `catalog-amphibians-02`
- **Grupo:** Anfíbios
- **Espécies:** Sapo-cururu (*Rhinella diptycha*), Rã-pimenta (*Leptodactylus chaquensis*), Perereca-de-margem-escura (*Scinax fuscomarginatus*), Perereca-de-folhagem-azul (*Pithecopus azureus*).

## Evidências Verificadas

### 1. Taxonomia (GBIF)
A API GBIF revelou que dois táxons do lote eram armazenados como sinônimos e foram migrados para os nomes aceitos:
- *Rhinella schneideri* → **`Rhinella diptycha`** (UsageKey 5216992, 98% confiança).
- *Phyllomedusa azurea* → **`Pithecopus azureus`** (UsageKey 10838752, 98% confiança).
- *Leptodactylus chaquensis* (UsageKey 5217514, 99% confiança) e *Scinax fuscomarginatus* (UsageKey 5217879, 99% confiança) foram confirmados como nomes aceitos.

### 2. Ocorrência e Conservação
- A **Portaria MMA nº 1.704/2026** foi consultada e nenhum dos táxons possui categoria de ameaça nacional.
- O lote permanece `pending-review` aguardando evidência regional reproduzível para o Pantanal.

### 3. Imagens e Licenciamento (Wikimedia Commons)
- 10/10 URLs de imagem e páginas individuais retornaram HTTP 200.
- **Bloqueio Mantido:** *Scinax fuscomarginatus* e *Pithecopus azureus* continuam com apenas 2 imagens cada. A pesquisa nas categorias Commons confirmou a ausência de uma terceira imagem de campo com licença comercial auditada; figuras gráficas de artigos científicos foram rejeitadas.

## Bloqueios e Pendências
O lote permanece no estado **`pending-review`** devido a:
1. Lacunas de imagens (3ª imagem ausente para dois táxons).
2. Necessidade de revisão editorial formal e metadados de auditoria.
3. Comprovação individual de ocorrência pantaneira.

## Validação Técnica
- `pnpm check`: Aprovado
- `pnpm lint`: Aprovado
- `pnpm test`: 49 aprovados, 1 pulado.
- `git diff --check`: Limpo.
