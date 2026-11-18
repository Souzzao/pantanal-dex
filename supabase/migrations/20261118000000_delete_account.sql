-- PantanalDex — Exclusão da conta pelo próprio app (exigência da Google Play e da App Store).
--
-- A pessoa só consegue apagar a PRÓPRIA conta (auth.uid()). Os dados ligados a ela caem juntos
-- pelas chaves estrangeiras: profiles e public_sightings (on delete cascade), e o histórico da
-- auditoria fica sem o nome do auditor (on delete set null).
-- As fotos no Storage são apagadas pelo app antes de chamar esta função (o Supabase não deixa
-- apagar arquivos do Storage direto por SQL); a política "fotos: dono apaga" permite isso.
--
-- @author Felipe de Souza Aquino

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'não autenticado' using errcode = '28000';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
