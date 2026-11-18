# Identidade preto, branco e amarelo

Direção aprovada pelo Felipe em 17/11/2026: onça-pintada com boca fechada; sem verde. Originais aprovados preservados nesta pasta. Recorte e versão monocromática gerados com imagegen integrado; exportação dos tamanhos com `scripts/prepare-branding.py` (Pillow).

## Arquivos usados pelo app

Em `assets/images/`: `icon.png` (1024×1024, opaco), `android-icon-background.png` (1024×1024, #0D0D0D), `android-icon-foreground.png` e `android-icon-monochrome.png` (1024×1024, transparentes), `splash-icon.png` (1024×1024, transparente), `favicon.png` (64×64) e `logo-wordmark.png` (1200×400, transparente).

As camadas adaptativas cabem no círculo seguro central de 66/108 do quadro, preservando as orelhas. Essa proporção é a recomendação do [Android](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive), mais conservadora do que usar 66% da largura da imagem. O Android usa o canal alfa do arquivo monocromático para aplicar a cor escolhida pelo sistema.

Splash normal e escuro e fundo adaptativo configurados em #0D0D0D. Não houve alteração das telas/tema do Claude, nem nova compilação do APK nesta tarefa. A logo está disponível para integração nas telas.

## Prompts finais (imagegen integrado)

- Recorte: remover somente o fundo preto externo da onça aprovada, com transparência real; preservar boca fechada, manchas pretas internas, nariz, olhos e detalhes brancos/amarelos, sem redesenhar.
- Monocromático: produzir estêncil da mesma onça de boca fechada, com tinta preta e fundo transparente; olhos, nariz, boca e rosetas como espaços negativos transparentes, legível em miniatura. As primeiras tentativas brancas não foram usadas porque os espaços negativos ficaram pouco definidos.

Validação: inspeção visual sobre fundo cinza; dimensões e alfa conferidos; prévias circular e quadrada verificadas. Teste no launcher/APK continua pendente de uma nova compilação.
