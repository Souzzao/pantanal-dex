-- PantanalDex · Coleção da equipe, personagem e autoria (pacote "Equipes e Personagens", 25/11).
--
-- Regras (ESPECIFICACAO.md e TESTES-DE-ACEITE.md do pacote):
--  * Personagem: cor, olhos e acessório guardados no perfil, só com valores da lista do app.
--  * Registro da equipe: cada observação tem o seu ID, a sua descrição e as suas fotos. Vários registros
--    da mesma espécie (de pessoas diferentes ou da mesma pessoa) convivem: não há unicidade por
--    espécie+autor nem espécie+equipe.
--  * O autor é SEMPRE auth.uid(): a função não recebe autor, então ninguém registra em nome de outro (T07).
--  * Reenvio seguro: (autor, op_id) é único; repetir a mesma operação devolve o mesmo registro (T04).
--  * Privacidade: a equipe vê fotos, descrição, data e a ZONA de 0,1° (~11 km). Coordenada exata nunca
--    chega ao servidor por aqui. Só membros leem os registros e as fotos (T06), no banco e no Storage.
--  * Pessoa que exclui a conta: o registro fica, sem autor ("Autoria indisponível", T09).
--  * Tabelas fechadas (RLS sem política): tudo passa pelas funções abaixo.
--
-- @author Felipe de Souza Aquino

-- ───────────── Personagem no perfil ─────────────
alter table public.profiles add column if not exists avatar jsonb not null default '{"tone":"verde","eyes":"redondos","item":"nenhum"}'::jsonb;
alter table public.profiles drop constraint if exists profiles_avatar_valid;
alter table public.profiles add constraint profiles_avatar_valid check (
  jsonb_typeof(avatar) = 'object'
  and avatar ->> 'tone' in ('verde', 'pessego', 'lavanda', 'amarelo', 'rio', 'ipe')
  and avatar ->> 'eyes' in ('redondos', 'curvos', 'sono')
  and avatar ->> 'item' in ('nenhum', 'estrela', 'broche', 'folha', 'chapeu')
  and avatar - 'tone' - 'eyes' - 'item' = '{}'::jsonb
);

