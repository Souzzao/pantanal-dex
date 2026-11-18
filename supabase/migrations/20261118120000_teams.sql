-- PantanalDex · Equipes (grupos de campo e estudo), pedido do Felipe em 18/11.
--
-- Regras:
--  * Até 100 pessoas por equipe (trava com bloqueio de linha: duas entradas ao mesmo tempo não passam de 100).
--  * Entrar pelo código de 8 letras/números (fácil de ditar no campo). Cada pessoa participa de até 5 equipes.
--  * Ninguém sai sem querer: sair é só pela função leave_team, chamada depois de confirmar o nome da
--    equipe no app. Ficar sem internet, sair da conta no aparelho ou reinstalar o app NÃO tira da equipe.
--  * O dono não sai sem passar a equipe para outra pessoa (ou apagar a equipe).
--  * A equipe vê só um RESUMO de cada membro: espécies avistadas, número de avistamentos e zonas
--    (células de ~11 km, as mesmas do mapa público). Nunca coordenada exata, notas ou fotos.
--  * Tabelas fechadas (RLS sem política): tudo passa pelas funções abaixo, que conferem auth.uid().
--
-- @author Felipe de Souza Aquino

create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 2 and 40),
  code        text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.team_members (
  team_id    uuid not null references public.teams (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at  timestamptz not null default now(),
  primary key (team_id, user_id)
);
create index if not exists team_members_user_idx on public.team_members (user_id);

-- Resumo que cada pessoa compartilha (um por pessoa, vale para todas as equipes dela).
create table if not exists public.team_stats (
  user_id         uuid primary key references auth.users (id) on delete cascade,
  species_ids     text[] not null default '{}' check (cardinality(species_ids) <= 2000),
  sightings_count integer not null default 0 check (sightings_count between 0 and 1000000),
  zones           jsonb not null default '[]'::jsonb check (jsonb_typeof(zones) = 'array' and jsonb_array_length(zones) <= 3000),
  updated_at      timestamptz not null default now()
);

alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.team_stats enable row level security;
revoke all on public.teams, public.team_members, public.team_stats from anon, authenticated;

-- Código sem letras que confundem (sem I, O, 0, 1).
create or replace function public.new_team_code() returns text
language plpgsql volatile set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out_code text;
begin
  loop
    out_code := '';
    for i in 1..8 loop
      out_code := out_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.teams where code = out_code);
  end loop;
  return out_code;
end;
$$;
revoke all on function public.new_team_code() from public, anon, authenticated;

-- Criar equipe: quem cria vira dono.
create or replace function public.create_team(p_name text)
returns table (team_id uuid, code text)
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_code text;
begin
  if v_uid is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  if char_length(btrim(coalesce(p_name, ''))) not between 2 and 40 then raise exception 'nome da equipe: 2 a 40 letras'; end if;
  if (select count(*) from team_members where user_id = v_uid) >= 5 then raise exception 'limite de 5 equipes por pessoa'; end if;
  v_code := new_team_code();
  insert into teams (name, code, owner_id) values (btrim(p_name), v_code, v_uid) returning id into v_id;
  insert into team_members (team_id, user_id, role) values (v_id, v_uid, 'owner');
  return query select v_id, v_code;
end;
$$;

-- Entrar pelo código. Idempotente: entrar de novo numa equipe em que já está não muda nada.
create or replace function public.join_team(p_code text)
returns table (team_id uuid, name text, members integer)
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_team teams%rowtype;
  v_count integer;
begin
  if v_uid is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  select * into v_team from teams where code = upper(btrim(coalesce(p_code, ''))) for update;
  if not found then raise exception 'código de equipe não encontrado'; end if;
  if not exists (select 1 from team_members where team_members.team_id = v_team.id and user_id = v_uid) then
    if (select count(*) from team_members where user_id = v_uid) >= 5 then raise exception 'limite de 5 equipes por pessoa'; end if;
    select count(*) into v_count from team_members where team_members.team_id = v_team.id;
    if v_count >= 100 then raise exception 'equipe cheia (100 pessoas)'; end if;
    insert into team_members (team_id, user_id) values (v_team.id, v_uid);
  end if;
  select count(*) into v_count from team_members where team_members.team_id = v_team.id;
  return query select v_team.id, v_team.name, v_count;
end;
$$;

