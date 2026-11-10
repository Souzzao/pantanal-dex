-- PantanalDex · mapa público (registros públicos de todas as pessoas)
--
-- Regras:
--  * Nunca guarda a coordenada exata: só o centro da célula de 0,1° (RN03).
--  * Sem login no MVP. Cada aparelho tem um segredo aleatório; o banco guarda só o hash
--    (sha256) desse segredo. Só quem tem o segredo encerra ou renova a própria publicação.
--  * Leitura pública só de registros ativos e sem o dado do dono: RLS com política de leitura
--    + permissão por coluna (owner_hash fica de fora). A view public_feed é security_invoker.
--  * Ninguém escreve na tabela diretamente: escrita só pelas funções publish_sighting e
--    end_publication (security definer, de propósito), que validam tudo.
--  * Limite de 30 publicações novas por aparelho por dia (mesma regra do UC06).

-- No Supabase o pgcrypto fica no schema "extensions"; por isso as funções usam search_path = public, extensions.
create extension if not exists pgcrypto;

create table if not exists public.public_sightings (
  id            text primary key check (char_length(id) between 1 and 80),
  species_id    text not null check (species_id ~ '^[a-z0-9-]{1,60}$'),
  observed_on   date not null,
  observed_time text check (observed_time is null or observed_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  cell_lat      numeric(4,1) not null check (cell_lat between -90 and 90),
  cell_lon      numeric(4,1) not null check (cell_lon between -180 and 180),
  published_at  timestamptz not null default now(),
  expires_at    timestamptz,
  ended_at      timestamptz,
  owner_hash    text not null check (char_length(owner_hash) = 64)
);

create index if not exists public_sightings_active_idx on public.public_sightings (observed_on desc) where ended_at is null;
create index if not exists public_sightings_owner_day_idx on public.public_sightings (owner_hash, published_at);

alter table public.public_sightings enable row level security;
revoke all on public.public_sightings from anon, authenticated;
-- Leitura: só as colunas públicas (sem owner_hash nem ended_at) e só registros ativos.
grant select (id, species_id, observed_on, observed_time, cell_lat, cell_lon, published_at, expires_at)
  on public.public_sightings to anon, authenticated;
drop policy if exists "registros ativos sao publicos" on public.public_sightings;
create policy "registros ativos sao publicos" on public.public_sightings
  for select to anon, authenticated
  using (ended_at is null and (expires_at is null or expires_at > now()));
-- Sem política de insert/update/delete: escrever só pelas funções abaixo.

-- Leitura pública pela view (roda com as permissões de quem consulta; a política acima já
-- filtra os registros ativos, e a view não cita colunas privadas).
drop view if exists public.public_feed;
create view public.public_feed with (security_invoker = true) as
  select id, species_id, observed_on, observed_time, cell_lat, cell_lon, published_at, expires_at
  from public.public_sightings;

grant select on public.public_feed to anon, authenticated;

-- Publica ou renova. Renovar exige o mesmo segredo de quem publicou.
create or replace function public.publish_sighting(
  p_id text, p_species_id text, p_observed_on date, p_observed_time text,
  p_cell_lat numeric, p_cell_lon numeric, p_expires_at timestamptz, p_secret text
) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text := encode(digest(coalesce(p_secret, ''), 'sha256'), 'hex');
  v_existing text;
  v_today int;
begin
  if char_length(coalesce(p_secret, '')) < 32 then
    raise exception 'segredo do aparelho inválido';
  end if;
  if p_cell_lat <> round(p_cell_lat, 1) or p_cell_lon <> round(p_cell_lon, 1) then
    raise exception 'coordenada precisa estar na grade pública de 0,1 grau';
  end if;
  if p_observed_on > (now() at time zone 'utc')::date + 1 then
    raise exception 'data do avistamento no futuro';
  end if;
  if p_expires_at is not null and p_expires_at <= now() then
    raise exception 'prazo de publicação já vencido';
  end if;

  select owner_hash into v_existing from public_sightings where id = p_id;
  if v_existing is not null and v_existing <> v_hash then
    raise exception 'registro pertence a outro aparelho';
  end if;

  if v_existing is null then
    select count(*) into v_today from public_sightings
      where owner_hash = v_hash and published_at > now() - interval '1 day';
    if v_today >= 30 then
      raise exception 'limite de 30 publicações por dia';
    end if;
  end if;

  insert into public_sightings (id, species_id, observed_on, observed_time, cell_lat, cell_lon, published_at, expires_at, ended_at, owner_hash)
  values (p_id, p_species_id, p_observed_on, p_observed_time, p_cell_lat, p_cell_lon, now(), p_expires_at, null, v_hash)
  on conflict (id) do update set
    species_id = excluded.species_id, observed_on = excluded.observed_on, observed_time = excluded.observed_time,
    cell_lat = excluded.cell_lat, cell_lon = excluded.cell_lon,
    published_at = now(), expires_at = excluded.expires_at, ended_at = null;
end;
$$;

-- Encerra antes do prazo (só o dono).
create or replace function public.end_publication(p_id text, p_secret text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  update public_sightings set ended_at = now()
    where id = p_id and owner_hash = encode(digest(coalesce(p_secret, ''), 'sha256'), 'hex') and ended_at is null;
end;
$$;

revoke all on function public.publish_sighting(text, text, date, text, numeric, numeric, timestamptz, text) from public;
revoke all on function public.end_publication(text, text) from public;
grant execute on function public.publish_sighting(text, text, date, text, numeric, numeric, timestamptz, text) to anon, authenticated;
grant execute on function public.end_publication(text, text) to anon, authenticated;
