# Passo 35/50 — validação oficial de conservação do jaú

## Alvo

A sequência de validação normativa segue para o jaú, `Zungaro jahu`, incorporado no passo 30.

## Fontes oficiais localizadas

A busca oficial localizou materiais do ICMBio que citam `Zungaro jahu` em relação à lista nacional de espécies ameaçadas e aos Planos de Ação Nacional. A confirmação final da categoria exigirá extração textual do documento oficial ou consulta direta à ficha SALVE, distinguindo `Zungaro jahu` do táxon amazônico `Zungaro zungaro`.

A espécie não será promovida com base em snippets ou em menções secundárias: é necessário localizar a correspondência taxonômica exata, a categoria e o escopo geográfico/normativo no documento oficial.

Fonte inicial: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-alto-parana/1-ciclo/2026-pan-alto-parana-areas-estrategicas.pdf "ICMBio — Áreas estratégicas do PAN Alto Paraná"


## Limite da evidência e decisão conservadora

A publicação oficial do ICMBio sobre peixes ameaçados no Parque Nacional do Iguaçu menciona um nome grafado como `Zungaru jahu` entre espécies Vulneráveis, mas essa grafia não é uma correspondência taxonômica exata e o artigo não substitui a ficha normativa individual. O PDF da Portaria MMA nº 148/2022 foi extraído e pesquisado por `Zungaro jahu`, `Zungaro zungaro` e variações de `jahu`; não foi localizada uma linha exata para o táxon-alvo. Assim, o passo 35 adotará o finding `not-listed` limitado à Portaria MMA nº 148/2022, sem converter a ausência em LC e sem promover NT/VU com base em grafia divergente ou snippet.

Fonte adicional consultada: [2]

[2]: https://revistaeletronica.icmbio.gov.br/BioBR/article/view/565 "ICMBio — Espécies de peixes ameaçadas de extinção no Parque Nacional do Iguaçu"


---

# Registro V3 do passo 35/60 — validação regional e normativa do Lote 02

## Conservação normativa

A Portaria MMA nº 148/2022 foi baixada da fonte oficial e extraída com `pdftotext`. Os 15 nomes científicos foram pesquisados por correspondência literal. *Brycon orbignyanus* apareceu na linha normativa consultada com categoria **CR — Criticamente em Perigo**. Os outros 14 candidatos não tiveram correspondência exata na Portaria e foram registrados no ledger como `not-listed`, sem conversão para LC ou qualquer outra categoria.

Esse resultado é limitado à lista oficial consultada. `not-listed` significa apenas que não foi encontrada correspondência exata na Portaria pesquisada; não equivale a uma avaliação de baixo risco. O ledger passou de 23 para 38 registros, todos com fonte HTTPS, regra de decisão e evidência textual.

## Ocorrência regional

A consulta GBIF utilizou o retângulo operacional `decimalLatitude=-22,-15` e `decimalLongitude=-61,-54`. Quatorze candidatos retornaram pelo menos uma ocorrência nesse recorte; *Podocnemis unifilis* retornou zero. A contagem foi tratada somente como triagem de localização e não como prova narrativa final de ocorrência no Pantanal.

As fontes abertas consultadas confirmam o contexto faunístico do Pantanal e, no caso de *Hydrodynastes gigas*, a revisão de biodiversidade cita explicitamente a espécie entre as serpentes da região. A lista anotada de répteis em paisagens de Cerrado e Pantanal é uma fonte regional adicional, distribuída sob CC BY 4.0. Como a evidência individualizada ainda não foi consolidada para os 15 candidatos, nenhum novo registro foi promovido no ledger de ocorrência regional neste passo.

A contagem zero de *Podocnemis unifilis* não foi interpretada como ausência. O táxon permanece pendente de confirmação regional direta, assim como os demais candidatos permanecem sujeitos a fonte individualizada antes de eventual promoção.

## Mídia e licenciamento

Nenhuma imagem foi inserida ou aprovada no passo 35. A auditoria comercial de três imagens por espécie permanece separada e obrigatória; falhas de acesso ao Wikimedia Commons não foram tratadas como evidência de licença.

## Validação

| Verificação | Resultado |
|---|---|
| TypeScript (`pnpm check`) | PASS |
| Lint (`pnpm lint`) | PASS; permanece aviso preexistente de módulo do ESLint |
| Testes (`pnpm test`) | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 38 registros, 0 pendências |
| Auditoria regional | PASS; 7 registros existentes, 0 pendências no ledger atual |
| `git diff --check` | PASS |

## Conclusão

O passo 35/60 está concluído como validação normativa e triagem regional conservadora do Lote 02. A única categoria normativa promovida foi CR para *Brycon orbignyanus*, com correspondência exata. Os outros 14 táxons foram marcados `not-listed` na Portaria consultada, e nenhuma ocorrência regional ou licença foi promovida sem evidência individual direta.

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022"
[2]: https://api.gbif.org/v1/species/match "GBIF Species Match API"
[3]: https://api.gbif.org/v1/occurrence/search "GBIF Occurrence Search API"
[4]: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal "ICMBio — Pantanal"
[5]: https://www.scielo.br/j/bjb/a/cTbDFzkGmpNjD4RKnsxfTwn/?lang=en "Alho — Biodiversity of the Pantanal"
[6]: https://checklist.pensoft.net/article/26813/ "Fischer et al. — Roadkill records of reptiles and birds in Cerrado and Pantanal landscapes"