-- Sair (só por pedido explícito). O dono precisa passar a equipe antes, a não ser que esteja sozinho
-- (aí a equipe é apagada).
create or replace function public.leave_team(p_team uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_count integer;
begin
  if v_uid is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  select role into v_role from team_members where team_id = p_team and user_id = v_uid;
  if v_role is null then return; end if;
  select count(*) into v_count from team_members where team_id = p_team;
  if v_role = 'owner' and v_count > 1 then raise exception 'passe a equipe para outra pessoa antes de sair'; end if;
  if v_role = 'owner' then
    delete from teams where id = p_team;
  else
    delete from team_members where team_id = p_team and user_id = v_uid;
  end if;
end;
$$;

-- Dono/admin: remover alguém, promover a admin ou passar a equipe (owner).
create or replace function public.manage_team_member(p_team uuid, p_user uuid, p_action text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_me text;
  v_target text;
begin
  if v_uid is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  select role into v_me from team_members where team_id = p_team and user_id = v_uid;
  select role into v_target from team_members where team_id = p_team and user_id = p_user;
  if v_me is null or v_target is null or p_user = v_uid then raise exception 'ação não permitida'; end if;
  if p_action = 'remove' then
    if v_target = 'owner' or (v_me = 'admin' and v_target = 'admin') or v_me = 'member' then raise exception 'ação não permitida'; end if;
    delete from team_members where team_id = p_team and user_id = p_user;
  elsif p_action in ('admin', 'member') then
    if v_me <> 'owner' or v_target = 'owner' then raise exception 'ação não permitida'; end if;
    update team_members set role = p_action where team_id = p_team and user_id = p_user;
  elsif p_action = 'owner' then
    if v_me <> 'owner' then raise exception 'ação não permitida'; end if;
    update team_members set role = 'admin' where team_id = p_team and user_id = v_uid;
    update team_members set role = 'owner' where team_id = p_team and user_id = p_user;
    update teams set owner_id = p_user where id = p_team;
  else
    raise exception 'ação desconhecida';
  end if;
end;
$$;

-- Dono: novo código (o antigo para de funcionar; quem já está continua).
create or replace function public.regenerate_team_code(p_team uuid)
returns text
language plpgsql security definer set search_path = public as $$
declare v_code text;
begin
  if not exists (select 1 from team_members where team_id = p_team and user_id = auth.uid() and role = 'owner') then
    raise exception 'ação não permitida';
  end if;
  v_code := new_team_code();
  update teams set code = v_code where id = p_team;
  return v_code;
end;
$$;

-- Envia o resumo do aparelho (espécies, número de avistamentos, zonas de ~11 km).
create or replace function public.sync_team_stats(p_species text[], p_sightings integer, p_zones jsonb)
returns timestamptz
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_now timestamptz := now();
begin
  if v_uid is null then raise exception 'não autenticado' using errcode = '28000'; end if;
  if coalesce(cardinality(p_species), 0) > 2000 or exists (select 1 from unnest(coalesce(p_species, '{}')) s where s !~ '^[\w\-]{1,80}$') then
    raise exception 'lista de espécies inválida';
  end if;
  if p_zones is null or jsonb_typeof(p_zones) <> 'array' or jsonb_array_length(p_zones) > 3000 then raise exception 'zonas inválidas'; end if;
  -- Cada zona: [especie, lat da célula, lon da célula, quantidade], com célula de 0,1° (nunca o ponto exato).
  if exists (
    select 1 from jsonb_array_elements(p_zones) z
    where jsonb_typeof(z) <> 'array' or jsonb_array_length(z) <> 4
      or (z->>0) !~ '^[\w\-]{1,80}$'
      or (z->>1)::numeric <> round((z->>1)::numeric, 1) or (z->>2)::numeric <> round((z->>2)::numeric, 1)
      or (z->>3)::int not between 1 and 100000
  ) then raise exception 'zonas inválidas'; end if;
  insert into team_stats (user_id, species_ids, sightings_count, zones, updated_at)
  values (v_uid, coalesce(p_species, '{}'), greatest(coalesce(p_sightings, 0), 0), p_zones, v_now)
  on conflict (user_id) do update set species_ids = excluded.species_ids, sightings_count = excluded.sightings_count,
    zones = excluded.zones, updated_at = v_now;
  return v_now;
end;
$$;

-- Minhas equipes (para a lista e para o cache offline).
create or replace function public.my_teams()
returns table (team_id uuid, name text, code text, my_role text, members integer, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select t.id, t.name, t.code, m.role, (select count(*)::int from team_members x where x.team_id = t.id), t.created_at
  from team_members m join teams t on t.id = m.team_id
  where m.user_id = auth.uid()
  order by t.created_at;
$$;

-- Visão da equipe: membros com o resumo de cada um (só para quem é da equipe).
create or replace function public.team_overview(p_team uuid)
returns table (user_id uuid, display_name text, role text, joined_at timestamptz, species_ids text[], sightings_count integer, zones jsonb, updated_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from team_members where team_id = p_team and team_members.user_id = auth.uid()) then
    raise exception 'você não é desta equipe';
  end if;
  return query
    select m.user_id, coalesce(p.display_name, 'Pessoa'), m.role, m.joined_at,
           coalesce(s.species_ids, '{}'), coalesce(s.sightings_count, 0), coalesce(s.zones, '[]'::jsonb), s.updated_at
    from team_members m
    left join profiles p on p.id = m.user_id
    left join team_stats s on s.user_id = m.user_id
    where m.team_id = p_team
    order by m.joined_at;
end;
$$;

do $$
declare f text;
begin
  foreach f in array array[
    'create_team(text)', 'join_team(text)', 'leave_team(uuid)', 'manage_team_member(uuid, uuid, text)',
    'regenerate_team_code(uuid)', 'sync_team_stats(text[], integer, jsonb)', 'my_teams()', 'team_overview(uuid)'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;

-- Excluir a conta não derruba a equipe: se a pessoa é dona e há outros membros, a equipe passa para
-- o admin mais antigo (ou, sem admin, para o membro mais antigo) antes de apagar a conta.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  t record;
  heir uuid;
begin
  if uid is null then
    raise exception 'não autenticado' using errcode = '28000';
  end if;
  for t in select team_id from team_members where user_id = uid and role = 'owner' loop
    select user_id into heir from team_members
      where team_id = t.team_id and user_id <> uid
      order by (role = 'admin') desc, joined_at
      limit 1;
    if heir is not null then
      update team_members set role = 'owner' where team_id = t.team_id and user_id = heir;
      update teams set owner_id = heir where id = t.team_id;
    end if;
  end loop;
  delete from auth.users where id = uid;
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
