# Cobertura dos textos de interface

Foram criados `shared/i18n/ui-pt.json`, `ui-en.json`, `ui-es.json` e `ui-de.json` como objetos planos: **frase de origem → frase no idioma do arquivo**. Cada arquivo contém 1.195 entradas, incluindo aliases em português, inglês, espanhol e termos revisados em alemão. Os quatro arquivos têm as mesmas chaves e nenhum valor vazio.

A extração usou a árvore sintática de todos os arquivos `app/**/*.tsx`, `components/**/*.tsx`, `shared/native-permissions.ts` e `shared/sighting-rules.ts`. Foram considerados textos JSX, atributos de acessibilidade, placeholders, objetos de labels, alertas e templates. Estilos, caminhos, identificadores internos, tipos MIME, mensagens de depuração e códigos de erro foram excluídos. Nomes científicos e conteúdo inserido pelo usuário não entram no dicionário.

A cobertura inclui catálogo e filtros, início, caderno, formulário de avistamento, detalhes, coleção e conquistas, configurações, login e conta, mapas e escolha de localização, registros públicos, publicação, auditoria, área dev, fotos offline, permissões e validação do registro. Textos das folhas de espécie são responsabilidade dos dicionários de conteúdo, separados destes arquivos.

As traduções existentes nos objetos PT/EN/ES foram reaproveitadas. Os demais textos receberam tradução automática durante a preparação, com revisão manual de 72 conjuntos de termos e ações: grupos zoológicos, espécie, nível, alimentação, usuário/auditor, localização, compartilhamento, conta, salvar/voltar, coleção e conquistas. Os JSON finais são estáticos e não consultam serviço de tradução durante o uso do aplicativo.

## Interpolação e integração

Templates mantêm exatamente os índices `{0}`, `{1}`, etc., na ordem das expressões do código original. Exemplos:

- `Baixando fotos: {0} de {1}`
- `{0}/30 novos registros hoje neste aparelho.`
- `Imagem {0} de {1} de {2}`
- `Mover {0} para cima`
- `{0} {1}, {2} {3}{4}. Ver detalhes`

A validação confirmou a mesma coleção de placeholders entre cada chave e seu valor nos quatro idiomas. Os aliases de uma mesma mensagem com quantidade de interpolações diferente foram tratados separadamente, para preservar o significado dos argumentos.

O motor deve normalizar espaços dos textos JSX e substituir os placeholders pelos valores em tempo de execução. Não deve traduzir livremente campos do usuário, nomes científicos, URLs ou valores técnicos. Texto HTML/JavaScript completo embutido para WebView não é uma chave de interface: rótulos dessa camada precisam ser enviados separadamente ao mapa ou cobertos pelo responsável pela integração.

## Verificação

- JSON de quatro idiomas analisados com sucesso.
- 1.195 chaves iguais nos quatro arquivos; nenhum valor vazio.
- Zero divergências de placeholders.
- Todos os candidatos textuais extraídos estão cobertos; as únicas exclusões restantes são valores técnicos (rota, identificador, transformação, duração, tipo MIME e códigos internos).
- Esta verificação cobre os arquivos de tradução; a renderização e a troca de idioma dependem da integração feita pelo responsável pelas telas e pelo motor de tradução.

Os arquivos intermediários de extração, agrupamento e tradução foram movidos para `.tmp/i18n-ui/`; não são importados pelo aplicativo.
