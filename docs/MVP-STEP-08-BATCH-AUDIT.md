# MVP — Passo 8/50: auditoria do terceiro lote de aves

## Resultado executivo

O lote `catalog-birds-03` contém exatamente as três espécies definidas para este passo: Arara-canindé (*Ara ararauna*), Urubu-de-cabeça-preta (*Coragyps atratus*) e Tucano-toco (*Ramphastos toco*). A inspeção confirmou IDs únicos, nomes científicos aceitos pelo GBIF e nove imagens com URLs acessíveis, créditos e licenças declaradas. O lote permanece `pending-review` porque o PantanalDex não permite promoção sem evidência individual de ocorrência no Pantanal, conservação oficial brasileira quando aplicável, `reviewedAt`, `reviewedBy` e checklist editorial completo.

## Evidências taxonômicas

| Espécie | Nome aceito no GBIF | Match | Usage key | Resultado |
|---|---|---|---:|---|
| Arara-canindé | *Ara ararauna* (Linnaeus, 1758) | EXACT / ACCEPTED | 5959231 | Confirmado |
| Urubu-de-cabeça-preta | *Coragyps atratus* (Bechstein, 1793) | EXACT / ACCEPTED | 2481942 | Confirmado |
| Tucano-toco | *Ramphastos toco* P.L.S.Müller, 1776 | EXACT / ACCEPTED | 2478765 | Confirmado |

A correspondência taxonômica confirma a identidade científica, mas não substitui a comprovação de ocorrência local. A distribuição textual do lote foi preservada sem transformar a presença geral no Brasil em prova de registro no Pantanal.

## Auditoria das imagens

| Espécie | Imagens | Licenças declaradas | URLs verificadas | Decisão |
|---|---:|---|---:|---|
| Arara-canindé | 3 | CC BY 2.0, CC BY 3.0, CC BY-SA 3.0 | 3/3 HTTP 200 | Aceitas estruturalmente |
| Urubu-de-cabeça-preta | 3 | CC BY-SA 3.0 | 3/3 HTTP 200 | Aceitas estruturalmente |
| Tucano-toco | 3 | CC BY-SA 4.0, CC BY-SA 4.0, CC BY-SA 2.0 | 3/3 HTTP 200 | Aceitas estruturalmente |

As licenças declaradas não contêm NC ou ND e são compatíveis com a política comercial do projeto. A conferência editorial final ainda deve manter página individual, autor, licença, atribuição e indicação de alterações no registro de créditos de release.

## Conservação e ocorrência

A página oficial do Diário Oficial referente à Portaria MMA nº 1.704/2026 foi aberta durante a auditoria, porém a busca individual reproduzível por nome não retornou uma ficha específica para as três espécies. Por segurança, nenhum `conservationStatus` foi inventado ou preenchido. A ocorrência pantaneira também continua pendente de evidência individual adequada. O lote não foi promovido.

## Alterações realizadas

O `pendingNotes` de `catalog-birds-03` foi ampliado para registrar explicitamente os critérios ainda necessários. O dossiê de evidências recebeu os usage keys, resultados das URLs e referências de licenciamento. O catálogo mantém 47 espécies, sem duplicação. Nenhum dado temporário de colaboração foi misturado aos avistamentos do usuário.

## Validação técnica

`pnpm test` passou com 49 testes aprovados e 1 teste de autenticação pulado por depender de credencial. `pnpm check`, `pnpm lint` e `git diff --check` também passaram. O aviso de `MODULE_TYPELESS_PACKAGE_JSON` do ESLint é informativo e não impediu a validação.

## Próxima frente

O Passo 9/50 deve iniciar a auditoria do primeiro lote de répteis, sem repetir a auditoria de birds-03. A Conta 2 deve anexar evidências regionais e de conservação para destravar a promoção das aves; a Conta 3 deve validar a renderização do Colhereiro, Arara-canindé, Jabiru e demais aves no navegador.

## Referências

[1]: https://api.gbif.org/v1/species/match?name=Ara%20ararauna "GBIF — Ara ararauna"
[2]: https://api.gbif.org/v1/species/match?name=Coragyps%20atratus "GBIF — Coragyps atratus"
[3]: https://api.gbif.org/v1/species/match?name=Ramphastos%20toco "GBIF — Ramphastos toco"
[4]: https://www.in.gov.br/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917 "DOU — Portaria MMA nº 1.704/2026"
[5]: https://commons.wikimedia.org/wiki/File:Ara_ararauna_Luc_Viatour.jpg "Wikimedia Commons — Ara ararauna Luc Viatour"
[6]: https://commons.wikimedia.org/wiki/File:Coragyps-atratus-002.jpg "Wikimedia Commons — Coragyps atratus 002"
[7]: https://commons.wikimedia.org/wiki/File:Toco_toucan_(Ramphastos_toco)_in_flight_composite.jpg "Wikimedia Commons — Ramphastos toco in flight"
