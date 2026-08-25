# PantanalDex — meta revisada do MVP: mínimo de 500 espécies verificadas

## Portão obrigatório

O MVP só pode ser declarado entregue quando houver **pelo menos 500 espécies verificadas**, distribuídas pelos grupos prioritários do Pantanal e aprovadas pelo checklist editorial. A contagem deve ser calculada pelo índice derivado e reproduzida por teste ou relatório versionado.

> Espécie estruturalmente cadastrada não é automaticamente espécie verificada.

Para contar no mínimo de 500, cada espécie precisa ter ID único, taxonomia conferida, ocorrência no Pantanal comprovada por fonte adequada, descrição sem conteúdo inventado, três imagens específicas ou uma exceção editorial formalmente aprovada, créditos e licença comercial compatível por arquivo, fonte estruturada, conservação oficial somente quando disponível e revisão com `reviewedAt` e `reviewedBy`.

## Distribuição de referência

A alocação abaixo é uma meta operacional inicial, não uma afirmação sobre a biodiversidade real nem uma autorização para preencher lacunas sem fontes.

| Grupo | Meta mínima do MVP |
|---|---:|
| Mamíferos | 70 |
| Aves | 180 |
| Répteis | 60 |
| Anfíbios | 40 |
| Peixes | 80 |
| Invertebrados | 70 |
| **Total** | **500** |

Os agentes podem recalibrar essa distribuição com dados reais, mas não podem reduzir o total ou contar duplicações taxonômicas. Espécies prioritárias incluem animais emblemáticos, comuns em campo, indicadores ecológicos e representantes de ambientes distintos.

## Como medir

O Agente 1 deve manter a métrica com quatro números separados: espécies públicas, espécies modulares, espécies estruturalmente válidas e espécies verificadas. A métrica deve registrar também lotes pending-review, lotes inválidos, imagens faltantes e fontes sem licença confirmada.

O Agente 2 é responsável por produzir os lotes científicos. O Agente 3 é responsável por garantir que a interface, busca, filtros, persistência e recursos nativos suportem o aumento sem travamentos. O Agente 1 integra somente lotes revisados e atualiza o relatório de release.

## Mecanismo anti-trabalho superficial

Nenhum ponto dos checklists de 300 itens vale por intenção. Cada ponto exige evidência em arquivo, teste, log, documentação ou PR. Um lote sem fonte individual, licença por arquivo, ocorrência comprovada ou revisão não entra na contagem de 500 verificadas. Bloqueios devem conter causa, evidência, alternativa e responsável. Sem commit, PR e checks verdes, a tarefa continua incompleta.

## Fases até o MVP

Os passos 1–17 foram concluídos como fundação e auditoria do inventário existente. Os passos 18–30 devem ampliar conteúdo, corrigir lacunas e estabilizar índice, busca, filtros e fichas. Os passos 31–40 devem fechar offline, importação/exportação, câmera, GPS, mapa, idiomas e acessibilidade. Os passos 41–49 devem executar integração, performance, testes, segurança, licenças e validação da meta de 500. O passo 50 é o release candidate, relatório de créditos, checkpoint e aprovação final.

## Fontes e licenças

São permitidas somente fontes e imagens com uso comercial compatível, conforme `LICENSES.md`. NC, ND, licença ausente, arquivo sem página individual e referência à IUCN Red List API são bloqueios. Conservação sem fonte oficial ICMBio/MMA permanece vazia.
