# MVP — Passo 10/50: auditoria do segundo lote de répteis

**Lote:** `catalog-reptiles-02`  
**Espécies:** Cágado-cabeçudo (*Acanthochelys macrocephala*), Cobra-d'água (*Helicops infrataeniatus*), Jacaré-do-Pantanal (*Caiman yacare*) e Teiú-vermelho (*Salvator rufescens*)  
**Estado:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Método

Foi executada a validação determinística do contrato modular e uma verificação passiva de todas as URLs de imagens, páginas específicas do Wikimedia Commons e fontes GBIF. Foram conferidos campos obrigatórios, grupo, ambientes, IDs, doze imagens, créditos, licenças comerciais, origem individual dos arquivos e bloqueios do checklist. HTTP 200 foi tratado apenas como integridade de endpoint; não substitui a confirmação editorial da licença, taxonomia, ocorrência pantaneira ou conservação.

## Resultado por espécie

| Espécie | Nome científico | Imagens | Licenças registradas | Fonte taxonômica | Resultado |
|---|---|---:|---|---|---|
| Cágado-cabeçudo | *Acanthochelys macrocephala* | 3/3 acessíveis | CC BY-SA 3.0; CC BY-SA 2.0; CC BY-SA 2.0 | GBIF Species Match | Estruturalmente válido; revisão pendente |
| Cobra-d'água | *Helicops infrataeniatus* | 3/3 acessíveis | CC BY-SA 2.5; CC BY 4.0; CC BY 4.0 | GBIF Species Match | Estruturalmente válido; revisão pendente |
| Jacaré-do-Pantanal | *Caiman yacare* | 3/3 acessíveis | CC BY-SA 4.0 em todas | GBIF Species Match | Estruturalmente válido; revisão pendente |
| Teiú-vermelho | *Salvator rufescens* | 3/3 acessíveis | CC BY-SA 3.0; CC BY 4.0; CC0 | GBIF Species Match | Estruturalmente válido; revisão pendente |

## Falha encontrada e correção aplicada

A inspeção encontrou **nove referências de imagem quebradas** no conjunto anterior: duas do Cágado-cabeçudo, duas da Cobra-d'água, duas do Jacaré-do-Pantanal e três do Teiú-vermelho. As páginas Commons e arquivos inválidos retornavam HTTP 404. Todas as doze imagens do lote foram então substituídas por arquivos existentes retornados pela busca/API do Commons, com URL de arquivo e página individual registrados.

Também havia risco de rastreabilidade: o helper atribuía `CC BY-SA 4.0` genericamente às imagens. O helper agora recebe `license` por arquivo, preservando as licenças reais declaradas nos metadados consultados. Nenhuma licença NC, ND, ausente ou ambígua foi incorporada.

## Evidência operacional de links

Após a correção, as doze URLs de arquivo, doze páginas Commons e quatro endpoints GBIF retornaram **HTTP 200** na verificação passiva executada no passo 11/50. Não foram encontrados hosts fora da lista aprovada.

## Bloqueios editoriais

O lote permanece pendente porque não contém `reviewedAt`, `reviewedBy` nem checklist completo de taxonomia, ocorrência, licenças e conservação. As descrições de distribuição fornecem contexto textual, mas não são prova regional individual anexada ao registro. A presença de um resultado no GBIF Species Match confirma uma correspondência taxonômica declarada, não encerra a confirmação de ocorrência no Pantanal nem fornece automaticamente situação de conservação.

Não foi preenchido status de conservação sem fonte oficial do ICMBio ou MMA. O Jacaré-do-Pantanal tem relação nominal direta com o bioma no nome comum, mas isso não elimina a exigência de evidência editorial de ocorrência. Todas as quatro espécies devem permanecer fora da contagem de lotes verificados até a revisão formal.

## Testes e validação

Foi adicionado teste determinístico que confirma a composição do lote, doze imagens, páginas de origem Commons, licenças individuais, validade do contrato modular e bloqueio de promoção por `isCatalogBatchReviewReady`. Resultado final: **42 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluíram com sucesso.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Acanthochelys%20macrocephala "GBIF Species Match — Acanthochelys macrocephala"
[2]: https://api.gbif.org/v1/species/match?name=Helicops%20infrataeniatus "GBIF Species Match — Helicops infrataeniatus"
[3]: https://api.gbif.org/v1/species/match?name=Caiman%20yacare "GBIF Species Match — Caiman yacare"
[4]: https://api.gbif.org/v1/species/match?name=Salvator%20rufescens "GBIF Species Match — Salvator rufescens"
[5]: https://commons.wikimedia.org/wiki/File:Acanthochelys_macrocephala.jpg "Acanthochelys macrocephala — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Helicops_infrataeniatus01.jpg "Helicops infrataeniatus — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Brillenkaiman_Caiman_yacare.jpg "Caiman yacare — Wikimedia Commons"
[8]: https://commons.wikimedia.org/wiki/File:Red_Tegu_(Salvator_rufescens).jpg "Salvator rufescens — Wikimedia Commons"
