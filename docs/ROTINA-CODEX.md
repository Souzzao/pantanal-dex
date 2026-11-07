# PantanalDex — rotina agendada do Codex até 11/11

Escrita pelo Claude a pedido do Felipe (06/11). O Codex cria estas tarefas agendadas no próprio app (menu **Scheduled** do ChatGPT desktop). Elas rodam no computador do Felipe, então o app precisa estar aberto e o PC ligado no horário.

## Onde o Codex ajuda mais (o que só ele consegue fazer)

1. **Builds do APK no EAS:** a conta Expo do Felipe está logada no computador dele.
2. **Testes no Android de verdade:** BlueStacks + ADB, instalar o APK, seguir o roteiro, ler travamentos com `adb logcat` e tirar prints.
3. **Frente UC06:** remover a trava do Pantanal (decisão do Felipe), regras do formulário, contraste no modo escuro e idiomas nas telas dele.
4. **Integrar a duração da publicação no formulário:** ao marcar "Compartilhável", mostrar "Ficar público por" usando `usePublications().publish(id, duração)` (do Claude).
5. **Supabase no computador do Felipe:** ajudar a criar o `.env` com as chaves (**nunca colar chaves no chat**) e aplicar a migração SQL que o Claude vai deixar em `supabase/migrations/`.
6. **Catálogo:** imagem com licença comercial para o Jaú; plano para as 4 espécies duplicadas (sem apagar ids: o caderno ficaria só leitura).
7. **Revisão cruzada:** revisar o PR #13 do Claude (o Claude revisa o #14).
8. **Documentos da disciplina:** atualizar `docs/ALINHAMENTO-ACADEMICO.md` e `requirements-matrix.md` para o novo escopo (mundo inteiro, mapa público).

## Regras de toda tarefa agendada

- **Começar** lendo `COORDENACAO-CLAUDE-CODEX.md` (Quadro e Recados) e `docs/PLANO-ATE-11-11.md`.
- Editar só os arquivos da própria frente. Ao mexer na nota, **ler a versão atual e acrescentar**, nunca regravar a partir de cópia antiga.
- Rodar `pnpm check` e `pnpm test` antes de terminar.
- **Terminar** com um recado datado na nota (o que fez, o que falta, o que precisa do Claude).
- Publicar na branch `codex/uc06` (PR #14). Não fazer push na `main`.
- Os horários do Codex ficam **1 hora antes** dos checkpoints do Claude, que revisa e integra logo depois.

## Agenda (horário de Cuiabá)

| Quando | Tarefa do Codex | Checkpoint do Claude logo depois |
|---|---|---|
| **Sáb 07/11 09:00** | Remover a trava geográfica do Pantanal (manter `LOCATION_INVALID`), com testes e textos; atualizar PR #14 | 10:30 |
| **Sáb 07/11 14:00** | Revisar o PR #13 do Claude; colocar "Ficar público por" no formulário quando "Compartilhável" estiver marcado | 16:00 |
| **Sáb 07/11 20:00** | Contraste no modo escuro (`colors.background` sobre `colors.primary`) e idiomas no formulário, na lista e em Animais; aviso de lint do `SightingLocationModal` | 22:00 |
| **Dom 08/11 10:00** | Se houver conta Supabase: `.env` + migração. Se não houver: imagem licenciada para o Jaú e plano de "apelidos" para as espécies duplicadas | 12:00 |
| **Dom 08/11 16:00** | **APK candidato 2** com a pasta integrada; instalar no BlueStacks; seguir `docs/ROTEIRO-DEMO.md`; registrar em `docs/TESTES-ANDROID.md` | 20:00 |
| **Seg 09/11 10:30** | Depois dos merges do Felipe: juntar `main` em `codex/uc06` (nos conflitos de `animals.tsx`/`sightings.tsx`, manter o lado da `main`); `pnpm check` + `pnpm test` | 12:30 |
| **Seg 09/11 14:00** | Teste completo no Android: roteiro inteiro, `adb logcat` para travamentos, prints das telas | 16:00 |
| **Seg 09/11 19:00** | Corrigir o que o teste achou na frente do Codex | 20:30 |
| **Ter 10/11 10:00** | Atualizar `docs/ALINHAMENTO-ACADEMICO.md` e `requirements-matrix.md` para o novo escopo | 12:30 |
| **Ter 10/11 15:00** | **APK final (release candidate)**: build, instalação, teste rápido e link de download | 17:00 |
| **Ter 10/11 20:00** | Teste final pelo roteiro + checklist da apresentação | 21:00 |
| **Qua 11/11 07:30** | Conferir se o link do APK funciona e deixar o resumo final na nota | 07:00 / 09:00 |

## Texto para o Felipe colar no Codex

> Crie tarefas agendadas no projeto `pantanal-dex-main` conforme a tabela "Agenda" do arquivo `docs/ROTINA-CODEX.md` (horário de Cuiabá, UTC-4). Cada tarefa deve seguir as "Regras de toda tarefa agendada" do mesmo arquivo, começando por ler `COORDENACAO-CLAUDE-CODEX.md` e terminando com um recado nessa nota. Use o modo local da pasta compartilhada e as permissões mínimas que permitam editar o projeto e rodar `pnpm`, `eas` e `adb`. Me mostre a lista criada antes de ativar.
