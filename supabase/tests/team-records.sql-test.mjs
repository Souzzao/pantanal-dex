// Teste da coleção da equipe, personagem e autoria num Postgres em memória (PGlite).
// Cobre T03–T10 do pacote "Equipes e Personagens" no nível do banco.
// Rodar: npm i --no-save @electric-sql/pglite && node supabase/tests/team-records.sql-test.mjs
// @author Felipe de Souza Aquino
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const db = new PGlite();
await db.exec(`
create role anon; create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text not null, role text default 'user');
`);
const mig = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), "utf8");
await db.exec(mig("20261118120000_teams.sql"));
await db.exec(mig("20261125000000_team_code_strong_random.sql"));
await db.exec(mig("20261125100000_team_records.sql"));
await db.exec(mig("20261125110000_team_media_attached.sql"));

const uid = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
const names = { 1: "Joana", 2: "Rafael", 3: "Clara", 4: "Joana" };
for (const [n, name] of Object.entries(names)) {
  await db.query("insert into auth.users values ($1)", [uid(n)]);
  await db.query("insert into public.profiles (id, display_name) values ($1, $2)", [uid(n), name]);
}
const as = async (n, sql, params = []) => { await db.exec(`select set_config('test.uid', '${n ? uid(n) : ""}', false)`); return (await db.query(sql, params)).rows; };
let failures = 0;
const check = (label, ok, extra = "") => { console.log(ok ? "ok  " : "FALHOU", label, extra); if (!ok) failures++; };
const expectErr = async (label, p, txt) => { try { await p; check(label, false, "(esperava erro)"); } catch (e) { check(label, e.message.includes(txt), e.message); } };

// T01/T02: personagem salvo no perfil e restaurado.
await as(1, "select set_my_avatar('lavanda','curvos','folha')");
const saved = (await as(1, "select * from my_profile()"))[0].avatar;
check("T01 personagem salvo", saved.tone === "lavanda" && saved.eyes === "curvos" && saved.item === "folha");
await expectErr("T01 personagem fora da lista é recusado", as(1, "select set_my_avatar('neon','curvos','folha')"), "personagem inválido");

const [{ team_id, code }] = await as(1, "select * from create_team('Equipe Corixo')");
await as(2, "select * from join_team($1)", [code]);
await as(4, "select * from join_team($1)", [code]);
const members = await as(2, "select * from team_overview($1)", [team_id]);
const avatars = await as(2, "select * from team_member_avatars($1)", [team_id]);
check("T02 equipe lista cada pessoa uma vez, com personagem", members.length === 3 && avatars.length === 3 && avatars.find((m) => m.user_id === uid(1)).avatar.tone === "lavanda");
await expectErr("T06 C não lê os personagens da equipe", as(3, "select * from team_member_avatars($1)", [team_id]), "não é desta equipe");

// T03: A e B registram capivara com fotos e descrições diferentes.
const pathA = `${team_id}/${uid(1)}/a1.jpg`, pathB = `${team_id}/${uid(2)}/b1.jpg`;
check("Storage: rascunho ainda não pode ser lido por outro membro", (await as(2, "select can_read_team_media($1) ok", [pathA]))[0].ok === false);
check("Storage: rascunho ainda pode ser enviado pelo autor", (await as(1, "select can_write_team_media($1) ok", [pathA]))[0].ok === true);
const [ra] = await as(1, "select * from share_team_record($1,'op-joana-0001','capivara','Perto da vegetação na margem','2026-11-20',-16.523,-56.71,$2)", [team_id, [pathA]]);
const [rb] = await as(2, "select * from share_team_record($1,'op-rafael-0001','capivara','Nadando no canal ao amanhecer','2026-11-21',-16.51,-56.73,$2)", [team_id, [pathB]]);
let recs = await as(1, "select * from team_records($1)", [team_id]);
check("T03 dois registros da mesma espécie, IDs distintos", recs.length === 2 && ra.record_id !== rb.record_id);
const a = recs.find((r) => r.id === ra.record_id), b = recs.find((r) => r.id === rb.record_id);
check("T03 cada um com autor, foto e descrição próprios", a.author_name === "Joana" && b.author_name === "Rafael" && a.photo_paths[0] === pathA && b.photo_paths[0] === pathB && a.description !== b.description);
check("T03 numeração Registro 1 e 2", a.number === 1 && b.number === 2);
check("Privacidade: zona arredondada a 0,1°", a.zone_lat === -16.5 && a.zone_lon === -56.7);

