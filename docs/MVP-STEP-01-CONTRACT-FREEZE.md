# MVP — Passo 1/50: contratos e inventário congelados

**Data:** 22/08/2026  
**Responsável:** Agente 1 / Coordenador  
**Branch de integração:** `integracao-ciclo-14`

## Contratos preservados

| Contrato | Estado congelado |
|---|---|
| `Species` | ID, nomes, grupo, ambientes, conteúdo editorial, conservação opcional, imagens e fontes |
| `Sighting` | ID, espécie, foto opcional, data/hora, localização, precisão, quantidade, notas, visibilidade e timestamps |
| `Settings` | idioma padrão e lista ordenada de idiomas rápidos |
| `ExportEnvelope` | versão, data de exportação e coleção de avistamentos |

Nenhuma tela ou lote pode renomear, remover ou reinterpretar esses campos sem uma decisão de arquitetura registrada no handoff. O catálogo modular continua sendo combinado pelo índice derivado e deduplicado por ID.

## Inventário de entrada

| Métrica | Valor |
|---|---:|
| Espécies públicas | 102 |
| Espécies modulares | 36 |
| Lotes modulares | 12 |
| Lotes verificados | 0 |
| Lotes pendentes | 12 |
| Lotes `review-ready` | 0 |
| Imagens públicas | 306 |
| Imagens modulares auditadas automaticamente | 108 |

Distribuição pública: 24 mamíferos, 26 aves, 14 répteis, 12 anfíbios, 16 peixes e 10 invertebrados.

## Critérios para o passo 2

O próximo passo é validar o núcleo P1 por espécie. Nenhum lote será promovido apenas por estar completo sintaticamente. A promoção exige fonte estruturada, ocorrência pantaneira verificável, nomenclatura conferida, conservação oficial quando informada, imagem individual com licença comercial permitida, crédito e checklist editorial completo.
