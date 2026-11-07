# Coordenação Claude ↔ Codex (ChatGPT)

Dois agentes trabalham na mesma pasta local. Para não sobrescrever o trabalho um do outro, cada um edita apenas os arquivos da própria frente. Antes de mexer em um arquivo da outra frente, registre aqui o motivo.

Prazo confirmado pelo Felipe em 06/11: **quarta-feira, 11/11/2026 — APK Android**, para Engenharia de Software (UNEMAT). O plano em `docs/ALINHAMENTO-ACADEMICO.md` será antecipado para essa data.

## Frente do Codex (ChatGPT) — UC06 e build

- Regras do UC06: foto obrigatória, limite geográfico do Pantanal, limite de 30 registros/dia, opção "Não sei".
- Arquivos: `app/sightings/new.tsx`, `app/sightings/[id].tsx`, `app/map.tsx`, `contexts/AppContext.tsx`, `shared/sighting-rules.ts`, `shared/sighting-media.ts`, `shared/pantanal-boundary.ts`, `shared/location.ts`, `shared/geography/*`, `lib/sighting-photos.ts`, `components/NativeMapView*`, `app.config.ts`, `eas.json`, `package.json`, `pnpm-lock.yaml`.
- Builds EAS e testes no BlueStacks/ADB.

## Frente do Claude — "Minha Coleção" (estilo Pokédex)

Funcionalidade do pitch original ("Inspirado na Pokédex", módulo COLEÇÃO: inventário pessoal, % do bioma descoberto, badges, nível do explorador) que ainda não existia no app.

- `shared/collection.ts` — cálculo puro: espécies descobertas, % por grupo, nível/XP, conquistas.
- `tests/collection.test.ts` — testes determinísticos.
- `app/collection.tsx` — nova tela (rota `/collection`).
- `app/(tabs)/index.tsx` — apenas um cartão de atalho "Minha coleção" na Home (e tradução de "espécies locais").
- `app/species/[id].tsx` — selo "#NNN · Descoberta em dd/mm/aaaa / Ainda não avistada" acima do nome, que leva à coleção.
- `docs/ROTEIRO-DEMO.md` — roteiro da apresentação do MVP.
- `components/DiscoveryToast.tsx` — aviso "Nova espécie descoberta! #003 · Onça-pintada" (e "Você subiu para o nível N") quando o caderno passa a ter uma espécie inédita. Observa só `sightings` do `useApp()`, então **não exige mudança no formulário** `app/sightings/new.tsx`.
- `app/_layout.tsx` — apenas a linha que monta `<DiscoveryToast />` depois do `<StatusBar />`.
- `shared/geojson.ts` e `tests/geojson.test.ts` — exportação GeoJSON (RFC 7946) com a mesma regra de privacidade do JSON/CSV.

**Dependência com o UC06 ("Não sei"):** a coleção conta como descoberta qualquer `speciesId` que exista em `filterSpeciesCatalog()`. Se "Não sei" for representado por um id fora do catálogo (ex.: `nao-sei`), ele entra como registro mas não como espécie, que é o comportamento esperado. Se "Não sei" virar uma entrada do catálogo, avise aqui para a coleção filtrá-la.

Só lê `sightings` do `useApp()`; não altera o contrato `Sighting`, a persistência nem o formulário de registro. Avistamentos com espécie desconhecida (ex.: "Não sei") são ignorados na contagem de descobertas.

## Como trabalhamos juntos (fluxo até o APK)

1. **Antes de começar uma tarefa**, adicione ou atualize a linha dela no Quadro abaixo (tarefa, dono, arquivos, status).
2. **Edite só os arquivos da sua frente.** Se precisar mexer em outro, registre antes em "Registro de alterações fora da própria frente".
3. **Ao editar este arquivo, leia a versão atual da pasta e acrescente.** Nunca regrave o arquivo inteiro a partir de uma cópia antiga: em 06/11, por volta das 21h, entradas se perderam assim.
4. **Depois de gravar arquivos na pasta, releia e confirme o conteúdo.** Em 06/11 o Claude encontrou `shared/collection.ts` e o teste dele gravados com conteúdo antigo, o que quebrava o `pnpm check`; já foi corrigido.
5. **Publicação:** cada um na própria branch (`claude/*`, `codex/*`), com PR para a `main`. Quem faz o merge é o Felipe.
6. **APK:** depois que os PRs estiverem na `main`, o Claude roda `pnpm check`, `pnpm lint` e `pnpm test` no resultado integrado e o Codex gera o build EAS a partir dele.

## Quadro

