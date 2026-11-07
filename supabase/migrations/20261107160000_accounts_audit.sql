-- PantanalDex · contas, papéis e auditoria (pedido do Felipe, 07/11)
--
-- Papéis: user (registra e pede para publicar), auditor (confere a pilha de pendentes e decide),
-- dev (escolhe auditores, vê números e o histórico). Login por e-mail e senha (Supabase Auth).
--
-- Publicação passa a ser ligada à conta (auth.uid()), não mais ao segredo do aparelho:
--  * a pessoa envia a coordenada exata, a observação e a foto; isso só o AUDITOR vê (pela RPC);
--  * o público vê só espécie, data, hora, célula de 0,1° (RN03) e a situação (pendente/aprovado);
--  * reprovados somem do mapa; toda decisão fica no histórico (sighting_reviews).

-- ───────────── Perfis e papéis ─────────────

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  role         text not null default 'user' check (role in ('user', 'auditor', 'dev')),
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Papel de quem está chamando (null sem login).
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;
revoke all on function public.my_role() from public;
grant execute on function public.my_role() to authenticated;

drop policy if exists "ver o proprio perfil" on public.profiles;
create policy "ver o proprio perfil" on public.profiles for select to authenticated
  using (id = auth.uid() or public.my_role() in ('auditor', 'dev'));
drop policy if exists "editar o proprio nome" on public.profiles;
create policy "editar o proprio nome" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Perfil criado junto com a conta.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Observador'), 40))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── Publicações ligadas à conta ─────────────

