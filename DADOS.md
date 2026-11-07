# PantanalDex · Onde ficam os dados

Explicação em linguagem simples de **o que o app guarda, onde guarda e por quê**. Serve para a banca, para o relatório e para quem for mexer no código depois.

## 1. No aparelho (sempre funciona, sem internet)

| O quê | Onde | Observação |
|---|---|---|
| Caderno de campo (avistamentos: espécie, data, hora, coordenada exata, observação, foto) | AsyncStorage `pantanal-dex:sightings…` | **Nunca sai do aparelho**, a não ser que a pessoa exporte (CSV/GeoJSON) ou publique (ver item 2). |
| Publicações no mapa público (qual avistamento está público e até quando) | AsyncStorage `pantanal-dex:public-publications-v1` | Chave separada: não mexe no caderno. |
| Fila de envio para o servidor (publicar/encerrar que ainda não subiram) | AsyncStorage `pantanal-dex:public-feed-queue-v1` | Se estiver sem internet, as ações esperam aqui e sobem depois. |
| Segredo do aparelho (64 caracteres aleatórios) | SecureStore (área protegida do celular) | Prova que "esta publicação é minha" sem login. Nunca é mostrado na tela. |
| Imagens do catálogo baixadas para uso offline | Cache de disco do `expo-image` | Pode ser apagado pelo sistema; o app baixa de novo quando houver rede. |

## 2. No servidor (opcional — só quando o Supabase estiver configurado)

Sem as variáveis `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`, o app **não fala com servidor nenhum**: o mapa público mostra só os registros públicos do próprio aparelho e os exemplos.

Com o servidor ligado, cada registro público vira **uma linha** na tabela `public_sightings`:

| Campo | Exemplo | Por quê |
|---|---|---|
| `id` | `sighting-123@1a2b3c4d` | id do avistamento + 8 letras do aparelho (evita colisão entre aparelhos). |
| `species_id` | `onca-pintada` | Espécie do catálogo. |
| `observed_on`, `observed_time` | `2026-11-06`, `07:30` | Data e hora do avistamento (filtro por data). |
| `cell_lat`, `cell_lon` | `-16.4`, `-56.9` | **Só o centro de uma célula de 0,1° (~11 km)**, nunca a coordenada exata (RN03). |
| `published_at`, `expires_at`, `ended_at` | | Duração escolhida pela pessoa (1 dia a "sempre") e encerramento antecipado. |
| `owner_hash` | 64 letras | **Hash** do segredo do aparelho. Não identifica a pessoa e não é publicado. |

**Não vai para o servidor:** nome, e-mail, telefone, foto, observação escrita, coordenada exata, modelo do celular.

## 3. Quem pode ler e escrever (segurança no banco)

- A tabela tem **RLS ligado e nenhuma política** para o público: ninguém lê nem escreve nela diretamente.
- **Leitura:** pela view `public_feed`, que entrega só registros ativos e **sem** `owner_hash`.
- **Escrita:** só pelas funções `publish_sighting` e `end_publication`, que conferem:
  - segredo do aparelho com pelo menos 32 caracteres;
  - coordenada já arredondada na grade de 0,1° (o servidor recusa coordenada exata);
  - data não pode estar no futuro; prazo não pode já estar vencido;
  - só o mesmo aparelho renova ou encerra a própria publicação;
  - no máximo 30 publicações novas por aparelho por dia (mesma regra do UC06).
- A chave `anon` que vai no app é **pública por definição** (qualquer app Supabase funciona assim); a proteção está nas regras acima. A chave `service_role` **nunca** entra no app nem no repositório.

Arquivo com todas as regras: `supabase/migrations/20261107000000_public_feed.sql` (testado em PostgreSQL 16 real com o papel `anon`, 15 cenários + teste ponta a ponta com os pedidos gerados pelo próprio app).

## 4. LGPD em uma frase por princípio

- **Finalidade e necessidade:** o servidor guarda só o mínimo para desenhar o mapa (espécie, data, célula de ~11 km, prazo).
- **Consentimento e controle:** publicar é escolha da pessoa por registro; ela escolhe a duração, encerra quando quiser e vê tudo em "Meus registros públicos".
- **Anonimização:** sem cadastro; o vínculo com o aparelho é um hash que não volta para o segredo.
- **Prazo de guarda:** registros vencidos ou encerrados somem do mapa na hora (a view filtra). Limpeza definitiva das linhas antigas fica como melhoria pós-MVP (tarefa agendada no Supabase).
- **Segurança:** regras no próprio banco, não só no app; segredo guardado no SecureStore.

## 5. O que fica para depois do MVP

- Login opcional (Supabase Auth) para levar os registros para outro celular.
- Apagar de vez as linhas encerradas há mais de 30 dias (`pg_cron`).
- Moderação/denúncia de registros públicos estranhos.
