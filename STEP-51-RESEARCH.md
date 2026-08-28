# Passo 51/60 — compartilhamento individual seguro

A nova fase nativa foi iniciada com um incremento de baixo risco e alto valor operacional: o compartilhamento individual de um avistamento a partir da tela de detalhes. O recurso usa o mesmo envelope JSON versionado do passo 48, evitando um segundo formato de dados e mantendo a importação futura compatível.

Para registros marcados como `shareable`, o usuário pode gerar diretamente o arquivo individual. Para registros `private`, a interface mostra uma confirmação adicional e informa que o arquivo pode conter localização e outros dados sensíveis. Sem confirmação, nenhum arquivo é gerado. A ação também é bloqueada enquanto o arquivo está sendo preparado, prevenindo cliques concorrentes.

O arquivo é escrito no cache local com `expo-file-system/legacy` e compartilhado por `expo-sharing` quando o sistema oferece esse recurso. Em plataformas sem compartilhamento nativo disponível, a interface apresenta o caminho do arquivo como fallback controlado, sem alterar o registro original.

| Requisito | Implementação |
|---|---|
| Formato | Envelope JSON versionado 2.0 |
| Privacidade | Confirmação explícita para registros pessoais |
| Conteúdo | Apenas o avistamento selecionado |
| Persistência | Nenhuma alteração no catálogo ou no registro |
| Concorrência | Botão desabilitado durante a preparação |
| Native | `expo-sharing` quando disponível |
| Fallback | Caminho do arquivo informado ao usuário |

A validação passou com `pnpm check`, `pnpm lint`, `pnpm test` — 30 aprovados e 1 ignorado —, auditorias de arquitetura, vocabulário, prioridades, fontes, conservação, ocorrência regional, imagens, sinônimos, GBIF legado e dataset ICMBio/SISBio. As métricas permaneceram em 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos.

A auditoria de imagens permanece com zero falhas definitivas; respostas HTTP 429 continuam registradas como limitação temporária explícita. Nenhum estado pendente foi introduzido.
