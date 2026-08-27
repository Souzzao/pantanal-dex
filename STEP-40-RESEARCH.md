# Passo 40/50 — validação oficial de conservação do tucanuçu-de-garganta-azul

## Alvo

A sequência P2 segue para o tucanuçu-de-garganta-azul, `Megaceryle torquata`, registro prioritário do catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Megaceryle torquata`, `torquata` e `Megaceryle`. Não foi localizada correspondência exata para o táxon no texto extraído. Menções gerais a aves aquáticas ou outros táxons não foram usadas para inferir categoria.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Registro V3 do passo 40/60 — auditoria comercial dos Lotes 01 e 02

## Resultado do inventário

Foi realizada uma busca no catálogo modular em `shared/catalog/batches/` pelos 30 candidatos definidos nos Lotes 01 e 02. Nenhum dos candidatos foi localizado em lote modular ingerido. Portanto, não existem ainda registros de espécie ou referências de imagem desses dois lotes no catálogo publicado para auditar.

Esse resultado é importante: não foram adicionadas URLs, autorias, licenças ou imagens fictícias para preencher a meta de três imagens por espécie. A política comercial permanece intacta, sem qualquer mídia NC/ND e sem promoção de material cuja licença não tenha sido verificada diretamente.

| Item | Resultado |
|---|---:|
| Candidatos Lote 01 inventariados | 15 |
| Candidatos Lote 02 inventariados | 15 |
| Candidatos encontrados em lotes modulares | 0 |
| Mídias comerciais auditáveis nos dois lotes | 0 |
| Licenças NC/ND introduzidas | 0 |
| Registros promovidos indevidamente | 0 |

## Decisão operacional

O passo 40 é encerrado como **auditoria concluída e ingestão de mídia não aplicável neste estado do repositório**. Os candidatos não são considerados pendentes de licença dentro do catálogo publicado porque ainda não foram ingeridos. A ingestão futura deverá ocorrer somente após validação individual de fonte, autoria, URL original e licença comercial compatível para cada imagem.

Não alterei o contrato de `Species`, não relaxei o validador de licenças e não converti referências desconhecidas em aprovação. A ausência de mídia nos lotes não foi mascarada como licença aprovada.

## Estado dos auditores

O catálogo publicado continua com 60 espécies modulares e 26 lotes, sem alteração de registros. A auditoria comercial dos registros já publicados permanece aprovada; os candidatos dos Lotes 01 e 02 continuam fora da superfície publicada até que suas evidências científicas e comerciais sejam completadas.

| Verificação | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm lint` | PASS; aviso preexistente de módulo do ESLint |
| `pnpm test` | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 38 registros, 0 pendências |
| Auditoria regional | PASS; 22 registros, 19 confirmados, 3 `not-confirmed`, 0 `pending-review` |
| `git diff --check` | PASS |

## Referências

[2]: https://www.imasul.ms.gov.br/guia-ilustrado-elaborado-pelo-imasul-apresenta-para-o-mundo-386-especies-de-peixes-do-pantanal/ "IMASUL — Guia Ilustrado dos Peixes do Pantanal e Entorno"
[3]: https://commons.wikimedia.org/wiki/Commons:Licensing "Wikimedia Commons — Licensing"
