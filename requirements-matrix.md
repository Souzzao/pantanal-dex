# Matriz de requisitos — PantanalDex

| Requisito | Implementação atual | Evidência/validação | Estado |
|---|---|---|---|
| Catálogo offline de espécies | Catálogo local compartilhado em `shared/pantanal.ts`, com busca, grupos, ambientes e ficha detalhada | `validateSpeciesCatalog()` e testes determinísticos | Implementado |
| Registro pessoal de avistamentos | Formulário com espécie, data, horário, local, quantidade, notas, visibilidade e fotografia | TypeScript, lint, testes e revisão visual portrait | Implementado |
| Fotografia pela galeria e câmera | `expo-image-picker`, com permissão, cancelamento e fallback de erro | Validação estática e preview web; permissão nativa depende de dispositivo | Implementado com validação nativa pendente |
| Localização opcional | `expo-location`, solicitação de permissão e precisão `exact`/`none` | Fluxo de erro tratado; dispositivo real ainda necessário | Implementado com validação nativa pendente |
| Mapa no web | Cartões georreferenciados, navegação para detalhe e mapa externo | Preview web renderizado após separar dependência nativa | Implementado |
| Mapa nativo | `react-native-maps` em `NativeMapView.native.tsx`, com marcadores e callout | TypeScript; requer Expo Go/development build para validação visual | Implementado com validação nativa pendente |
| Privacidade de localização | Coordenadas compartilháveis são arredondadas no detalhe, mapa e exportação | Teste de exportação e inspeção de fluxo | Implementado |
| Persistência offline | AsyncStorage com envelope versionado, compatibilidade com formato legado e sanitização | Testes de round-trip, versão desconhecida e JSON corrompido | Implementado |
| Exportação JSON/CSV | Exportação versionada, escape de CSV e não-mutação dos registros | Testes determinísticos | Implementado |
| Idiomas | Preferência padrão, idiomas rápidos, ordem e remoção | Testes de sanitização | Implementado |
| Conteúdo editorial ampliado | 20+ espécies e grupos representados, com fontes e créditos | Validação estrutural; revisão científica externa ainda recomendada | Parcial |
| Validação em dispositivo | Fluxos de câmera, localização e marcadores nativos | Não executável no preview web | Pendente |

## Riscos controlados

A prévia web não importa mais `react-native-maps`; a resolução por plataforma está isolada nos componentes `NativeMapView.native.tsx` e `NativeMapView.web.tsx`. Registros corrompidos ou com coordenadas, datas, horários e quantidades inválidos são descartados na restauração. Exportações de registros compartilháveis não expõem coordenadas exatas.

## Pendências explícitas

Ainda é necessário validar câmera, permissões de localização e mapa nativo em um aparelho ou development build Expo. Também permanece recomendável uma revisão editorial das fontes e uma avaliação de acessibilidade em VoiceOver/TalkBack antes da publicação.
