// Teste das funções de equipes num Postgres em memória (PGlite), simulando 105 pessoas.
// Rodar: npm i --no-save @electric-sql/pglite && node supabase/tests/teams.sql-test.mjs
// @author Felipe de Souza Aquino
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text, role text default 'user');
`);
await db.exec(readFileSync(process.argv[2] ?? new URL("../migrations/20261118120000_teams.sql", import.meta.url), "utf8"));
const uid = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
for (let i = 1; i <= 105; i++) await db.query(`insert into auth.users values ($1); insert into public.profiles (id, display_name) values ($1, $2)`.split(";")[0], [uid(i)]).then(() => db.query(`insert into public.profiles (id, display_name) values ($1, $2)`, [uid(i), "P" + i]));
const as = async (n, sql, params = []) => { await db.exec(`select set_config('test.uid', '${n ? uid(n) : ""}', false)`); return (await db.query(sql, params)).rows; };
const expectErr = async (p, txt) => { try { await p; console.log("FALHOU: esperava erro", txt); } catch (e) { console.log(e.message.includes(txt) ? "ok erro:" : "ERRO DIFERENTE:", e.message); } };
const [{ team_id, code }] = await as(1, "select * from create_team('Expedição Poconé')");
console.log("criou", code, /^[A-HJ-NP-Z2-9]{8}$/.test(code));
for (let i = 2; i <= 100; i++) await as(i, "select * from join_team($1)", [code.toLowerCase()]);
console.log("membros", (await as(1, "select * from my_teams()"))[0].members);
await expectErr(as(101, "select * from join_team($1)", [code]), "equipe cheia");
console.log("entrar de novo (idempotente)", (await as(50, "select * from join_team($1)", [code]))[0].members);
await expectErr(as(null, "select * from join_team($1)", [code]), "não autenticado");
await expectErr(as(1, "select leave_team($1)", [team_id]), "passe a equipe");
await as(50, "select leave_team($1)", [team_id]);
console.log("depois de 50 sair", (await as(1, "select * from my_teams()"))[0].members);
await expectErr(as(102, "select * from team_overview($1)", [team_id]), "não é desta equipe");
await as(2, "select sync_team_stats($1, $2, $3)", [["tuiuiu", "capivara"], 3, JSON.stringify([["tuiuiu", -16.5, -56.7, 2]])]);
await expectErr(as(2, "select sync_team_stats($1, $2, $3)", [["tuiuiu"], 1, JSON.stringify([["tuiuiu", -16.523, -56.7, 1]])]), "zonas inválidas");
const ov = await as(3, "select * from team_overview($1)", [team_id]);
console.log("overview linhas", ov.length, ov.find((r) => r.display_name === "P2").species_ids);
await expectErr(as(3, "select manage_team_member($1,$2,'remove')", [team_id, uid(4)]), "não permitida");
await as(1, "select manage_team_member($1,$2,'admin')", [team_id, uid(3)]);
await as(3, "select manage_team_member($1,$2,'remove')", [team_id, uid(4)]);
await expectErr(as(3, "select manage_team_member($1,$2,'remove')", [team_id, uid(1)]), "não permitida");
await as(1, "select manage_team_member($1,$2,'owner')", [team_id, uid(3)]);
console.log("papel do 1 agora", (await as(1, "select * from my_teams()"))[0].my_role, "| novo código:", (await as(3, "select regenerate_team_code($1) c", [team_id]))[0].c !== code);
await expectErr(as(1, "select regenerate_team_code($1)", [team_id]), "não permitida");
for (let k = 0; k < 4; k++) await as(105, "select * from create_team($1)", ["T" + k]);
await as(105, "select * from create_team('Quinta')");
await expectErr(as(105, "select * from create_team('Sexta')"), "limite de 5");
await as(3, "select delete_my_account()");
const after = await as(1, "select * from my_teams()");
console.log("dono excluiu a conta → equipe continua:", after.length === 1, "| novo papel do 1:", after[0]?.my_role, "| membros:", after[0]?.members);
