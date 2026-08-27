# Pesquisa do passo 28/50 — arara-canindé

## Seleção do alvo

A matriz P1 identifica `Arara-canindé` — *Ara ararauna* — como a próxima prioridade sem registro correspondente após a inclusão do veado-campeiro. O passo cria um lote modular isolado e não preenche conservação sem fonte oficial individual.

## Identidade taxonômica

O GBIF apresenta *Ara ararauna* (Linnaeus, 1758) como espécie aceita. O nome comum arara-canindé é usado como variante brasileira da espécie azul-e-amarela; o registro mantém o nome científico aceito como identificador principal.

Fonte: [1]

## Ocorrência regional

A publicação sobre movimentos sazonais da arara-canindé nas planícies de inundação do Pantanal setentrional documenta *Ara ararauna* no Pantanal. Uma fonte oficial do ICMBio sobre uma RPPN no bioma também lista *Ara ararauna* na avifauna da unidade. Essas referências sustentam a inclusão regional; imagens de zoológico ou de outras localidades não são tratadas como prova de ocorrência.

Fontes: [2] [3]

## Conservação e limite da promoção

O lote permanece `review-ready`. Este passo não atribui categoria de risco nem transforma uma eventual ausência na lista nacional em `LC`; a trilha de conservação será validada separadamente com correspondência oficial individual.

## Auditoria comercial das imagens

Foram verificadas páginas do Wikimedia Commons e rejeitado o arquivo `Blue-and-Yellow-Macaw.jpg`, que usa GFDL 1.2 e não atende à política comercial do projeto. Foram selecionados três arquivos compatíveis: `Ara-ararauna.jpg` (CC BY 2.0, Jan Smith), `Ara ararauna -Jurong Bird Park, Singapore-8.jpg` (CC BY 2.0, Jan Smith) e `"arara-canindé" - Ara ararauna.jpg` (CC BY-SA 4.0, DiogoKanouté). A última imagem é de Arenópolis, Goiás; nenhuma imagem foi usada como evidência de ocorrência no Pantanal.

Fontes de crédito: [4] [5] [6] [7]

## Referências

[1]: https://www.gbif.org/taxon/G227 "GBIF — Ara ararauna"
[2]: https://www.researchgate.net/publication/338720979_Seasonal_movements_of_Blue-and-yellow_Macaw_Ara_ararauna_in_the_northern_Pantanal_floodplains_Brazil "Seasonal movements of Blue-and-yellow Macaw in the northern Pantanal floodplains"
[3]: https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/pantanal/lista-de-ucs/rppn-dona-aracy-estancia-caiman/PM_RPPN_Dona_Aracy_Atualizado_13_10_22.pdf "ICMBio — Plano de Manejo da RPPN Dona Aracy/Estância Caiman"
[4]: https://commons.wikimedia.org/wiki/File:Blue-and-Yellow-Macaw.jpg "Wikimedia Commons — arquivo rejeitado por GFDL 1.2"
[5]: https://commons.wikimedia.org/wiki/File:Ara-ararauna.jpg "Wikimedia Commons — Ara-ararauna.jpg, CC BY 2.0"
[6]: https://commons.wikimedia.org/wiki/File:Ara_ararauna_-Jurong_Bird_Park,_Singapore-8.jpg "Wikimedia Commons — Ara ararauna -Jurong Bird Park, Singapore-8.jpg, CC BY 2.0"
[7]: https://commons.wikimedia.org/wiki/File:%22arara-canind%C3%A9%22_-_Ara_ararauna.jpg "Wikimedia Commons — arara-canindé, CC BY-SA 4.0"


---

# Registro técnico do passo 28/60 — triagem do Lote 01 V3

## Escopo

O passo 28 inicia a ingestão do Lote 01 prevista no Master Plan V3. Como o roteiro agrupa os passos 28–29 para a ingestão completa de 15 espécies de mamíferos e aves, este passo formaliza a lista de candidatos e a triagem taxonômica inicial. A criação dos registros modulares completos, com evidência regional e três mídias comerciais verificadas por espécie, permanece para a etapa seguinte de ingestão.

## Lista proposta do Lote 01

