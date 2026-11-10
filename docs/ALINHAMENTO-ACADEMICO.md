# PantanalDex — alinhamento acadêmico do MVP

## Objetivo do produto

O PantanalDex é um guia de campo para explorar espécies do Pantanal e registrar avistamentos no celular. A entrega está marcada para **quarta-feira, 11/11/2026**. O MVP prioriza uso sem conexão: catálogo, contorno do bioma e caderno pessoal ficam no aparelho; fotografias do catálogo ainda podem exigir internet.

## Relação entre o escopo acadêmico e o app

| Tema dos materiais | Como aparece no MVP | Situação |
|---|---|---|
| Problema, público e limite do projeto | Guia de fauna e caderno de campo para visitante/observador. O Pantanal é o recorte do catálogo; registros valem no mundo inteiro. Login obrigatório, mas a conta continua aberta sem internet (caderno e catálogo) | Implementado (PR #18) |
| Catálogo e consulta de espécies | Busca, filtros e fichas com nomes, informações, fontes e créditos | Implementado; o catálogo ainda é menor que a meta de 500 espécies prevista no roadmap do repositório |
| Registrar e consultar avistamentos (UC06–UC08) | Formulário local, lista, mapa, edição e exclusão | Implementado em modo pessoal/offline |
| Proteção de localização (RN03) | O dono vê o ponto exato no aparelho; o público vê só a célula de 0,1° (~11 km); a coordenada exata vai ao servidor apenas para o auditor | Implementado no caderno, na exportação e no mapa público (PRs #16–#18) |
| Cadastro, autenticação, moderação e auditoria | E-mail e senha (Supabase Auth); papéis usuário/auditor/dev; pilha de auditoria com aprovar/reprovar (motivo obrigatório) e correção de espécie; histórico de decisões; área dev para papéis e números | Implementado (PR #18); servidor testado com contas simuladas; falta o teste no Android |
| Validações específicas do UC06 | Foto e coordenadas obrigatórias; validação do contorno IBGE 2025; opção "Não sei"; bloqueio de data futura; horário, quantidade e observações até 500 caracteres | Implementado no caderno local; enforcement global depende de serviço |
| Limite diário | Até 30 novos registros por dia no aparelho; e até 30 publicações por dia **por conta** no servidor (com trava contra envios simultâneos) | Implementado nos dois lados |
| Evidência fotográfica | Arquivo até 10 MiB, copiado do cache do seletor para a pasta permanente do app | Implementado no Android; a foto não é embutida no JSON/CSV nem tem EXIF removido por este helper |
| Mapa público | Registros públicos de todas as contas, agrupados em áreas (alta incidência a partir de 5), filtro por data, prazo de publicação escolhido pela pessoa, pendentes com selo "aguardando verificação" | Implementado (PRs #16–#18) |
| Seleção manual e mapa | Mapa de satélite Sentinel-2 em tela cheia (com nomes opcionais), ponto manual por toque ou arrasto; sem internet, mapa offline com contorno IBGE | Implementado (PR #17), sem chave do Google Maps |

Atualizado em 09/11: com o Supabase, o MVP passou a ter contas, mapa público e auditoria (ver `docs/MAPA-PUBLICO.md` e `DADOS.md`). O caderno continua **pessoal e local**: publicar é escolha da pessoa, por registro.

## Fluxo principal para demonstração

1. Abrir **Animais**, buscar uma espécie e consultar sua ficha e fontes.
2. Escolher **Registrar avistamento**, selecionar uma espécie ou **Não sei**, anexar foto e indicar o ponto do avistamento pelo GPS ou pelo mapa.
3. Salvar e mostrar o registro no caderno e no mapa do próprio aparelho.
4. Exportar um registro compartilhável e explicar que a coordenada sai aproximada; registros pessoais com coordenada exata só são exportados após confirmação explícita.
5. Fechar e reabrir o app para mostrar que os dados do caderno persistem no aparelho.

## Método para fechar a entrega

Os materiais de MVP recomendam validar um fluxo prioritário em uma semana, usando mapeamento, esboço, decisão, prototipação e teste. Para a semana de entrega:

| Dia | Foco | Evidência simples |
|---|---|---|
| Sexta, 6/11 | Integrar UC06, Coleção e correções encontradas no BlueStacks | Código das duas frentes e registro dos testes |
| Sábado, 7/11 | Validar foto, ponto manual, limite geográfico e persistência | Testes automatizados e roteiro no emulador |
| Domingo, 8/11 | Corrigir falhas e revisar requisitos e apresentação | Matriz atualizada e demonstração completa |
| Segunda, 9/11 | Gerar e instalar o APK candidato integrado | APK com Coleção e UC06 |
| Terça, 10/11 | Validar em aparelho e ensaiar a apresentação | Evidências dos fluxos e roteiro final |
| Quarta, 11/11 | Entregar APK e apresentar o MVP | Arquivo instalável, código e pendências documentadas |

Esse plano aplica entrega incremental e um quadro Kanban simples (a fazer, em andamento, concluído). Não pressupõe que as regras de moderação e o backend do sistema completo estejam prontos.

## Critérios de aceite para o APK acadêmico

- O aplicativo abre em Android e apresenta o PantanalDex como guia de fauna.
- A busca abre fichas de espécies com fontes e créditos disponíveis.
- A pessoa consegue criar, consultar, editar e excluir um avistamento local.
- Os dados do caderno permanecem salvos ao reabrir o app.
- Câmera, galeria e localização pedem autorização no momento de uso e têm alternativa quando a pessoa nega a permissão.
- A exportação de um registro compartilhável não revela coordenadas exatas.

## Próximas iterações após o MVP

1. Aplicar o limite diário por conta também no servidor, tratar EXIF antes de publicação de evidências e definir política de revisão para espécies não identificadas. As regras locais do UC06 estão implementadas; não substituem controles de um serviço público.
2. Já implementado no MVP (PR #18): autenticação, revisão e trilha de auditoria. Próximo passo: denúncia de registros, mais de um auditor por registro e limpeza automática de publicações antigas.
3. Ampliar o catálogo com revisão científica e meta explícita de cobertura; não tratar registros estruturais como espécies verificadas.
4. Validar acessibilidade e fluxos nativos em aparelhos Android e testar com usuários do público definido.

## Bases consultadas

- `MVP em 7 dias.pdf`: conceito de MVP e ciclo de Design Sprint, especialmente o capítulo 4.
- `Metodologias de Dev.pdf`: prototipação, desenvolvimento incremental, Scrum, Kanban/Lean e relação da abordagem com o projeto.
- `Temporada-1-ES-V2.pdf`: problema, público, escopo e definição do produto.
- `Temporada-2-ES - Uso Acadêmico.pdf`: levantamento, classificação e especificação de requisitos.
- `Uso academico - Temporada-3-ES-8-10.pdf`: casos de uso, modelo de domínio, atividades e sequências.
- `Pantanaldex - Especificação Completa de Requisitos (1).pptx.pdf` e `Pantanaldex — Casos de Uso e Funções.pptx.pdf`: requisitos, regras de negócio e fluxo UC06 usados na matriz acima.
