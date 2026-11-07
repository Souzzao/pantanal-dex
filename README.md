# PantanalDex

Aplicativo móvel de guia de campo para conhecer a fauna do Pantanal e registrar avistamentos.

O vínculo entre o MVP, os requisitos da disciplina e o plano de entrega está em [Alinhamento acadêmico](docs/ALINHAMENTO-ACADEMICO.md).

## O que já funciona

- Catálogo pesquisável, fichas de espécies com fontes e créditos de imagem.
- Caderno de avistamentos com foto obrigatória, data, notas e localização pelo GPS ou pelo mapa.
- Opção “Não sei” para espécie não identificada, validação do bioma Pantanal e até 30 novos registros por dia no aparelho.
- Lista, mapa, edição e exclusão de registros.
- Dados pessoais e preferências guardados no aparelho, com importação e exportação.

O catálogo e o caderno usam dados locais. Fotografias do catálogo são carregadas de fontes externas e podem precisar de internet na primeira abertura; se uma imagem não carregar, o app mostra uma alternativa visual.

O mapa regional usa o contorno oficial do IBGE e funciona offline, com ampliação e seleção manual do ponto. Ele não inclui ruas ou imagens de satélite. Fotos dos avistamentos são copiadas para a pasta permanente do app; a exportação JSON/CSV contém a referência local, sem anexar a imagem.

## Abrir o projeto

Requisitos: Node.js compatível com Expo SDK 54 e pnpm 9.

```bash
pnpm install --frozen-lockfile
pnpm dev:metro
```

Para iniciar no Android com um emulador ou aparelho conectado:

```bash
pnpm android
```

## Gerar um APK instalável

O APK de entrega é compilado pelo Expo Application Services (EAS). É preciso ter uma conta Expo e conexão com a internet.

1. Entrar na conta e vincular este projeto ao EAS:

   ```bash
   pnpm exec eas login
   pnpm exec eas init
   ```

2. Gerar o APK Android:

   ```bash
   pnpm build:android:apk
   ```

3. Abrir o link exibido pelo EAS, baixar o arquivo `.apk` e instalá-lo no aparelho Android. Na primeira instalação, o Android pode pedir autorização para instalar o arquivo baixado.

O primeiro build configura a assinatura Android no EAS. Guarde essa credencial na conta Expo: ela será necessária para publicar atualizações com o mesmo identificador do app. O perfil `production` está preparado para gerar um `.aab` para a Google Play.
