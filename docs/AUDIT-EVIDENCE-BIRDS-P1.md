# Evidências de Auditoria — Aves P1

## Cariama cristata (Seriema)
- **Ocorrência Pantanal**: Confirmada (espécie comum em áreas abertas).
- **Status Conservação (Portaria 1.704/2026)**: Menos Preocupante (LC).
- **Fontes**: Portaria MMA nº 1.704/2026, ICMBio Mosaico Pantanal.

## Crax fasciolata (Mutum-de-penacho)
- **Ocorrência Pantanal**: Confirmada (espécie característica de matas ciliares).
- **Status Conservação (Portaria 1.704/2026)**: Vulnerável (VU).
- **Fontes**: Portaria MMA nº 1.704/2026, ICMBio Mosaico Pantanal.

## Anhima cornuta (Anhuma)
- **Ocorrência Pantanal**: Confirmada (espécie de áreas alagadas).
- **Status Conservação (Portaria 1.704/2026)**: Menos Preocupante (LC).
- **Fontes**: Portaria MMA nº 1.704/2026, ICMBio Mosaico Pantanal.

## Verificação de Imagens (Pendentes URLs Finais)
- **Seriema**: 3 imagens (Pascal, Giles, Charles) - CC BY/CC BY-SA.
- **Mutum**: 3 imagens (Giles, Charles, Bruno) - CC BY-SA.
- **Anhuma**: 3 imagens (Christoph, agujaceratops, miguelpodas) - PD/CC BY/CC BY-SA.

## Evidências adicionais — auditoria do Passo 7/50

A composição real do repositório não coincide integralmente com a solicitação textual. O lote `catalog-birds-02` contém `Busarellus nigricollis` (Gavião-belo) e `Sarcoramphus papa` (Urubu-rei). A Arara-canindé está em `catalog-birds-03`, o Tuiuiú/Jabiru está em `catalog-birds-04` e Colhereiro não foi localizado nos lotes existentes. Não foi alterado nenhum lote para esconder essa divergência.

A API pública do GBIF retornou `Busarellus nigricollis` como nome aceito, rank SPECIES, status ACCEPTED, matchType EXACT e usageKey 2480692. A ficha PDF do SALVE foi aberta, mas o sistema encerrou a sessão e não disponibilizou o conteúdo da ficha sem nova sessão; por isso, não se usou essa página como evidência suficiente de status individual.

A verificação das nove URLs de imagem existentes no lote 02, com redirecionamentos e User-Agent, retornou HTTP 200. A conferência da licença continua sendo baseada nos metadados declarados na página individual do arquivo Commons; nenhuma licença NC ou ND foi aceita.

## Colhereiro — evidência taxonômica e de imagem

A API GBIF retornou `Platalea ajaja Linnaeus, 1758` como nome aceito, rank SPECIES, status ACCEPTED, matchType EXACT, confidence 99 e usageKey 2480803. A página individual do arquivo `Platalea ajaja 5.jpg` no Wikimedia Commons identificou o autor como Riverbanks Outdoor Store from New Port Richey, FL (publicado por berichard) e a licença como Creative Commons Attribution 2.0 Generic (CC BY 2.0), compatível com uso comercial mediante atribuição. A página informa arquivo original 3.648 × 2.736 pixels. Essa fonte não comprova, sozinha, ocorrência específica no Pantanal nem conservação oficial brasileira; esses critérios permanecem separados.

## Conservação oficial — verificação cautelosa

A página oficial do Diário Oficial apresenta a Portaria MMA nº 1.704, de 16 de junho de 2026, publicada em 17/06/2026, como alteração dos Anexos I e II da lista nacional oficial de espécies da fauna ameaçadas. A busca textual individual do navegador não localizou `Busarellus nigricollis`; portanto, o status de conservação dessas aves não deve ser inferido apenas pela ausência na busca. A auditoria manterá conservação sem preenchimento até haver conferência individual reproduzível no anexo oficial ou ficha SALVE.

A página Commons `Roseate Spoonbill Platalea ajaja JG.jpg` identifica JeffreyGammon como autor e licencia o arquivo em CC BY 4.0, com página original e dimensões 1.921 × 1.441 pixels. A página Commons `Roseate Spoonbill Platalea ajaja National Aviary 2650px.jpg` identifica Derek Ramsey (Ram-Man) como autor e oferece CC BY-SA 2.5, com página original e arquivo de 1.650 × 2.000 pixels. Ambas são licenças permitidas pela política do projeto; a segunda exige preservação da atribuição e share-alike em eventual adaptação.

## Correção de imagem — Arara-azul

A referência anterior `Anodorhynchus hyacinthinus in flight.jpg` retornou 404. A página individual do arquivo `017 Hyacinth macaw flying in Encontro das Águas State Park Photo by Giles Laurent.jpg` confirmou o autor Giles Laurent e a licença CC BY-SA 4.0, incluindo a atribuição recomendada `© Giles Laurent, gileslaurent.com, License CC BY-SA`. A nova URL `Special:FilePath` foi verificada com redirecionamento e retornou HTTP 200 com conteúdo `image/jpeg`. A referência foi substituída sem alterar o ID da espécie.
