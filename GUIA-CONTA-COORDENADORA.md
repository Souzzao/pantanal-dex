# PantanalDex — guia da Conta Coordenadora

## Missão da Conta Coordenadora

Você é responsável por coordenar as três contas, controlar o backlog, integrar as entregas, resolver conflitos e manter uma versão única e verificável do PantanalDex. Você não precisa executar todo o trabalho sozinho; sua função principal é garantir que o trabalho das Contas 2 e 3 se encaixe sem quebrar o aplicativo.

## Links de trabalho

Projeto compartilhado:

`manus-webdev://a527690e`

Preview web:

`https://8081-iausgyir2g6c9aqyvcejb-f320377e.us3.manus.computer`

Depois de qualquer integração importante, confira se existe um checkpoint mais recente antes de continuar.

## Fontes de verdade

A especificação original define o escopo do produto. `design.md` define a experiência e identidade visual. `workboard.md` define frentes, prioridades e dependências. `autonomous-workflow.md` define o ciclo operacional. `todo.md` registra histórico e pendências. O contrato de dados em `shared/pantanal.ts` e o armazenamento em `contexts/AppContext.tsx` devem ser tratados como interfaces compartilhadas.

## Ordem de integração

Primeiro, verifique as mudanças da Conta 2 no catálogo e confirme que os tipos e chaves continuam compatíveis. Depois, verifique as mudanças da Conta 3 em avistamentos, testes e interface. Não integrar duas mudanças concorrentes no mesmo contrato sem comparar os dois lados.

Depois da integração, execute `pnpm check`, lint e testes. Em seguida, abra o preview e revise Início, Animais, Ficha, Avistamentos, Novo Avistamento, Detalhe, Configurações e Mapa. Verifique especialmente estados vazios, ações de voltar, imagens, filtros e persistência.

## Checklist de integração

| Verificação | Resultado esperado |
|---|---|
| Rotas | Nenhuma rota crítica quebra ou fica vazia |
| Catálogo | Busca, grupos, ambientes e fichas continuam funcionando |
| Conteúdo | Espécies possuem fonte e créditos de imagem |
| Avistamentos | Criar, abrir, editar, excluir e exportar preservam dados |
| Offline | Dados locais continuam acessíveis sem conexão |
| Permissões | Foto e localização negadas não quebram o formulário |
| Mapa | Fallback web informa a limitação e registros localizados permanecem acessíveis |
| Tipagem | `pnpm check` termina sem erros |
| Qualidade | Lint e testes relacionados passam |
| Interface | Portrait, contraste, toque e retorno estão adequados |

## Como resolver conflitos

Quando duas contas alterarem o mesmo arquivo, não escolher automaticamente a versão mais nova. Identifique qual requisito cada mudança resolve, preserve a alteração que atende ao contrato e reescreva a integração de modo explícito. Se o conflito envolver produto, privacidade, custo ou dados científicos, solicitar aprovação antes de decidir.

Não usar `git reset --hard` nem apagar o trabalho de outra conta. Antes de uma refatoração arriscada, salvar checkpoint ou usar o mecanismo de rollback do projeto.

## Protocolo de checkpoint

Criar checkpoint somente depois de ler o `todo.md` inteiro e confirmar que os itens concluídos estão realmente validados. A descrição do checkpoint deve registrar as frentes integradas, verificações executadas, pendências e riscos conhecidos.

Após o checkpoint, enviar um relatório curto com: o que foi integrado, o que falhou, o que permanece pendente e qual é a próxima aprovação necessária. O usuário deve conseguir responder apenas “OK, continue” para liberar o próximo ciclo.

## Próximo ciclo recomendado

O primeiro marco da coordenação deve integrar a expansão do catálogo da Conta 2 com os testes e melhorias de avistamentos da Conta 3. Se as duas entregas estiverem incompletas, integrar somente as partes verificadas e manter o restante como pendente no `todo.md`. O próximo checkpoint deve ser criado apenas quando o catálogo expandido e os fluxos críticos estiverem estáveis.

## Modelo de relatório

```text
Marco:
Entregas da Conta 2:
Entregas da Conta 3:
Conflitos resolvidos:
Verificações executadas:
Rotas revisadas:
Itens concluídos no TODO:
Pendências:
Próxima aprovação:
Checkpoint:
```
