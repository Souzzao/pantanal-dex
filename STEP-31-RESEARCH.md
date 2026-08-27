# Passo 31/50 — validação científica da aranha-armadeira

## Alvo

A matriz P1 identifica a aranha-armadeira como `Phoneutria nigriventer`, com o ID modular ainda ausente. O objetivo deste passo é confirmar a identidade taxonômica, buscar evidência direta de ocorrência no Pantanal, auditar conservação e selecionar imagens com licença comercial compatível.

## Evidência taxonômica inicial

O GBIF/Catalogue of Life apresenta *Phoneutria nigriventer* (Keyserling, 1891) como espécie aceita, dentro de Araneae, Ctenidae e *Phoneutria*. A página lista usos históricos como *Ctenus nigriventer*, *Phoneutria luederwaldti*, *Phoneutria paca* e *Phoneutria rufichelis*.

Fonte: [1]

## Fonte oficial inicial

O Ministério da Saúde disponibiliza o **Guia de Animais Peçonhentos do Brasil**, que inclui o gênero *Phoneutria* e serve como fonte oficial de contexto médico e de distribuição brasileira. A presença no Brasil não será tratada como prova suficiente de ocorrência no Pantanal; será necessária fonte regional específica ou o registro permanecerá `pending-review`.

Fonte: [2]

## Referências

[1]: https://www.gbif.org/taxon/4GQ68 "GBIF — Phoneutria nigriventer (Keyserling, 1891)"
[2]: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/animais-peconhentos/publicacoes/guia-animais-peconhentos-do-brasil.pdf "Ministério da Saúde — Guia de Animais Peçonhentos do Brasil"


## Evidência regional

O artigo **Diversidade e composição da araneofauna do Mato Grosso do Sul, Brasil** compilou registros da literatura e de inventários para o estado. O método inclui explicitamente amostragens no Passo do Lontra, município de Corumbá, no Pantanal sul-mato-grossense, e na Serra do Amolar. Nos resultados, *Phoneutria nigriventer* é uma das seis espécies de aranhas com mais de dez registros no Mato Grosso do Sul. Essa fonte sustenta a ocorrência estadual e regional no Pantanal Sul, embora o trecho resumido não atribua cada registro individual a uma única localidade; por isso, o registro será marcado como `confirmed` para ocorrência no recorte regional, com a ressalva metodológica documentada.

Fonte: [3]

## Conservação

Nenhuma categoria de ameaça nacional foi inferida. A espécie será mantida sem promoção no ledger de conservação até existir correspondência direta em fonte normativa MMA/ICMBio.

## Referências adicionais

[3]: https://www.scielo.br/j/isz/a/VnwWHnXJMxyw8mbMxbgsVmx/?lang=pt "SciELO — Diversidade e composição da araneofauna do Mato Grosso do Sul, Brasil"


## Imagens e licenciamento

A categoria específica do Wikimedia Commons contém imagens identificadas como *Phoneutria nigriventer*. Foram selecionadas três imagens com licenças compatíveis com uso comercial: uma CC BY-SA 3.0 de João P. Burini, uma CC BY 2.0 de Graham Wise e uma CC BY-SA 4.0 de Pablo H. Capovilla. A autoria e a página de origem serão preservadas no registro.

Fontes: [4] [5] [6]

[4]: https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer.jpg "Wikimedia Commons — Phoneutria nigriventer, João P. Burini, CC BY-SA 3.0"
[5]: https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer_Brisbane.jpg "Wikimedia Commons — Phoneutria nigriventer Brisbane, Graham Wise, CC BY 2.0"
[6]: https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer_male.jpg "Wikimedia Commons — Phoneutria nigriventer male, pablohcapovilla, CC BY-SA 4.0"


---

# Registro técnico do passo 31/60 — câmera nativa e galeria

## Implementação

O formulário `app/sightings/new.tsx` passou a oferecer captura nativa por `expo-camera`, usando `CameraView`, `useCameraPermissions` e `takePictureAsync`. A fotografia capturada é exibida em pré-visualização antes do salvamento e pode ser removida pelo usuário.

A seleção da galeria foi mantida e reforçada com solicitação explícita de permissão por `expo-image-picker`. No Web, o botão principal não tenta abrir uma câmera nativa inexistente: informa a limitação e encaminha o usuário para a seleção de imagem da galeria. Em dispositivos nativos, a permissão da câmera só é solicitada quando o usuário escolhe abrir a câmera; em caso de recusa, a galeria continua disponível.

A fotografia é associada ao registro local por `photoUri` e segue o fluxo existente de `addSighting`. Nenhum envio remoto, publicação automática ou alteração do catálogo científico foi introduzido. O controle de visibilidade, localização, observações e seleção de espécie foi preservado.

## Privacidade e acessibilidade

A câmera e a galeria são acionadas somente por ação explícita do usuário. Foram adicionados rótulos e estados de acessibilidade para voltar, selecionar espécie, abrir câmera, capturar, cancelar, remover fotografia, escolher galeria e salvar o avistamento. A recusa de permissões não impede salvar o registro sem fotografia ou coordenadas.

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

O passo 31/60 está concluído com câmera nativa, galeria, pré-visualização, remoção de fotografia, tratamento de permissões e fallback Web. Os contratos científicos, os dados do catálogo e a política comercial de imagens não foram alterados.
