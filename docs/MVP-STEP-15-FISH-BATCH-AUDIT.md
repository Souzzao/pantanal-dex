# MVP — Passo 15/50: auditoria do primeiro lote de peixes

**Lote:** `catalog-fish-01`  
**Espécies:** Dourado (*Salminus brasiliensis*), Pacu (*Piaractus mesopotamicus*), Piraputanga (*Brycon hilarii*) e Cachara (*Pseudoplatystoma reticulatum*)  
**Estado:** `pending-review`  
**Decisão:** lote não promovido para `verified`.

## Método

Foi executada a validação do contrato modular e a verificação passiva das URLs de imagens, páginas individuais do Wikimedia Commons e endpoints GBIF. A inspeção inicial encontrou referências Commons 404 e metadados de licença genéricos. A API do Commons foi consultada para recuperar arquivos existentes, autores e licenças individuais. Não foram usados gráficos de distribuição, espécies próximas ou imagens sem identificação específica para completar artificialmente a quantidade exigida.

## Resultado por espécie

| Espécie | Nome científico | Imagens válidas | Licenças | Situação |
|---|---|---:|---|---|
| Dourado | *Salminus brasiliensis* | 3/3 | CC0, CC0, CC0 | Estruturalmente válido; revisão pendente |
| Pacu | *Piaractus mesopotamicus* | 3/3 | CC BY 2.0, CC BY 4.0, CC BY 4.0 | Estruturalmente válido; revisão pendente |
| Piraputanga | *Brycon hilarii* | 3/3 | CC BY-SA 2.0, CC BY-SA 4.0, CC BY 4.0 | Estruturalmente válido; revisão pendente |
| Cachara | *Pseudoplatystoma reticulatum* | 1/3 | CC BY-SA 3.0 | Bloqueada por falta de imagens específicas |

## Falhas encontradas e correções

A verificação inicial encontrou URLs 404 para a maior parte dos arquivos declarados. Foram substituídas as referências do Dourado por arquivos reais `Salminus brasiliensis 102879277.jpg`, `102879283.jpg` e `61505781.jpg`, com autores Diego Carús e Walter S. Prado. O Pacu recebeu arquivos de Dick Culbert, Nicolas Olejnik e R Vasconcellos. A Piraputanga recebeu arquivos de David Morimoto, BRASIL AQUA e Nicola Crockford.

Para a Cachara, somente `Pseudoplatystoma reticulatum.JPG`, de CHUCAO, com CC BY-SA 3.0, foi confirmada como imagem específica. Outros resultados eram gráficos, espécies diferentes ou arquivos sem correspondência segura; foram rejeitados. A lacuna de duas imagens permanece explícita no lote.

O helper do lote foi corrigido para receber a licença individual, substituindo a atribuição genérica de CC BY-SA 4.0. O código agora preserva a licença declarada por arquivo e seus créditos correspondentes.

## Correção de robustez

Como a Cachara ficou com acervo incompleto, a validação global passou a reportar o lote como inválido operacionalmente, mas não derruba o aplicativo quando o lote está em `pending-review`. Erros permanecem visíveis para a fila editorial; somente lotes `verified` com erro e IDs duplicados geram falha fatal de release.

## Bloqueios editoriais

O lote não tem checklist editorial completo, `reviewedAt` ou `reviewedBy`. A ocorrência descrita em escala de bacia não substitui comprovação individual no recorte do Pantanal. Nenhuma situação de conservação foi preenchida sem fonte oficial ICMBio/MMA. A Cachara também precisa de duas imagens específicas adicionais com licença e crédito conferidos.

## Testes e validação

Foi adicionado teste determinístico para a composição do lote, dez imagens válidas, licenças individuais, URLs Commons e bloqueio da Cachara sem inventar imagens. Foram atualizadas as expectativas do relatório para reconhecer dois lotes inválidos com erros documentados, sem impedir a inicialização do app. Resultado final: **46 testes aprovados e 1 teste de autenticação pulado**; `pnpm check`, `pnpm lint`, `git diff --check` e `pnpm watchdog` concluíram com sucesso.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Salminus%20brasiliensis "GBIF Species Match — Salminus brasiliensis"
[2]: https://api.gbif.org/v1/species/match?name=Piaractus%20mesopotamicus "GBIF Species Match — Piaractus mesopotamicus"
[3]: https://api.gbif.org/v1/species/match?name=Brycon%20hilarii "GBIF Species Match — Brycon hilarii"
[4]: https://api.gbif.org/v1/species/match?name=Pseudoplatystoma%20reticulatum "GBIF Species Match — Pseudoplatystoma reticulatum"
[5]: https://commons.wikimedia.org/wiki/File:Salminus_brasiliensis_102879277.jpg "Salminus brasiliensis — Diego Carús — Wikimedia Commons"
[6]: https://commons.wikimedia.org/wiki/File:Piaractus_mesopotamicus_-_Flickr_-_Dick_Culbert.jpg "Piaractus mesopotamicus — Dick Culbert — Wikimedia Commons"
[7]: https://commons.wikimedia.org/wiki/File:Brycon_hilarii_-_Piraputanga_no_Monumento_Natural_do_Rio_Formoso.jpg "Brycon hilarii — BRASIL AQUA — Wikimedia Commons"
[8]: https://commons.wikimedia.org/wiki/File:Pseudoplatystoma_reticulatum.JPG "Pseudoplatystoma reticulatum — CHUCAO — Wikimedia Commons"
