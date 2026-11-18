# Publicação na Google Play — PantanalDex 3.9

Tudo o que o Play Console pede, já preenchido para copiar e colar. Estado em 18/11/2026.

## 0. Antes de começar (bloqueios)

| Item | Situação |
|---|---|
| **Mapa de satélite comercial** | ⛔ A imagem atual (EOxCloudless) é **CC BY-NC-SA**: proibida em app pago. Trocar antes de publicar a versão paga (veja "Mapa" abaixo). A Demo pode continuar com ela (não é vendida). |
| Conta de desenvolvedor Google Play | ⬜ Taxa única de US$ 25. Conta pessoal nova: **teste fechado com 12 testadores por 14 dias seguidos** antes de liberar a produção. |
| Perfil de pagamentos (app pago) | ⬜ Play Console → Configurar → Perfil de pagamentos. Sem ele não dá para cobrar. |
| E-mail de contato | ⬜ Criar um e-mail para o app (aparece na loja e na política de privacidade). |
| Conta de teste para a revisão do Google | ⬜ O app exige login: criar uma conta só para a revisão e informar em "Acesso ao app". |

## 1. Gerar o arquivo para a loja (AAB)

A loja não aceita o APK do GitHub (assinado com chave de teste). O arquivo certo é o **AAB** do EAS:

```bash
eas build -p android --profile production      # versão final, AAB, assinatura gerenciada pelo Expo
eas build -p android --profile demo            # Demo (APK para instalar direto; não vai para a loja)
```

- Na primeira vez o EAS cria a **chave de envio** e guarda na conta Expo. No Play Console, aceite o
  **Play App Signing** (o Google guarda a chave definitiva).
- Pacote: `com.app.pantanaldex` — **não muda depois da primeira publicação**. Se quiser um nome
  próprio (ex.: `br.com.seunome.pantanaldex`), troque em `app.config.ts` antes do primeiro envio.
- Cada envio precisa de `versionCode` maior (`app.config.ts`, hoje 6).
- SDK 54 já mira o Android 16 (API 36), exigido para apps novos desde 31/08/2026.

## 2. Página da loja (pt-BR)

**Nome do app** (até 30): `PantanalDex: Guia do Pantanal`

**Descrição curta** (até 80):
`Guia de campo offline com 1.000 animais do Pantanal e caderno de avistamentos.`

**Descrição completa** (até 4000):

```
O PantanalDex é o guia de campo da fauna do Pantanal no seu bolso — funciona sem internet.

🦜 MAIS DE 1.000 ESPÉCIES
Aves, mamíferos, répteis, anfíbios, peixes e invertebrados do Pantanal, com até 6 fotos cada,
descrição, habitat, alimentação, comportamento e situação de conservação. Busque pelo nome popular
ou científico e filtre por grupo e ambiente.

📒 CADERNOS DE AVISTAMENTOS
Registre o que você viu: espécie, data, hora, local no mapa, quantidade, notas e foto. Organize em
cadernos (uma viagem, uma trilha, uma pesquisa), junte cadernos e exporte em JSON, CSV ou GeoJSON
para usar em planilhas e mapas.

🗺️ MAPAS
Veja seus avistamentos no mapa e a área de vida de cada espécie. Pontos turísticos do Pantanal.

🌎 MAPA PÚBLICO, COM PRIVACIDADE
Se quiser, publique avistamentos para o mapa público. Cada publicação é revisada por um auditor, e
o mapa mostra só uma área de cerca de 11 km — nunca o ponto exato — para proteger ninhos e
espécies ameaçadas.

🏅 COLEÇÃO E INSÍGNIAS
Complete sua coleção de espécies avistadas e ganhe insígnias.

📶 OFFLINE
Catálogo, fotos de capa e cadernos funcionam sem sinal, no meio do campo.

Fotos com licenças livres (CC0, CC BY, CC BY-SA) de iNaturalist, GBIF e Wikimedia Commons, com
crédito ao autor em cada ficha. Seus avistamentos ficam no seu aparelho; você escolhe o que publicar
e pode excluir a conta pelo próprio app.

Desenvolvido por Felipe de Souza Aquino, em Cáceres/MT.
```

