# Como contribuir

O PantanalDex é mantido por **Felipe de Souza Aquino** ([@Souzzao](https://github.com/Souzzao)). Sugestões e relatos de problemas são bem-vindos pelas [issues](https://github.com/Souzzao/pantanal-dex/issues).

> O código é público para consulta e avaliação (veja [LICENSE](LICENSE)). Pull requests externos só são aceitos após conversa prévia em uma issue.

## Fluxo de trabalho

1. Crie uma branch a partir da `main`: `feat/nome-curto`, `fix/nome-curto` ou `docs/nome-curto`.
2. Faça commits pequenos e descritivos, em português.
3. Rode as verificações:
   ```bash
   pnpm check
   pnpm test
   ```
4. Abra um pull request preenchendo o modelo. A `main` é protegida: todo PR precisa da revisão do mantenedor e do CI verde.

## Padrões de código

- **Regras de negócio em `shared/`**, como funções puras com testes. Telas só exibem e chamam essas funções.
- TypeScript estrito; evite `any`.
- Textos visíveis passam pelo i18n (`shared/i18n/`) nos 4 idiomas.
- Comentários e documentação em português.
- Toda mudança no banco vira uma nova migração em `supabase/migrations/`, com RLS.

## Segurança

- Nunca envie `.env`, chaves, tokens ou senhas. Use `.env.example` como modelo.
- Falhas de segurança: siga [SECURITY.md](SECURITY.md), sem issue pública.
- Não exponha localização exata de avistamentos em telas ou logs públicos.
