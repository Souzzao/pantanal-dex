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

## Checklist antes de cada versão

- [ ] `pnpm check` e `pnpm test` sem erros
- [ ] Nenhum segredo no diff (`git diff --cached | grep -iE "key|secret|token"`)
- [ ] Novas tabelas com RLS e políticas revisadas
- [ ] Avisos de segurança do Supabase (*Advisors*) conferidos
