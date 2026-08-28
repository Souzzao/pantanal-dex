# Passo 44/50 — validação oficial de conservação do mandi

## Alvo

A sequência P2 segue para o mandi, `Pimelodus maculatus`, registro prioritário do catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Pimelodus maculatus`, `maculatus` e `Pimelodus`. Não foi localizada correspondência exata para o táxon no texto extraído. O anexo contém outros táxons dos gêneros `Pimelodus` e espécies com o epíteto `maculatus`, como `Pimelodus joannis`, `Pimelodus stewartii` e `Microglanis maculatus`; nenhum deles foi confundido com o mandi.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Passo 44/60 — auditoria comercial e ingestão modular

## Objetivo

Resolver a auditoria comercial dos quatro mamíferos regionalmente confirmados no Lote 01 e ingerir somente registros com três imagens por espécie, autoria, licença e URL original verificáveis.

## Resultado

Foram auditadas 12 páginas individuais do Wikimedia Commons: três para cada espécie. Todas as licenças são compatíveis com uso comercial e não contêm as restrições NC (não comercial) ou ND (sem derivados).

| Espécie | Imagem 1 | Imagem 2 | Imagem 3 | Licenças |
|---|---|---|---|---|
| *Puma concolor* | [Puma concolor puma 1](https://commons.wikimedia.org/wiki/File:Puma_concolor_puma_1.JPG), CHUCAO | [Puma concolor 706305049](https://commons.wikimedia.org/wiki/File:Puma_concolor_706305049.jpg), Colin Croft | [Puma concolor Not a Good Place to Be](https://commons.wikimedia.org/wiki/File:Puma_concolor_Not_a_Good_Place_to_Be.jpg), USFWS Mountain-Prairie / Lori Iverson | CC BY-SA 3.0; CC BY 4.0; CC BY 2.0 |
| *Lontra longicaudis* | [Lontra longicaudis 2](https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_2.jpeg), Carla Antonini | [Lontra longicaudis 4](https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_4.jpeg), Carla Antonini | [Lontra longicaudis 05](https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_05.jpg), Encarna Sáez Goñalons e Víctor Martínez Moll | CC BY-SA 2.5 AR; CC BY-SA 2.5 AR; CC BY-SA 3.0 |
| *Pteronura brasiliensis* | [Giantotter](https://commons.wikimedia.org/wiki/File:Giantotter.jpg), Renaud d'Avout d'Auerstaedt | [Giant otter juvenile](https://commons.wikimedia.org/wiki/File:Giant_otter_(Pteronura_brasiliensis)_juvenile.jpg), Charles J. Sharp | [Giant Otter resting](https://commons.wikimedia.org/wiki/File:Giant_Otter_(Pteronura_brasiliensis)_resting_in_the_sun_..._-_Flickr_-_berniedup.jpg), Bernard DUPONT | CC BY-SA 2.5; CC BY-SA 4.0; CC BY-SA 2.0 |
| *Nasua nasua* | [Nasua nasua 01](https://commons.wikimedia.org/wiki/File:Nasua_nasua_01.jpg), MatthiasKabel | [Nasua nasua qtl1](https://commons.wikimedia.org/wiki/File:Nasua_nasua_qtl1.jpg), Quartl | [Nasua nasua](https://commons.wikimedia.org/wiki/File:Nasua_nasua.jpg), Andrew Magill | CC BY-SA 3.0; CC BY-SA 3.0; CC BY 2.0 |

## Implementação

O arquivo `shared/catalog/batches/mammals-03.ts` contém quatro espécies, 12 imagens auditadas e fontes GBIF Species Match. O lote foi integrado em `shared/catalog/index.ts` como `catalog-mammals-03`, ciclo 3, grupo Mamíferos e status `verified`.

A atualização eleva o catálogo de 60 para 64 espécies modulares, de 26 para 27 lotes e de 180 para 192 imagens. A auditoria científica passou a contar 84 registros totais incluindo o catálogo legado.

## Política comercial

As páginas auditadas declararam apenas CC BY, CC BY-SA ou variantes compatíveis. A aplicação deve fornecer atribuição e respeitar compartilhamento pela mesma licença quando aplicável. Nenhuma licença NC/ND foi aceita. As URLs `Special:FilePath` são usadas como URLs de mídia; as páginas individuais Commons são mantidas em `sourceUrl` para rastreabilidade.

## Observação regional

A imagem de *Pteronura brasiliensis* juvenil foi registrada no rio Cuiabá, perto de Porto Jofre, Poconé, Mato Grosso, Brasil, e complementa a evidência regional já registrada no ledger. As demais imagens foram usadas como referências taxonômicas e de licença, sem serem tratadas como prova de ocorrência regional quando suas páginas indicaram zoológicos ou localidades externas.

## Validação

Passaram `pnpm check`, `pnpm lint`, `pnpm test` — 20 aprovados e 1 teste legado ignorado —, auditorias de prioridades, fontes, conservação e ocorrência regional, e `git diff --check`.

## Referências

As 12 páginas Commons listadas na tabela acima são as referências de autoria e licença. A fonte taxonômica de cada registro é o endpoint GBIF Species Match gerado em `mammals-03.ts`. A evidência regional narrativa permanece no ledger de ocorrência e nos dossiês dos passos 37–42.
