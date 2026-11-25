# Instruções do repositório — PantanalDex

Guia para quem contribui (pessoas ou assistentes de IA). O autor e revisor final é Felipe de Souza Aquino.

## Mapa do código

- Telas e rotas (Expo Router): `app/` — abas em `app/(tabs)/`
- Interface compartilhada: `components/` — movimento em `components/motion.tsx`, efeitos em `components/orbit-effects.tsx`, barra em `components/FloatingTabBar.tsx`
- Tokens de cor: `theme.config.js` (preto quente + amarelo `#FFC400`); fonte de títulos: Fraunces
- Estado: `contexts/` (Auth, App/cadernos, Teams, Publications)
- Regras de negócio puras e testáveis: `shared/` (catálogo, cadernos, equipes, variante Demo/Final)
- Integrações: `lib/` (Supabase, equipes, fotos)
- Banco: `supabase/migrations/` (RLS fechada; acesso só por funções que conferem `auth.uid()`), testes SQL em `supabase/tests/`
- Catálogo e fotos: `scripts/catalog/` (o build usa `data/traits`, que não fica no git)
- Testes: `tests/` (Vitest)

## Comandos verificados

- Instalação: `pnpm install --frozen-lockfile` (Node 20, pnpm 9)
- Servidor local: `pnpm start` (`APP_VARIANT=demo pnpm start` para a versão Demo)
- Tipos: `pnpm check` · Lint: `pnpm lint`
- Testes: `pnpm test` · SQL de equipes: `npm i --no-save @electric-sql/pglite && node supabase/tests/teams.sql-test.mjs`
- APK: GitHub Actions (`.github/workflows/apk.yml`) gera Final e Demo; AAB da loja: `eas build -p android --profile production`

## Convenções

- Uma branch e um PR por mudança; nunca enviar direto para `main`. O merge é feito pelo autor.
- Reaproveite componentes e fluxos existentes; textos da interface em português (traduções em `shared/i18n`).
- Animações curtas, com mola, e sempre com alternativa para "reduzir movimento".
- Fotos do catálogo só com licença CC0, CC BY ou CC BY-SA, sempre com crédito.
- Privacidade: o local exato nunca sai do aparelho, exceto para o auditor ao publicar; equipes veem só zonas de ~11 km.
- Nunca versionar `.env`, `.project-config.json`, chaves ou senhas; a chave `service_role` nunca vai para o app.
- No PR, preencha a tabela de evidências (critério, verificação, resultado, evidência) e liste o que não foi testado.
