# Política de segurança

## Versões com suporte

| Versão | Suporte |
|---|---|
| 1.3.x | ✅ |
| < 1.3 | ❌ |

## Como relatar uma vulnerabilidade

**Não abra uma issue pública.** Use o relato privado do GitHub:
[Security → Report a vulnerability](https://github.com/Souzzao/pantanal-dex/security/advisories/new).

Inclua o que encontrou, como reproduzir e o impacto possível. A resposta inicial sai em até 7 dias.

## Como o projeto se protege

**Repositório**
- A branch `main` é protegida: só recebe mudanças por pull request revisado pelo mantenedor, sem push forçado e sem exclusão.
- `CODEOWNERS` exige a revisão de [@Souzzao](https://github.com/Souzzao) em todo PR.
- O CI roda com permissão mínima (`contents: read`). PRs de forks não recebem segredos.
- Dependabot avisa sobre dependências vulneráveis; a varredura de segredos do GitHub bloqueia chaves enviadas por engano.

**Segredos**
- Nenhuma chave fica no código. O app lê `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` do `.env` local ou dos *secrets* do GitHub Actions.
- A chave `anon/publishable` é pública por natureza; quem protege os dados é o RLS do banco.
- A chave `service_role` **nunca** entra no app nem no repositório.

**Dados e privacidade**
- Row Level Security ativo em todas as tabelas (`supabase/migrations`).
- O papel do usuário (usuário, auditor, dev) é conferido no servidor, nunca só na tela.
- O mapa público mostra apenas uma área arredondada, nunca o ponto exato do avistamento.
- Publicações têm limite diário, data não pode ser futura e o ponto precisa estar no Pantanal.
- Registros só ficam públicos depois de auditados.

Detalhes técnicos em [`docs/SEGURANCA.md`](docs/SEGURANCA.md).
