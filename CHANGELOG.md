# Histórico de versões

Todas as mudanças relevantes do PantanalDex. Mantido por Felipe de Souza Aquino.

## [3.9.0] — 2026-11-25

### Adicionado
- **Equipes de campo**: criar ou entrar por código de 8 letras, até 100 pessoas, até 5 equipes por pessoa, 9 conquistas, ranking e zonas de ~11 km estudadas. Funciona offline; sair exige digitar o nome da equipe; o dono que exclui a conta passa a equipe adiante.
- **Duas versões**: PantanalDex (final) e PantanalDex Demo (caderno Teste e auditoria simulada), pelo `APP_VARIANT`; o GitHub publica os dois APKs.
- **Excluir minha conta** no app e **aceite da Política de Privacidade** na criação da conta (LGPD).
- Interface nova: barra flutuante com Registrar no centro, espécie do dia, grade de atalhos, ficha com foto em tela cheia, animações com mola e efeitos inspirados no kit Órbita UI / Magic UI; títulos em Fraunces.

### Alterado
- Catálogo só com fotos de **licença livre** (CC0, CC BY, CC BY-SA): 1.003 espécies, até 6 fotos cada; nomes populares sem repetição e espécies duplicadas unidas.
- App definido como **gratuito e sem anúncios**.

### Segurança
- Backup automático do Android desligado, permissões mínimas, links externos só `https`, WebView do mapa sem acesso a arquivos, importação limitada a 5 MB.

## [3.8.0] — 2026-11-18

### Adicionado
- **Cadernos de avistamentos**: Principal, Teste (com exemplos), cadernos criados pela pessoa e importados.
- Seletor de cadernos em Meus registros e no Novo avistamento; caderno ativo para os novos registros.
- Tela **Cadernos**: criar, renomear, apagar (movendo ou apagando os registros), juntar cadernos com remoção de repetidos.
- Importação de cadernos em **JSON, CSV ou GeoJSON** (caderno novo, separado pelos cadernos do arquivo ou no caderno ativo).
- Exportação por caderno nos três formatos, com o nome do caderno no arquivo, e histórico de **cadernos exportados**.
- **Modo demonstração da auditoria**: pilha simulada, simulação de publicação passo a passo e explicação do processo, sem enviar nada ao servidor.

### Alterado
- Exemplos do caderno Teste não contam para a coleção nem para o limite diário.
- Tela de Ajustes mais limpa, com atalho para os cadernos e a versão 3.8.

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
