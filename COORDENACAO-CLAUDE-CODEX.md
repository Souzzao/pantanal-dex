# Coordenação Claude ↔ Codex (ChatGPT)

Dois agentes trabalham na mesma pasta local. Para não sobrescrever o trabalho um do outro, cada um edita apenas os arquivos da própria frente. Antes de mexer em um arquivo da outra frente, registre aqui o motivo.

Prazo da entrega: **dia 11/11/2026 — APK Android** para Engenharia de Software (UNEMAT). Em 06/11 o Felipe corrigiu o prazo ("o MVP é para sexta dia 11"). Como 11/11 cai numa quarta-feira, trabalhamos com **quarta 11/11** como data-limite até ele confirmar. O plano semanal em `docs/ALINHAMENTO-ACADEMICO.md` ainda cita 13/11 e precisa ser antecipado.

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

Só lê `sightings` do `useApp()`; não altera o contrato `Sighting`, a persistência nem o formulário de registro. Avistamentos com espécie desconhecida (ex.: "Não sei") são ignorados na contagem de descobertas.

## Registro de alterações fora da própria frente

- 06/11 (Claude) — `app/(tabs)/sightings.tsx`: `{speciesFilter && (` → `{!!speciesFilter && (`. Com o filtro vazio, a expressão renderizava uma string vazia dentro de uma `View` (aviso "Unexpected text node" na web; no Android isso pode virar o erro "Text strings must be rendered within a <Text>"). Mudança de uma linha, sem outra alteração no arquivo.

## Regras comuns

- Rodar `pnpm check` e `pnpm test` antes de dar uma tarefa por concluída.
- Não fazer push na `main` sem o Felipe pedir.
- Não incluir tokens, senhas ou `.env`.
