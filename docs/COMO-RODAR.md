# Como rodar o PantanalDex

> Autor: Felipe de Souza Aquino

## 1. Ambiente

| Ferramenta | Versão |
|---|---|
| Node.js | 20 ou mais recente |
| pnpm | 9 |
| Python (opcional, só para regenerar o catálogo) | 3.10+ |
| Android Studio ou emulador (opcional) | Android 9+ |

```bash
git clone https://github.com/Souzzao/pantanal-dex.git
cd pantanal-dex
pnpm install --frozen-lockfile
pnpm start
```

No terminal do Expo, aperte `a` para abrir no Android, `w` para a web ou leia o QR code com o Expo Go.

## 2. Supabase (login, mapa público e auditoria)

Sem Supabase o app funciona em **modo local**: catálogo, caderno, coleção e pontos turísticos continuam disponíveis.

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode os arquivos de [`supabase/migrations/`](../supabase/migrations) em ordem de data. Eles podem ser executados mais de uma vez.
3. Em **Authentication → Providers → Email**, mantenha o login por e-mail ativo.
4. Em **Project Settings → API**, copie a *Project URL* e a chave **publishable/anon**.
5. Crie o arquivo `.env` a partir do modelo:

   ```bash
   cp .env.example .env
   ```

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   ```

6. Para tornar uma conta `dev` (a primeira vez), rode no SQL Editor:

   ```sql
   update public.profiles set role = 'dev' where id = '<uuid-da-conta>';
   ```

   Depois disso, novos papéis são definidos pela **Área dev** do próprio app.

> ⚠️ Nunca use a chave `service_role` no app nem a coloque no repositório. O `.env` já está no `.gitignore`.

## 3. Gerar o APK

### Pelo GitHub Actions (recomendado)

1. No repositório, abra **Settings → Secrets and variables → Actions** e crie os *secrets* `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2. Cada push na `main` dispara o workflow **APK Android**. Também dá para rodar manualmente em **Actions → APK Android → Run workflow**.
3. Ao final, baixe o artefato **PantanalDex-APK** na página da execução.

### Pelo EAS (Expo)

```bash
pnpm exec eas login
pnpm build:android:apk
```

Configure as mesmas variáveis no painel da Expo (**Environment variables**, ambientes `preview` e `production`).

## 4. Regenerar o catálogo

Os dados brutos ficam em `data/` e o resultado vai para `shared/catalog/generated/`.

```bash
pnpm catalog:build
pnpm test        # confere IDs únicos, fontes e licenças
```

Mais detalhes em [PIPELINE-CATALOGO.md](PIPELINE-CATALOGO.md) e [DADOS.md](DADOS.md).

## 5. Rodar no BlueStacks

1. Instale o APK arrastando o arquivo para a janela do BlueStacks.
2. Em placas de vídeo antigas, use o renderizador **DirectX**, resolução 1280×720 e 4 GB de RAM nas configurações do BlueStacks.
3. O emulador não tem câmera real: no Novo avistamento, use **Galeria**.

## Problemas comuns

| Sintoma | Solução |
|---|---|
| App sem tela de login | O build não recebeu as variáveis do Supabase. Confira o `.env` ou os *secrets* do GitHub. |
| "Email not confirmed" ao entrar | Confirme o e-mail ou desative *Confirm email* em Authentication. |
| Fotos do catálogo não aparecem offline | Em Ajustes, use **Baixar fotos para uso offline** com internet. |
| Erro ao rodar SQL | As migrações são idempotentes: rode de novo e confira a mensagem de erro. |
