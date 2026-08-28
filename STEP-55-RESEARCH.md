# Passo 55/60 — persistência segura de preferências de listagem

As preferências da tela de avistamentos agora são restauradas após reinicializações e persistidas localmente em formato versionado. O módulo `lib/sightings-preferences.ts` centraliza a chave de armazenamento, a versão do contrato, os valores padrão, a sanitização e a serialização.

São persistidos apenas os critérios operacionais: intervalo de datas, visibilidade, presença de GPS, campo de ordenação e direção. A busca textual não é persistida, pois pode conter nomes de pessoas, locais sensíveis ou termos presentes em observações. Dessa forma, a conveniência da restauração não transforma uma consulta potencialmente privada em dado permanente no dispositivo.

A leitura é defensiva: JSON corrompido, versão desconhecida, enum inválido, datas não textuais e valores booleanos inadequados retornam ao padrão seguro ou são sanitizados individualmente. A tela aguarda a restauração antes de gravar, evitando que o estado inicial sobrescreva preferências existentes durante a inicialização.

| Item | Resultado |
|---|---|
| Formato versionado | Versão 1 |
| Restauração após reinício | Implementada |
| Ordenação persistida | Campo e direção |
| Filtros persistidos | Datas, visibilidade e GPS |
| Busca textual | Não persistida por privacidade |
| JSON corrompido | Fallback aos padrões |
| Versão desconhecida | Fallback aos padrões |
| Dados privados de avistamentos | Nunca incluídos |

Foram adicionados quatro testes de preferências, cobrindo restauração válida, corrupção, versão desconhecida, sanitização e ausência do campo `query`. A validação passou com `pnpm check`, `pnpm lint`, **42 testes aprovados e 1 ignorado**, todas as auditorias científicas e comerciais e `git diff --check`.

O catálogo permanece com 76 espécies modulares, 29 lotes, 228 imagens e 96 registros científicos. A auditoria ICMBio/SISBio terminou com status `PASS`; nenhuma pendência foi criada e a política de licenciamento comercial permanece inalterada.
