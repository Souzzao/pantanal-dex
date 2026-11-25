# Checklist de interface — PantanalDex 3.9

Revisão feita com o checklist do kit **Órbita UI** (`CHECKLIST.md`) sobre a build web do app (mesmo código das telas do Android), em 25/11/2026.
Ferramenta: Playwright (Chromium) com toque ativado, larguras de 320, 390 e 768 px e emulação de "reduzir movimento".
Telas: login, início, animais, ficha da espécie, avistamentos, coleção, cadernos, novo avistamento e ajustes (9 telas × 4 configurações = 36 execuções).

| ID | Tela | Teste executado | Resultado | Evidência |
| --- | --- | --- | --- | --- |
| V01 | Todas | Título, proposta e ação principal visíveis em cada tela; contraste do título sobre o horizonte e sobre as fotos (degradê inferior) | PASSOU | capturas em `docs/img/` (login, início, coleção) |
| V02 | Todas | Cores, raios, espaçamentos e durações vêm de tokens (`theme.config.js`, `constants/design.ts`); cartões e botões iguais entre telas | PASSOU | inspeção de código |
| V03 | 9 telas | Larguras 320, 390 e 768 px: rolagem horizontal indevida da página | PASSOU (após correção) | 1ª rodada: login a 768 px rolava (brilho do horizonte) → corrigido com `overflow: hidden`; 2ª rodada: 0 ocorrências |
| F01 | Início, coleção | Atalhos levam ao destino certo: "Explore por grupo" abre Animais já filtrado (ex.: Aves → 479 espécies) | PASSOU | navegação por URL `/animals?group=Aves` |
| F02 | Avistamentos, equipes | Estados vazio (caderno vazio, sem equipe → órbita com convite) e sem internet (equipes mostram o cache) | PASSOU (vazio) · NÃO TESTADO (erro de rede no navegador) | o estado offline é coberto por `tests/teams.test.ts` |
| F03 | Criar conta | Envio sem aceitar a política mostra erro; campos guardam o que foi digitado | PASSOU | Playwright na build com servidor: mensagem "Marque que leu e aceita a Política de Privacidade." exibida e e-mail mantido; o envio é barrado antes do servidor (nenhuma conta criada) |
| F04 | Modal "Sair da equipe" | Abrir, cancelar e confirmar só com o nome certo | NÃO TESTADO no navegador | depende de conta com equipe; regra coberta por código (botão desabilitado até o nome bater) |
| A01 | Todas | Todos os controles têm nome acessível (rótulo, texto ou dica) | PASSOU (após correção) | 1ª rodada: interruptor de "remover repetidos" sem nome → rótulo adicionado |
| A02 | Todas | Contraste WCAG: texto 18,2:1; texto secundário 8,2–9,0:1; amarelo 12,2:1; tinta sobre os 6 gradientes 7,2–9,4:1 (mínimo 4,5:1) | PASSOU | cálculo pela fórmula WCAG 2.2 |
| A02b | Ajustes | Alvos de toque ≥ 40 px | PASSOU (após correção) | setas de ordem dos idiomas tinham 33×37 px → 44×44 px |
| A03 | 9 telas | "Reduzir movimento" ativo: animações param (estrelas, meteoros, borda luminosa, contadores) e as ações continuam iguais | PASSOU | rodada 390 px com `reducedMotion: reduce`, 0 erros |
| P01 | Início | Animações usam só transform/opacity/props de SVG no thread de UI (Reanimated) | PASSOU por inspeção · NÃO TESTADO com perfil de CPU | — |
| P02 | 9 telas × 4 | Console e exceções da página | PASSOU | 0 erros (exceto o aviso de hidratação #418, só da exportação web estática, sem efeito no Android) |

**O que ainda impede considerar a interface 100% pronta:** testar no aparelho físico com o APK (animações nativas, vibração, barra flutuante sobre a barra de gestos do Android) e o fluxo completo de equipes com contas reais.
