# MVP — Passo 9/50: auditoria do terceiro lote de aves

**Lote:** `catalog-birds-03`  
**Espécies:** Arara-canindé (*Ara ararauna*), Urubu-de-cabeça-preta (*Coragyps atratus*) e Tucano-toco (*Ramphastos toco*)  
**Estado:** `pending-review`  
**Decisão:** não promover para `verified`.

## Método

Foi executada a validação determinística do contrato modular e uma verificação passiva de todos os endpoints declarados. Foram conferidos campos obrigatórios, grupo, ambientes, IDs, nove imagens, créditos, licenças comerciais, páginas de origem Commons, URLs de arquivo e fontes GBIF. A disponibilidade HTTP foi usada apenas como teste de integridade do link; não substitui a revisão taxonômica, de ocorrência ou de conservação.

## Resultado por espécie

| Espécie | Nome científico | Imagens | Licenças registradas | Fonte taxonômica | Situação |
|---|---|---:|---|---|---|
| Arara-canindé | *Ara ararauna* | 3/3 acessíveis | CC BY 2.0; CC BY 3.0; CC BY-SA 3.0 | GBIF Species Match | Estruturalmente válida; revisão pendente |
| Urubu-de-cabeça-preta | *Coragyps atratus* | 3/3 acessíveis | CC BY-SA 3.0; CC BY-SA 3.0; CC BY-SA 3.0 | GBIF Species Match | Estruturalmente válida; revisão pendente |
| Tucano-toco | *Ramphastos toco* | 3/3 acessíveis | CC BY-SA 4.0; CC BY-SA 4.0; CC BY-SA 2.0 | GBIF Species Match | Estruturalmente válida; revisão pendente |

## Falhas encontradas e correção

A auditoria encontrou oito referências de arquivo/página Commons inválidas no conjunto anterior: duas imagens da Arara-canindé, duas do Urubu-de-cabeça-preta e três do Tucano-toco, além da referência restante que não correspondia ao arquivo publicado. As nove imagens do lote foram substituídas por arquivos reais retornados pela API de busca do Commons e suas páginas de origem específicas. Após a correção, todas as URLs do lote — imagens, páginas Commons e endpoints GBIF — retornaram HTTP 200 na verificação executada.

Também havia o mesmo problema de rastreabilidade encontrado no lote anterior: o helper atribuía `CC BY-SA 4.0` genericamente. O helper passou a receber `license` por imagem e os dados foram registrados de acordo com os metadados consultados nas páginas do Commons. Nenhuma licença NC, ND, ausente ou ambígua foi aceita.

## Evidências de origem e crédito

| Espécie | Arquivo/página | Autor registrado | Licença |
|---|---|---|---|
| Arara-canindé | `Ara_ararauna_Luc_Viatour.jpg` | Luc Viatour | CC BY 2.0 |
| Arara-canindé | `Ara_ararauna_(Linnaeus_1758).jpg` | Michael Gäbler | CC BY 3.0 |
| Arara-canindé | `Ara_ararauna_qtl3.jpg` | Quartl | CC BY-SA 3.0 |
| Urubu-de-cabeça-preta | `Coragyps-atratus-002.jpg` | Mdf | CC BY-SA 3.0 |
| Urubu-de-cabeça-preta | `Coragyps-atratus-001.jpg` | Mdf | CC BY-SA 3.0 |
| Urubu-de-cabeça-preta | `Coragyps_atratus_brasiliensis_Black_vulture_Belém_01.jpg` | Cayambe | CC BY-SA 3.0 |
| Tucano-toco | `Toco_toucan_(Ramphastos_toco)_in_flight_composite.jpg` | Charles J. Sharp | CC BY-SA 4.0 |
| Tucano-toco | `Toco_toucan_(Ramphastos_toco)_drinking_composite.jpg` | Charles J. Sharp | CC BY-SA 4.0 |
| Tucano-toco | `Toco_Toucan_(Ramphastos_toco)_-_48153967707.jpg` | Bernard DUPONT | CC BY-SA 2.0 |

## Bloqueios editoriais

As três espécies continuam pendentes porque o lote não contém `reviewedAt`, `reviewedBy` nem checklist completo de taxonomia, ocorrência, licenças e conservação. As frases de distribuição existentes mencionam o Pantanal, mas ainda não estão acompanhadas de evidência regional individual anexada ao registro. O GBIF Species Match é uma fonte taxonômica declarada, não uma prova suficiente de ocorrência local ou de situação de conservação.

Não foi preenchido status de conservação sem fonte oficial ICMBio/MMA. Até a revisão editorial formal, o lote não deve ser contado como verificado nem usado para afirmar que a ocorrência regional foi confirmada.

## Testes e validação

Foi adicionado teste determinístico que confirma a composição do lote, nove imagens, páginas Commons, licenças por arquivo, validade modular e bloqueio de promoção. Resultado final: **40 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluídos com sucesso.

## Referências

[1]: https://commons.wikimedia.org/wiki/File:Ara_ararauna_Luc_Viatour.jpg "Ara ararauna Luc Viatour — Wikimedia Commons"
[2]: https://commons.wikimedia.org/wiki/File:Ara_ararauna_(Linnaeus_1758).jpg "Ara ararauna Linnaeus 1758 — Wikimedia Commons"
[3]: https://commons.wikimedia.org/wiki/File:Ara_ararauna_qtl3.jpg "Ara ararauna qtl3 — Wikimedia Commons"
[4]: https://commons.wikimedia.org/wiki/File:Coragyps-atratus-002.jpg "Coragyps atratus 002 — Wikimedia Commons"
[5]: https://commons.wikimedia.org/wiki/File:Coragyps-atratus-001.jpg "Coragyps atratus 001 — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Coragyps_atratus_brasiliensis_Black_vulture_Belém_01.jpg "Coragyps atratus brasiliensis — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Toco_toucan_(Ramphastos_toco)_in_flight_composite.jpg "Toco toucan in flight — Wikimedia Commons"
[8]: https://commons.wikimedia.org/wiki/File:Toco_toucan_(Ramphastos_toco)_drinking_composite.jpg "Toco toucan drinking — Wikimedia Commons"
[9]: https://commons.wikimedia.org/wiki/File:Toco_Toucan_(Ramphastos_toco)_-_48153967707.jpg "Toco Toucan 48153967707 — Wikimedia Commons"
[10]: https://api.gbif.org/v1/species/match?name=Ara%20ararauna "GBIF Species Match — Ara ararauna"
[11]: https://api.gbif.org/v1/species/match?name=Coragyps%20atratus "GBIF Species Match — Coragyps atratus"
[12]: https://api.gbif.org/v1/species/match?name=Ramphastos%20toco "GBIF Species Match — Ramphastos toco"
