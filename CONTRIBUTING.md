# Contribuindo com o PantanalDex

Leia `COLABORACAO-GITHUB.md` antes de editar. O projeto usa Pull Requests e não aceita push direto em `main` pelas contas colaboradoras.

## Antes de começar

Confirme a branch atribuída, atualize a referência de `main` e evite editar arquivos de outra frente. Não inclua segredos ou arquivos de configuração locais.

## Antes do Pull Request

Execute:

```bash
pnpm check
pnpm test
```

Se o lint estiver disponível no ambiente, execute também `pnpm lint`. Para mudanças de interface, registre o caminho testado e inclua uma captura do preview quando possível.

## Pull Request

Use o template do repositório. Explique o problema resolvido, o que foi alterado, os testes executados, as pendências e qualquer decisão que precise da Conta Coordenadora. Um PR incompleto deve permanecer aberto, não ser marcado como concluído.

## Política de integração

A Conta Coordenadora revisa contratos compartilhados, conflitos, segurança, privacidade e compatibilidade com Expo SDK 54. O merge só ocorre depois de TypeScript, testes e revisão visual passarem.
