# PantanalDex — começar pelo GitHub

O compartilhamento por projeto do Manus ficou bloqueado entre as contas. A colaboração agora acontece pelo repositório privado do GitHub, usando branches e Pull Requests.

## Repositório

`https://github.com/Souzzao/pantanal-dex`

A Conta 2 trabalha na branch `conta-2-catalogo`. A Conta 3 trabalha na branch `conta-3-qualidade`. A Conta Coordenadora revisa e integra os Pull Requests em `main`.

## Como começar

O repositório agora é público, então não é necessário convite para clonagem. Basta abrir a URL e clonar o projeto:

```bash
git clone https://github.com/Souzzao/pantanal-dex.git
cd pantanal-dex
pnpm install
```

Conta 2:

```bash
git checkout conta-2-catalogo
```

Conta 3:

```bash
git checkout conta-3-qualidade
```

## Regras essenciais

Não fazer push em `main`. Não editar a frente da outra conta. Não incluir tokens, senhas, `.env` ou `.project-config.json`. Antes de abrir um Pull Request, execute `pnpm check` e `pnpm test`. Toda alteração visual deve ser verificada no preview.

## Entrega

Faça commit na própria branch e envie para o GitHub:

```bash
git add -A
git commit -m "feat: descreva a alteração"
git push origin NOME-DA-BRANCH
```

Depois abra um Pull Request contra `main`. O template já está configurado no repositório. A Conta Coordenadora fará a revisão, resolverá conflitos e integrará a alteração.

## Frentes

A Conta 2 trabalha apenas em espécies, fontes, imagens, créditos e catálogo. A Conta 3 trabalha apenas em avistamentos, filtros, edição, exportação, testes, acessibilidade e qualidade. Se uma alteração precisar cruzar as duas frentes, documente a dependência no Pull Request antes de implementá-la.

## Mensagem pronta para enviar

> O PantanalDex agora está no GitHub: https://github.com/Souzzao/pantanal-dex. Aceite o convite de colaborador, clone o repositório e trabalhe somente na sua branch. Conta 2: `conta-2-catalogo`. Conta 3: `conta-3-qualidade`. Não faça push em `main`; abra um Pull Request quando terminar. Use `COLABORACAO-GITHUB.md` e o guia da sua conta para o restante do fluxo.
