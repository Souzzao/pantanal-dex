-- PantanalDex · correção da revisão do Codex (PR #16, 07/11)
--
-- 1) Dono conferido na própria gravação: se duas publicações com o mesmo id chegam juntas,
--    a segunda cai no ON CONFLICT e só atualiza se o hash do dono for o mesmo. Senão, recusa.
-- 2) Cota de 30/dia sem corrida: um "cadeado" por aparelho (pg_advisory_xact_lock) faz as
--    publicações do mesmo aparelho rodarem uma de cada vez dentro da transação.

create or replace function public.publish_sighting(
  p_id text, p_species_id text, p_observed_on date, p_observed_time text,
  p_cell_lat numeric, p_cell_lon numeric, p_expires_at timestamptz, p_secret text
) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text := encode(digest(coalesce(p_secret, ''), 'sha256'), 'hex');
  v_exists boolean;
  v_today int;
  v_rows int;
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

  -- Uma publicação por vez para cada aparelho (vale até o fim da transação).
  perform pg_advisory_xact_lock(hashtextextended('pantanal-dex:' || v_hash, 0));

  select true into v_exists from public_sightings where id = p_id and owner_hash = v_hash;
  if v_exists is null then
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
    published_at = now(), expires_at = excluded.expires_at, ended_at = null
  where public_sightings.owner_hash = excluded.owner_hash;

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'registro pertence a outro aparelho';
  end if;
end;
$$;

revoke all on function public.publish_sighting(text, text, date, text, numeric, numeric, timestamptz, text) from public;
grant execute on function public.publish_sighting(text, text, date, text, numeric, numeric, timestamptz, text) to anon, authenticated;
