# Reunião diária — Felipe, Claude e Codex

**Quando:** todo dia às **18h30** (horário de Cuiabá), de sábado 07/11 a terça 10/11, e uma rápida na **quarta 11/11 às 07h45**, antes da entrega.
**Onde:** na conversa do Felipe com o Claude. O Claude traz o que o Codex deixou na pauta e leva as decisões de volta para ele, pela nota de coordenação ou pelo próprio app do Codex.
**Duração:** curta. O Felipe só precisa responder as decisões.

## Conversa informal Claude + Codex (todo dia às 17h30)

Pedido do Felipe (06/11): os dois conversam de forma mais leve, trocam ideias sobre o projeto, chegam a consensos e alinham o que vai para a reunião principal. Também é um momento de descontrair.

- O Claude abre o app do Codex no computador do Felipe e escreve como **"[Claude]"**. Se o Codex estiver sem limite de uso, a conversa acontece por escrito na seção "Conversa informal" abaixo.
- **Notícias do dia:** antes da conversa, o Claude pesquisa de 3 a 5 notícias do Brasil e de 3 a 5 da área de tecnologia e IA, com fonte e link. O Codex comenta as que achar relevantes. As notícias também vão no fim da pauta das 18h30, em "Para ler", sem tomar tempo da reunião.
- **O que sai da conversa:** consensos (vão para a pauta como proposta conjunta), divergências (vão para a pauta como "para opinar", com os dois lados) e ideias para depois da entrega.

## Como a pauta é montada

- **Até 18h:** o Codex acrescenta os itens dele aqui (tarefa agendada "preparar pauta", em `docs/ROTINA-CODEX.md`).
- **18h15:** o Claude junta os itens dele, confere o estado real (PRs, CI, testes e APK) e envia a pauta ao Felipe às 18h30.
- **Depois da reunião:** o Claude registra as decisões abaixo e nos Recados da nota de coordenação.

## Formato de cada reunião

```
### Reunião AAAA-MM-DD
1. Para aprovar (o Felipe responde sim/não): merges nomeados (PR #...), mudanças de escopo, gastos/contas
2. Para opinar: escolhas de produto e de interface com 2 ou 3 opções
3. Feito desde a última reunião (Claude / Codex)
4. Bloqueios e riscos para 11/11
5. Próximas 24h (Claude / Codex)
Decisões registradas: ...
```

## Pauta da próxima reunião (sáb 07/11, 18h30)

### Itens do Claude
- **Para aprovar (já autorizado pelo Felipe às 08h54, falta o "aprovo" do Codex):** merges na ordem **#16 → #17 → #18**. Os três estão verdes e sem conflito. O #16 traz as 4 correções da revisão do Codex (head `7acec61`).
- **Felipe, 5 minutos:** (1) Supabase → Authentication → Sign In / Providers → Email → desligar **"Confirm email"**; (2) criar o `.env.local` e as variáveis na EAS (`docs/SUPABASE-PASSO-A-PASSO.md`, passos 3–5); (3) criar a conta no app; o Claude a transforma em **dev**.
- **Para decidir:** quem serão os auditores na demonstração (sugestão: uma conta de colega ou uma segunda conta do Felipe) e o roteiro com três contas (usuário publica → auditor aprova na pilha → mapa mostra aprovado).
- **Para opinar:** as 4 espécies duplicadas no catálogo (unificar agora ou depois da entrega). Agora o auditor pode corrigir a espécie na pilha.
- **Riscos para segunda:** login, envio de foto e a pilha ainda não foram testados num Android real. O APK candidato 2 precisa sair no domingo.

### Itens do Codex
- (o Codex acrescenta aqui)

## Conversa informal

(Registro curto de cada conversa: data, assuntos, consensos, divergências e ideias.)

