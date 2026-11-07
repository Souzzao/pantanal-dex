# PantanalDex — roteiro da demonstração do MVP

Disciplina: Engenharia de Software — UNEMAT · Docente: Dra. Maricy Caregnato · Discente: Felipe de Souza Aquino
Entrega: APK Android, **11/11/2026**. Duração alvo: **7 a 8 minutos** de demonstração mais perguntas.

## Antes de começar (checklist)

- [ ] APK final instalado no celular (ou BlueStacks) e aberto uma vez **com internet**, para as fotos do catálogo ficarem em cache.
- [ ] Caderno limpo, ou com 2 ou 3 registros de exemplo de dias diferentes (para a Coleção e o mapa não ficarem vazios).
- [ ] Localização e câmera do aparelho ativadas; ter **duas ou três fotos de animais na galeria** (a foto agora é obrigatória).
- [ ] Idioma do app em Português.
- [ ] Modo avião à mão para mostrar o funcionamento offline.
- [ ] Para mostrar que o app vale para o mundo todo: tenha à mão uma coordenada de outro país (ex.: Paris, 48.8566 / 2.3522).

## Roteiro

| # | Tempo | O que mostrar | O que falar | Requisitos |
|---|---|---|---|---|
| 1 | 0:00 | Tela inicial | "O PantanalDex é um guia de campo da fauna pantaneira, inspirado na Pokédex: você descobre espécies e registra seus avistamentos com foto e localização, mesmo sem internet." | Escopo (Temporada 1) |
| 2 | 0:40 | **Animais** → buscar "onça" → abrir a ficha | Busca por nome popular ou científico; filtros por grupo e ambiente; a ficha traz descrição, habitat, alimentação, **fontes e créditos/licença de cada imagem**. | RF08, RF09, RF10, RN06 |
| 3 | 1:40 | Na ficha, o selo **"#003 · Ainda não avistada"** | "Cada espécie tem um número na coleção. Ela ainda não foi descoberta porque não há registro meu." | Módulo COLEÇÃO |
| 4 | 2:00 | **Registrar avistamento** a partir da ficha | A espécie já vem preenchida. O topo do formulário mostra "Foto e localização são obrigatórias" e o contador "N/30 novos registros hoje neste aparelho". Anexar a foto (galeria ou câmera, até 10 MB) e usar a localização do aparelho, ou **Escolher local no mapa** offline do Pantanal (contorno IBGE 2025). O app pede permissão só nesse momento; se a pessoa negar, dá para usar a galeria e o ponto manual. | UC06, RF04, RF05, UC06-A1 |
| 5 | 3:00 | Exceções do UC06 e alcance mundial | Tentar salvar **sem foto** → "Adicione uma fotografia…" (E1). Data futura → erro (E2). Explicar o limite de 30 novos registros por dia (E4) e as observações com no máximo 500 caracteres. **Escolher local no mapa** → afastar com "−" até o mundo e marcar outro país: o app aceita registros de qualquer lugar; o Pantanal é só o recorte do catálogo deste MVP. | UC06 E1, E2, E4, RN-01, RN-02, RN-05, RNF05 |
| 6 | 3:40 | Escolha **Pessoal / Compartilhável** e salvar → aparece **"Nova espécie descoberta! #003 · Onça-pintada"** | "A coordenada exata fica só no aparelho; registros compartilháveis saem arredondados para uma célula de 0,1° (~11 km), protegendo espécies sensíveis contra caça e tráfico." Ao salvar, o aviso de descoberta aparece no topo. | RN03, RF11, RNF07, módulo COLEÇÃO |
| 7 | 4:20 | Novo registro com **"Não sei"** (UC06-A2) | Registrar um animal que a pessoa não identificou. Ele entra no caderno como "Espécie não identificada". | UC06-A2 |
| 8 | 4:50 | **Avistamentos** (lista) → abrir o registro "Não sei" → **editar** e escolher a espécie → salvar | Consultar, editar e excluir os próprios registros (filtros por espécie, grupo, ambiente e período). Ao identificar a espécie, a coleção registra a descoberta e o aviso aparece de novo. | UC07, UC08, RF10 |
| 9 | 5:30 | **Mapa** → depois **Minha coleção** (cartão na Home ou selo da ficha) | Mapa offline com os pontos do caderno. Na coleção: % do bioma descoberto, nível e XP, progresso por grupo, conquistas (ex.: "Cinco do Pantanal") e grade #001–#102, com as espécies ainda não vistas como "?". | UC03, RF11, pitch original (DESCUBRA / REGISTRE / COLEÇÃO) |
| 10 | 6:30 | **Configurações** → Exportar **CSV** e **GeoJSON** | CSV para planilhas e GeoJSON para programas de mapa (QGIS, geojson.io), com data de extração e nota de licença. Registros compartilháveis saem arredondados para 0,1°; coordenadas exatas de registros pessoais só saem após confirmação explícita. | RF13, RN08, RNF07, pitch ("exportação de seus dados geojson") |
| 11 | 7:00 | Ativar **modo avião**, fechar e reabrir o app | Catálogo, fichas, caderno e coleção continuam disponíveis: dados guardados no aparelho. | RNF08, critério "offline-first" |
| 12 | 7:30 | Encerramento | O que ficou fora do MVP e por quê (próxima seção). | Delimitação de escopo |