// T04: terceiro registro da mesma pessoa; reenvio da mesma operação não duplica.
const [rc] = await as(1, "select * from share_team_record($1,'op-joana-0002','capivara','Outra capivara','2026-11-22',null,null,'{}')", [team_id]);
const [again] = await as(1, "select * from share_team_record($1,'op-joana-0002','capivara','Outra capivara','2026-11-22',null,null,'{}')", [team_id]);
recs = await as(2, "select * from team_records($1)", [team_id]);
check("T04 terceiro registro aparece; reenvio devolve o mesmo", recs.length === 3 && again.record_id === rc.record_id && rc.record_number === 3);

// T05: B altera a própria descrição; só o registro de B muda. B não altera o de A.
await as(2, "select update_team_record($1,'Nadando — editado',null)", [rb.record_id]);
recs = await as(1, "select * from team_records($1)", [team_id]);
check("T05 só o registro de B mudou", recs.find((r) => r.id === rb.record_id).description === "Nadando — editado" && recs.find((r) => r.id === ra.record_id).description === "Perto da vegetação na margem");
await expectErr("T05 B não edita o registro de A", as(2, "select update_team_record($1,'invasão',null)", [ra.record_id]), "não permitida");

// T06: C (sem equipe) não lê registros nem fotos.
await expectErr("T06 C não lê a coleção", as(3, "select * from team_records($1)", [team_id]), "não é desta equipe");
check("T06 C não lê a foto no Storage", (await as(3, "select can_read_team_media($1) ok", [pathA]))[0].ok === false);
check("T06 membro lê a foto", (await as(2, "select can_read_team_media($1) ok", [pathA]))[0].ok === true);
check("T06 nome malformado não passa", (await as(2, "select can_read_team_media('../x/y.jpg') ok"))[0].ok === false);
check("Storage: B não envia na pasta de A", (await as(2, "select can_write_team_media($1) ok", [`${team_id}/${uid(1)}/x.jpg`]))[0].ok === false);
check("Storage: B envia na própria pasta", (await as(2, "select can_write_team_media($1) ok", [`${team_id}/${uid(2)}/x.jpg`]))[0].ok === true);

// T07: A tenta usar a foto (pasta) de B / não há parâmetro de autor.
await expectErr("T07 A não anexa foto da pasta de B", as(1, "select * from share_team_record($1,'op-joana-0003','capivara','x','2026-11-22',null,null,$2)", [team_id, [pathB]]), "fotos inválidas");
const [r7] = await as(1, "select * from share_team_record($1,'op-joana-0004','tuiuiu','x','2026-11-22',null,null,'{}')", [team_id]);
check("T07 autoria vem da sessão", (await as(1, "select author_id from team_records where id = $1", [r7.record_id]))[0].author_id === uid(1));

// T09: autoria indisponível quando a conta do autor é excluída.
await as(2, "select delete_my_account()");
recs = await as(1, "select * from team_records($1)", [team_id]);
const orphan = recs.find((r) => r.id === rb.record_id);
check("T09 registro fica, sem autor", !!orphan && orphan.author_id === null && orphan.author_name === null);

// T10: duas pessoas com o mesmo nome continuam distintas pelo ID.
const [r10] = await as(4, "select * from share_team_record($1,'op-joana2-0001','capivara','Da outra Joana','2026-11-23',null,null,'{}')", [team_id]);
recs = await as(1, "select * from team_records($1)", [team_id]);
check("T10 mesmo nome, autores diferentes", recs.find((r) => r.id === r10.record_id).author_id === uid(4) && recs.find((r) => r.id === ra.record_id).author_id === uid(1));

// Moderação e saída
await expectErr("Membro comum não apaga registro alheio", as(4, "select delete_team_record($1)", [ra.record_id]), "não permitida");
const removed = await as(1, "select delete_team_record($1) paths", [r10.record_id]);
check("Dono apaga (moderação) e recebe as fotos para limpar", Array.isArray(removed[0].paths));
await as(1, "select delete_team_record($1)", [ra.record_id]);
check("Storage: foto de registro excluído deixa de ser acessível", (await as(4, "select can_read_team_media($1) ok", [pathA]))[0].ok === false);
await expectErr("Data no futuro recusada", as(1, "select * from share_team_record($1,'op-joana-0009','capivara','x','2099-01-01',null,null,'{}')", [team_id]), "data inválida");

console.log(failures ? `\n${failures} FALHA(S)` : "\nTodos os critérios passaram.");
process.exit(failures ? 1 : 0);
