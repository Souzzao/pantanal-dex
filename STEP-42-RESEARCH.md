# Passo 42/50 — validação oficial de conservação da traíra

## Alvo

A sequência P2 segue para a traíra, `Hoplias malabaricus`, registro prioritário do catálogo.

## Evidência oficial e controle de escopo

A busca do ICMBio/SALVE localizou materiais que mencionam `Hoplias malabaricus` em contexto de avaliação de risco, mas a URL retornada pelo mecanismo resolveu para a ficha de outro táxon (`Pecari tajacu`), não constituindo ficha individual navegável para a traíra. Essa fonte não foi usada para promover categoria.

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Hoplias malabaricus`, `malabaricus` e `Hoplias`. Não foi localizada correspondência exata para o táxon do catálogo. A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte normativa: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Passo 42/60 — resolução ativa do Lote 01

## Resultado

A reavaliação dos nove candidatos novos do Lote 01 foi concluída com decisão explícita para todos. Quatro mamíferos foram confirmados pela revisão aberta *Terrestrial and aquatic mammals of the Pantanal*: *Puma concolor*, *Lontra longicaudis*, *Pteronura brasiliensis* e *Nasua nasua*. A fonte descreve os táxons no contexto ecológico do Pantanal; a identidade foi conferida separadamente no GBIF/Catalogue of Life.

Cinco aves foram encerradas como `not-confirmed` para o recorte Pantanal. A checklist estadual do Mato Grosso do Sul confirma ou discute parte dos táxons em escala estadual, mas a tabela consultada não vincula cada entrada a uma localidade pantaneira individual; *Eudocimus ruber* e *Eupsittula nenday* não tiveram correspondência nominal na checklist revisada. Não foi feita extrapolação do estado inteiro para o bioma.

| Táxon | Decisão |
|---|---|
| *Puma concolor* | `confirmed` |
| *Lontra longicaudis* | `confirmed` |
| *Pteronura brasiliensis* | `confirmed` |
| *Nasua nasua* | `confirmed` |
| *Rhea americana* | `not-confirmed` |
| *Anhinga anhinga* | `not-confirmed` |
| *Eudocimus ruber* | `not-confirmed` |
| *Caracara plancus* | `not-confirmed` |
| *Eupsittula nenday* | `not-confirmed` |

## Estado resolvido

O ledger regional passou de 22 para 31 registros: 23 confirmados, oito `not-confirmed` e zero `pending-review`. O novo estado `not-confirmed` encerra a triagem sem afirmar ausência absoluta, extinção ou categoria de conservação.

A etapa não promoveu nenhuma espécie ao catálogo modular porque os nove candidatos não possuem um pacote simultâneo de registro modular, validação científica completa e auditoria comercial de três imagens por espécie. Nenhuma imagem, autoria ou licença foi inventada, e nenhuma licença NC/ND foi introduzida.

## Validação

`pnpm check`, `pnpm lint`, `pnpm test`, as auditorias de prioridades, fontes, conservação e ocorrência regional e `git diff --check` passaram. A auditoria regional retornou 31 registros, zero pendências abertas e status `PASS`.

## Referências

[1]: https://www.scielo.br/j/bjb/a/ntjhhV3T693jyYtC4zGxHBR/?lang=en "Terrestrial and aquatic mammals of the Pantanal"
[2]: https://www.scielo.br/j/paz/a/CtXKR4YMyrsG4ttMdRP7JYR/?lang "Checklist of the birds of Mato Grosso do Sul state, Brazil"
[3]: https://api.gbif.org/v1/species/match "GBIF Species Match"
