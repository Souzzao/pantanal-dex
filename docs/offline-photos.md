# Fotos incorporadas para uso offline

102/102 espécies com foto real incorporada. 0 ausentes. Tamanho total: 3.11 MiB.

Fontes, autor, licença vigente consultada, URL de origem, hash e alterações em `assets/images/species/manifest.json`. As fotos foram reduzidas para até 400×400 px e JPEG qualidade 78; isso é uma adaptação de formato, conservando a licença de cada arquivo.

O mapa estático em `shared/species-assets.ts` deve ser usado pelas telas para que Metro inclua os arquivos no APK. A presença dos assets não comprova o teste em modo avião no aparelho.

## Ausentes

Nenhuma.

## Reprodução

Executar `tsx scripts/export-offline-catalog.ts` e `node scripts/cache-species-photos.mjs` na raiz. O script reutiliza os downloads do manifesto. No Commons exige nome científico na descrição, categoria ou título e autor explícito; no iNaturalist exige táxon de nome científico exato e foto padrão ou observação research-grade. Aceita apenas CC0, domínio público, CC BY ou CC BY-SA. Taxonomia e ocorrência no Pantanal permanecem responsabilidade do catálogo.
