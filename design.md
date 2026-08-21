# PantanalDex — plano de design da interface

## Direção do produto

O PantanalDex será uma experiência mobile portrait, pensada para uso com uma mão durante passeios, atividades escolares e trabalhos de campo. A interface deve priorizar leitura rápida, alvos de toque confortáveis, contraste alto e ações principais sempre próximas à parte inferior da tela. O tom visual combina **caderno de campo**, **paisagem alagada** e **catálogo naturalista**, sem excesso de ornamentação.

A primeira versão será local-first: o catálogo instalado e os avistamentos salvos devem continuar acessíveis sem conexão. Não haverá autenticação nem sincronização em nuvem nesta etapa, pois esses recursos não foram solicitados.

## Lista de telas

| Tela | Conteúdo principal | Funcionalidade | Ação primária |
|---|---|---|---|
| Início | Marca PantanalDex, frase de entrada, busca rápida, animais em destaque e atalhos | Navegar para o catálogo ou avistamentos e iniciar uma busca | Explorar animais |
| Animais | Campo de busca, filtros por grupo e ambiente, lista eficiente de cards | Encontrar espécies por nome popular/científico e filtrar a coleção | Abrir ficha da espécie |
| Ficha da espécie | Galeria com três imagens, nomes, blocos informativos, fontes e créditos | Alternar idioma disponível, ler conteúdo e iniciar registro | Registrar avistamento |
| Novo avistamento | Espécie, foto opcional, data, horário, local, quantidade, observações e visibilidade | Salvar registro com ou sem localização | Salvar avistamento |
| Avistamentos | Segmento lista/mapa, filtros, cards de registros e estado vazio | Consultar, filtrar, editar, excluir e abrir registros no mapa | Novo avistamento |
| Detalhe do avistamento | Foto, espécie, data, local, coordenadas, observações e visibilidade | Editar, excluir após confirmação e compartilhar/exportar | Editar registro |
| Mapa | Mapa com marcadores dos registros georreferenciados | Visualizar registros com coordenadas e aplicar filtros | Abrir registro |
| Configurações | Idioma padrão, idiomas disponíveis, ordem da barra rápida, privacidade e exportação | Ajustar preferências e exportar JSON/CSV | Exportar registros |

## Navegação e estrutura

A barra inferior terá quatro áreas persistentes: **Início**, **Animais**, **Avistamentos** e **Configurações**. Telas de ficha, formulário, detalhe e mapa serão abertas como rotas empilhadas, com retorno claro para a tela anterior. A ação de voltar será sempre visível no topo das telas secundárias e não dependerá de gestos.

A barra de idioma ficará no topo da ficha de espécie, abaixo do cabeçalho, com botões compactos e legíveis. Quando não houver tradução, a interface exibirá uma mensagem explícita e manterá o idioma disponível, em vez de apresentar conteúdo vazio.

## Fluxos principais

### Consultar uma espécie

O usuário abre **Início**, toca em **Explorar animais**, digita um nome ou escolhe um grupo/ambiente. A lista é atualizada imediatamente. Ao tocar em um card, a ficha abre com galeria, informações organizadas em blocos curtos, fontes e créditos. O usuário pode voltar à lista ou tocar em **Registrar avistamento**.

### Registrar um avistamento

O usuário entra pela ficha da espécie ou pela tela **Avistamentos**. O formulário já recebe a espécie quando iniciado pela ficha. A data é obrigatória; foto, horário, localização, quantidade, observações e visibilidade são opcionais conforme a especificação. Se houver autorização, a localização do aparelho pode preencher latitude, longitude e precisão. Ao salvar, o aplicativo confirma a criação e abre o detalhe do registro.

### Consultar e editar registros

Em **Avistamentos**, o usuário alterna entre lista e mapa. A lista mantém disponíveis os registros sem coordenadas; o mapa mostra apenas os registros que têm latitude e longitude. Filtros por espécie, grupo, ambiente e período podem ser aplicados sem retirar o acesso à lista completa. O usuário toca em um card, visualiza o detalhe, edita ou exclui depois de confirmar.

### Exportar dados

Em **Configurações**, o usuário escolhe JSON ou CSV e aciona o compartilhamento do arquivo gerado. A exportação contém os dados dos registros e nunca remove o conteúdo local. O estado da tela informa quando o arquivo está pronto para compartilhar.

## Identidade visual

| Elemento | Decisão específica |
|---|---|
| Fundo | Areia clara `#F7F3E8`, com superfícies brancas quentes `#FFFDF7` |
| Cor principal | Verde mata `#1F5D46`, para ações, navegação ativa e títulos de seção |
| Cor secundária | Azul de rio `#2D7892`, para mapa, localização e indicadores informativos |
| Destaque | Amarelo sol `#E7B84B`, usado com moderação em etiquetas e chamadas de atenção |
| Texto | Grafite `#26332E` e marrom profundo `#4A392B` para leitura naturalista |
| Estado positivo | Verde folha `#3E8B5B` |
| Estado de alerta | Ocre `#B7791F` |
| Bordas | Verde acinzentado claro `#D9E2D9` |

Os cards usarão cantos arredondados moderados, borda discreta, imagem em proporção ampla e hierarquia tipográfica clara. Botões primários terão altura mínima confortável, texto sem ambiguidade e feedback visual ao toque. Fotografias são o elemento dominante do catálogo, mas os créditos e licenças aparecerão em texto secundário na ficha para preservar transparência.

## Componentes de interface

Os componentes centrais serão `SpeciesCard`, `SpeciesImageGallery`, `LanguageQuickBar`, `FilterSheet`, `SightingCard`, `EmptyState` e um cabeçalho contextual reutilizável. Todas as telas utilizarão o contêiner de área segura do projeto. Listas de espécies e avistamentos utilizarão `FlatList`, com estados distintos para carregamento, lista vazia e nenhum resultado de busca.

## Conteúdo e dados iniciais

O catálogo inicial será estruturado em JSON separado da interface, com as espécies tuiuiú, arara-azul, onça-pintada, capivara, jacaré-do-pantanal, sucuri, cervo-do-pantanal e ariranha. Cada entrada seguirá o tipo `Species` da especificação, incluindo três imagens, créditos, licenças e fontes. Para manter a primeira entrega funcional sem depender de conexão, as imagens e os dados essenciais serão empacotados ou armazenados com referências locais adequadas ao projeto.

## Acessibilidade e uso em campo

A interface manterá contraste suficiente, textos com tamanho confortável, áreas de toque amplas e rótulos que não dependam apenas de cor ou ícone. Estados de permissão para câmera e localização serão explicados antes da solicitação. A ausência de conexão será informada somente quando limitar o mapa ou o carregamento externo; catálogo, registros, preferências e exportação permanecerão acessíveis localmente.
