# MVP — Passo 8/50: auditoria do segundo lote de aves

**Lote auditado:** `catalog-birds-02`  
**Espécies:** Gavião-belo (*Busarellus nigricollis*) e Urubu-rei (*Sarcoramphus papa*)  
**Estado final:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Escopo e método

A auditoria combinou validação determinística do contrato modular com inspeção passiva dos endpoints declarados. Foram conferidos IDs, campos textuais, grupo, ambientes, quantidade de imagens, crédito, licença, URLs HTTP, hosts aprovados, fontes estruturadas e a presença do checklist editorial. As páginas individuais do Wikimedia Commons foram usadas para conferir candidatos reais de arquivo e a licença exibida na página de cada arquivo. A existência de uma URL ou a resposta HTTP não foi tratada como comprovação de ocorrência no Pantanal.

## Achados estruturais

| Critério | Gavião-belo | Urubu-rei | Resultado do lote |
|---|---:|---:|---|
| Campos obrigatórios | Passa | Passa | Passa |
| Grupo e ambientes válidos | Passa | Passa | Passa |
| ID único | Passa | Passa | Passa |
| Imagens declaradas | 3 | 3 | 6 |
| Crédito declarado | 3/3 | 3/3 | Passa |
| Licença comercialmente compatível | 3/3 | 3/3 | Passa |
| Fonte científica estruturada | GBIF | GBIF | Passa estruturalmente |
| Checklist editorial completo | Não | Não | Bloqueado |
| `reviewedAt` e `reviewedBy` | Ausentes | Ausentes | Bloqueado |
| Ocorrência individual no Pantanal | Não anexada | Não anexada | Bloqueado |
| Conservação oficial individual | Não anexada | Não anexada | Bloqueado |

## Falha encontrada e correção aplicada

A inspeção dos dados anteriores encontrou **seis URLs de imagem quebradas**, todas retornando HTTP 404: três do Gavião-belo e três do Urubu-rei. As páginas Commons correspondentes também não existiam para esses nomes de arquivo. O lote foi corrigido com seis arquivos existentes no Commons, mantendo o lote pendente e sem promover automaticamente qualquer registro.

Também foi identificado um problema de rastreabilidade: o helper do lote atribuía `CC BY-SA 4.0` a todas as imagens, independentemente da licença real. O helper agora recebe a licença por arquivo. Os valores registrados foram preservados conforme as páginas consultadas: três arquivos do Gavião-belo em `CC BY-SA 4.0`; e, no Urubu-rei, um arquivo em `CC BY 2.0`, um em `CC BY-SA 3.0` e um em `CC BY 4.0`.[1] [2] [3] [4]

## Arquivos corrigidos

| Espécie | Autor | Licença registrada | Página de origem |
|---|---|---|---|
| Gavião-belo | Charles J. Sharp | CC BY-SA 4.0 | Black-collared hawk adult; immature |
| Gavião-belo | Giles Laurent | CC BY-SA 4.0 | Black-collared hawk at Encontro das Águas |
| Urubu-rei | Geoff Gallice | CC BY 2.0 | Sarcoramphus papa in Ecuador |
| Urubu-rei | Olaf Oliviero Riemer | CC BY-SA 3.0 | Weltvogelpark Walsrode |
| Urubu-rei | Anthony Batista | CC BY 4.0 | Sarcoramphus papa 441774682 |

A tabela é uma síntese operacional dos metadados das páginas consultadas. Os créditos exibidos no aplicativo continuam sendo derivados do autor e da indicação “Wikimedia Commons”.

## Bloqueios editoriais restantes

O lote continua pendente porque ainda não possui revisão editorial por espécie, data e revisor, evidência individual de ocorrência no recorte do Pantanal e fonte oficial de conservação quando um status for informado. As descrições de distribuição existentes — “incluindo o Pantanal” e “com registros no Pantanal” — são declarações de conteúdo e não substituem a citação de uma fonte regional verificável. O GBIF Species Match confirma a identificação taxonômica do nome consultado, mas não encerra a auditoria de ocorrência local nem a auditoria de licença de cada arquivo.

Portanto, **nenhuma das duas espécies deve ser considerada editorialmente verificada** neste passo. O catálogo permanece seguro para uso como conteúdo pendente e o guardião automático continua impedindo a promoção sem checklist.

## Testes adicionados

Foi acrescentado um teste determinístico que confirma a composição do lote, as seis licenças individuais, a validade do contrato modular e o retorno `false` de `isCatalogBatchReviewReady`. A suíte final passou com **39 testes aprovados e 1 teste de autenticação pulado**.

## Referências

[1]: https://commons.wikimedia.org/wiki/File:Black-collared_hawk_(Busarellus_nigricollis)_adult.jpg "Black-collared hawk adult — Wikimedia Commons"
[2]: https://commons.wikimedia.org/wiki/File:A_black-collared_hawk,_Busarellus_nigricollis.jpg "A black-collared hawk — Wikimedia Commons"
[3]: https://commons.wikimedia.org/wiki/File:King_Vulture_(Sarcoramphus_papa)_(7222542704).jpg "King Vulture — Wikimedia Commons"
[4]: https://commons.wikimedia.org/wiki/File:Sarcoramphus_papa_in_flight2.jpg "Sarcoramphus papa in flight — Wikimedia Commons"
[5]: https://api.gbif.org/v1/species/match?name=Busarellus%20nigricollis "GBIF Species Match — Busarellus nigricollis"
[6]: https://api.gbif.org/v1/species/match?name=Sarcoramphus%20papa "GBIF Species Match — Sarcoramphus papa"
