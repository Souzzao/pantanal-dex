-- PantanalDex · Código de equipe com aleatoriedade criptograficamente segura.
--
-- Alerta do GitHub Advanced Security no PR #40: random() do Postgres não é seguro (dá para tentar
-- prever a sequência a partir de códigos gerados na mesma conexão). Cada caractere passa a vir de um
-- byte de gen_random_uuid(), que usa o gerador seguro do sistema (pg_strong_random). Como 256 é
-- múltiplo de 32, o "% 32" não cria viés entre as letras.
--
-- @author Felipe de Souza Aquino

create or replace function public.new_team_code() returns text
language plpgsql volatile set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out_code text;
  bytes bytea;
  i int;
begin
  loop
    bytes := uuid_send(gen_random_uuid());
    out_code := '';
    -- bytes 0..5 e 8 são totalmente aleatórios no UUID v4 (6 e 7 carregam versão/variante)
    foreach i in array array[0, 1, 2, 3, 4, 5, 9, 10] loop
      out_code := out_code || substr(alphabet, 1 + (get_byte(bytes, i) % 32), 1);
    end loop;
    exit when not exists (select 1 from public.teams where code = out_code);
  end loop;
  return out_code;
end;
$$;
revoke all on function public.new_team_code() from public, anon, authenticated;
