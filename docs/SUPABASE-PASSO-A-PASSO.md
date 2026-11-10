# Ligar o mapa público online (Supabase) — passo a passo

Tempo: uns 15 minutos. Custo: zero (plano gratuito). Não precisa saber programar.

> **Situação em 07/11 (09h):** os passos 1 a 4 **já foram feitos pelo Claude** pelo conector do Supabase: projeto `pantanal-dex` (org Souzaodev, São Paulo), migração aplicada, avisos de segurança conferidos. **Falta o Felipe** (o Claude não pode gravar arquivo `.env` pela ponte com o PC): criar o `.env.local` (passo 4, copiando URL e chave do painel, passo 3) e as variáveis na EAS (passo 5). Uns 5 minutos. Este guia fica para refazer do zero, se precisar.

> **Regras de ouro**
> - **Nunca cole chaves no chat** (nem com o Claude, nem com o Codex). Elas só vão para o arquivo `.env.local` e para o painel da Expo.
> - Use **só** a chave `anon` / `publishable`. A chave `service_role` / `secret` **nunca** vai para o app, para o `.env` ou para o GitHub.
> - Se você não fizer nada disso, o app continua funcionando: o mapa público só mostra os registros do próprio celular e os exemplos.

## 1. Criar a conta e o projeto

1. Abra **supabase.com** → **Start your project** → entre com o GitHub (mais rápido).
2. **New project**:
   - Organization: a sua (pode ser a pessoal).
   - Name: `pantanal-dex`
   - Database Password: clique em **Generate a password** e guarde no seu gerenciador de senhas (não precisa colar em lugar nenhum do app).
   - Region: **South America (São Paulo)**.
   - Plano: **Free**.
3. Clique **Create new project** e espere 1–2 minutos até o painel ficar verde.

## 2. Criar a tabela e as regras de segurança

1. No menu da esquerda, abra **SQL Editor** → **New query**.
2. No seu computador, abra o arquivo `supabase/migrations/20261107000000_public_feed.sql` (no VS Code ou no Bloco de Notas), copie **tudo** e cole no editor.
3. Clique **Run**. Deve aparecer **Success. No rows returned**.
4. Confira: menu **Table Editor** → deve existir a tabela `public_sightings` com um cadeado (RLS ligado).

## 3. Pegar o endereço e a chave pública

1. Menu **Project Settings** (engrenagem) → **API** (ou **Data API** / **API Keys**, o nome muda às vezes).
2. Você vai precisar de duas coisas:
   - **Project URL** — algo como `https://abcdxyz.supabase.co`
   - **anon public** (ou **publishable**) key — um texto comprido.
3. **Não copie** a que diz `service_role` ou `secret`.

## 4. Colocar no app (para testar no Expo Go / no seu PC)

1. Na pasta do projeto, crie um arquivo chamado **`.env.local`** (com o ponto na frente). Esse nome já está no `.gitignore`, então **não sobe para o GitHub**.
2. Escreva exatamente estas duas linhas, trocando pelos seus valores:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=cole-aqui-a-chave-anon
   ```

3. Salve, pare o Expo e rode de novo (`npx expo start`). Abra **Mapa público**: o aviso no topo deve mudar de **"Somente neste aparelho"** para **"Online: registros públicos de todas as pessoas"**.

## 5. Colocar no APK (build da EAS)

O `.env.local` não vai para o servidor da Expo quando o Codex faz o build. Por isso:

1. Abra **expo.dev** → seu projeto **pantanal-dex** → **Environment variables**.
2. **Add variable** duas vezes:
   - `EXPO_PUBLIC_SUPABASE_URL` = o Project URL — ambiente **preview** (e **production** se quiser), visibilidade **Plain text**.
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = a chave anon — ambiente **preview**, visibilidade **Plain text** (ela é pública por definição).
3. Avise o Codex só **"variáveis do Supabase criadas na EAS"** — **sem colar os valores**. Ele faz o build `preview` normalmente.

**Atalho (sem digitar nada):** no terminal, na pasta do projeto, `npx eas-cli env:push --path .env.local --environment preview` copia as duas variáveis do `.env.local` para a EAS.

## 6. Teste rápido (2 celulares ou 1 celular + Expo Go)

1. No celular A: novo avistamento com visibilidade **Compartilhável** → ele entra no mapa público automaticamente (30 dias).
2. No celular B: abra **Mapa público** → **Atualizar** → o registro aparece (na célula de ~11 km, não no ponto exato).
3. No celular A: **Meus registros públicos** → **Encerrar** → no B, **Atualizar** → sumiu.
4. Sem internet no A: publique outro → aparece "1 envio pendente" → ligue a internet → **Atualizar** → sobe.

## Se algo der errado

| Sintoma | O que fazer |
|---|---|
| Mapa diz "Somente neste aparelho" | O app não achou as variáveis. Confira o nome do arquivo (`.env.local`) e os nomes das variáveis; reinicie o Expo. No APK: confira a EAS. |
| Mapa diz "Sem conexão" | Sem internet, ou o URL está errado (precisa começar com `https://`). |
| Erro ao rodar o SQL | Rode de novo: o arquivo pode ser executado mais de uma vez sem estragar nada. Se persistir, mande **a mensagem de erro** (não as chaves) para o Claude. |
| Registro não sobe | Pode ter batido o limite de 30 publicações por dia por aparelho, ou a data está no futuro. |
| Vazou a chave `service_role` | Painel → API Keys → **Reset/Roll** a chave na hora. |

Sobre os avisos do painel (Security Advisor): sobram 2 avisos amarelos dizendo que `publish_sighting` e `end_publication` podem ser chamadas sem login. **É de propósito:** são a única porta de escrita e conferem segredo, grade de 0,1°, data e limite diário. O aviso vermelho de "view security definer" foi resolvido (a view agora usa as permissões de quem consulta).

Detalhes do que é guardado e por quê: `DADOS.md`.
