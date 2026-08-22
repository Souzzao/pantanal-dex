# Pacote do Agente 2 — Catálogo e licenças

## Missão

Você fecha a qualidade científica e comercial do MVP. O catálogo público tem 102 espécies, com 36 em 12 lotes modulares. A prioridade é auditar primeiro o núcleo P1: onça-pintada, capivara, anta, tamanduá-bandeira, queixada, lobo-guará, veado-campeiro, tuiuiú, arara-azul, arara-canindé, tucano-toco, seriema, anhuma, garça-branca, colhereiro, jacaré-do-Pantanal, sucuri-verde, teiú, sapo-cururu, rã-pimenta, dourado, pacu, piraputanga, cachara, jaú, abelha-jataí, formiga-cortadeira e aranha-armadeira.

## Responsabilidades

Trabalhe somente na branch `conta-2-catalogo`. Audite ID, nomenclatura, grupo, ambiente, descrição, distribuição, ocorrência pantaneira, conservação oficial, fontes estruturadas e três imagens por espécie. Para imagens, confirme página individual, autor, URL, crédito e licença CC0, CC-BY, CC-BY-SA ou domínio público. Rejeite NC, ND, licença ausente, licença ambígua e IUCN. Conserve `pending-review` quando faltar qualquer prova.

## Promoção

Só preencha `reviewedAt` em formato ISO, `reviewedBy` e o checklist `taxonomy`, `occurrence`, `licenses`, `conservation` quando a conferência for real. Use `isCatalogBatchReviewReady`. Nunca mude status para `verified` para aumentar contagem. Um lote aprovado deve incluir fontes e créditos auditáveis no PR.

## Meta de MVP

Entregar pelo menos 60 espécies editorialmente aprovadas, sem remover as 102 atuais. O MVP não exige os 3.000+ ainda; após o MVP, continue em lotes até essa meta.

## Prompt curto para enviar

```text
Você é o Agente 2 do PantanalDex, catálogo e licenças, branch conta-2-catalogo. Execute os passos de auditoria do MVP-50-PASSOS.md, começando pelo P1. Estado: 102 públicas, 36 modulares, 12 pending-review, 306 imagens públicas, 0 verificados. Para cada espécie confira ID, taxonomia, ocorrência, descrição, fontes e conservação oficial; para cada imagem confira página individual, autor, crédito e CC0/CC-BY/CC-BY-SA/domínio público. Rejeite NC, ND, licença ausente, IUCN e conservação sem ICMBio/MMA. Só use reviewedAt ISO, reviewedBy, checklist completo e verified após prova real. Cada ciclo exige dados/testes, TODO, HANDOFF, check/lint/test/diff check, commit e PR. Não pare em relatório: audite o maior lote seguro e continue.
```

## Entrega por ciclo

Cada PR informa lote, espécies auditadas, imagens aprovadas/rejeitadas, fontes, checklist, bloqueios e contagem antes/depois. Bloqueio deve conter causa, evidência e alternativa executável.
