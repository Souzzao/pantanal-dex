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

**Dependência com o UC06 ("Não sei"):** a coleção conta como descoberta qualquer `speciesId` que exista em `filterSpeciesCatalog()`. Se "Não sei" for representado por um id fora do catálogo (ex.: `nao-sei`), ele entra como registro mas não como espécie, que é o comportamento esperado. Se "Não sei" virar uma entrada do catálogo, avise aqui para a coleção filtrá-la.

Só lê `sightings` do `useApp()`; não altera o contrato `Sighting`, a persistência nem o formulário de registro. Avistamentos com espécie desconhecida (ex.: "Não sei") são ignorados na contagem de descobertas.

## Registro de alterações fora da própria frente

- 06/11 (Claude) — `app/(tabs)/sightings.tsx`: `{speciesFilter && (` → `{!!speciesFilter && (`. Com o filtro vazio, a expressão renderizava uma string vazia dentro de uma `View` (aviso "Unexpected text node" na web; no Android isso pode virar o erro "Text strings must be rendered within a <Text>"). Mudança de uma linha, sem outra alteração no arquivo.

## Regras comuns

- 06/11 (Codex) — Arquivos auxiliares da frente UC06: `shared/notebook.ts` e testes próprios para gravar caderno e cota diária juntos; `shared/pantanal.ts` para reconhecer a opção "Não sei" na restauração; `shared/native-permissions.ts` para orientar galeria e ponto manual quando houver recusa de câmera/GPS. Esses arquivos serão incluídos só na branch do Codex.
- 06/11 (Codex) — Revisão complementar em `components/RemoteImage.tsx` e `app/(tabs)/animals.tsx`: falhas de fotos observadas no BlueStacks e segurança de condições JSX com strings vazias. Não serão alterados os callers reservados ao Claude (`index.tsx` e `species/[id].tsx`).
- 06/11 (Codex) — A publicação `codex/uc06` será preparada em worktree separado para não trocar a branch da pasta compartilhada durante o trabalho do Claude.

- Rodar `pnpm check` e `pnpm test` antes de dar uma tarefa por concluída.
- Não fazer push na `main` sem o Felipe pedir.
- Não incluir tokens, senhas ou `.env`.