alter table public.public_sightings alter column owner_hash drop not null;
alter table public.public_sightings
  add column if not exists owner_id    uuid references auth.users (id) on delete cascade,
  add column if not exists local_id    text check (local_id is null or char_length(local_id) between 1 and 80),
  add column if not exists status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  add column if not exists exact_lat   double precision check (exact_lat is null or exact_lat between -90 and 90),
  add column if not exists exact_lon   double precision check (exact_lon is null or exact_lon between -180 and 180),
  add column if not exists notes       text check (notes is null or char_length(notes) <= 500),
  add column if not exists photo_path  text check (photo_path is null or char_length(photo_path) <= 200),
  add column if not exists reviewed_by uuid references auth.users (id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_note text check (review_note is null or char_length(review_note) <= 300);

create unique index if not exists public_sightings_owner_local_idx on public.public_sightings (owner_id, local_id) where owner_id is not null;
create index if not exists public_sightings_pending_idx on public.public_sightings (published_at) where status = 'pending' and ended_at is null;

-- Leitura pública: só quem tem conta, só colunas públicas (+ situação), sem reprovados.
revoke all on public.public_sightings from anon, authenticated;
grant select (id, species_id, observed_on, observed_time, cell_lat, cell_lon, published_at, expires_at, status)
  on public.public_sightings to authenticated;
drop policy if exists "registros ativos sao publicos" on public.public_sightings;
create policy "registros ativos sao publicos" on public.public_sightings
  for select to authenticated
  using (ended_at is null and status <> 'rejected' and (expires_at is null or expires_at > now()));

drop view if exists public.public_feed;
create view public.public_feed with (security_invoker = true) as
  select id, species_id, observed_on, observed_time, cell_lat, cell_lon, published_at, expires_at, status
  from public.public_sightings;
revoke all on public.public_feed from anon;
grant select on public.public_feed to authenticated;

-- As funções antigas (segredo do aparelho, sem login) deixam de ser usadas.
revoke all on function public.publish_sighting(text, text, date, text, numeric, numeric, timestamptz, text) from anon, authenticated;
revoke all on function public.end_publication(text, text) from anon, authenticated;

-- Histórico de decisões da auditoria (ninguém lê direto; só pelas funções).
create table if not exists public.sighting_reviews (
  id             bigint generated always as identity primary key,
  sighting_id    text not null references public.public_sightings (id) on delete cascade,
  auditor_id     uuid references auth.users (id) on delete set null,
  decision       text not null check (decision in ('approved', 'rejected')),
  old_species_id text,
  new_species_id text,
  note           text check (note is null or char_length(note) <= 300),
  created_at     timestamptz not null default now()
);
alter table public.sighting_reviews enable row level security;
revoke all on public.sighting_reviews from anon, authenticated;

-- Publica ou atualiza (volta para "pendente" se o conteúdo mudou). Retorna o id público.
create or replace function public.publish_my_sighting(
  p_local_id text, p_species_id text, p_observed_on date, p_observed_time text,
  p_exact_lat double precision, p_exact_lon double precision, p_notes text, p_photo_path text, p_expires_at timestamptz
) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_uid uuid := auth.uid();
  v_id text;
  v_today int;
  v_lat numeric(4,1);
  v_lon numeric(4,1);
begin
  if v_uid is null then raise exception 'entre na sua conta para publicar'; end if;
  if p_local_id is null or char_length(p_local_id) not between 1 and 80 then raise exception 'registro inválido'; end if;
  if p_species_id is null or p_species_id !~ '^[a-z0-9-]{1,60}$' then raise exception 'espécie inválida'; end if;
  if p_exact_lat is null or p_exact_lon is null or abs(p_exact_lat) > 90 or abs(p_exact_lon) > 180 then raise exception 'localização inválida'; end if;
  if p_observed_on > (now() at time zone 'utc')::date + 1 then raise exception 'data do avistamento no futuro'; end if;
  if p_expires_at is not null and p_expires_at <= now() then raise exception 'prazo de publicação já vencido'; end if;
  if p_photo_path is not null and split_part(p_photo_path, '/', 1) <> v_uid::text then raise exception 'foto de outra conta'; end if;

  v_lat := round(p_exact_lat::numeric, 1);
  v_lon := round(p_exact_lon::numeric, 1);

  -- Uma publicação por vez para cada conta: a cota não estoura com envios simultâneos.
  perform pg_advisory_xact_lock(hashtextextended('pantanal-dex:' || v_uid::text, 0));

  select id into v_id from public_sightings where owner_id = v_uid and local_id = p_local_id;
  if v_id is null then
    select count(*) into v_today from public_sightings where owner_id = v_uid and published_at > now() - interval '1 day';
    if v_today >= 30 then raise exception 'limite de 30 publicações por dia'; end if;
    v_id := gen_random_uuid()::text;
    insert into public_sightings (id, owner_id, local_id, species_id, observed_on, observed_time, cell_lat, cell_lon, exact_lat, exact_lon, notes, photo_path, published_at, expires_at, status)
    values (v_id, v_uid, p_local_id, p_species_id, p_observed_on, p_observed_time, v_lat, v_lon, p_exact_lat, p_exact_lon, nullif(trim(p_notes), ''), p_photo_path, now(), p_expires_at, 'pending');
  else
    update public_sightings set
      status = case when species_id is distinct from p_species_id or observed_on is distinct from p_observed_on
                      or cell_lat is distinct from v_lat or cell_lon is distinct from v_lon or status = 'rejected'
                    then 'pending' else status end,
      species_id = p_species_id, observed_on = p_observed_on, observed_time = p_observed_time,
      cell_lat = v_lat, cell_lon = v_lon, exact_lat = p_exact_lat, exact_lon = p_exact_lon,
      notes = nullif(trim(p_notes), ''), photo_path = coalesce(p_photo_path, photo_path),
      published_at = now(), expires_at = p_expires_at, ended_at = null
    where id = v_id and owner_id = v_uid;
  end if;
  return v_id;
end;
$$;

create or replace function public.end_my_publication(p_local_id text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'entre na sua conta'; end if;
  update public_sightings set ended_at = now() where owner_id = auth.uid() and local_id = p_local_id and ended_at is null;
end;
$$;

-- Minhas publicações e o resultado da auditoria (para "Meus registros públicos").
create or replace function public.my_publications()
returns table (local_id text, id text, status text, review_note text, reviewed_at timestamptz, ended_at timestamptz, expires_at timestamptz)
language sql stable security definer set search_path = public as $$
  select local_id, id, status, review_note, reviewed_at, ended_at, expires_at
  from public_sightings where owner_id = auth.uid();
$$;

-- ───────────── Auditoria ─────────────

-- Pilha de pendentes, do mais antigo para o mais novo (auditor e dev).
create or replace function public.audit_queue(p_limit int default 50)
returns table (id text, species_id text, observed_on date, observed_time text, exact_lat double precision, exact_lon double precision,
               cell_lat numeric, cell_lon numeric, notes text, photo_path text, published_at timestamptz, owner_name text)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.my_role() not in ('auditor', 'dev') then raise exception 'apenas auditores'; end if;
  return query
    select s.id, s.species_id, s.observed_on, s.observed_time, s.exact_lat, s.exact_lon, s.cell_lat, s.cell_lon,
           s.notes, s.photo_path, s.published_at, p.display_name
    from public_sightings s left join profiles p on p.id = s.owner_id
    where s.status = 'pending' and s.ended_at is null and (s.expires_at is null or s.expires_at > now()) and s.owner_id is not null
    order by s.published_at asc
    limit least(greatest(coalesce(p_limit, 50), 1), 200);
end;
$$;

-- Decide um pendente. Pode corrigir a espécie. Reprovar exige justificativa.
create or replace function public.review_sighting(p_id text, p_decision text, p_note text default null, p_species_id text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_old text;
begin
  if public.my_role() not in ('auditor', 'dev') then raise exception 'apenas auditores'; end if;
  if p_decision not in ('approved', 'rejected') then raise exception 'decisão inválida'; end if;
  if p_decision = 'rejected' and coalesce(trim(p_note), '') = '' then raise exception 'explique o motivo da reprovação'; end if;
  if p_species_id is not null and p_species_id !~ '^[a-z0-9-]{1,60}$' then raise exception 'espécie inválida'; end if;

  select species_id into v_old from public_sightings where id = p_id and owner_id is not null for update;
  if v_old is null then raise exception 'registro não encontrado'; end if;

  update public_sightings set
    status = p_decision,
    species_id = coalesce(p_species_id, species_id),
    reviewed_by = auth.uid(), reviewed_at = now(), review_note = nullif(trim(p_note), '')
  where id = p_id;

  insert into sighting_reviews (sighting_id, auditor_id, decision, old_species_id, new_species_id, note)
  values (p_id, auth.uid(), p_decision, v_old, case when p_species_id is distinct from v_old then p_species_id end, nullif(trim(p_note), ''));
end;
$$;

-- Histórico das decisões (auditor e dev).
create or replace function public.review_log(p_limit int default 50)
returns table (created_at timestamptz, sighting_id text, decision text, old_species_id text, new_species_id text, note text, auditor_name text)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.my_role() not in ('auditor', 'dev') then raise exception 'apenas auditores'; end if;
  return query
    select r.created_at, r.sighting_id, r.decision, r.old_species_id, r.new_species_id, r.note, p.display_name
    from sighting_reviews r left join profiles p on p.id = r.auditor_id
    order by r.created_at desc limit least(greatest(coalesce(p_limit, 50), 1), 200);
end;
$$;

-- ───────────── Área dev ─────────────

create or replace function public.dev_list_users()
returns table (id uuid, email text, display_name text, role text, created_at timestamptz, publications bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.my_role() <> 'dev' then raise exception 'apenas dev'; end if;
  return query
    select p.id, u.email::text, p.display_name, p.role, p.created_at,
           (select count(*) from public_sightings s where s.owner_id = p.id)
    from profiles p join auth.users u on u.id = p.id
    order by p.created_at desc;
end;
$$;

create or replace function public.dev_set_role(p_user uuid, p_role text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'dev' then raise exception 'apenas dev'; end if;
  if p_role not in ('user', 'auditor', 'dev') then raise exception 'papel inválido'; end if;
  if p_user = auth.uid() and p_role <> 'dev' and (select count(*) from profiles where role = 'dev') <= 1 then
    raise exception 'você é o único dev: promova outra pessoa antes';
  end if;
  update profiles set role = p_role where id = p_user;
  if not found then raise exception 'conta não encontrada'; end if;
end;
$$;

create or replace function public.dev_stats()
returns table (users bigint, auditors bigint, pending bigint, approved bigint, rejected bigint, reviews_today bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.my_role() <> 'dev' then raise exception 'apenas dev'; end if;
  return query select
    (select count(*) from profiles), (select count(*) from profiles where role in ('auditor', 'dev')),
    (select count(*) from public_sightings where status = 'pending' and ended_at is null and owner_id is not null),
    (select count(*) from public_sightings where status = 'approved' and owner_id is not null),
    (select count(*) from public_sightings where status = 'rejected' and owner_id is not null),
    (select count(*) from sighting_reviews where created_at > now() - interval '1 day');
end;
$$;

do $$
declare f text;
begin
  foreach f in array array[
    'public.publish_my_sighting(text, text, date, text, double precision, double precision, text, text, timestamptz)',
    'public.end_my_publication(text)', 'public.my_publications()', 'public.audit_queue(int)',
    'public.review_sighting(text, text, text, text)', 'public.review_log(int)',
    'public.dev_list_users()', 'public.dev_set_role(uuid, text)', 'public.dev_stats()'
  ] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;

-- ───────────── Fotos dos avistamentos (Storage) ─────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sighting-photos', 'sighting-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fotos: dono envia" on storage.objects;
create policy "fotos: dono envia" on storage.objects for insert to authenticated
  with check (bucket_id = 'sighting-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "fotos: dono troca" on storage.objects;
create policy "fotos: dono troca" on storage.objects for update to authenticated
  using (bucket_id = 'sighting-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "fotos: dono e auditor veem" on storage.objects;
create policy "fotos: dono e auditor veem" on storage.objects for select to authenticated
  using (bucket_id = 'sighting-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.my_role() in ('auditor', 'dev')));
drop policy if exists "fotos: dono apaga" on storage.objects;
create policy "fotos: dono apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'sighting-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- O Supabase dá EXECUTE para anon/authenticated por padrão: o gatilho não deve ser chamável pela API.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.my_role() from public, anon;
grant execute on function public.my_role() to authenticated;