## Como explicar o escopo (o que ficou fora)

A especificação completa tem 15 RFs, 10 RNFs e 10 RNs para um sistema com servidor, contas e moderação. O MVP valida primeiro o **fluxo central do observador em campo**, que funciona sozinho no aparelho:

- **Fora desta versão:** cadastro e login (UC01, UC02, RF01–RF03), submissão para revisão e moderação (UC09, RF06, RF07, RN01, RN04, RN05), histórico auditável (RF12), gestão de vocabulário (UC10, RF14) e painel de moderação (RF15). Tudo isso exige um serviço compartilhado e papéis de usuário.
- **Por quê:** os materiais de MVP recomendam validar um fluxo prioritário em ciclo curto (Design Sprint) antes de construir a infraestrutura. Sem conta, o app também coleta o mínimo de dados pessoais (LGPD, RNF07).
- **Próximo ciclo:** API com autenticação, fila de moderação com a regra "ninguém aprova o próprio registro", mapa público com células de 0,1° e ampliação do catálogo com revisão científica (meta de 500 espécies verificadas).

## Perguntas prováveis

- **"Os dados são reais?"** — Sim. As 102 espécies do catálogo trazem fontes (GBIF, Wikimedia Commons) e licença por imagem. Conservação só aparece quando há fonte oficial ICMBio/MMA; a API da IUCN não é usada.
- **"E se não tiver GPS?"** — A pessoa escolhe o ponto no mapa offline ou digita as coordenadas (UC06 A1).
- **"Por que só animais do Pantanal?"** — O app registra avistamentos em qualquer lugar do mundo; o catálogo começa pelo Pantanal para validar o MVP sem catalogar todas as espécies de uma vez. A regra E3 (recusar fora do Pantanal) da especificação original foi retirada por decisão de escopo.
- **"Como protege espécies ameaçadas?"** — A coordenada exata nunca sai do aparelho sem confirmação; o que é compartilhado vai arredondado para 0,1°.
- **"Qual metodologia vocês usaram?"** — Incremental, com quadro Kanban (a fazer / em andamento / concluído) e testes automatizados (100+ testes de domínio rodando a cada mudança).

## Plano B

- **Sem internet na sala:** as fotos do catálogo aparecem com o cartão "Imagem indisponível" (com a inicial do nome); todo o resto funciona. Por isso o app deve ser aberto uma vez com internet antes.
- **Celular falhou:** usar o BlueStacks no notebook com o mesmo APK. Evite demonstrar pelo navegador: lá os alertas de validação não aparecem.
- **Câmera ou GPS negados:** usar foto da galeria e escolher o ponto no mapa offline.
