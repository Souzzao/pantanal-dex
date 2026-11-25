-- Restrict access to media attached to a live team record. Uploads may be staged first.
create or replace function public.can_read_team_media(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare team_text text := split_part(p_name, '/', 1);
begin
  if team_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return false; end if;
  if not public.is_team_member(team_text::uuid) then return false; end if;
  return exists (select 1 from public.team_records r
    where r.team_id = team_text::uuid and r.photo_paths @> array[p_name]);
end;
$$;

create or replace function public.can_write_team_media(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if p_name !~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[A-Za-z0-9._-]{1,80}\.(jpg|jpeg|png|webp)$'
     or split_part(p_name, '/', 1) !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return false; end if;
  return public.is_team_member(split_part(p_name, '/', 1)::uuid) and split_part(p_name, '/', 2) = auth.uid()::text;
end;
$$;

revoke all on function public.can_read_team_media(text), public.can_write_team_media(text) from public, anon;
grant execute on function public.can_read_team_media(text), public.can_write_team_media(text) to authenticated;
