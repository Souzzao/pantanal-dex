# Passo 43/50 — validação oficial de conservação da pintada-do-sul

## Alvo

A sequência P2 segue para a pintada-do-sul, `Vanessa myrinna`, registro prioritário do catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Vanessa myrinna`, `myrinna` e `Vanessa`. Não foi localizada correspondência exata para o táxon no texto extraído. Registros de outros táxons não foram usados para inferir categoria.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Passo 43/60 — ingestão segura dos mamíferos confirmados do Lote 01

## Auditoria de elegibilidade

Os quatro mamíferos do Lote 01 — *Puma concolor*, *Lontra longicaudis*, *Pteronura brasiliensis* e *Nasua nasua* — possuem confirmação regional no ledger por fonte aberta sobre mamíferos do Pantanal e identidade taxonômica separada no GBIF/Catalogue of Life.

A ingestão modular exige também três imagens por espécie com URL original, autoria e licença comercial verificáveis. A busca visual encontrou resultados no Wikimedia Commons para parte dos táxons, mas os resultados disponíveis nesta rodada não forneceram metadados completos e verificáveis para todos os 12 arquivos exigidos. O Commons também apresentou HTTP 429 em consultas anteriores. Assim, nenhuma imagem foi promovida com base apenas em miniatura, título de busca ou URL presumida.

| Critério | Resultado |
|---|---:|
| Mamíferos candidatos | 4 |
| Confirmação regional | 4/4 |
| Identidade taxonômica | 4/4 |
| Imagens comerciais exigidas | 12 |
| Conjuntos com licença individual confirmada | 0/4 |
| Registros modulares ingeridos | 0 |
| Licenças NC/ND aceitas | 0 |
| URLs/autorias inventadas | 0 |

## Decisão

A ingestão foi bloqueada para os quatro registros porque o pacote comercial ainda não está completo. Os táxons não foram deixados como `pending-review` no ledger regional: sua ocorrência está resolvida; o bloqueio restante é exclusivamente de ingestão de mídia no catálogo. Não alterei o contrato de imagem nem converti resultados de busca em aprovação de licença.

Os quatro candidatos permanecem fora dos lotes modulares publicados até que três páginas Commons individualmente auditadas por espécie tenham fonte, autor e licença compatível com uso comercial. A ausência de ingestão não cria duplicidade nem altera as 60 espécies já publicadas.

## Checks

`pnpm check`, `pnpm lint`, `pnpm test`, as auditorias de prioridades, fontes, conservação e ocorrência regional e `git diff --check` permanecem obrigatórios antes da publicação deste passo.


---

# Correção de estado — conclusão do passo 44/60

A auditoria comercial posterior do passo 44 resolveu o bloqueio registrado acima. Foram verificadas três referências de imagem por espécie para *Puma concolor*, *Lontra longicaudis*, *Pteronura brasiliensis* e *Nasua nasua*, totalizando 12 páginas individuais do Wikimedia Commons. Todas têm licença CC BY ou CC BY-SA, sem NC/ND, com autoria e URL de página registradas. O lote modular passou a ser `mammals03`, com quatro espécies e status `verified`; a seção anterior sobre bloqueio de ingestão corresponde ao estado intermediário do passo 43 e foi superada pela auditoria do passo 44.
