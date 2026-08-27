# Passo 34/50 — validação oficial de conservação do tucano-toco

## Alvo

O próximo registro recém-validado na sequência é o tucano-toco, `Ramphastos toco`, incorporado no passo 29.

## Evidência oficial

A ficha oficial do ICMBio/SALVE avalia diretamente *Ramphastos toco* Statius Muller, 1776, sem restringir a avaliação a uma subespécie. A categoria atribuída é **Menos Preocupante (LC)**, com data da categoria em 05/10/2018. A justificativa informa ocorrência nas Guianas, Peru, Bolívia, Paraguai, Argentina e Brasil, ampla distribuição e ausência de expectativa de que o tráfico ilegal, isoladamente, leve a espécie aos limiares de risco no futuro próximo.

A correspondência taxonômica é exata entre o registro do catálogo e a ficha oficial; portanto, a categoria pode ser promovida no ledger sem a ressalva subespecífica usada no passo 32 para o veado-campeiro.

Fonte: [1]

## Referências

[1]: https://salve.icmbio.gov.br/salve/api/pdf/doi/382b574f73347872452b77383535307574712f6f314e7937426a35584f6d755a4c3167726c7354686d64733d "ICMBio/SALVE — Avaliação do risco de extinção de Ramphastos toco"


---

# Registro V3 do passo 34/60 — triagem do Lote 02

## Escopo

Foi preparado o Lote 02 V3 com 15 candidatos novos, composto por 10 peixes e 5 répteis. A triagem foi feita antes de qualquer ingestão modular definitiva. Nenhuma imagem, licença ou categoria de conservação foi inventada ou promovida nesta etapa.

## Resultado taxonômico e regional do GBIF

A consulta `species/match` do GBIF retornou correspondência de rank `SPECIES` e chave taxonômica para os 15 nomes. A consulta de ocorrências utilizou o recorte geográfico operacional `decimalLatitude=-22,-15` e `decimalLongitude=-61,-54`, como triagem de presença no entorno do Pantanal; isso não substitui a fonte regional narrativa ou normativa exigida para promoção final.

| Candidato | Chave GBIF | Nome aceito retornado | Ocorrências no recorte |
|---|---:|---|---:|
| *Brycon orbignyanus* | 2353463 | *Brycon orbignyanus* (Valenciennes, 1850) | 1 |
| *Serrasalmus maculatus* | 2354117 | *Serrasalmus maculatus* Kner, 1858 | 170 |
| *Serrasalmus marginatus* | 2354121 | *Serrasalmus marginatus* Valenciennes, 1837 | 183 |
| *Gymnotus inaequilabiatus* | 5212821 | *Gymnotus inaequilabiatus* (Valenciennes, 1839) | 39 |
| *Eigenmannia virescens* | 2402039 | *Eigenmannia virescens* (Valenciennes, 1836) | 64 |
| *Rhamdia quelen* | 2343735 | *Rhamdia quelen* (Quoy & Gaimard, 1824) | 199 |
| *Synbranchus marmoratus* | 2351979 | *Synbranchus marmoratus* Bloch, 1795 | 148 |
| *Crenicichla britskii* | 2371008 | *Crenicichla britskii* Kullander, 1982 | 5 |
| *Hemisorubim platyrhynchos* | 2338702 | *Hemisorubim platyrhynchos* (Valenciennes, 1840) | 148 |
| *Loricariichthys platymetopon* | 2339173 | *Loricariichthys platymetopon* Isbrücker & Nijssen, 1979 | 86 |
| *Paleosuchus palpebrosus* | 2441396 | *Paleosuchus palpebrosus* (Cuvier, 1807) | 47 |
| *Micrablepharus maximiliani* | 5222394 | *Micrablepharus maximiliani* (Reinhardt & Lütken, 1862) | 48 |
| *Phrynops geoffroanus* | 2442094 | *Phrynops geoffroanus* (Schweigger, 1812) | 32 |
| *Podocnemis unifilis* | 2442782 | *Podocnemis unifilis* Troschel, 1848 | 0 |
| *Hydrodynastes gigas* | 2454428 | *Hydrodynastes gigas* (Duméril, Bibron & Duméril, 1854) | 101 |

A contagem zero de *Podocnemis unifilis* no retângulo utilizado não foi convertida em ausência regional. O candidato permanece sujeito a confirmação em fonte regional direta e não será promovido com base apenas nessa consulta.

## Duplicidade e limites de evidência

Nenhum dos 15 nomes candidatos foi localizado no catálogo atual (`shared/catalog` e `shared/pantanal.ts`). O resultado é uma lista de candidatos novos, não uma autorização automática de ingestão. A confirmação de ocorrência no Pantanal, conservação ICMBio/MMA e três mídias com metadados de licença comercial por espécie permanece obrigatória antes da criação dos registros modulares.

## Referências

[1]: https://api.gbif.org/v1/species/match "GBIF Species Match API"
[2]: https://api.gbif.org/v1/occurrence/search "GBIF Occurrence Search API"

## Conclusão

O passo 34/60 foi concluído como preparação e triagem segura do Lote 02. Os 15 candidatos têm correspondência taxonômica de espécie no GBIF, não duplicam o catálogo atual e foram registrados com evidência de triagem regional quando disponível. A ingestão definitiva permanece condicionada às validações científicas e comerciais dos passos seguintes.


## Evidência regional complementar consultada no passo 35

A página institucional do ICMBio sobre o Pantanal descreve o bioma e informa a escala de sua fauna, incluindo centenas de espécies de peixes e aves, mas não constitui, isoladamente, comprovação de cada candidato do Lote 02. [3]

A revisão aberta de Alho sobre a biodiversidade do Pantanal registra 263 espécies de peixes e 113 espécies de répteis na planície, além de citar explicitamente *Hydrodynastes gigas* entre as serpentes da região. A revisão é evidência regional de contexto e de ocorrência explícita para esse táxon, mas os demais candidatos continuam exigindo confirmação individualizada antes da promoção. [4]

O artigo de Fischer, Faria de Godoi e Paranhos Filho fornece uma lista anotada de répteis registrados em paisagens do Cerrado e Pantanal, com dados de campo e georreferenciamento. A publicação é distribuída sob CC BY 4.0, mas cada nome do lote ainda deve ser conferido no corpo ou nos dados associados antes de receber o estado `confirmed`. [5]

[3]: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/pantanal "ICMBio — Pantanal"
[4]: https://www.scielo.br/j/bjb/a/cTbDFzkGmpNjD4RKnsxfTwn/?lang=en "Alho — Biodiversity of the Pantanal: response to seasonal flooding regime and to environmental degradation"
[5]: https://checklist.pensoft.net/article/26813/ "Fischer et al. — Roadkill records of reptiles and birds in Cerrado and Pantanal landscapes"
