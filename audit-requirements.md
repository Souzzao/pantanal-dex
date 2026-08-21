# Auditoria de requisitos — PantanalDex

Fonte principal: `PantanalDex—especificaçãobásicaparadesenvolvimento.md`, recebida pelo usuário.

## Requisitos funcionais centrais

| Área | Requisitos verificáveis |
|---|---|
| Início | Nome PantanalDex, frase “Conheça e registre os animais do Pantanal”, busca rápida, botões reais para catálogo e avistamentos, destaques e estado vazio orientativo. |
| Catálogo | Lista eficiente com fotografia, nome popular e científico, busca pelos dois nomes, filtros por grupo e ambiente, estado vazio e possibilidade de ampliar categorias. |
| Ficha | Galeria de três imagens; nome popular/científico; descrição; características; habitat; comportamento; alimentação; curiosidades; ocorrência; importância ecológica; conservação; fontes; crédito/licença por imagem; registrar avistamento. |
| Avistamento | Espécie, foto opcional, data obrigatória, horário, local, localização opcional, quantidade aproximada, observações, visibilidade pessoal/compartilhável; salvar sem coordenadas; abrir registro criado. |
| Lista/mapa | Lista com imagem, espécie, data e local; detalhe, edição e exclusão confirmada; mapa para coordenadas; filtros por espécie, grupo, ambiente, período e projeto/observação; registros sem coordenadas permanecem na lista; proteção de localização sensível. |
| Idiomas | Barra rápida no topo da ficha; idioma padrão; seleção, ordenação e remoção de idiomas preferidos; fallback claro quando tradução não existe. |
| Offline | Catálogo, fichas, imagens instaladas, criação/edição de avistamentos, lista, preferências e exportação devem funcionar sem conexão; mapa pode informar limitação cartográfica. |
| Exportação | JSON versionado com data de exportação, espécie, data, horário, local, coordenadas, precisão, quantidade, observações e referência de fotografia; CSV opcional; exportar nunca apaga registros. |
| Dados | Species e Sighting simples, catálogo separado da interface quando possível, armazenamento local persistente e extensível. |
| Aceitação | App abre sem erro; telas e botões funcionam; catálogo, busca, filtros, fichas, registros, mapa, idiomas, offline e exportação atendem ao escopo; sem telas vazias ou ações sem efeito. |

## Lacunas prioritárias a verificar

1. A barra rápida de idioma dentro da ficha precisa existir e informar ausência de tradução; atualmente as preferências existem, mas a ficha deve ser auditada.
2. A ordenação dos idiomas preferidos ainda precisa ser avaliada; seleção e remoção não garantem necessariamente ordenação manual.
3. O mapa web funciona como cartões e mapa externo, mas o mapa nativo com marcadores requer uma estratégia de build que não quebre o preview web.
4. A proteção de localização sensível ainda precisa ser implementada para compartilhamento.
5. O catálogo precisa de fallback explícito para imagens quebradas e estados de carregamento, especialmente porque as fontes são URLs remotas.
6. A persistência precisa tratar JSON corrompido e preferências inválidas sem derrubar o app.
7. Os testes atuais cobrem contrato do catálogo e exportações, mas não cobrem persistência real, edição, filtros, permissões, offline ou casos extremos de dados.
8. A seleção de espécie no formulário usa uma lista horizontal extensa; é funcional, mas pode ser refinada para busca e uso com uma mão.
9. O app deve ser auditado para confirmar que toda ação de mapa e navegação possui um caminho válido nas plataformas suportadas.
