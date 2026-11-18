# Matriz de requisitos — PantanalDex

| Requisito | Implementação atual | Evidência/validação | Estado |
|---|---|---|---|
| Catálogo offline de espécies | Catálogo local compartilhado em `shared/pantanal.ts`, com busca, grupos, ambientes e ficha detalhada | `validateSpeciesCatalog()` e testes determinísticos | Implementado |
| Registro pessoal de avistamentos | Formulário com espécie ou "Não sei", data, horário, local, quantidade, notas, visibilidade e fotografia obrigatória | Validação compartilhada UC06 e testes | Implementado |
| Fotografia pela galeria e câmera | `expo-image-picker`, limite de 10 MiB e cópia para documentos permanentes do app | Testes do helper e TypeScript; fluxo nativo completo precisa do novo APK | Implementado com validação nativa pendente |
| Localização obrigatória | GPS ou seleção manual no mapa, validada contra o polígono oficial IBGE 2025 do Pantanal brasileiro | Testes de interior, exterior, borda e entradas inválidas | Implementado |
| Mapa no web | Contorno offline do bioma, marcadores, ampliação, deslocamento e mapa externo | Testes da projeção e TypeScript | Implementado |
| Mapa nativo | Contorno offline com `react-native-svg`, marcadores e abertura do registro; seleção manual para UC06 | Substitui Google Maps sem chave, causa de crash encontrada no APK 1.0.0 | Implementado com validação no APK 1.1.0 pendente |
| Privacidade de localização | Coordenadas compartilháveis são arredondadas para células de 0,1° no detalhe, mapa nativo, mapa de registros e exportação | Teste de exportação e inspeção de fluxo | Implementado |
| Rejeição de data futura | Data de avistamento usa o dia local e não aceita dias posteriores ao atual | Validação compartilhada no formulário e na restauração dos registros | Implementado |
| Observação com até 500 caracteres | Formulário limita o campo para respeitar o limite do UC06 | `maxLength` no campo de observação | Implementado |
| Persistência offline e cota diária | Envelope v2 grava caderno e histórico de criações juntos, migra dados legados e preserva a cota ao excluir registros | Testes de round-trip, migração, cota e corrupção; escritas serializadas | Implementado |
| Até 30 novos registros por dia | Histórico separado logicamente dos registros e baseado no dia local do aparelho | Testes do 30º/31º registro, edição, idempotência e restauração | Implementado por aparelho; controle global requer servidor |
| Exportação JSON/CSV | Exportação versionada, escape de CSV e não-mutação dos registros | Testes determinísticos | Implementado |
| Idiomas | Preferência padrão, idiomas rápidos, ordem e remoção | Testes de sanitização | Implementado |
| Conteúdo editorial ampliado | 102 espécies e grupos representados, com fontes e créditos | Validação estrutural; revisão científica externa ainda recomendada | Parcial |
| Validação em dispositivo | Fluxos de câmera, localização e marcadores nativos | Não executável no preview web | Pendente |

## Riscos controlados

O mapa é renderizado com o contorno IBGE sem depender de uma chave de serviço externo. A validação geográfica usa as coordenadas originais, antes da generalização de 0,1° para registros compartilháveis. Uma cota diária corrompida bloqueia novas escritas para evitar que seja silenciosamente reiniciada; registros válidos recuperáveis continuam disponíveis para exportação.

## Pendências explícitas

Ainda é necessário validar câmera, permissões de localização e mapa nativo em um aparelho ou development build Expo. Também permanece recomendável uma revisão editorial das fontes e uma avaliação de acessibilidade em VoiceOver/TalkBack antes da publicação.
