# PantanalDex — alinhamento acadêmico do MVP

## Objetivo do produto

O PantanalDex é um guia de campo para explorar espécies do Pantanal e registrar avistamentos no celular. A entrega está marcada para **quarta-feira, 11/11/2026**. O MVP prioriza uso sem conexão: catálogo, contorno do bioma e caderno pessoal ficam no aparelho; fotografias do catálogo ainda podem exigir internet.

## Relação entre o escopo acadêmico e o app

| Tema dos materiais | Como aparece no MVP | Situação |
|---|---|---|
| Problema, público e limite do projeto | Guia de fauna e caderno de campo para visitante/observador; sem depender de conta ou conexão para as funções centrais | Implementado como escopo do MVP |
| Catálogo e consulta de espécies | Busca, filtros e fichas com nomes, informações, fontes e créditos | Implementado; o catálogo ainda é menor que a meta de 500 espécies prevista no roadmap do repositório |
| Registrar e consultar avistamentos (UC06–UC08) | Formulário local, lista, mapa, edição e exclusão | Implementado em modo pessoal/offline |
| Proteção de localização | O proprietário pode ver o ponto exato localmente; mapa e exportação usam a célula de 0,1° (~11 km) para registros compartilháveis; exportar coordenadas exatas de registros pessoais exige confirmação | Implementado para o caderno local; não há mapa público central neste MVP |
| Cadastro, autenticação, moderação e auditoria | Contas, fila de revisão, justificativa de decisão e histórico auditável | Fora do escopo desta versão; exigem serviço compartilhado e papéis de usuário |
| Validações específicas do UC06 | Foto e coordenadas obrigatórias; validação do contorno IBGE 2025; opção "Não sei"; bloqueio de data futura; horário, quantidade e observações até 500 caracteres | Implementado no caderno local; enforcement global depende de serviço |
| Limite diário | Até 30 novos registros por dia local e por aparelho; excluir registros não libera cota; edição e importação de backup não consomem cota | Caderno e histórico diário gravados no mesmo envelope; não é controle global por conta |
| Evidência fotográfica | Arquivo até 10 MiB, copiado do cache do seletor para a pasta permanente do app | Implementado no Android; a foto não é embutida no JSON/CSV nem tem EXIF removido por este helper |
| Seleção manual e mapa | Mapa regional offline do contorno IBGE, com ponto manual, ampliação, deslocamento e abertura do registro | Funciona sem chave Google Maps; não contém ruas ou imagens de satélite |

O escopo acima distingue uma versão utilizável de MVP do sistema completo descrito na especificação. A apresentação deve chamar o caderno de **pessoal e local**; nenhum registro é publicado ou submetido a moderação pelo app atual.

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
2. Definir e implementar API, autenticação, submissão para revisão, moderação imparcial e trilha de auditoria.
3. Ampliar o catálogo com revisão científica e meta explícita de cobertura; não tratar registros estruturais como espécies verificadas.
4. Validar acessibilidade e fluxos nativos em aparelhos Android e testar com usuários do público definido.

## Bases consultadas

- `MVP em 7 dias.pdf`: conceito de MVP e ciclo de Design Sprint, especialmente o capítulo 4.
- `Metodologias de Dev.pdf`: prototipação, desenvolvimento incremental, Scrum, Kanban/Lean e relação da abordagem com o projeto.
- `Temporada-1-ES-V2.pdf`: problema, público, escopo e definição do produto.
- `Temporada-2-ES - Uso Acadêmico.pdf`: levantamento, classificação e especificação de requisitos.
- `Uso academico - Temporada-3-ES-8-10.pdf`: casos de uso, modelo de domínio, atividades e sequências.
- `Pantanaldex - Especificação Completa de Requisitos (1).pptx.pdf` e `Pantanaldex — Casos de Uso e Funções.pptx.pdf`: requisitos, regras de negócio e fluxo UC06 usados na matriz acima.