**Categoria:** Educação (alternativa: Livros e referências) · **Tags:** natureza, animais, guia de campo
**Política de privacidade:** https://github.com/Souzzao/pantanal-dex/blob/main/docs/PRIVACIDADE.md

**Imagens exigidas**
- Ícone 512×512 PNG (de `assets/images/icon.png`).
- Imagem de destaque 1024×500.
- 2 a 8 capturas do celular (sugestão: lista de animais, ficha da espécie, novo avistamento, cadernos, mapa, coleção).

## 3. Segurança dos dados (formulário "Data safety")

**O app coleta ou compartilha dados?** Sim. **Criptografados em trânsito?** Sim.
**O usuário pode pedir exclusão?** Sim — no app (Ajustes → Sua conta → Excluir minha conta) e pelo link:
https://github.com/Souzzao/pantanal-dex/issues (informar em "URL para exclusão da conta").
**Compartilhados com terceiros?** Não (o Supabase é prestador de serviço, não conta como compartilhamento).

| Tipo de dado (Play) | Coletado | Obrigatório? | Finalidade |
|---|---|---|---|
| Informações pessoais → Endereço de e-mail | Sim | Obrigatório | Gerenciamento da conta |
| Informações pessoais → Nome | Sim | Obrigatório | Funcionalidade do app, gerenciamento da conta |
| Local → Local exato | Sim | Opcional (só ao publicar) | Funcionalidade do app |
| Local → Local aproximado (zonas de ~11 km) | Sim | Opcional (só em equipes) | Funcionalidade do app |
| Atividade no app → Outras ações (espécies registradas e número de avistamentos) | Sim | Opcional (só em equipes) | Funcionalidade do app |
| Fotos e vídeos → Fotos | Sim | Opcional (só ao publicar) | Funcionalidade do app |
| Mensagens/Conteúdo do usuário → Outro conteúdo gerado pelo usuário (notas) | Sim | Opcional (só ao publicar) | Funcionalidade do app |

Não coletados: identificadores do dispositivo, contatos, apps instalados, histórico de navegação,
informações financeiras, saúde, áudio, arquivos. Avistamentos que ficam só no aparelho **não** contam
como coleta.

## 4. Outras declarações do Play Console

- **Anúncios:** o app não contém anúncios.
- **Acesso ao app:** "Toda a funcionalidade exige login" → informar e-mail e senha da conta de revisão.
- **Público-alvo:** 13 anos ou mais (não marcar faixas infantis: evita a política de Famílias).
- **Classificação de conteúdo (IARC):** categoria "Referência, notícias ou educação"; sem violência,
  sexo, linguagem imprópria, drogas ou jogos de azar; **não** permite troca de conteúdo livre entre
  usuários (o público vê só espécie, data e área); compartilha localização só de forma aproximada no
  mapa público → resultado esperado: **Livre**.
- **App de notícias / governo / saúde / financeiro:** não.
- **Permissões sensíveis:** localização só em primeiro plano; sem localização em segundo plano.

## 5. Ordem sugerida

1. Resolver o mapa comercial e o e-mail de contato.
2. `eas build --profile production` → criar o app no Play Console (pago, Brasil) → enviar o AAB no
   **Teste fechado**.
3. Convidar 12+ testadores (Google Grupos ou lista de e-mails; em app pago, cadastrá-los como
   **testadores de licença** para instalarem sem pagar). Manter 14 dias.
4. Preencher página da loja, Segurança dos dados, classificação, público-alvo, acesso ao app.
5. Pedir acesso à produção → enviar para revisão.

## Mapa — opções para a versão paga

| Opção | Custo | Observação |
|---|---|---|
| **Esri World Imagery** (ArcGIS Location Platform) | Grátis até 2 milhões de azulejos/mês, depois pago | Uso comercial permitido com chave de API; muito parecido com o atual |
| **MapTiler Satellite** | Plano pago para uso comercial | Chave de API |
| **EOxCloudless com licença comercial** | Sob consulta (EOX) | Mantém a imagem atual |
| **Só mapa de ruas** (OpenFreeMap / OSM) | Grátis | Perde a imagem de satélite |

A troca é só a URL e o crédito em `TILE_LAYERS` (`shared/street-map.ts`).
