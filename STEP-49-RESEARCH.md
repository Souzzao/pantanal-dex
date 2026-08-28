# Passo 49/60 — interface nativa de transferência

A tela `app/(tabs)/settings.tsx` agora integra o ciclo completo de transferência de avistamentos. A exportação continua criando arquivos JSON ou CSV no cache local e usando o compartilhamento nativo quando disponível. A interface informa o estado de geração e impede ações concorrentes durante a operação.

A importação usa `expo-document-picker` com filtro JSON e leitura por `expo-file-system/legacy`, compatível com o SDK 54 adotado pelo projeto. Depois da leitura, o conteúdo passa pelo parser versionado do passo 48. Arquivos sem registros válidos produzem relatório controlado; erros de leitura mostram uma mensagem sem alterar o inventário local.

Antes de gravar os registros válidos, a interface exibe confirmação explícita: os dados privados e as coordenadas serão armazenados localmente no dispositivo. Registros com IDs já existentes são omitidos para evitar substituição silenciosa. Ao final, o painel visual apresenta o total adicionado, rejeitado e já existente, além dos motivos das rejeições.

| Fluxo | Comportamento |
|---|---|
| Exportar JSON | Gera envelope versionado e compartilha o arquivo |
| Exportar CSV | Gera tabela sem apagar dados locais |
| Selecionar arquivo | DocumentPicker nativo com filtro JSON |
| Privacidade | Confirmação antes de persistir dados sensíveis |
| Duplicidade | IDs existentes são ignorados e contabilizados |
| Rejeições | Relatório visual por motivo |
| Web | Usa o mesmo componente com fallback de compartilhamento |

A dependência `expo-document-picker` foi adicionada na versão compatível com Expo SDK 54. A validação passou com `pnpm check`, `pnpm lint`, `pnpm test` — 30 aprovados e 1 ignorado —, auditorias de prioridades, fontes, conservação e ocorrência regional, e `git diff --check`.

As métricas científicas permaneceram estáveis em 76 espécies modulares, 29 lotes, 82 fontes estruturadas, 152 URLs GBIF, 38 registros de conservação e 31 registros regionais, sem pendências.
