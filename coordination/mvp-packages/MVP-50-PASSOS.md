# PantanalDex — 50 passos coordenados para o MVP

## Regras de execução

Cada passo precisa produzir alteração verificável, teste ou evidência. O passo só conta quando o responsável atualiza `todo.md`, `HANDOFF-3-CONTAS.md`, roda `pnpm check`, `pnpm lint`, `pnpm test` e `git diff --check`, faz commit e abre ou atualiza PR. A main só recebe PR revisado. Licenças NC, ND, ausentes, IUCN e conservação sem ICMBio/MMA oficial são bloqueios.

## Passos

1. Congelar contratos `Species`, `Sighting`, `Settings` e exportação.
2. Medir catálogo real com `pnpm mvp:report`.
3. Registrar 102 espécies públicas, 36 modulares, 12 lotes pendentes e 306 imagens.
4. Fixar a matriz P1/P2 de espécies prioritárias.
5. Dividir o trabalho entre as branches dos três agentes.
6. Auditar IDs duplicados e campos científicos obrigatórios.
7. Auditar fontes estruturadas e URLs seguras.
8. Auditar imagens P1 individualmente.
9. Conferir autor, crédito e licença de cada imagem P1.
10. Conferir ocorrência pantaneira de cada espécie P1.
11. Conferir nomenclatura e sinônimos aceitos.
12. Conferir conservação apenas em fonte oficial permitida.
13. Preencher `reviewedAt`, `reviewedBy` e checklist quando comprovado.
14. Promover somente o primeiro lote realmente completo.
15. Reexecutar relatório de licenças e revisão.
16. Verificar busca por nome popular.
17. Verificar busca por nome científico e acentos.
18. Verificar filtros por grupo e ambiente.
19. Verificar paginação e ordenação.
20. Verificar abertura da ficha e galerias.
21. Verificar fallback de imagem quebrada.
22. Verificar créditos e fontes sem URL insegura.
23. Verificar estados loading, vazio, erro e offline.
24. Verificar idioma Português.
25. Verificar idioma English.
26. Verificar idioma Español.
27. Verificar acessibilidade de labels, roles e estados.
28. Verificar uso portrait e alcance com uma mão.
29. Verificar criação de avistamento.
30. Verificar edição de avistamento.
31. Verificar exclusão com confirmação.
32. Verificar foto pela câmera.
33. Verificar fallback web e galeria.
34. Verificar permissão de câmera negada.
35. Verificar GPS autorizado.
36. Verificar GPS negado.
37. Verificar serviço de localização desligado.
38. Verificar mapa sem coordenadas.
39. Verificar mapa com coordenadas e detalhe.
40. Verificar persistência após reinício.
41. Verificar corrupção e versão incompatível.
42. Verificar retry de leitura e gravação.
43. Verificar exportação JSON e CSV.
44. Verificar importação, merge e registros inválidos.
45. Verificar proteção de localização privada.
46. Rodar testes completos e corrigir regressões.
47. Fazer segunda passagem de bugs encontrados.
48. Revisar visualmente todas as rotas principais.
49. Consolidar handoff, créditos, riscos e checklist de release.
50. Abrir PR final, salvar checkpoint e declarar objetivamente se o MVP passou ou quais bloqueios permanecem.
