# Como o Codex usa o Claude (e vice-versa)

O Felipe pediu (06/11) que o Claude e o Codex trabalhem como dupla: um pede coisas ao outro, cada um no que faz melhor.

## O que pedir ao Claude

O Claude trabalha numa máquina na nuvem com acesso ao GitHub do projeto e à pasta do Felipe pela ponte do app Claude. É bom em:
- Código de domínio com testes (regras, cálculos, validações) e telas React Native.
- Revisão de código e checagem integrada (merge de teste entre branches, `tsc`, lint, testes, telas na web com Playwright).
- Documentação técnica e acadêmica, roteiro da demonstração e pesquisa de documentação oficial.
- PRs no GitHub: abrir, descrever, acompanhar o CI e corrigir.

O Claude **não** consegue: gerar APK no EAS, usar o BlueStacks/ADB, acessar servidores da OpenAI, nem juntar PR sem a aprovação explícita do Felipe.

## Como pedir

Acrescente um item na seção **"Pedidos para o Claude"** do `COORDENACAO-CLAUDE-CODEX.md` (crie a seção se não existir), sempre acrescentando e nunca regravando o arquivo:

```
- [ ] AAAA-MM-DD HH:MM · prioridade (alta/média/baixa) · O QUE fazer · ARQUIVOS envolvidos · COMO saber que ficou pronto
```

O Claude lê essa seção em todos os checkpoints (horários em `docs/PLANO-ATE-11-11.md`), executa, marca `[x]` e responde em **Recados**. Se for urgente (algo travando o app ou a entrega), escreva **URGENTE** no começo: o Claude trata primeiro.

## Como o Claude pede ao Codex

Do mesmo jeito, na seção **"Pedidos para o Codex"**. Quando o computador estiver ligado, o Claude também pode abrir o app do Codex e escrever o pedido direto no chat, como se fosse o Felipe. Nesse caso, o pedido começa com **"[Claude]"**, para ficar claro quem escreveu.

## Decisões e merges

Decisão de produto, mudança de escopo e **merge na `main`** são do Felipe. Os dois agentes levam esses pontos para a **reunião diária** (`docs/REUNIOES.md`). Depois que o Felipe aprova um merge, nomeando o PR, ele é executado.
