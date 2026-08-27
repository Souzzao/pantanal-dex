# Pesquisa do passo 29/50 — tucano-toco

## Seleção do alvo

A matriz P1 identifica `Tucano-toco` — *Ramphastos toco* — como a próxima prioridade sem registro correspondente.

## Identidade taxonômica

O GBIF/Catalogue of Life apresenta *Ramphastos toco* P. L. S. Müller, 1776 como espécie aceita e lista as subespécies reconhecidas. O catálogo usa o nome nominal aceito, sem misturar automaticamente dados de subespécies.

Fonte: [1]

## Ocorrência no Pantanal

O estudo de Ragusa-Netto, indexado no PubMed, avaliou a abundância e a frugivoria do tucano-toco em uma floresta de galeria no Pantanal Sul, na sub-região de Miranda, Brasil. O resumo registra presença mais comum em períodos específicos das estações seca e úmida e relaciona a abundância à disponibilidade de frutos. Essa é evidência primária direta para a inclusão regional.

Fonte: [2]

## Conservação e comércio

O lote permanece `review-ready`. O GBIF mostra restrição comercial CITES II, mas essa informação não é convertida automaticamente em categoria de ameaça nacional. A trilha de conservação será revisada separadamente com fonte normativa ou avaliação oficial individual.

## Referências

[1]: https://www.gbif.org/taxon/78R6G "GBIF — Ramphastos toco"
[2]: https://pubmed.ncbi.nlm.nih.gov/16680316/ "PubMed — Abundance and frugivory of the Toco toucan in Brazil's southern Pantanal"

## Auditoria de imagens Commons

Foram verificadas páginas Commons com licenças compatíveis: `Ramphastos toco -Birdworld, Farnham, Surrey, England-8a.jpg` (CC BY 2.0, Chris Parfitt), `Tucanoçu - Ramphastos toco 06.jpg` (CC BY-SA 3.0, Germano Roberto Schüür) e `Toco toucan (Ramphastos toco).jpg` será usado somente após confirmação da página e licença. A seleção prioriza arquivos com crédito e licença explícitos; imagens de cativeiro não são tratadas como prova regional.

Fontes de crédito verificadas: [3] [4]

[3]: https://commons.wikimedia.org/wiki/File:Ramphastos_toco_-Birdworld,_Farnham,_Surrey,_England-8a.jpg "Wikimedia Commons — Ramphastos toco, CC BY 2.0"
[4]: https://commons.wikimedia.org/wiki/File:Tucano%C3%A7u_-_Ramphastos_toco_06.jpg "Wikimedia Commons — Tucanoçu, CC BY-SA 3.0"

A terceira imagem foi confirmada: `Toco toucan (Ramphastos toco).jpg`, de gipe25, está sob CC BY-SA 2.0 e foi revisada no Wikimedia Commons. O conjunto final pode usar três referências distintas e compatíveis: Chris Parfitt (CC BY 2.0), Germano Roberto Schüür (CC BY-SA 3.0) e gipe25 (CC BY-SA 2.0).

[5]: https://commons.wikimedia.org/wiki/File:Toco_toucan_(Ramphastos_toco).jpg "Wikimedia Commons — Toco toucan, CC BY-SA 2.0"


---

# Registro técnico do passo 29/60 — Lote 01 V3 em revisão pendente

## Resultado

A ingestão completa do Lote 01 V3 não foi promovida ao catálogo porque a auditoria individual das mídias do Wikimedia Commons não pôde ser concluída. O endpoint de busca e metadados retornou HTTP 429 durante as tentativas automatizadas.

A decisão é intencionalmente conservadora: não foram inventadas URLs de mídia, autorias, licenças, ocorrências no Pantanal ou categorias de conservação. Também não foi criado um lote modular com imagens cuja licença comercial não esteja diretamente comprovada.

## Evidências preservadas

A lista de 15 candidatos — oito mamíferos e sete aves — permanece documentada em `STEP-28-RESEARCH.md`. A triagem GBIF confirmou os nomes aceitos para os táxons consultados; `Aratinga nenday` foi substituído pelo nome aceito `Eupsittula nenday`. O guia oficial de identificação do ICMBio/MMA e o Plano de Manejo da RPPN Dona Aracy/Estância Caiman sustentam o contexto regional de fauna de mamíferos e aves, mas não foram usados para promover automaticamente cada espécie sem ficha individual suficiente.

## Estado do catálogo

Nenhum registro novo foi adicionado a `shared/catalog/batches/`. Nenhum status de conservação foi alterado. As regras de uso comercial continuam intactas, e nenhuma licença NC/ND foi introduzida.

## Próxima ação técnica

A ingestão modular deverá ser retomada quando for possível obter, para cada espécie, três páginas de arquivo do Wikimedia Commons com autoria e licença CC BY, CC BY-SA, CC0 ou domínio público confirmadas. Após isso, deverão ser executadas novamente as auditorias taxonômica, regional, de conservação, de fontes e de mídia.

## Validação executada

As auditorias do catálogo existente continuam aprovadas: TypeScript, lint, testes, prioridades, fontes, conservação, ocorrência regional e `git diff --check`. A ausência de um lote novo não foi mascarada como sucesso de ingestão; o resultado deste passo é `pending-review` por limitação de evidência externa.