create or replace function public.set_my_avatar(p_tone text, p_eyes text, p_item text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v jsonb := jsonb_build_object('tone', p_tone, 'eyes', p_eyes, 'item', p_item);
begin
  if auth.uid() is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  update profiles set avatar = v where id = auth.uid();
  if not found then raise exception 'perfil não encontrado'; end if;
  return v;
exception when check_violation then
  raise exception 'personagem inválido';
end;
$$;

create or replace function public.my_profile()
returns table (display_name text, avatar jsonb)
language sql stable security definer set search_path = public as $$
  select p.display_name, p.avatar from profiles p where p.id = auth.uid();
$$;

-- Personagem de cada membro (nome acima do personagem na lista). Função separada para não mudar o
-- formato de team_overview, que as versões anteriores do app ainda usam.
create or replace function public.team_member_avatars(p_team uuid)
returns table (user_id uuid, avatar jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_team_member(p_team) then raise exception 'você não é desta equipe'; end if;
  return query select m.user_id, coalesce(p.avatar, '{"tone":"verde","eyes":"redondos","item":"nenhum"}'::jsonb)
    from team_members m left join profiles p on p.id = m.user_id where m.team_id = p_team;
end;
$$;

-- ───────────── Registros da equipe ─────────────
create table if not exists public.team_records (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references public.teams (id) on delete cascade,
  number       integer not null check (number > 0),
  author_id    uuid references auth.users (id) on delete set null,
  op_id        text not null check (op_id ~ '^[A-Za-z0-9._:-]{8,120}$'),
  species_id   text not null check (species_id ~ '^[a-z0-9-]{1,80}$'),
  description  text not null default '' check (char_length(description) <= 500),
  observed_on  date not null check (observed_on >= date '1990-01-01'),
  zone_lat     numeric(4, 1) check (zone_lat between -35 and 6),
  zone_lon     numeric(4, 1) check (zone_lon between -75 and -30),
  photo_paths  text[] not null default '{}' check (cardinality(photo_paths) <= 8),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (team_id, number),
  unique (author_id, op_id)
);
create index if not exists team_records_team_species_idx on public.team_records (team_id, species_id, created_at, id);
alter table public.team_records enable row level security;
revoke all on public.team_records from anon, authenticated;

create or replace function public.is_team_member(p_team uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from team_members where team_id = p_team and user_id = auth.uid());
$$;

-- Caminho das fotos no Storage: <equipe>/<autor>/<arquivo>. O autor só envia na própria pasta.
create or replace function public.valid_team_photo_paths(p_team uuid, p_paths text[])
returns boolean language sql stable as $$
  select coalesce(bool_and(p ~ ('^' || p_team::text || '/' || coalesce(auth.uid()::text, 'x') || '/[A-Za-z0-9._-]{1,80}\.(jpg|jpeg|png|webp)$')), true)
  from unnest(coalesce(p_paths, '{}')) p;
$$;

create or replace function public.share_team_record(
  p_team uuid, p_op text, p_species text, p_description text, p_observed_on date,
  p_zone_lat double precision, p_zone_lon double precision, p_photo_paths text[]
) returns table (record_id uuid, record_number integer)
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); existing record; next_number int;
begin
  if uid is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  if not exists (select 1 from team_members where team_id = p_team and user_id = uid) then raise exception 'você não é desta equipe'; end if;
  if not public.valid_team_photo_paths(p_team, p_photo_paths) then raise exception 'fotos inválidas'; end if;
  if p_observed_on is null or p_observed_on > (now() + interval '1 day')::date then raise exception 'data inválida'; end if;
  if (p_zone_lat is null) <> (p_zone_lon is null) then raise exception 'zona inválida'; end if;
  -- Mesma operação repetida (reenvio depois de falha de rede): devolve o registro já criado.
  select id, number into existing from team_records where author_id = uid and op_id = p_op;
  if found then return query select existing.id, existing.number; return; end if;
  if (select count(*) from team_records where author_id = uid and created_at > now() - interval '1 day') >= 60 then
    raise exception 'limite diário de registros na equipe';
  end if;
  perform 1 from teams where id = p_team for update; -- numeração sem buracos por equipe, mesmo com envios simultâneos
  select coalesce(max(number), 0) + 1 into next_number from team_records where team_id = p_team;
  return query
    insert into team_records (team_id, number, author_id, op_id, species_id, description, observed_on, zone_lat, zone_lon, photo_paths)
    values (p_team, next_number, uid, p_op, p_species, left(coalesce(btrim(p_description), ''), 500), p_observed_on,
            round(p_zone_lat::numeric, 1), round(p_zone_lon::numeric, 1), coalesce(p_photo_paths, '{}'))
    returning id, number;
end;
$$;

-- Só o autor muda a descrição ou as fotos do próprio registro; os outros registros não mudam (T05).
create or replace function public.update_team_record(p_id uuid, p_description text, p_photo_paths text[])
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select * into r from team_records where id = p_id;
  if not found or r.author_id is distinct from auth.uid() then raise exception 'ação não permitida'; end if;
  if not public.valid_team_photo_paths(r.team_id, p_photo_paths) then raise exception 'fotos inválidas'; end if;
  update team_records set description = left(coalesce(btrim(p_description), ''), 500), photo_paths = coalesce(p_photo_paths, photo_paths), updated_at = now()
  where id = p_id;
end;
$$;

-- Apagar: o autor, ou dono/admin da equipe (moderação).
create or replace function public.delete_team_record(p_id uuid)
returns text[] language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select * into r from team_records where id = p_id;
  if not found then raise exception 'registro não encontrado'; end if;
  if r.author_id is distinct from auth.uid() and not exists (
    select 1 from team_members where team_id = r.team_id and user_id = auth.uid() and role in ('owner', 'admin')) then
    raise exception 'ação não permitida';
  end if;
  delete from team_records where id = p_id;
  return r.photo_paths;
end;
$$;

-- Coleção da equipe: todos os registros autorizados, com autor e personagem (nulo = autoria indisponível).
create or replace function public.team_records(p_team uuid)
returns table (id uuid, number integer, species_id text, author_id uuid, author_name text, author_avatar jsonb,
               description text, observed_on date, zone_lat double precision, zone_lon double precision, photo_paths text[], created_at timestamptz, updated_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_team_member(p_team) then raise exception 'você não é desta equipe'; end if;
  return query
    select r.id, r.number, r.species_id, r.author_id, p.display_name, p.avatar,
           r.description, r.observed_on, r.zone_lat::double precision, r.zone_lon::double precision, r.photo_paths, r.created_at, r.updated_at
    from team_records r left join profiles p on p.id = r.author_id
    where r.team_id = p_team
    order by r.species_id, r.created_at, r.id
    limit 5000;
end;
$$;

-- Leitura das fotos no Storage: só quem é da equipe da pasta (o nome começa com o id da equipe).
create or replace function public.can_read_team_media(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare team_text text := split_part(p_name, '/', 1);
begin
  if team_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return false; end if;
  return public.is_team_member(team_text::uuid);
end;
$$;

create or replace function public.can_write_team_media(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  return public.can_read_team_media(p_name) and split_part(p_name, '/', 2) = auth.uid()::text
    and p_name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[A-Za-z0-9._-]{1,80}\.(jpg|jpeg|png|webp)$';
end;
$$;

do $$
declare f text;
begin
  foreach f in array array[
    'set_my_avatar(text, text, text)', 'my_profile()', 'team_member_avatars(uuid)', 'is_team_member(uuid)',
    'share_team_record(uuid, text, text, text, date, double precision, double precision, text[])',
    'update_team_record(uuid, text, text[])', 'delete_team_record(uuid)', 'team_records(uuid)',
    'can_read_team_media(text)', 'can_write_team_media(text)', 'valid_team_photo_paths(uuid, text[])'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;

-- ───────────── Fotos da equipe (Storage privado) ─────────────
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') and to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('team-media', 'team-media', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
    on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

    drop policy if exists "equipe: membro vê fotos" on storage.objects;
    create policy "equipe: membro vê fotos" on storage.objects for select to authenticated
      using (bucket_id = 'team-media' and public.can_read_team_media(name));
    drop policy if exists "equipe: autor envia" on storage.objects;
    create policy "equipe: autor envia" on storage.objects for insert to authenticated
      with check (bucket_id = 'team-media' and public.can_write_team_media(name));
    drop policy if exists "equipe: autor apaga" on storage.objects;
    create policy "equipe: autor apaga" on storage.objects for delete to authenticated
      using (bucket_id = 'team-media' and split_part(name, '/', 2) = auth.uid()::text);
  end if;
end $$;
