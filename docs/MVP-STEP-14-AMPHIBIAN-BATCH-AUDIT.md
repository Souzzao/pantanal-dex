# MVP — Passo 14/50: auditoria do segundo lote de anfíbios

**Lote:** `catalog-amphibians-02`  
**Espécies:** Sapo-cururu (*Rhinella schneideri*), Rã-pimenta (*Leptodactylus chaquensis*), Perereca-de-margem-escura (*Scinax fuscomarginatus*) e Perereca-de-folhagem-azul (*Phyllomedusa azurea*)  
**Estado:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Método

Foi executada a validação do contrato modular e uma verificação passiva das URLs de arquivos, páginas individuais do Wikimedia Commons e fontes GBIF. A inspeção inicial encontrou referências Commons inexistentes e arquivos 404. A API de busca do Commons foi consultada para obter arquivos existentes, autores e licenças. Resultados de espécies diferentes não foram reutilizados.

## Resultado por espécie

| Espécie | Nome científico | Imagens válidas após correção | Licenças registradas | Situação |
|---|---|---:|---|---|
| Sapo-cururu | *Rhinella schneideri* | 3/3 | CC BY-SA 2.5; CC BY 4.0; CC BY 4.0 | Estruturalmente válido; revisão pendente |
| Rã-pimenta | *Leptodactylus chaquensis* | 3/3 | CC BY-SA 2.5; CC BY-SA 2.5; CC0 | Estruturalmente válido; revisão pendente |
| Perereca-de-margem-escura | *Scinax fuscomarginatus* | 2/3 | CC BY-SA 2.5; CC BY-SA 2.5 | Bloqueada por falta de terceira imagem específica |
| Perereca-de-folhagem-azul | *Phyllomedusa azurea* | 2/3 | CC BY-SA 2.5; CC BY-SA 2.5 | Bloqueada por falta de terceira imagem específica |

## Falhas encontradas e correções

A inspeção inicial encontrou referências quebradas para todas as espécies: `Schneider's_toad.jpg`, `Rhinella_schneideri_field.jpg`, `Chaqui_frog.jpg`, `Leptodactylus_chaquensis_wetland.jpg`, `Scinax_fuscomarginatus.jpg`, `Scinax_frog_leaf.jpg`, `Scinax_fuscomarginatus_call.jpg`, `Phyllomedusa_azurea_leaf.jpg` e `Phyllomedusa_azurea_green.jpg` retornaram HTTP 404; uma das URLs de arquivo respondeu 429 temporariamente. Os arquivos foram substituídos somente quando havia correspondência específica verificável.

Para *Rhinella schneideri*, foram usados `Bufo schneideri.jpg`, `Cururu (Rhinella schneideri), Uruguay, 2015.jpg` e `Cururú, (Rhinella schneideri), Uruguay, 2019.jpg`. Para *Leptodactylus chaquensis*, foram usados `Leptodactylus chaquensis.jpg`, `Leptodactylus chaquensis06.jpg` e `Leptodactylus chaquensis 08.jpg`. Para as outras duas espécies, somente duas imagens específicas foram encontradas de forma segura; não foram usados arquivos de espécies próximas, figuras sem identificação individual nem duplicações. As lacunas ficaram explícitas no `pendingNotes`.

O helper do lote também foi corrigido para receber a licença por imagem. O lote agora preserva `CC BY-SA 2.5`, `CC BY 4.0` e `CC0` conforme cada arquivo. Nenhuma licença NC, ND, ausente ou incompatível foi aceita.

## Correção de robustez do carregamento

A validação global continuava impedindo o carregamento do aplicativo quando um lote `pending-review` tinha uma lacuna editorial real. Isso fazia o catálogo lançar erro fatal e podia produzir tela branca, apesar de a pendência já estar documentada. O índice foi ajustado para manter `catalogValidationErrors` e o relatório operacional, mas tornar fatais somente erros de lotes `verified` e IDs duplicados. Assim, lotes pendentes podem ser exibidos e auditados; a promoção continua bloqueada por erros estruturais ou checklist incompleto.

## Bloqueios editoriais

O lote permanece pendente porque não possui checklist editorial completo, `reviewedAt` e `reviewedBy`. Além disso, *Scinax fuscomarginatus* e *Phyllomedusa azurea* ainda não têm três imagens específicas licenciadas e verificáveis. A descrição de distribuição não substitui evidência individual de ocorrência no Pantanal, e nenhuma situação de conservação foi preenchida sem fonte oficial ICMBio/MMA.

## Testes e validação

Foram adicionados testes determinísticos para a composição do lote, licenças individuais, URLs de origem e bloqueio das duas espécies com apenas duas imagens. Também foi atualizado o teste de throughput para registrar um lote inválido operacionalmente sem derrubar o carregador. Resultado final: **45 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluíram com sucesso.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Rhinella%20schneideri "GBIF Species Match — Rhinella schneideri"
[2]: https://api.gbif.org/v1/species/match?name=Leptodactylus%20chaquensis "GBIF Species Match — Leptodactylus chaquensis"
[3]: https://api.gbif.org/v1/species/match?name=Scinax%20fuscomarginatus "GBIF Species Match — Scinax fuscomarginatus"
[4]: https://api.gbif.org/v1/species/match?name=Phyllomedusa%20azurea "GBIF Species Match — Phyllomedusa azurea"
[5]: https://commons.wikimedia.org/wiki/File:Bufo_schneideri.jpg "Bufo schneideri — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Leptodactylus_chaquensis.jpg "Leptodactylus chaquensis — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Scinax_fuscomarginatus01.jpg "Scinax fuscomarginatus — Wikimedia Commons"
[8]: https://commons.wikimedia.org/wiki/File:Phyllomedusa_azurea.jpg "Phyllomedusa azurea — Wikimedia Commons"
