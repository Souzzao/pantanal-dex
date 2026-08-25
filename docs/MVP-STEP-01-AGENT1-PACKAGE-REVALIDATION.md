# Passo 1/50 — revalidação do pacote do Agente 1

## Escopo

O pacote recebido `PantanalDex-Agente-1-RETOMADA-500.zip` foi extraído em `/home/ubuntu/recovery-agent1-500` e testado com `unzip -tq`. A extração foi concluída sem erros e produziu 11 arquivos, incluindo a visão geral, a meta de 500 espécies, o handoff, o TODO, o checklist de 300 pontos, documentos do roadmap e `package.json`.

## Comparação

A visão geral e a meta de 500 espécies do pacote têm os mesmos hashes dos arquivos atuais em `handoffs/`, confirmando que o núcleo de coordenação está coerente. O `todo.md` e o `HANDOFF-3-CONTAS.md` do pacote são snapshots anteriores à retomada atual; portanto, foram preservados como evidência histórica e não sobrescreveram os arquivos vivos do projeto. O pacote não contém código-fonte completo: ele é um handoff operacional, não uma cópia editável do app.

## Estado confirmado

Os passos 1–17/50 já constam como concluídos no projeto. O estado atual registra 102 espécies públicas, 36 espécies modulares em 12 lotes, 0 lotes verificados e meta mínima revisada de 500 espécies verificadas para o MVP. A branch criada para esta revalidação é `integracao-retomada-passo-01`, mantendo a regra de não trabalhar diretamente na `main`.

## Decisão

O passo 1/50 desta retomada é considerado concluído como revalidação do pacote e congelamento do estado documental. Nenhum arquivo histórico do ZIP foi copiado sobre o código atual. O checklist de 300 pontos permanece a fonte operacional para o coordenador, e os agentes 2 e 3 devem continuar em branches próprias, abrindo PRs contra `main`.

## Portão de qualidade

A etapa só pode ser consolidada com `pnpm check`, `pnpm lint`, `pnpm test`, `git diff --check` e `pnpm watchdog` verdes, além de TODO, handoff, commit e checkpoint. O pacote extraído foi validado estruturalmente; a validação de código será executada antes do checkpoint.
