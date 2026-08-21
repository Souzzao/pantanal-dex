#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const run = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const failures = [];
const branch = run(["branch", "--show-current"]);
const status = run(["status", "--short"]);
const todo = readFileSync("todo.md", "utf8");

if (!branch || branch === "main") failures.push("trabalhe em uma branch de integração/agente, não diretamente na main");
if (!status) failures.push("não há alteração verificável neste bloco");
if (!/\[x\].*(check|lint|test|diff|PR|commit)/i.test(todo)) failures.push("TODO não registra validação/publicação concluída");

try { run(["diff", "--check"]); } catch { failures.push("git diff --check falhou"); }

if (failures.length) {
  console.error("WATCHDOG: INCOMPLETE");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`WATCHDOG: READY (${branch})`);
