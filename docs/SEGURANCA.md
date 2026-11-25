# Segurança

> Autor: Felipe de Souza Aquino · Para relatar falhas, veja [SECURITY.md](../SECURITY.md).

## Princípios

1. **O app não é confiável.** Qualquer pessoa pode modificar o APK; por isso toda regra que importa é repetida no servidor.
2. **Nenhum segredo no código.** O app só conhece a chave pública (*publishable/anon*), que é pública por natureza.
3. **Menor privilégio.** Cada perfil só enxerga e altera o que precisa.
4. **Privacidade por padrão.** A localização exata nunca é exibida publicamente.

## Modelo de ameaças

| Ameaça | Proteção |
|---|---|
| Alguém promove a própria conta a dev | `profiles` só permite ao usuário alterar a coluna `display_name` (privilégio por coluna). O papel só muda por `dev_set_role`, que exige papel `dev`. |
| Usuário comum tenta auditar | `audit_queue`, `review_sighting` e `review_log` verificam `my_role() in ('auditor','dev')` no servidor. |
| Escrita direta nas tabelas públicas | `authenticated` e `anon` não têm `INSERT`/`UPDATE` em `public_sightings`; toda escrita passa por funções que validam. |
| Spam de publicações | Limite de 30 por dia por conta em `publish_my_sighting`. |
| Data falsa ou ponto fora do Pantanal | Validado no app (`shared/sighting-rules.ts`, `shared/pantanal-boundary.ts`) e a data também no servidor. |
| Caça ou perturbação de espécies ameaçadas | O mapa mostra só uma célula arredondada + círculo de até 3 km. |
| Leitura anônima de dados | `anon` não tem acesso de leitura a `public_sightings`; é preciso estar logado. |
| Vazamento de chave no Git | `.gitignore` cobre `.env*`, chaves e credenciais; varredura de segredos do GitHub com bloqueio de push. |
| PR malicioso alterando o CI | Workflows com `permissions: contents: read`; PRs de forks não recebem segredos; `CODEOWNERS` exige revisão do mantenedor. |
| Push direto ou reescrita da `main` | Proteção de branch: PR obrigatório, sem push forçado e sem exclusão. |

## Banco de dados (Supabase)

- **RLS ativo** em `profiles`, `public_sightings` e `sighting_reviews`.
- Políticas:
  - `profiles`: cada pessoa vê o próprio perfil; auditores e devs veem todos. Atualização só do próprio nome.
  - `public_sightings`: leitura (logado) apenas de registros ativos, não recusados e não expirados.
  - `sighting_reviews`: sem políticas de leitura direta; acessado só pelas funções de auditoria.
- Funções `SECURITY DEFINER` (`publish_my_sighting`, `review_sighting`, `dev_*` etc.) conferem `auth.uid()` e o papel antes de agir, e não são executáveis por `anon`.
- Migrações versionadas em [`supabase/migrations/`](../supabase/migrations).

## Aplicativo

- Sessão guardada pelo cliente oficial do Supabase; sem login o app funciona em modo local.
- Dados do caderno separados por conta no aparelho.
- Fotos dos avistamentos ficam na pasta privada do app; a exportação leva só a referência.
- Imagens do catálogo passam por auditoria de licença (`shared/catalog/license-audit.ts`): licenças NC/ND são bloqueadas.

## Repositório

| Medida | Onde |
|---|---|
| Política de relato privado | [`SECURITY.md`](../SECURITY.md) |
| Revisão obrigatória do mantenedor | [`.github/CODEOWNERS`](../.github/CODEOWNERS) |
| CI com permissão mínima | [`.github/workflows/`](../.github/workflows) |
| Atualizações de segurança automáticas | [`.github/dependabot.yml`](../.github/dependabot.yml) |
| Modelo de variáveis sem segredos | [`.env.example`](../.env.example) |

## Blindagem da versão 3.9

**App (Android)**
- Backup automático do Android desligado (`allowBackup: false`): avistamentos com local exato e a sessão não vão para a nuvem do Google sem a pessoa querer. Para trocar de aparelho: Exportar.
- Permissões mínimas: localização (só durante o uso), câmera e internet. Bloqueadas as que bibliotecas costumam trazer (microfone, localização em segundo plano, telefone, armazenamento antigo, sobreposição de tela).
- Sem link curinga (`autoVerify` com `host: *`); esquema próprio `pantanaldex://` (Demo: `pantanaldex-demo://`).
- Links externos só abrem se forem `https` comuns (`shared/safe-url.ts`): bloqueia `intent:`, `file:`, `content:`, `javascript:` e endereços com usuário/senha.
- Mapa (WebView): sem acesso a arquivos do aparelho, sem conteúdo misto http/https, links abrem fora do app.
- Importação de cadernos e backups limitada a 5 MB (evita travar o app com arquivo gigante).
- Versão final sem caderno Teste e sem auditoria simulada (`shared/variant.ts`); a Demo é outro pacote.

**Servidor (Supabase)** — conferido com o Security Advisor em 18/11/2026
- RLS em todas as tabelas; `sighting_reviews` sem política de propósito (ninguém lê direto, só pelas funções).
- Funções `SECURITY DEFINER` chamáveis por quem está logado: são de propósito; cada uma confere `auth.uid()` e o papel (`my_role()`) antes de agir. `delete_my_account` só apaga a conta de quem chama.
- ⚠️ Proteção contra senhas vazadas (HaveIBeenPwned) desligada: no Supabase ela só existe no plano Pro. Hoje vale a regra de mínimo de 8 caracteres.

**Dependências**
- `pnpm audit --prod`: 8 alertas (3 altos), todos dentro de `@expo/cli` (ferramenta de build: `image-size`, `decode-uri-component`, `glob`, `minimatch`, `uuid`). Não vão para dentro do app instalado. Somem ao atualizar o Expo SDK — fazer depois da publicação, testando.

**Testes** — `tests/security-hardening.test.ts` e `tests/variant.test.ts` cobrem links, limite de importação, ausência de chaves secretas no código, WebView e as diferenças entre Demo e Final.

## Checklist antes de cada versão

- [ ] `pnpm check` e `pnpm test` sem erros
- [ ] Nenhum segredo no diff (`git diff --cached | grep -iE "key|secret|token"`)
- [ ] Novas tabelas com RLS e políticas revisadas
- [ ] Avisos de segurança do Supabase (*Advisors*) conferidos
