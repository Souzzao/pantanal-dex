# Passo 33/50 — validação oficial de conservação da arara-canindé

## Alvo e fonte normativa

A sequência pós-P1/P2 segue para a arara-canindé, `Ara ararauna`, incorporada no passo 28. A fonte normativa prioritária é a Portaria MMA nº 148, de 7 de junho de 2022, que contém a lista oficial nacional de espécies ameaçadas de extinção. A consulta foi aberta diretamente no arquivo oficial hospedado pelo ICMBio/Gov.br.

## Estado da verificação

A promoção dependerá de correspondência exata para `Ara ararauna` ou de uma ausência oficialmente documentada, sem converter ausência em categoria LC. A linha e a categoria devem ser conferidas no texto extraído do PDF antes da alteração do ledger.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


## Resultado da busca normativa

A extração textual do PDF oficial foi pesquisada por `Ara ararauna` e `arara-canindé`; nenhuma ocorrência exata foi encontrada. Também foram conferidos resultados relacionados ao gênero e à palavra arara para evitar confundir outros táxons com a espécie-alvo. O finding será registrado como `not-listed`, sem atribuição de LC ou outra categoria de ameaça. Essa conclusão é limitada à lista oficial consultada na Portaria MMA nº 148/2022.


---

# Registro técnico do passo 33/60 — fallback Web e permissões negadas

## Implementação

O formulário de avistamentos passou a exibir um painel persistente de **Captura no navegador** quando executado na Web. O painel explica que a câmera nativa está disponível no aplicativo móvel e oferece diretamente a seleção pela galeria. O fluxo anterior de fallback continua ativo no botão principal, sem tentar montar `CameraView` no navegador.

Em dispositivos nativos, quando a permissão da câmera é negada, a tela exibe um painel acessível com duas rotas de recuperação. Se o sistema ainda permitir nova solicitação, o usuário pode tentar novamente; se a permissão estiver bloqueada, o aplicativo oferece abertura das configurações do aparelho. Em ambos os casos, a galeria permanece disponível como alternativa.

A montagem da câmera também trata `onMountError`, fecha o visor, limpa o estado de prontidão e mostra a mensagem de erro sem perder os demais dados do formulário. O salvamento não depende de câmera, galeria ou localização autorizadas.

## Validação

| Verificação | Resultado |
|---|---|
| TypeScript (`pnpm check`) | PASS |
| Lint (`pnpm lint`) | PASS; permanece aviso preexistente de módulo do ESLint |
| Testes (`pnpm test`) | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 23 registros, 0 pendências |
| Auditoria regional | PASS; 7 registros, 0 pendências |
| `git diff --check` | PASS |

## Conclusão

O passo 33/60 está concluído. O fluxo possui fallback Web visível, tratamento de permissão negada, recuperação por configurações, galeria alternativa e tratamento de falha de montagem, preservando acessibilidade, privacidade e salvamento seguro.