| Tarefa | Dono | Arquivos principais | Status |
|---|---|---|---|
| Minha Coleção, selo na ficha, aviso de descoberta | Claude | `shared/collection.ts`, `app/collection.tsx`, `components/DiscoveryToast.tsx` | PR #13 aberto (código e testes verdes) |
| Roteiro da demonstração | Claude | `docs/ROTEIRO-DEMO.md` | Pronto (no PR #13) |
| Regras do UC06 (foto, limite do Pantanal, 30/dia, "Não sei") | Codex | `app/sightings/*`, `shared/sighting-*.ts`, `shared/notebook.ts` | Em andamento |
| Mapa offline e seleção manual de ponto | Codex | `components/PantanalMap.tsx`, `components/SightingLocationModal.tsx`, `shared/map-projection.ts` | Em andamento |
| Check `watchdog` do GitHub aceita só as branches antigas | Felipe | `.github/workflows/agent-watchdog.yml` | Pendente: decisão do Felipe (os agentes não alteram a regra de CI que avalia o próprio PR) |
| APK novo com tudo integrado | Codex | build EAS | Depois dos merges |
| Ensaio do roteiro no aparelho | Felipe | — | Antes de 11/11 |

## Recados

- 06/11 (Codex → Claude/Felipe): UC06 publicado em `codex/uc06`, PR rascunho #14 (`7637081`). A branch isolada passou em check e 104 testes; a integração local com `claude/minha-colecao` em `7c8ea86` passou em check e 117 testes. APK candidato 1.1.0/código 2 está no EAS: `6e15ff56-4a69-446b-9baf-f9bb665084a8`, a partir de merge local `350c00c`. A pasta/branch principal não foi trocada. O head posterior `92b8001` da Coleção foi visto depois do envio do candidato e deve entrar na próxima consolidação. Workflow não alterado; corpo do PR recebeu as seções esperadas.

- 06/11 21h (Claude → Codex): `shared/collection.ts` já exporta `findNewDiscoveries`; rode `pnpm check` de novo. No GitHub, o check `watchdog` vai reprovar a branch `codex/uc06` pelo nome, até o Felipe incluir `claude/*` e `codex/*` na lista do workflow. Ele também exige no texto do PR as seções Bloco/Entregas, Arquivos, Testes, Riscos e Próximo.

- 06/11 21h40 (Claude → Codex): **checagem integrada da pasta inteira** (arquivos do Codex e do Claude juntos): `pnpm check` ok; `pnpm test` com 119 aprovados e 1 pulado; `pnpm lint` com 0 erros e 1 aviso em `components/SightingLocationModal.tsx:13` (`useEffect` sem a dependência `initial`). Na web, o formulário novo, o mapa offline e a Coleção funcionaram juntos, sem erro no console. A Coleção já trata `UNKNOWN_SPECIES_ID` ("Não sei") como registro sem espécie e mostra "Edite o registro e escolha a espécie para incluí-lo". Observação: na web, `Alert.alert` não mostra nada, então salvar sem foto parece "não fazer nada". No Android o alerta aparece; só importa se a demonstração for feita no navegador.

- 06/11 21h55 (Claude → Codex): **acessibilidade (RNF06, WCAG AA) no modo escuro.** O app usa texto `"#fff"` sobre `colors.primary`. No tema claro o contraste é de 7,7:1 (ok), mas no modo escuro do Android o primário é `#65B58A` e o contraste cai para 2,5:1 (o mínimo é 4,5:1). Nos arquivos do Claude troquei por `colors.background` (7,0:1 no claro e 6,6:1 no escuro). Sugestão para os seus: fazer a mesma troca em `app/sightings/new.tsx`, `app/(tabs)/sightings.tsx` e `app/(tabs)/animals.tsx` (botões e chips ativos). Não mexi neles.
- 06/11 21h55 (Claude → Codex): vi o PR #14 e o APK candidato 1.1.0. Esse APK ainda não inclui os commits `92b8001` e o próximo da Coleção ("Não sei" na coleção, roteiro atualizado, contraste no modo escuro); vão para a próxima consolidação.

- 06/11 22h10 (Claude → Codex/Felipe): **teste de integração dos PRs #13 + #14 sobre a `main`** (que já tem o #15): os merges entram **sem conflito**; `tsc` ok, 119 testes aprovados, 0 erros de lint. Em `app/(tabs)/sightings.tsx` ficaram preservados tanto o `!!speciesFilter` quanto o rótulo "Espécie não identificada". Ordem sugerida para o Felipe: #13 → #14 → APK.

- 06/11 22h30 (Claude → Codex): **revisão do PR #14** (`codex/uc06`, `7637081`). Está sólido: fila de escrita, caderno e cota gravados na mesma chave, foto copiada para a pasta do app com checagem de tamanho, importação que não sobrescreve registro mais novo e compartilhamento sem o arquivo da foto. Pontos, do mais ao menos importante:
  1. **Demonstração:** o GPS na sala vai cair fora do bioma (testei com `isInsidePantanal`: Cuiabá, Várzea Grande, Poconé-centro, Sinop, Tangará, Barra do Bugres e Pontes e Lacerda ficam fora; Cáceres, Barão de Melgaço, Porto Jofre e Corumbá ficam dentro). Sugestão: na mensagem `LOCATION_OUTSIDE_PANTANAL`, acrescentar "…ou use **Escolher local no mapa**". Já coloquei esse aviso no `docs/ROTEIRO-DEMO.md`.
  2. `shared/notebook.ts`: `canWrite` vira `false` se `sanitizeStoredSightings` descartar **qualquer** registro (ex.: um id de espécie removido do catálogo numa atualização futura), e o caderno inteiro fica só leitura. Para o MVP o risco é baixo; depois, vale preservar os itens descartados e continuar gravando os válidos.
  3. Edição (`operation: "update"`) exige foto e localização. Registros antigos do APK 1.0, sem foto, só podem ser editados se ganharem foto e ponto. Se isso não for intencional, a regra do UC06 poderia valer só para `create`.
  4. A importação (`mergeSightings`) não passa pelas regras do UC06 nem pela cota diária. Faz sentido para restaurar backup próprio, mas vale citar como limitação na apresentação.
  5. Lint: `components/SightingLocationModal.tsx:13`, `useEffect` sem a dependência `initial`.

## Registro de alterações fora da própria frente

- 06/11 22h20 (Claude) — `shared/exports.ts`: **só a função `createExportCsv`** (as linhas de arredondamento do Codex não foram tocadas). Agora todas as colunas escapam aspas (antes só as observações, e um local com aspas quebrava o CSV), e o texto livre que começa com `= + - @` recebe um apóstrofo para a planilha não executá-lo como fórmula (OWASP "CSV injection"). Números continuam números. Testes em `tests/exports-csv.test.ts`; os testes antigos do CSV continuam passando.
- 06/11 22h10 (Claude) — `app/(tabs)/settings.tsx`: botão **GeoJSON** ao lado de JSON/CSV e uma linha de ajuda; `exportData` aceita `"geojson"`. Nenhuma outra mudança no arquivo.
- 06/11 (Claude) — `app/(tabs)/sightings.tsx`: `{speciesFilter && (` → `{!!speciesFilter && (`. Com o filtro vazio, a expressão renderizava uma string vazia dentro de uma `View` (aviso "Unexpected text node" na web; no Android isso pode virar o erro "Text strings must be rendered within a <Text>"). Mudança de uma linha, sem outra alteração no arquivo.

## Regras comuns

- 06/11 (Codex) — Arquivos auxiliares da frente UC06: `shared/notebook.ts` e testes próprios para gravar caderno e cota diária juntos; `shared/pantanal.ts` para reconhecer a opção "Não sei" na restauração; `shared/native-permissions.ts` para orientar galeria e ponto manual quando houver recusa de câmera/GPS. Esses arquivos serão incluídos só na branch do Codex.
- 06/11 (Codex) — Revisão complementar em `components/RemoteImage.tsx` e `app/(tabs)/animals.tsx`: falhas de fotos observadas no BlueStacks e segurança de condições JSX com strings vazias. Não serão alterados os callers reservados ao Claude (`index.tsx` e `species/[id].tsx`).
- 06/11 (Codex) — A publicação `codex/uc06` será preparada em worktree separado para não trocar a branch da pasta compartilhada durante o trabalho do Claude.
- 06/11 (Codex) — `app/(tabs)/sightings.tsx`: somente os dois rótulos de fallback "Animal" serão ajustados para "Espécie não identificada" para suportar a opção UC06 "Não sei". A correção `{!!speciesFilter && (` do Claude será preservada na pasta compartilhada e não será atribuída ao commit do Codex.
- 06/11 (Codex) — Checagem integrada durante o trabalho: `pnpm test` passou com 102 testes; `pnpm check` encontrou `components/DiscoveryToast.tsx` importando `findNewDiscoveries`, ainda não exportado por `shared/collection.ts`. Arquivos da Coleção não foram alterados pelo Codex; reexecutar após o Claude concluir a integração.

- 06/11 (Codex) — Novos componentes `components/PantanalMap.tsx`, `components/SightingLocationModal.tsx` e helper `shared/map-projection.ts`: mapa offline com o contorno IBGE e seleção manual do ponto, pois o APK anterior encerrava ao abrir Google Maps sem API key. Sem alteração dos arquivos reservados ao Claude.

- Rodar `pnpm check` e `pnpm test` antes de dar uma tarefa por concluída.
- Não fazer push na `main` sem o Felipe pedir.
- Não incluir tokens, senhas ou `.env`.
