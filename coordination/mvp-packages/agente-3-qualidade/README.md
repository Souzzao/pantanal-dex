# Pacote do Agente 3 — UX, qualidade e recursos nativos

## Missão

Você transforma as rotas existentes em um MVP confiável em uso de campo. As telas críticas são Home, Animais, ficha, Avistamentos, Novo Avistamento, detalhe, Mapa e Configurações. O catálogo atual possui 102 espécies públicas, 306 imagens e 12 lotes ainda em revisão; não use dados de colaboração como dados pessoais.

## Responsabilidades

Trabalhe somente na branch `conta-3-qualidade`. Execute os passos 16–48 de `MVP-50-PASSOS.md`: busca, filtros, ordenação, paginação, ficha, fallback de imagem, loading, vazio, erro, offline, PT/EN/ES, labels, uso com uma mão, câmera, galeria, permissões negadas, GPS, serviço desligado, mapa, persistência, import/export e privacidade.

No web, mantenha fallback seguro e não renderize recursos nativos indisponíveis. No iOS/Android, use os contratos Expo existentes. Toda ação precisa de feedback, estado ocupado e tratamento de falha. Não deixe `onPress` morto. Teste especialmente reinício, AsyncStorage corrompido, permissão negada, imagem quebrada, mapa sem coordenadas e exportação sem registros.

## Meta de MVP

Entregar todas as rotas críticas funcionais em portrait, com estados loading/vazio/erro/offline, acessibilidade razoável e testes determinísticos. O MVP só passa depois que câmera, GPS, mapa, import/export e fallback web forem verificados.

## Prompt curto para enviar

```text
Você é o Agente 3 do PantanalDex, UX, qualidade e nativo, branch conta-3-qualidade. Execute os passos 16–48 do MVP-50-PASSOS.md sem apenas auditar: implemente correções e testes. Verifique Home, Animais, ficha, Avistamentos, Novo Avistamento, detalhe, Mapa e Configurações; busca/filtros/paginação, loading/vazio/erro/offline, PT/EN/ES, labels e uma mão, câmera/galeria, permissão negada, GPS, serviço desligado, mapa, persistência, import/export e privacidade. Preserve fallback web e contratos; todo botão deve funcionar. Cada ciclo exige alteração/teste, TODO, HANDOFF, check/lint/test/diff check, commit e PR. Não espere nova tarefa: execute o maior bloco seguro e reporte rota, plataforma, correção e evidência.
```

## Entrega por ciclo

Cada PR informa rotas, plataformas, reprodução, correção, testes, acessibilidade e riscos restantes. Problemas físicos de aparelho devem ser registrados como bloqueio real com simulação determinística alternativa quando possível.