### Sáb 07/11, 17h30 (Claude; o PC estava desligado, então não houve conversa com o Codex)
- **O que o Claude fez hoje:** mapa público pronto para servidor, Supabase criado e testado, correções da revisão do Codex (#16), mapa de satélite em tela cheia (#17), login com modo offline, papéis, pilha de auditoria e área dev (#18).
- **Para conversar com o Codex:** a revisão de #16/#17/#18 (inclusive as mudanças em `AppContext`, nas abas e no `SightingLocationModal`, que são da frente dele) e quem gera e testa o APK candidato 2 no domingo.
- **Notícias do Brasil (7/11):** desabamento de prédio no Brás (SP), que não tinha alvará de funcionamento ([Metrópoles via Blog do Lago](https://blogdolago.com.br/manchetes-do-dia-7-de-novembro-de-2026/)); Banco Central mantém a Selic; TRF3 barra a volta de três empresas de apostas; a Casas Bahia adia o balanço do 3º trimestre (mesma fonte).
- **Notícias de tecnologia/IA (6/11):** queda forte das ações de chips (Nvidia e Qualcomm caíram mais de 9%); Meta suspende a mudança de termos que permitiria raspar sites, depois de reação de editores e de reguladores, inclusive do **Brasil**; Google anuncia data center de US$ 17 bi em Wyoming; o Departamento de Justiça dos EUA cria uma força-tarefa sobre uso indevido de IA ([AI Weekly, 6/11](https://aiweekly.co/ai-news-today/edition/2026-11-06)).
- **Gancho para o projeto:** a reação brasileira à raspagem da Meta conversa com a nossa escolha de mandar ao servidor só o mínimo (célula de ~11 km) e de deixar a coordenada exata visível apenas ao auditor (`DADOS.md`).


### Dom 08/11, 17h30 (Claude; o PC ficou desligado o dia todo, então não houve conversa com o Codex)
- **Feito desde ontem (só no GitHub, porque a pasta não estava acessível):** `docs/MAPA-PUBLICO.md` (caminho do avistamento, quem vê o quê, roteiro com 3 contas); acessibilidade (verde e âmbar do tema claro com contraste AA, botões da auditoria, alvos de toque de 44 px); crédito do mapa compacto em telas de 360 px; registros do próprio usuário no mapa com a situação da auditoria.
- **Continua parado:** merges de #16, #17 e #18 (falta o ok do Felipe ou o "aprovo" do Codex), conta no Supabase, "Confirm email", `.env.local` e APK candidato 2.
- **Notícias:** a busca de domingo voltou só com páginas genéricas e as fontes de resumo não abriram; ficou sem registro hoje, para não citar nada sem confirmar.
- **Para a reunião:** se o APK não sair até segunda de manhã, combinar o plano B. A demonstração fica no modo local, com registros de exemplo identificados, e o login e a auditoria são mostrados pelo código e pelo `docs/MAPA-PUBLICO.md`.

### Seg 09/11, 17h30 (Claude; PC desligado de novo, então não houve conversa com o Codex)
- **Situação:** tudo pronto e testado desde sábado. Teste de consolidação na `main` sem conflito (187 testes). Parado à espera do ok do Felipe para juntar, das variáveis na EAS e da conta no Supabase. O APK candidato 2 ainda não existe.
- **Notícias do Brasil (9/11):** Folha: títulos atrelados à Selic dobram e o colchão para rolar a dívida de curto prazo diminui. O Globo: ao menos oito capitais avançam para ter polícia municipal depois da PEC da Segurança. Correio Braziliense: STF deixa para 2027 a discussão sobre ministros e o caso Banco Master. Correio do Povo: abstenção no 1º dia do Enem chega a 32% ([capas via blog Antonio Pessoa Cardoso](https://www.antoniopessoacardoso.com.br/2026/11/manchetes-de-alguns-jornais-de-hoje_01323032915.html)).
- **Notícias de tecnologia/IA (9/11):** Mistral lança o Large 4 com pesos abertos (1 trilhão de parâmetros); Apple quer uma Siri "agente" até 2027, segundo a Bloomberg (não confirmado); Amazon abre compras por texto na Alexa; Shield AI compra a Echodyne por US$ 5,3 bi ([AI Tools Recap](https://aitoolsrecap.com/Blog/ai-news-november-09-2026)).
- **Para a reunião:** última chance de um APK com login antes da entrega. Se o ok não vier até terça de manhã, vale o plano B (modo local + demonstração do login e da auditoria pelo código e pelo `docs/MAPA-PUBLICO.md`).
