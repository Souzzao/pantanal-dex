# Passo 52/60 — revisão e edição segura de avistamentos

O PantanalDex agora permite revisar e editar um avistamento existente por meio da rota `app/sightings/edit.tsx`, acessível pelo botão **Editar registro** na tela de detalhes. O formulário reutiliza o contrato de `Sighting` e permite alterar data, horário, local, precisão da localização, quantidade, observações e visibilidade.

A atualização é feita sobre o objeto original, preservando `id`, `speciesId`, `photoUri`, coordenadas, `createdAt` e quaisquer campos não editados. Apenas `updatedAt` é renovado. A persistência continua passando pela fila serializada e pelo armazenamento em chunks já implementados nos passos 46 e 47.

A interface exige data preenchida e rejeita quantidades negativas, infinitas ou não numéricas. Quando um registro pessoal é transformado em compartilhável, uma confirmação adicional explica que o avistamento poderá aparecer em compartilhamentos futuros. O cancelamento não altera o armazenamento.

| Verificação | Resultado |
|---|---|
| Preservação do ID | PASS |
| Preservação de `createdAt` | PASS |
| Preservação de registros vizinhos | PASS |
| Prevenção de duplicidade | PASS |
| Validação de data | PASS |
| Validação de quantidade | PASS |
| Confirmação de privacidade | PASS |
| Persistência em chunks | PASS |
| TypeScript e lint | PASS |
| Testes | 31 aprovados, 1 ignorado |
| Auditorias científicas | PASS, sem pendências |

O teste `preserva identidade e registros vizinhos ao atualizar um avistamento` foi adicionado à suíte de armazenamento. A validação completa passou com as auditorias de arquitetura, vocabulário, prioridades, fontes, conservação, ocorrência regional, licenças, sinônimos, GBIF legado e ICMBio/SISBio.

As métricas do catálogo permaneceram em 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos. A auditoria de imagens mantém zero falhas definitivas, com respostas HTTP 429 registradas explicitamente como limitação temporária.
