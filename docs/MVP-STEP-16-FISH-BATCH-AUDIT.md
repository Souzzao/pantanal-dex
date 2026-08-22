# MVP — Passo 16/50: auditoria do segundo lote de peixes

**Lote:** `catalog-fish-02`  
**Espécies:** Jaú (*Zungaro jahu*), Peixe-cachorro (*Acestrorhynchus pantaneiro*) e Pacupeva (*Myloplus tiete*)  
**Estado:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Método

Foi executada a validação do contrato modular e a verificação passiva das URLs de imagens, páginas individuais do Wikimedia Commons e endpoints GBIF. A maior parte das referências originais do lote retornou 404. A API de busca do Commons foi consultada para localizar arquivos reais, com autores e licenças individuais. Resultados sem identificação específica, gráficos, PDFs, espécies próximas e duplicações não foram usados para preencher artificialmente o mínimo de imagens.

## Resultado por espécie

| Espécie | Nome científico | Imagens específicas confirmadas | Licenças | Situação |
|---|---|---:|---|---|
| Jaú | *Zungaro jahu* | 0/3 | — | Bloqueado; nenhum arquivo específico seguro localizado |
| Peixe-cachorro | *Acestrorhynchus pantaneiro* | 3/3 | CC0, CC BY 4.0, CC0 | Estruturalmente válido; revisão pendente |
| Pacupeva | *Myloplus tiete* | 1/3 | CC BY 4.0 | Bloqueado; duas imagens específicas ainda ausentes |

## Falhas encontradas e correções

As referências originais de Jaú e Peixe-cachorro retornaram 404; algumas URLs de upload também responderam 429 temporariamente. Para *Zungaro jahu*, a busca encontrou uma imagem de *Zungaro zungaro* e um PDF histórico, mas nenhum arquivo fotográfico específico de *Zungaro jahu*. Ambos foram rejeitados e o lote ficou com zero imagens para o Jaú.

Para *Acestrorhynchus pantaneiro*, foram confirmados `Acestrorhynchus pantaneiro 313835282.jpg`, de demianlescano, CC0; `333993221.jpg`, de Luciano Massa, CC BY 4.0; e `351129961.jpg`, de Sebastián Lovera, CC0. Para *Myloplus tiete*, foi confirmado `Myloplus tiete.jpg`, de Douglas Lopes, CC BY 4.0. Outros resultados eram pranchas, inventários ou arquivos que não garantiam uma fotografia específica da espécie; foram rejeitados.

O helper do lote foi corrigido para receber licença e crédito individual. Nenhum arquivo NC, ND, sem licença confirmada ou associado à IUCN foi incorporado.

## Bloqueios editoriais

O lote continua pendente por ausência de checklist editorial completo, `reviewedAt` e `reviewedBy`, além da falta de comprovação individual de ocorrência no recorte do Pantanal. O Jaú precisa de três imagens específicas licenciadas; a Pacupeva precisa de duas. A descrição de distribuição por bacia não substitui evidência editorial regional. Conservação permanece sem preenchimento quando não há fonte oficial ICMBio/MMA registrada.

## Robustez do catálogo

Os erros estruturais dos lotes pendentes permanecem disponíveis no relatório operacional, mas não impedem a inicialização do app. A promoção para `verified` continua bloqueada até que todas as imagens, fontes, ocorrência e checklist sejam aprovadas. IDs duplicados e lotes verificados inválidos continuam sendo erros fatais.

## Testes e validação

Foi adicionado teste determinístico para as três espécies, quatro imagens específicas confirmadas, licenças individuais, URLs Commons e bloqueio de Jaú e Pacupeva sem invenção de dados. As expectativas do relatório foram atualizadas para três lotes inválidos estruturais no catálogo atual. Resultado final: **47 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluíram com sucesso.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Zungaro%20jahu "GBIF Species Match — Zungaro jahu"
[2]: https://api.gbif.org/v1/species/match?name=Acestrorhynchus%20pantaneiro "GBIF Species Match — Acestrorhynchus pantaneiro"
[3]: https://api.gbif.org/v1/species/match?name=Myloplus%20tiete "GBIF Species Match — Myloplus tiete"
[4]: https://commons.wikimedia.org/wiki/File:Acestrorhynchus_pantaneiro_313835282.jpg "Acestrorhynchus pantaneiro — demianlescano — Wikimedia Commons"
[5]: https://commons.wikimedia.org/wiki/File:Acestrorhynchus_pantaneiro_333993221.jpg "Acestrorhynchus pantaneiro — Luciano Massa — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Acestrorhynchus_pantaneiro_351129961.jpg "Acestrorhynchus pantaneiro — Sebastián Lovera — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Myloplus_tiete.jpg "Myloplus tiete — Douglas Lopes — Wikimedia Commons"
