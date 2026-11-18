# Histórico de versões

Todas as mudanças relevantes do PantanalDex. Mantido por Felipe de Souza Aquino.

## [1.3.0] — 2026-11-17

### Adicionado
- Catálogo ampliado para **1.018 espécies**, com nomes populares do GBIF e dieta medida (EltonTraits 1.0 e AmphiBIO).
- Status IUCN em todas as fichas e filtro por grau de ameaça.
- **Pontos turísticos**: 19 atrativos e 16 municípios pantaneiros, check-in por GPS e insígnias Explorador do Pantanal (Bronze, Prata, Ouro e "todas as cidades").
- Círculo no mapa com tamanho por espécie (até 3 km), calculado pela massa e pela dieta.
- Filtros do mapa por espécie, grupo e período (hoje, 7 dias, 30 dias, 3 meses, 12 meses).
- Novo avistamento abre a câmera imediatamente.
- Nova identidade visual preta, branca e amarela.
- Workflow de verificação (TypeScript + testes) em todo pull request.

### Corrigido
- Lista de Animais limitada a 200 espécies.
- Download de fotos offline com novas tentativas e relatório de falhas.

### Segurança e organização
- `SECURITY.md`, `CODEOWNERS`, Dependabot e workflows com permissão mínima.
- Remoção do código de template não utilizado (servidor tRPC, OAuth e dependências antigas).
- Documentação completa em `docs/`.

## [1.2.0] — 2026-11-10
- Fotos do catálogo disponíveis offline.
- Interface e fichas em português, inglês, espanhol e alemão.

## [1.1.0] — 2026-11-07
- Login com Supabase e três perfis (usuário, auditor, dev).
- Mapa público com área aproximada, auditoria de registros e área dev.
- Mapa regional offline com o contorno oficial do IBGE.

## [1.0.0] — 2026-08-21
- Catálogo offline, fichas das espécies e caderno de avistamentos com foto, data e local.
- Coleção no estilo Pokédex.
