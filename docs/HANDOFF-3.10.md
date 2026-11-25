# Handoff 3.10: o que já foi feito e o que falta

Branch: `claude/v310-interacao` (sai de `claude/v39`, PR #40). Nunca enviar direto para `main`.
Pacotes de referência: "Auditoria UX" (câmera, galeria, mapa) e "Equipes e Personagens".

## Já feito (tipos passam em `pnpm check`)

- **Ícones gerados no ChatGPT** no lugar dos emojis: 48 figuras em `assets/icons/*.png`. Os nomes estão em `shared/art-names.ts` e o componente é `components/ArtIcon.tsx`. Os glifos de controle (setas, fechar, câmera do HUD) são vetor, em `shared/icon-paths.ts` + `components/Icon.tsx`.
  - Já trocado em: coleção, cadernos (`NOTEBOOK_ART`), ajustes, login, pontos turísticos (`icon` virou nome de figura) e grupos (`groupIcon`).
- **Câmera primeiro:** `components/CaptureHud.tsx`, usado em `app/sightings/new.tsx`. Fluxo: visor → lote → importar → revisar → Continuar → detalhes. Dependência `expo-camera` e plugin em `app.config.ts`.
- **Várias fotos por registro:** campo `extraPhotoUris` em `Sighting` (`shared/pantanal.ts`) e helper `photosOf`.
- **Galeria "Minhas fotos"** em `app/collection.tsx` (aba), com visualizador e "Abrir registro". Regras em `shared/photo-gallery.ts`.
- **Equipes, servidor:** `supabase/migrations/20261125100000_team_records.sql`.
  - Criado: personagem no perfil, `team_member_avatars`, `team_records`, `share_team_record` (idempotente), `update_team_record`, `delete_team_record`, bucket `team-media` com políticas.
  - Teste: `node supabase/tests/team-records.sql-test.mjs` cobre T01–T10, e todos passam.
  - **Aplicado no Supabase**, menos `delete_team_record` e a política "equipe: autor apaga", que precisam de confirmação manual. Rode esses dois trechos do arquivo no SQL Editor.
- **Equipes, cliente:** `shared/team-records.ts` (regras puras), `lib/teams.ts` (RPCs, upload, URLs assinadas) e `contexts/TeamsContext.tsx`.
  - O contexto expõe `avatar`/`saveAvatar`, `records`/`loadRecords`, `shareRecord` (fila offline), `editRecord`, `removeRecord` e `photoUrls`.
  - Novo registro: seletor "Coleção da equipe" ao salvar.
- `components/Avatar.tsx`: o personagem da demo (cor, olhos, acessório).

## Falta

1. **`app/teams.tsx`**
   - Trocar os emojis (👥 🦜 🐊 🐆 🦦 🐟 🦩 📒 🗺️ 🏆 📍) por `ArtIcon`.
   - `BeamFlow` em `components/orbita.tsx` recebe `icon: string`: mudar para `art: ArtName`.
   - Atualizar `PRIVACY_NOTE`: a equipe agora vê também os registros enviados por escolha (fotos, descrição, zona).
   - Card **Meu personagem**: prévia `Avatar`, chips de cor/olhos/acessório (`AVATAR_LABELS`), botão Salvar → `teams.saveAvatar`.
   - **Membros**: nome ACIMA do personagem (`member.avatar`).
   - **Coleção da equipe**: `teamSpeciesIndex(teams.records[teamId].items)`, cada espécie uma vez com a contagem → nova tela.
2. **Novas telas**
   - `app/team-species.tsx` (params `teamId`, `speciesId`): lista `recordsOfSpecies`, card com `recordLabel`, `authorLabel`, `Avatar`, foto (`teams.photoUrls`), descrição e data.
   - `app/team-record.tsx` (params `teamId`, `id`): detalhe; o autor edita a descrição (`editRecord`); autor ou dono/admin apaga (`removeRecord`).
3. **`app/sightings/[id].tsx`**: mostrar todas as fotos (`photosOf`) e o botão "Enviar para equipe" (`teams.shareRecord`).
4. **Emojis restantes**: `app/(tabs)/index.tsx`, `app/audit.tsx` + `shared/audit-demo.ts`, `app/species/[id].tsx` (📷), `components/SpotCard.tsx`, `components/AccountCard.tsx`, `components/DiscoveryToast.tsx` (✨ → `brilho`), setas de `PantanalMap.tsx`/`PublicMap.tsx` (`Icon` chevron), ✕ em `public-map.tsx`.
   - Para conferir: `grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" app components shared --include=*.ts*`.
5. **Mapa (pacote Auditoria UX, M01–M04)**
   - A troca de camada deve preservar centro, zoom e seleção.
   - Lista alternativa de registros, atribuição visível e aviso + base alternativa quando o satélite falhar.
   - Arquivos: `shared/street-map.ts`, `app/map.tsx`.
   - Os marcadores de ponto turístico estão sem figura (o texto do nome foi removido para não aparecer "onca"). Dá para embutir as PNGs como data URI.
6. **Testes**
   - Vitest para `photo-gallery`, `team-records`, `art-names`, garantindo que cada nome tenha um arquivo.
   - `pnpm test`, `pnpm lint`.
   - Playwright com câmera falsa (pasta `playwright` do pacote): `npx expo export -p web --clear`.
7. **PR e APK**
   - PR da branch para `main` com a tabela de evidências.
   - APK: GitHub Actions "APK" → Run workflow → `publicar=true`.
