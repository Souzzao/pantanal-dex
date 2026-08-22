# MVP — Passo 10/50: auditoria do primeiro lote de répteis

**Lote:** `catalog-reptiles-01`  
**Espécies:** Teiú (*Salvator merianae*) e Cobra-cipó (*Oxybelis aeneus*)  
**Estado:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Método

Foi executada a validação determinística do contrato modular e a verificação passiva de todas as URLs declaradas. Foram conferidos campos obrigatórios, grupo, ambientes, IDs, seis imagens, créditos, licenças, páginas de origem Commons, URLs dos arquivos e fontes GBIF. HTTP 200 confirma apenas que o endpoint está acessível; não substitui a revisão do conteúdo, a confirmação de ocorrência no Pantanal nem a conferência editorial da licença em cada página.

## Resultado por espécie

| Espécie | Nome científico | Imagens | Licenças declaradas | Fonte taxonômica | Resultado |
|---|---|---:|---|---|---|
| Teiú | *Salvator merianae* | 3/3 acessíveis | CC BY-SA 4.0 em todas | GBIF Species Match | Estruturalmente válido; revisão pendente |
| Cobra-cipó | *Oxybelis aeneus* | 3/3 acessíveis | CC BY 2.0; CC BY-SA 2.0; CC BY-SA 4.0 | GBIF Species Match | Estruturalmente válido; revisão pendente |

## Integridade dos endpoints

As seis URLs dos arquivos no `upload.wikimedia.org`, as seis páginas específicas do Commons e os dois endpoints GBIF retornaram **HTTP 200** na verificação passiva executada durante este passo. Não foram detectados links quebrados ou hosts fora da lista aprovada.

## Critérios estruturais

| Critério | Teiú | Cobra-cipó | Lote |
|---|---:|---:|---|
| Campos obrigatórios | Passa | Passa | Passa |
| Grupo e ambientes válidos | Passa | Passa | Passa |
| IDs únicos | Passa | Passa | Passa |
| Três imagens | Passa | Passa | Passa |
| Crédito e licença declarados | 3/3 | 3/3 | Passa |
| Fonte estruturada | GBIF | GBIF | Passa |
| `reviewedAt` / `reviewedBy` | Ausentes | Ausentes | Bloqueado |
| Checklist editorial | Incompleto | Incompleto | Bloqueado |
| Ocorrência individual no Pantanal | Não anexada | Não anexada | Bloqueado |
| Conservação oficial individual | Não anexada | Não anexada | Bloqueado |

## Avaliação editorial

Os registros possuem descrições coerentes com os campos do catálogo e fontes taxonômicas estruturadas. As frases de distribuição são amplas e não constituem, isoladamente, evidência regional suficiente. A confirmação de ocorrência deve ser anexada por espécie, preferencialmente com fonte regional apropriada, sem inferência a partir de uma simples correspondência taxonômica do GBIF.

Não foi preenchido status de conservação sem fonte oficial do ICMBio ou MMA. O lote permanece pendente até que um revisor identifique a nomenclatura aceita, confirme a ocorrência no recorte do Pantanal, confira cada página de arquivo e finalize `reviewedAt`, `reviewedBy` e os quatro campos do checklist.

## Imagens e licenças

Os registros já guardam autor, crédito, URL do arquivo e licença por imagem. O Teiú usa três arquivos atribuídos a Thomas Fuhrmann, Giles Laurent e Rafael, todos registrados como `CC BY-SA 4.0`. A Cobra-cipó usa arquivos atribuídos a Brian Gratwicke (`CC BY 2.0`), Tod Baker (`CC BY-SA 2.0`) e Lucas Vogel (`CC BY-SA 4.0`). As licenças declaradas são compatíveis com uso comercial e não incluem NC ou ND; a confirmação final arquivo a arquivo continua sendo responsabilidade da revisão editorial.

## Testes adicionados

Foi adicionado teste determinístico que confirma a composição do lote, seis imagens, páginas específicas do Commons, licenças comerciais individuais, validade do contrato e bloqueio de promoção por `isCatalogBatchReviewReady`. A suíte final passou com **41 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluíram com sucesso.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Salvator%20merianae "GBIF Species Match — Salvator merianae"
[2]: https://api.gbif.org/v1/species/match?name=Oxybelis%20aeneus "GBIF Species Match — Oxybelis aeneus"
[3]: https://commons.wikimedia.org/wiki/File:Argentine_Black-and-white_Tegu_(Salvator_merianae),_Parque_Estadual_Encontro_das_Águas_Thomas-Fuhrmann.jpg "Teiú — Thomas Fuhrmann — Wikimedia Commons"
[4]: https://commons.wikimedia.org/wiki/File:182_Argentine_black_and_white_tegu_in_Encontro_das_Águas_State_Park_Photo_by_Giles_Laurent.jpg "Teiú — Giles Laurent — Wikimedia Commons"
[5]: https://commons.wikimedia.org/wiki/File:Salvator_merianae_-_Rafael_-_470540720.jpeg "Teiú — Rafael — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Oxybelis_aeneus_01.jpg "Cobra-cipó — Brian Gratwicke — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Oxybelis_aeneus.jpg "Cobra-cipó — Tod Baker — Wikimedia Commons"
[8]: https://commons.wikimedia.org/wiki/File:Oxybelis_aeneus_(Costa_Rica).jpg "Cobra-cipó — Lucas Vogel — Wikimedia Commons"
