# PantanalDex — colaboração por GitHub

## Repositório compartilhado

O desenvolvimento colaborativo usa o repositório público:

`https://github.com/Souzzao/pantanal-dex`

A prévia atual do aplicativo continua disponível em:

`https://8081-iausgyir2g6c9aqyvcejb-f320377e.us3.manus.computer`

O repositório é a fonte de verdade para o código. O ambiente do Manus continua sendo usado pela Conta Coordenadora para preview, checkpoints e validação final.

## Branches

| Branch | Responsável | Finalidade |
|---|---|---|
| `main` | Conta Coordenadora | Código integrado e validado |
| `conta-2-catalogo` | Conta 2 | Espécies, fontes, imagens e catálogo |
| `conta-3-qualidade` | Conta 3 | Avistamentos, filtros, testes e interface |
| `integracao-ciclo-1` | Conta Coordenadora | Integração temporária do primeiro ciclo |

As Contas 2 e 3 devem criar suas alterações a partir da versão mais recente de `main`, trabalhando apenas na branch correspondente. Não fazer push direto para `main`.

## Fluxo de trabalho

A conta colaboradora deve clonar o repositório, atualizar `main`, trocar para sua branch de trabalho e implementar somente a frente atribuída. Antes de abrir um Pull Request, deve executar `pnpm check`, os testes relacionados e, quando houver alteração visual, verificar o preview.

O Pull Request deve ter título claro, resumo, arquivos alterados, verificações, screenshots quando aplicável, pendências e riscos. A Conta Coordenadora revisa o PR, resolve conflitos e integra em `main` somente após a validação.

## Conta 2 — catálogo científico

A Conta 2 deve trabalhar em conteúdo e catálogo. Prioridades: expandir o conjunto de espécies, cobrir mamíferos, aves, répteis, anfíbios, peixes e invertebrados, variar ambientes, preencher fontes, situação de conservação e créditos de imagem. Não alterar avistamentos, autenticação, banco remoto ou configuração Expo.

Branch: `conta-2-catalogo`.

## Conta 3 — avistamentos e qualidade

A Conta 3 deve trabalhar em edição de avistamentos, filtros, validação, exportação, testes determinísticos, acessibilidade e fallback de imagens. Não alterar o contrato científico das espécies sem abrir uma discussão no PR. Não adicionar serviços externos ou permissões novas sem autorização.

Branch: `conta-3-qualidade`.

## Conta Coordenadora

A Conta Coordenadora revisa ambos os PRs, executa TypeScript, lint, testes, revisão visual e integração. Ela é a única responsável por fazer merge em `main`, criar checkpoints e atualizar o backlog consolidado.

## Comandos básicos

```bash
git clone https://github.com/Souzzao/pantanal-dex.git
cd pantanal-dex
pnpm install
git checkout conta-2-catalogo   # Conta 2
git checkout conta-3-qualidade  # Conta 3
pnpm check
pnpm test
```

A branch deve ser atualizada antes do Pull Request:

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease origin NOME-DA-BRANCH
```

Mesmo sendo público, não colocar tokens, senhas, `.env`, `.project-config.json` ou credenciais no GitHub. Esses arquivos permanecem ignorados.

## Mensagem pronta para as contas colaboradoras

> O projeto agora está no repositório privado https://github.com/Souzzao/pantanal-dex. Clone o repositório e trabalhe somente na sua branch: `conta-2-catalogo` para conteúdo científico ou `conta-3-qualidade` para avistamentos/testes. Não faça push em `main`. Ao finalizar, abra um Pull Request contra `main` com resumo, arquivos, testes e pendências. A Conta Coordenadora fará a revisão e o merge.
