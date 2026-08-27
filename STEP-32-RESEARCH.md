# Passo 32/50 — validação oficial de conservação do veado-campeiro

## Escopo

Após a cobertura completa da matriz P1/P2, o passo 32 inicia a validação normativa das espécies recém-promovidas. O primeiro alvo é o veado-campeiro, `Ozotoceros bezoarticus`, incorporado no passo 27.

## Evidência oficial

A ficha oficial do ICMBio/SALVE avalia a subespécie *Ozotoceros bezoarticus bezoarticus* (Linnaeus, 1758) e atribui a categoria **Vulnerável (VU)**, com data da categoria em 08/02/2018 e publicação da ficha em 2023. A justificativa menciona dependência de fitofisionomias abertas do Cerrado e Pampa, declínio populacional associado à perda de habitat e caça ilegal, além de redução suspeita de ao menos 30% em três gerações, pelo critério A2c.

A categoria será associada ao registro de espécie no ledger de conservação com uma ressalva taxonômica explícita: a fonte oficial avalia a subespécie `O. b. bezoarticus`, enquanto o catálogo usa o táxon específico `O. bezoarticus`. A promoção não será feita sem registrar esse escopo.

Fonte: [1]

## Referências

[1]: https://salve.icmbio.gov.br/salve/api/pdf/doi/382b574f73347872452b77383535307574712f6f3146344e796664364c3170367a593753377757333675493d "ICMBio/SALVE — Avaliação do risco de extinção de Ozotoceros bezoarticus bezoarticus"


---

# Registro técnico do passo 32/60 — resiliência da captura e galeria

## Implementação

O fluxo de mídia do formulário de avistamentos foi reforçado com estados explícitos para câmera pronta, operação em andamento e erro de mídia. O botão de captura permanece desabilitado até o evento `onCameraReady`, evitando chamadas prematuras a `takePictureAsync`. O cancelamento encerra a prévia da câmera e redefine seu estado de prontidão, permitindo uma nova tentativa sem manter estado obsoleto.

A captura e a seleção da galeria agora passam por `acceptMedia`, que valida a existência da URI, aceita somente esquemas de mídia conhecidos e rejeita arquivos maiores que 12 MB quando o tamanho é informado pela galeria. Falhas de permissão, acesso à galeria ou captura são tratadas sem derrubar a tela, com mensagem acessível e opção de repetir ou escolher a outra fonte.

O salvamento recebeu proteção contra duplo acionamento por meio de estado de operação, botão desabilitado durante a persistência e tratamento de exceção. A quantidade é validada como número finito não negativo antes de criar o registro. O fluxo de visibilidade, localização, notas, seleção de espécie e `photoUri` foi preservado.

## Validação

| Verificação | Resultado |
|---|---|
| TypeScript (`pnpm check`) | PASS |
| Lint (`pnpm lint`) | PASS; permanece aviso preexistente de módulo do ESLint |
| Testes (`pnpm test`) | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 23 registros, 0 pendências |
| Auditoria regional | PASS; 7 registros, 0 pendências |
| `git diff --check` | PASS |

## Conclusão

O passo 32/60 está concluído. A captura agora suporta preparação explícita, cancelamento, repetição, mensagens de erro, validação de URI e limite de tamanho, sem alterar os contratos científicos ou comerciais do catálogo.
