# Testes Android — PantanalDex

## APK anterior 1.0.0

Instalado com sucesso no BlueStacks 5, instância Android 9. A abertura e o catálogo de 102 espécies foram observados. Algumas imagens remotas carregaram e outras acionaram a alternativa visual.

Durante a exploração, o aplicativo encerrou. O buffer `logcat -b crash` registrou uma exceção em `com.rnmaps.maps.MapView`: `API key not found` para `com.google.android.geo.API_KEY`. O mapa desta versão não pode ser considerado aprovado.

## Alterações preparadas para 1.1.0

- Mapa regional offline do contorno IBGE, sem montagem do SDK Google Maps.
- Foto e localização obrigatórias, opção "Não sei" e limite geográfico do Pantanal brasileiro.
- Histórico de até 30 novos registros por dia local, persistido com o caderno e preservado após exclusões.
- Fotos copiadas para documentos permanentes do aplicativo, com limite de 10 MiB.
- Alternativas de imagem tentadas em sequência, com chave semântica estável para evitar reinícios por objetos inline.
- A Coleção é desenvolvida na frente do Claude; o novo APK integrado deve incluir seu código concluído.

## Verificações de código

Em 06/11, `pnpm check` passou e `pnpm test` aprovou 117 testes, com um teste de autenticação ignorado por depender do ambiente de autenticação. Para executar os scripts com o pnpm 11 disponibilizado pelo ambiente do Codex sem reinstalação automática de dependências, foi usado `--config.verify-deps-before-run=false`.

A branch isolada `codex/uc06`, sem os arquivos da Coleção do Claude, também passou em `pnpm check` e aprovou seus 104 testes, com o mesmo teste de autenticação ignorado.

## Roteiro no próximo APK

1. Abrir Home, catálogo e Coleção; buscar espécie e abrir a ficha.
2. Tentar salvar sem foto e sem coordenadas; observar os erros.
3. Selecionar "Não sei", anexar foto e marcar um ponto dentro do Pantanal.
4. Tentar ponto fora do bioma e data futura.
5. Salvar, reabrir, editar e excluir o registro de teste; verificar persistência da foto e da cota.
6. Abrir o mapa sem crash, tocar no marcador e verificar a aproximação de registros compartilháveis.
7. Exportar e reimportar backup, distinguindo exportação pessoal exata (com confirmação) de compartilhável.
8. Exercitar câmera/GPS e as alternativas de galeria/ponto manual quando as permissões forem recusadas.

O mapa representa o contorno regional do bioma, sem ruas ou imagens de satélite. Os testes automatizados não substituem as verificações de permissão, arquivos e renderização no Android.
