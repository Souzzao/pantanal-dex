# MVP — Passo 13/50: auditoria do primeiro lote de anfíbios

**Lote:** `catalog-amphibians-01`  
**Espécies:** Perereca (*Boana albopunctata*) e Perereca-macaco (*Phyllomedusa sauvagii*)  
**Estado:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Método

Foi executada a validação determinística do contrato modular e a verificação passiva das URLs de arquivos, páginas individuais do Wikimedia Commons e endpoints GBIF. Foram conferidos campos obrigatórios, grupo, ambientes, IDs, seis imagens, créditos, licenças, fontes estruturadas e notas de bloqueio. A disponibilidade HTTP indica apenas integridade do endpoint e não substitui a confirmação editorial de taxonomia, ocorrência no Pantanal, licença por arquivo ou conservação.

## Resultado por espécie

| Espécie | Nome científico | Imagens | Licenças registradas | Fonte taxonômica | Resultado |
|---|---|---:|---|---|---|
| Perereca | *Boana albopunctata* | 3/3 acessíveis | CC BY-SA 2.5; CC BY 4.0; CC BY-SA 4.0 | GBIF Species Match | Estruturalmente válida; revisão pendente |
| Perereca-macaco | *Phyllomedusa sauvagii* | 3/3 acessíveis | CC BY-SA 3.0; CC BY-SA 3.0; Public domain | GBIF Species Match | Estruturalmente válida; revisão pendente |

## Integridade dos endpoints

As seis URLs de imagem, seis páginas individuais do Commons e dois endpoints GBIF retornaram **HTTP 200** na verificação passiva. Não foram detectados links quebrados ou hosts fora da lista aprovada.

## Correção de governança

O lote continha uma nota que mencionava uma busca global da IUCN. Essa referência foi removida. A política do PantanalDex proíbe a IUCN Red List API; a ausência de um resultado proibido não deve ser usada como evidência. A nota foi substituída por uma instrução neutra e compatível com a governança: não preencher conservação sem fonte oficial ICMBio/MMA confirmada.

A licença `Public domain` permanece aceita pelo validador comercial existente, mas deve continuar sendo conferida na página do arquivo durante a revisão editorial. Não foram aceitas licenças NC, ND, ausentes ou ambíguas.

## Critérios estruturais

| Critério | Perereca | Perereca-macaco | Lote |
|---|---:|---:|---|
| Campos obrigatórios | Passa | Passa | Passa |
| Grupo e ambientes válidos | Passa | Passa | Passa |
| IDs únicos | Passa | Passa | Passa |
| Três imagens | Passa | Passa | Passa |
| Crédito e licença declarados | 3/3 | 3/3 | Passa |
| Fonte estruturada | GBIF | GBIF | Passa |
| Referência à IUCN | Removida | Não presente | Corrigido |
| `reviewedAt` / `reviewedBy` | Ausentes | Ausentes | Bloqueado |
| Checklist editorial | Incompleto | Incompleto | Bloqueado |
| Ocorrência individual no Pantanal | Não anexada | Não anexada | Bloqueado |
| Conservação oficial individual | Não anexada | Não anexada | Bloqueado |

## Bloqueios editoriais

As frases de distribuição são amplas e não bastam para comprovar ocorrência no recorte do Pantanal. O GBIF Species Match é uma fonte taxonômica declarada, não uma prova suficiente de ocorrência regional ou de situação de conservação. Nenhum status de conservação foi inventado ou preenchido sem fonte oficial.

O lote permanece fora da contagem de espécies verificadas até a revisão formal confirmar nomenclatura, ocorrência regional, páginas de imagem e checklist com `reviewedAt` e `reviewedBy`.

## Testes e validação

Foi adicionado teste determinístico que confirma a composição do lote, seis imagens, páginas Commons, licenças individuais, ausência da referência proibida à IUCN, validade estrutural e bloqueio de promoção. Resultado final: **44 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluíram com sucesso.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Boana%20albopunctata "GBIF Species Match — Boana albopunctata"
[2]: https://api.gbif.org/v1/species/match?name=Phyllomedusa%20sauvagii "GBIF Species Match — Phyllomedusa sauvagii"
[3]: https://commons.wikimedia.org/wiki/File:Hypsiboas_albopunctatus01a.jpg "Boana albopunctata — Wikimedia Commons"
[4]: https://commons.wikimedia.org/wiki/File:Boana_albopunctata_-_Lucas_Mantelo_Cruz_-_353779982.jpeg "Boana albopunctata — Lucas Mantelo Cruz — Wikimedia Commons"
[5]: https://commons.wikimedia.org/wiki/File:Boana_albopunctata_-_karla_daniel_de_faria_-_536102291.jpeg "Boana albopunctata — karla daniel de faria — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Waxy_Monkey_Tree_Frogs_Phyllomedusa_sauvagii.jpg "Phyllomedusa sauvagii — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Waxy_Monkey_Tree_Frogs_Phyllomedusa_sauvagii_1.jpg "Phyllomedusa sauvagii — Wikimedia Commons"
[8]: https://commons.wikimedia.org/wiki/File:Waxy.tree.frog.arp.jpg "Waxy tree frog — Wikimedia Commons"
