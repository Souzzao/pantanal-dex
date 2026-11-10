# PantanalDex — plano do Claude até a entrega (quarta, 11/11/2026)

Horários de Cuiabá (UTC-4). Cada etapa tem uma retomada agendada nesta conversa; se o Felipe estiver presente, as etapas podem andar antes. Para economizar créditos, são 2 ou 3 sessões por dia, cada uma com uma entrega concreta (código testado gravado na pasta e no PR, ou documento).

| # | Quando | Etapa | Entrega | Depende de |
|---|---|---|---|---|
| 1 | Sex 06/11, agora até ~01h | **Mapa público: regras e agrupamento** | `shared/public-map.ts` com testes: publicação com prazo, filtro por data, agrupamento de registros próximos em "área de alta incidência" e coordenada pública sempre generalizada (0,1°) | — |
| 2 | Sex 06/11, na sequência | **Gestão dos registros públicos** | Tela "Meus registros públicos": escolher por quanto tempo fica público (1 dia, 7, 30, 90 dias, 1 ano ou sem prazo), encerrar e renovar | 1 |
| 3 | Sex 06/11, na sequência | **Tela do mapa público** | Mapa offline do mundo (contornos Natural Earth, domínio público) com o contorno do Pantanal, agrupamentos com contagem, filtro por data e lista de registros por área; atalhos na Home e no caderno | 1, 2 |
| 4 | Sáb 07/11, 08h | **Pronto para servidor (Supabase)** | Provedor que lê e publica no Supabase quando houver chave, migração SQL com RLS, `DADOS.md` e guia de criação da conta | 1–3 |
| 5 | Sáb 07/11, 13h | **Integração com o Codex** | Checagem conjunta depois que ele tirar a trava do Pantanal; roteiro sem a exceção E3; revisão do que ele mudou | Codex |
| 6 | Sáb 07/11, 19h | **Teste visual das telas novas** | Telas novas na web, nos temas claro e escuro, em celular pequeno; correções | 3 |
| 7 | Dom 08/11, 09h | **Ligar no servidor (se houver conta)** | Registros públicos de vários aparelhos no mesmo mapa; fila para quando estiver sem internet. Sem conta: modo local com registros de exemplo identificados | 4, conta Supabase |
| 8 | Dom 08/11, 15h | **Acessibilidade e idiomas** | Telas novas em PT/EN/ES, leitor de tela, contraste AA | 3 |
| 9 | Seg 09/11, 09h | **Consolidação** | Merge de teste #13 + #14 + mapa, checagem completa, orientação ao Felipe para os merges e pedido de APK ao Codex | 5–8 |
| 10 | Seg 09/11, 16h | **Correções do APK** | Ajustes a partir dos testes do Codex no BlueStacks | 9 |
| 11 | Ter 10/11, 09h | **Congelamento** | Roteiro final, documentação da disciplina (escopo, requisitos atendidos, limitações) e checklist da apresentação | 10 |
| 12 | Ter 10/11, 17h | **Última verificação** | APK final instalado e conferido com o roteiro | 11 |
| 13 | Qua 11/11, 07h | **Dia da entrega** | Checagem rápida do PR, da pasta e do APK; resumo para a apresentação | 12 |

## Replanejamento de 07/11 (pedidos do Felipe às 09h11 e 09h39)

Novo escopo: **mapa de satélite em tela cheia**, **login obrigatório com conta ativa offline**, **papéis usuário/auditor/dev**, **auditoria em pilha** e **abas Registrar / Meus registros**. Feito no sábado de manhã (PRs #17 e #18). Etapas que mudam:

| Quando | Etapa | Entrega |
|---|---|---|
| Sáb 07/11 (feito) | Satélite + servidor de contas + login + pilha + área dev + abas | PR #17 e PR #18; migrações aplicadas no Supabase |
| Sáb 07/11 tarde | Felipe: desligar "Confirm email", criar `.env.local` + variáveis na EAS e a conta dele | Claude transforma a conta em **dev** |
| Sáb/Dom | Codex: revisar #16 → #17 → #18; Claude faz os merges com o "aprovo" dele | `main` com tudo |
| Dom 08/11 | APK candidato 2 (Codex) e teste no celular: login, offline, publicar com foto, pilha, área dev, satélite | Lista de correções |
| Seg 09/11 | Correções do APK; documentação (escopo novo: login e auditoria saem de "fora do escopo") | APK candidato 3 |
| Ter 10/11 | Congelamento, roteiro da demonstração com as três contas (usuário, auditor, dev) | APK final |

## Decisões já tomadas pelo Felipe (06/11)

- O Pantanal é só o recorte do teste; o app não pode recusar registros fora dele. O Codex remove a trava; o Claude faz o mapa público.
- Mapa público: primeiro no aparelho, com interface pronta para servidor; liga no Supabase se a conta existir até segunda.
- Prazo: quarta, 11/11.

## Checkpoints extras (pedido do Felipe, 06/11 22h30)

O limite de uso do Claude renova em janelas de 5 horas. Por isso, além das etapas, há checkpoints logo depois de cada tarefa agendada do Codex (ver `docs/ROTINA-CODEX.md`) e sessões de madrugada, quando a janela renova sem ninguém usando. De madrugada o computador pode estar desligado; nesse caso o Claude trabalha só na nuvem (branch do PR no GitHub) e sincroniza a pasta na sessão seguinte.

| Quando | Checkpoint |
|---|---|
| Sáb 07/11 01:30 | Madrugada: código do provedor Supabase e testes, na nuvem |
| Sáb 07/11 10:30 | Revisar a remoção da trava do Pantanal feita pelo Codex; checagem integrada |
| Sáb 07/11 16:00 | Revisar o "Ficar público por" do Codex no formulário e a revisão dele do PR #13 |
| Sáb 07/11 22:00 | Revisar contraste e idiomas do Codex; ajustes |
| Dom 08/11 03:00 | Madrugada: testes extras e documentação (`DADOS.md`, mapa público) |
| Dom 08/11 12:00 | Revisar Supabase ou o plano para o Jaú e as espécies duplicadas |
| Dom 08/11 20:00 | Analisar o relatório do APK candidato 2 e corrigir |
| Seg 09/11 02:00 | Madrugada: merge de teste completo e preparação da consolidação |
| Seg 09/11 12:30 | Conferir o merge do Codex na `codex/uc06` |
| Seg 09/11 20:30 | Conferir as correções do Codex depois do teste no Android |
| Ter 10/11 02:00 | Madrugada: rascunho do documento final da disciplina |
| Ter 10/11 12:30 | Revisar os documentos da disciplina atualizados pelo Codex |
| Ter 10/11 21:00 | Conferir o teste final do Codex |
| Qua 11/11 09:00 | Última conferência depois do Codex |
