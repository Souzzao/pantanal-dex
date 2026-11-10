# Mapa público e auditoria: como funciona

Guia curto para a apresentação e para quem for mexer no código. Detalhes de dados e LGPD em `DADOS.md`.

## Caminho de um avistamento

1. **Registrar** (aba "Registrar"): o avistamento fica **no aparelho, na conta da pessoa**, com foto e coordenada exata. Funciona sem internet.
2. **Compartilhável?** Se a pessoa marcar "Compartilhável" e houver localização, o app **publica automaticamente por 30 dias**. Em "Meus registros públicos" ela escolhe outro prazo (1 dia a sem prazo), encerra ou renova.
3. **Fila:** sem internet, a publicação espera numa fila no aparelho e sobe quando a conexão volta. A foto sobe antes, para uma pasta privada da conta.
4. **Servidor:** grava como **pendente**. O público vê só a espécie, a data, a hora e a **célula de ~11 km** (RN03), com o selo "aguardando verificação".
5. **Auditor** (Configurações → "Auditoria de avistamentos"): confere a **pilha** e decide. Arrastar para a direita **aprova**; para a esquerda **reprova, com motivo**. Também pode corrigir a espécie.
6. **Resultado:** aprovado vira "verificado" no mapa de todos; reprovado some do mapa, e a pessoa vê o motivo em "Meus registros públicos".
7. **Mudanças depois de publicar:** se a pessoa editar o registro, a cópia pública é atualizada (e volta para pendente se a espécie, a data ou o local mudarem). Se o registro virar "Pessoal" ou for apagado, a publicação é encerrada.

## O que cada um vê

| | Público (com conta) | Dono | Auditor | Dev |
|---|---|---|---|---|
| Espécie, data, hora | ✓ | ✓ | ✓ | ✓ |
| Célula de ~11 km | ✓ | ✓ | ✓ | ✓ |
| Coordenada exata, observação, foto | — | ✓ (no aparelho) | ✓ | ✓ |
| Nome de quem enviou | — | ✓ | ✓ | ✓ |
| Reprovados | — | ✓ (com motivo) | histórico | histórico |
| Contas e papéis | — | — | — | ✓ |

## Mapa

- **Imagem de satélite** Sentinel-2 (EOxCloudless 2024, uso não comercial com crédito), com nomes e divisas opcionais. Sem internet, o app usa o mapa offline de contornos.
- Registros próximos viram **círculos com número**; a partir de 5 registros, o círculo fica **laranja** ("alta incidência"). Com bastante zoom, cada área aparece como um quadrado de ~11 km, nunca como um ponto exato.
- Os pendentes têm **borda tracejada**.

## Onde está no código

| Assunto | Arquivo |
|---|---|
| Regras do mapa público (prazo, filtro, agrupamento, célula) | `shared/public-map.ts` |
| Fila de envio e chamadas ao servidor | `shared/public-feed.ts`, `contexts/PublicationsContext.tsx` |
| Login e modo offline | `contexts/AuthContext.tsx`, `lib/supabase.ts`, `shared/auth.ts` |
| Mapa de satélite (Leaflet numa WebView) | `shared/street-map.ts`, `components/StreetMap.tsx` |
| Telas | `app/public-map.tsx`, `app/public-records.tsx`, `app/audit.tsx`, `app/dev-area.tsx` |
| Banco (tabelas, RLS, funções) | `supabase/migrations/` |

## Roteiro da demonstração (3 contas)

1. **Usuária:** registra um tuiuiú com foto, marca "Compartilhável" e abre o Mapa público. O registro aparece com a borda tracejada (pendente).
2. **Modo avião:** fecha e reabre o app. A conta continua aberta, e o caderno e o catálogo funcionam.
3. **Auditor:** abre a pilha, compara a foto enviada com a foto do catálogo e aprova arrastando para a direita. Também mostra uma reprovação com motivo.
4. **Usuária:** em "Meus registros públicos", vê "Verificado" e, no outro registro, o motivo da reprovação.
5. **Dev:** abre a área dev, mostra os números e promove uma conta a auditor.
