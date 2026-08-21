# PantanalDex — Licenças, fontes e créditos

## Finalidade

O PantanalDex prevê distribuição comercial e licenciamento de dados e imagens. Nenhuma espécie, fotografia ou fonte deve entrar em um lote aprovado sem uma trilha editorial verificável. A validação automática do catálogo bloqueia imagens sem licença comercial identificável e rejeita licenças com restrições **NC** (uso não comercial) ou **ND** (sem derivados).

## Imagens permitidas

| Licença | Uso no produto | Obrigação de crédito |
|---|---|---|
| CC0 | Permitido | Registrar autor, origem e identificação da licença quando disponíveis |
| Public Domain | Permitido quando a dedicação ao domínio público estiver confirmada | Registrar autor e origem |
| CC BY | Permitido, inclusive comercial e com adaptações | Registrar autor, licença e URL de origem |
| CC BY-SA | Permitido, inclusive comercial e com adaptações compatíveis | Registrar autor, licença e URL de origem; preservar a atribuição e a condição share-alike aplicável |

São proibidas imagens **CC BY-NC**, **CC BY-NC-SA**, **CC BY-NC-ND**, **CC BY-ND**, qualquer licença com restrição comercial ou de derivados, licença ausente, licença ambígua e arquivo cuja página de origem não permita confirmar a licença. A licença deve ser conferida na página específica do arquivo; a licença geral da plataforma não substitui essa conferência.

## Fontes aprovadas

| Fonte | Regra de uso |
|---|---|
| [GBIF](https://www.gbif.org/) | Usar somente registros ou mídias marcados como CC0 ou CC BY; conferir o item específico |
| [SiBBr](https://sibbr.gov.br/) e [ICMBio](https://www.gov.br/icmbio/) | Usar conteúdo compatível com CC BY 4.0 e registrar a página ou documento exato |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Usar somente o arquivo específico com CC0, CC BY ou CC BY-SA; conferir a licença na página do arquivo |
| [Wikidata](https://www.wikidata.org/) | Dados sob CC0; registrar a consulta ou entidade utilizada |
| [Wikipédia em português](https://pt.wikipedia.org/) | Usar apenas paráfrase, com atribuição CC BY-SA, sem copiar texto extensamente |
| [iNaturalist](https://www.inaturalist.org/) | Usar somente fotografias individuais marcadas como CC0 ou CC BY |

A **IUCN Red List API** e demais imagens ou dados com NC/ND estão proibidos neste produto. Referências informativas não aprovadas devem ser substituídas por fonte aprovada ou removidas antes do merge.

## Conservação

`Species.conservationStatus` deve permanecer vazio quando não houver confirmação em fonte oficial. Quando preenchido, `Species.conservationSource` deve apontar para o **Livro Vermelho do ICMBio** ou para uma **Portaria do MMA/ICMBio** em domínio `gov.br`, com título e URL do documento ou página exata. Não usar IUCN, agregadores ou inferência editorial como fonte de status.

## Crédito mínimo por imagem

Cada imagem precisa conter `author`, `license`, `sourceUrl`, `credit` e `uri` HTTP. O crédito exibido deve permitir identificar o autor, a licença e a origem. O registro deve permanecer associado ao arquivo específico, não somente ao domínio da plataforma.

## Critérios de PR

Um PR de catálogo é bloqueado quando houver ID duplicado, espécie sem fonte, imagem sem licença confirmada, licença NC/ND, crédito incompleto, URL insegura, status de conservação sem fonte oficial, ou alteração que remova créditos existentes. O agente responsável deve registrar a pendência em `HANDOFF-3-CONTAS.md`, corrigir a origem e abrir novo PR baseado na `main` atual.

## Revisão e rastreabilidade

Antes de cada lote, a Conta 2 informa a quantidade planejada e a Conta 1 registra a vazão real após validação. O lote piloto do Ciclo 1 deve ser pequeno o suficiente para conferir manualmente todos os arquivos e deve recalibrar o tamanho a partir do Ciclo 3. No Ciclo 20, esta política será acompanhada de uma tabela completa de créditos por espécie, arquivo, autor, licença, URL e data de revisão editorial.

## Auditoria automatizada atual

Além da validação de lotes, o código mantém o relatório `catalogLicenseAudit`, calculado em `shared/catalog/license-audit.ts`. Ele mede por espécie a quantidade de imagens, imagens que passam o padrão comercial, créditos ausentes, URLs inválidas e bloqueios. O relatório é informativo e **não promove automaticamente** lotes `pending-review` para `verified`.

A promoção editorial exige conferência individual das imagens, fontes, nomenclatura, ocorrência no recorte do Pantanal e situação de conservação. Cada lote deve permanecer em `pending-review` até que essa conferência seja registrada no handoff e revisada por outro agente. O relatório operacional distingue `verified`, `pending-review` e `invalid`, mantendo transparência entre volume catalogado e volume editorialmente aprovado.
