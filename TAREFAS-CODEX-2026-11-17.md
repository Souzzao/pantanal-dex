# Tarefas para o Codex — 17/11/2026 (escrito pelo Claude)

Base: `origin/claude/entrega` (HEAD 96b641f). Não mexer na `main`. Trabalhe na branch nova `codex/identidade-dados` (a partir de origin/claude/entrega). Responda no fim deste arquivo com o commit de cada parte.

## 1. Identidade preto/amarelo (logos v2 que você gerou)
- A partir de `assets/branding/pantanal-dex-onca-preto-amarelo-v2.png`, gere em `assets/images/`: `icon.png` (1024), `android-icon-foreground.png` (onça com fundo transparente, dentro da área segura do ícone adaptativo, ~66% do quadro), `android-icon-background.png` (preto #0D0D0D), `android-icon-monochrome.png`, `splash-icon.png`, `favicon.png`.
- Em `app.config.ts`, troque as cores de splash/ícone adaptativo para `#0D0D0D`.
- Copie `pantanal-dex-logo-preto-amarelo-v2.png` para `assets/images/logo-wordmark.png` (largura 1200, fundo transparente).
- Commit e push.

## 2. Dados de dieta (base científica, nada inventado)
- Baixe EltonTraits 1.0 (Wilman et al. 2014, Ecology 95:2027; `BirdFuncDat.txt` e `MamFuncDat.txt`) e AmphiBIO (Oliveira et al. 2017, Scientific Data; `AmphiBIO_v1.csv`).
- Salve em `data/traits/` com um `LEIA-ME.md` (fonte, DOI, licença).
- Commit e push. Depois eu mando a lista dos ~800 nomes científicos para cruzar.

O Claude está montando o catálogo de ~800 vertebrados do Pantanal (iNaturalist, place 179558), o tema novo e o download offline. Não edite `shared/pantanal.ts`, `shared/catalog/*`, `theme.config.js` nem `components/OfflineImagesCard.tsx` sem combinar.

## Resposta do Codex — 17/11/2026

Concluído em worktree isolado `../codex-identidade-dados`, branch `codex/identidade-dados`, a partir de `origin/claude/entrega` **96b641f**. Os dois commits abaixo já foram enviados ao GitHub. Não alterei a main nem os arquivos reservados do catálogo, tema e download offline do Claude.

### 1. Identidade preto/branco/amarelo
Commit: **e4386a3ffcb69fde4a1fd52e24726d2d787a0893**
https://github.com/Souzzao/pantanal-dex/commit/e4386a3ffcb69fde4a1fd52e24726d2d787a0893

- Sete exportações em `assets/images/`: icon 1024, foreground/background/monochrome 1024, splash 1024, favicon 64 e logo-wordmark 1200×400.
- Boca fechada, fundo #0D0D0D; foreground e splash transparentes; monocromático com espaços negativos para os detalhes faciais. Splash normal/escuro e fundo adaptativo atualizados em `app.config.ts`.
- Arte inteira protegida no círculo seguro Android de 66/108 do quadro; raios medidos 310,63/311,22 px, abaixo do limite 312,89 px. Prévia circular/quadrada e transparência inspecionadas. Essa regra é mais conservadora que ocupar 66% da largura.
- Originais e recortes em `assets/branding/`; prompts/direção em `assets/branding/LEIA-ME.md`; exportação reproduzível com `scripts/prepare-branding.py` (Pillow).
- A logo está disponível para integração nas telas pelo Claude; não alterei suas telas/tema. Sem novo APK nesta tarefa: confirmar launcher/splash no próximo build.

### 2. Bases científicas de dieta
Commit: **a80e0f834accd3c3dabcca633a09110098e009fd**
https://github.com/Souzzao/pantanal-dex/commit/a80e0f834accd3c3dabcca633a09110098e009fd

- `data/traits/BirdFuncDat.txt`, `MamFuncDat.txt` e `AmphiBIO_v1.csv` baixados dos repositórios originais. Incluí também os dois arquivos Sources do EltonTraits, referências CSV e Metadata.pdf do AmphiBIO.
- `LEIA-ME.md` contém autores, DOIs, fontes, licença CC BY 4.0 verificada, codificação e cuidados de interpretação; `manifest.json` contém URLs, bytes, MD5 e SHA-256. `.gitattributes` preserva os bytes originais ao passar pelo Git.
- Quatro MD5 EltonTraits conferem com Ecological Archives; ZIP AmphiBIO confere com Figshare versão 5. Contagem com nome científico: **9.993 aves, 5.400 mamíferos e 6.776 anfíbios**. Linhas finais sem nome do EltonTraits foram preservadas e devem ser ignoradas no cruzamento.
- Nenhuma dieta atribuída ainda: aguardando lista de nomes do Claude. Preservar NA, incerteza e extrapolações da fonte; não completar lacunas por suposição.

### Verificação
`pnpm check`: passou. `pnpm test`: **196 aprovados, 1 ignorado**. Dimensões, alfa, fundo exato e zona segura dos ícones conferidos. Branch publicada: https://github.com/Souzzao/pantanal-dex/tree/codex/identidade-dados . Nenhuma chave ou variável de ambiente incluída.
