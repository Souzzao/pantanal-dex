# Rodada 2 — capas e descrições (17/11/2026)

Base: `origin/claude/v2`, commit `3cd26b4`. Branch de trabalho: `codex/capas-traducoes`. Não foram alterados o catálogo, seus arquivos gerados, o mapa, o tema ou `scripts/catalog/build.py`.

## Capas embutidas

Entrada: `capas-para-embutir.json`. Resultado: **1.018/1.018 capas**, todas pela primeira URL fornecida, **zero falhas**; `capas-falhas.json` contém `[]`.

- Pasta `assets/images/species/`: **15.769.323 bytes (15,77 MB)**, abaixo de 30 MB.
- JPEG RGB, qualidade 72, lado maior até 360 px, sem EXIF/ICC/XMP/comentários. Duas imagens de origem já eram menores: `canario-rasteiro` e `canivete-raposa`; foram preservadas sem ampliação.
- `shared/species-covers.ts`: 1.018 `require` estáticos, com os IDs originais, inclusive acentos, e `hasBundledCover` no formato pedido.
- `components/RemoteImage.tsx`: integração mínima para priorizar a capa embutida ao receber a URI da primeira foto (original ou miniatura Wikimedia). Necessária porque o cartão offline já excluía essas capas do download, mas o renderizador ainda só usava a URI remota. Galerias, fotos do usuário e fontes numéricas preservadas. Motivo registrado previamente em `COORDENACAO-CLAUDE-CODEX.md` da pasta compartilhada.
- `capas-embutidas.json`: URL utilizada, SHA-256, tamanho e parâmetros de cada JPEG. Autoria, licença e links de origem continuam no catálogo existente; nenhuma foto de outra fonte foi substituída ou inventada.

Para refazer, instalar Pillow no Python e executar da raiz:

```sh
python scripts/catalog/embed_covers.py
```

O script tenta as alternativas na ordem se a principal falhar, limita simultaneidade no Wikimedia, preserva cache em `.tmp/` e registra falhas. Se a pasta atingir 30 MB, reexporta em 320 px/qualidade 68. Não remove arquivos alheios.

## Descrições traduzidas

Entrada: `descricoes-para-traduzir.json`. Saída: `traducoes-descricoes.json`, **469 IDs e 684 campos**, somente os idiomas solicitados: **164 pt, 86 es, 434 de**. Texto puro, sem itálico/HTML, nomes científicos preservados.

Tradução automática pelo serviço Google Translate, com nomes científicos protegidos; revisão amostral e correções editoriais. `traducoes-descricoes-revisoes.json` preserva correções de 26 entradas, vinculadas ao inglês original: medidas imperiais que o serviço omitiu no alemão e termos como *ray-finned* e *armored catfish*. Não houve resumo deliberado nem inclusão de fatos de outras fontes. Revisão editorial integral por falante nativo não foi realizada.

**Lacunas da própria entrada:** `manduve` (de) e `cobra-cega-marrom` (pt/es/de) têm apenas `...` no inglês fornecido. A saída mantém `...`, em vez de inventar descrição. Esses dois textos precisam de fonte completa antes de serem apresentados como descrições traduzidas. São quatro dos 684 campos; os outros 680 contêm texto descritivo traduzido.

Para refazer (requer rede, não requer chave):

```sh
python scripts/catalog/translate_descriptions.py
```

O script mantém cache fora do Git e aplica as revisões editoriais ao final; recusa aplicá-las se o texto inglês mudar. Preservar os créditos/licenças das descrições de origem ao incorporá-las no catálogo. A saída é estática: o aplicativo não precisa chamar o serviço de tradução.

## Verificação executada

- Todos os JPEGs abertos e conferidos: formato/modo, limite de resolução, ausência de metadados, SHA-256 e correspondência exata entre IDs, arquivos e `require`.
- Amostra visual de 27 capas, incluindo as espécies iniciais e grupos do catálogo ampliado.
- Todos os IDs/idiomas conferidos; números e nomes científicos mantidos; sem placeholders de tradução, HTML ou itálico. Amostras de texto revisadas e correções preservadas.
- `pnpm check`: passou. `pnpm test`: **202 aprovados, 1 ignorado**.
- Componente RemoteImage real empacotado com fixtures: capa local priorizada, miniatura Wikimedia reconhecida, segunda foto de galeria/foto pessoal/URI sem capa/fonte numérica preservadas.
- `expo export --platform android`: passou após a integração, 2.839 módulos, bundle Hermes gerado e as capas incluídas. Para esta verificação local, o Metro recebeu temporariamente o caminho real das dependências compartilhadas em `watchFolders`; configuração restaurada byte a byte ao terminar e não incluída no commit.

O Claude fará o merge e a incorporação das traduções no catálogo. Não houve novo APK nem teste em aparelho nesta rodada.
