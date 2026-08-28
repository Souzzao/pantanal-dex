# Passo 45/50 — validação oficial de conservação do bem-te-vi

## Alvo

A sequência P2 segue para o bem-te-vi, `Pitangus sulphuratus`, registro prioritário do catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Pitangus sulphuratus`, `sulphuratus` e `Pitangus`. Não foi localizada correspondência exata para o táxon no texto extraído. Registros gerais de aves ou outros táxons não foram usados para inferir categoria.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Passo 45/60 — ingestão do Lote 02 confirmado

## Objetivo

Integrar ao catálogo modular os oito peixes e quatro répteis do Lote 02 que possuem confirmação regional no Pantanal ou em fonte diretamente vinculada ao recorte validado, mantendo taxonomia GBIF, conservação normativa e política comercial de imagens.

## Espécies ingeridas

Foram integrados 12 registros: *Serrasalmus maculatus*, *Serrasalmus marginatus*, *Gymnotus inaequilabiatus*, *Eigenmannia virescens*, *Rhamdia quelen*, *Synbranchus marmoratus*, *Hemisorubim platyrhynchos*, *Loricariichthys platymetopon*, *Paleosuchus palpebrosus*, *Micrablepharus maximiliani*, *Phrynops geoffroanus* e *Hydrodynastes gigas*.

Os nomes científicos seguem as correspondências aceitas no GBIF registradas nos próprios lotes. A ocorrência regional foi previamente classificada como confirmada no ledger regional com inventários do Parque Nacional do Pantanal Matogrossense, guia oficial do IMASUL e revisão regional de répteis do Mato Grosso do Sul.

## Mídia e licenciamento

Cada espécie recebeu exatamente três referências de imagem de páginas individuais do Wikimedia Commons. Foram usadas somente licenças Public domain, CC BY e CC BY-SA, todas compatíveis com uso comercial quando respeitadas as atribuições e, no caso de ShareAlike, a obrigação de compartilhamento pela mesma licença. Nenhuma licença NC ou ND foi aceita.

| Grupo | Espécies | Imagens |
|---|---:|---:|
| Peixes | 8 | 24 |
| Répteis | 4 | 12 |
| Total | 12 | 36 |

Os metadados de autores, páginas e arquivos foram registrados nas propriedades `author`, `license`, `sourceUrl` e `credit` dos registros. As referências visuais não foram usadas para substituir evidência regional narrativa.

## Conservação

O ledger normativo já registrava os 15 candidatos do Lote 02. *Brycon orbignyanus* permanece CR na Portaria MMA nº 148/2022; os 14 demais táxons do conjunto foram classificados como `not-listed` na consulta literal, sem inferência de LC. A inclusão modular dos 12 confirmados não alterou essas decisões.

## Implementação

O arquivo `shared/catalog/batches/fish-reptiles-03.ts` mantém os 12 registros em uma fonte tipada e os expõe como dois lotes compatíveis com o contrato: `catalog-fish-03` para os oito peixes e `catalog-reptiles-02` para os quatro répteis. Ambos foram integrados ao índice em `shared/catalog/index.ts` com status `verified`.

As métricas subiram de 64 para 76 espécies modulares, de 27 para 29 lotes, de 192 para 228 imagens e de 84 para 96 registros científicos totais.

## Validação

Passaram `pnpm check`, `pnpm lint`, `pnpm test` — 20 aprovados e 1 teste legado ignorado —, `pnpm catalog:priority-audit`, `pnpm catalog:source-audit`, `pnpm catalog:conservation-audit`, `pnpm catalog:regional-occurrence-audit` e `git diff --check`.

Resultados das auditorias: 41 prioridades cobertas sem pendências; 29 lotes, 76 espécies, 82 fontes estruturadas e 152 URLs GBIF; 38 registros de conservação sem pendências; 31 registros regionais sem `pending-review`, com 23 confirmados e 8 `not-confirmed`.

## Referências

As páginas individuais do Commons estão registradas em cada imagem no arquivo `shared/catalog/batches/fish-reptiles-03.ts`. As fontes taxonômicas estruturadas são os endpoints GBIF Species Match correspondentes a cada nome aceito. As fontes regionais e normativas estão documentadas nos dossiês dos passos 35–39 e nos ledgers `shared/catalog/regional-occurrence.ts` e `shared/catalog/conservation.ts`.