| Grupo | Nome comum | Nome científico | Resultado GBIF |
|---|---|---|---|
| Mamíferos | Onça-pintada | `Panthera onca` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Capivara | `Hydrochoerus hydrochaeris` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Tamanduá-bandeira | `Myrmecophaga tridactyla` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Anta | `Tapirus terrestris` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Onça-parda | `Puma concolor` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Lontra | `Lontra longicaudis` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Ariranha | `Pteronura brasiliensis` | EXACT / ACCEPTED / SPECIES |
| Mamíferos | Quati | `Nasua nasua` | EXACT / ACCEPTED / SPECIES |
| Aves | Ema | `Rhea americana` | EXACT / ACCEPTED / SPECIES |
| Aves | Biguatinga | `Anhinga anhinga` | EXACT / ACCEPTED / SPECIES |
| Aves | Guará | `Eudocimus ruber` | EXACT / ACCEPTED / SPECIES |
| Aves | Colhereiro | `Platalea ajaja` | EXACT / ACCEPTED / SPECIES |
| Aves | Caracará | `Caracara plancus` | EXACT / ACCEPTED / SPECIES |
| Aves | Papagaio-verdadeiro | `Amazona aestiva` | EXACT / ACCEPTED / SPECIES |
| Aves | Periquito-de-cabeça-preta | `Eupsittula nenday` | EXACT / ACCEPTED / SPECIES |

A consulta inicialmente considerou `Aratinga nenday`, mas o GBIF retornou `SYNONYM`; por isso o lote usa o nome aceito `Eupsittula nenday`, evitando introduzir nomenclatura não aceita como nome principal.

## Limites desta etapa

A consulta GBIF confirmou correspondência exata, status aceito e rank de espécie para os 14 primeiros táxons. A consulta do nome aceito `Eupsittula nenday` deve ser repetida na ingestão do passo 29 para registrar a resposta específica do nome aceito e a chave taxonômica correspondente.

A validação de ocorrência no Pantanal, a consulta de conservação ICMBio/SALVE e a auditoria individual de três imagens do Wikimedia Commons com licença comercial compatível ainda não foram promovidas nesta etapa. A busca direta no endpoint do Commons encontrou rate limiting HTTP 429; esse resultado é uma limitação operacional e não é evidência de licença. Nenhuma espécie foi adicionada ao catálogo apenas com base em imagem, e nenhum status de conservação foi inferido.

## Resultado

O Lote 01 foi definido com 15 espécies novas em relação aos lotes modulares atuais, dividido em oito mamíferos e sete aves. O passo 28/60 fica concluído como triagem e preparação científica; o passo 29/60 deverá realizar a ingestão modular somente após completar as evidências taxonômicas, regionais, conservacionistas e comerciais exigidas.

## Referências GBIF

Cada táxon possui consulta individual no endpoint oficial de correspondência do GBIF:

- `https://api.gbif.org/v1/species/match?name=Panthera%20onca`
- `https://api.gbif.org/v1/species/match?name=Hydrochoerus%20hydrochaeris`
- `https://api.gbif.org/v1/species/match?name=Myrmecophaga%20tridactyla`
- `https://api.gbif.org/v1/species/match?name=Tapirus%20terrestris`
- `https://api.gbif.org/v1/species/match?name=Puma%20concolor`
- `https://api.gbif.org/v1/species/match?name=Lontra%20longicaudis`
- `https://api.gbif.org/v1/species/match?name=Pteronura%20brasiliensis`
- `https://api.gbif.org/v1/species/match?name=Nasua%20nasua`
- `https://api.gbif.org/v1/species/match?name=Rhea%20americana`
- `https://api.gbif.org/v1/species/match?name=Anhinga%20anhinga`
- `https://api.gbif.org/v1/species/match?name=Eudocimus%20ruber`
- `https://api.gbif.org/v1/species/match?name=Platalea%20ajaja`
- `https://api.gbif.org/v1/species/match?name=Caracara%20plancus`
- `https://api.gbif.org/v1/species/match?name=Amazona%20aestiva`
- `https://api.gbif.org/v1/species/match?name=Eupsittula%20nenday`
