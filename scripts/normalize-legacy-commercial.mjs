import fs from "node:fs";

const path = "shared/pantanal.ts";
let text = fs.readFileSync(path, "utf8");
const before = (text.match(/iucnredlist/gi) ?? []).length;
text = text.replace(/\{ title: "IUCN Red List — ([^"]+)", url: "https:\/\/www\.iucnredlist\.org\/[^\"]+" \}/g, (_match, name) => ({
  toString() { return `{ title: "GBIF Species Match — ${name}", url: "https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}" }`; },
}));
text = text.replace(/, conservationStatus: "[^"]+"/g, "");
const after = (text.match(/iucnredlist/gi) ?? []).length;
if (before === 0) throw new Error("Nenhuma referência IUCN legada encontrada; interrompendo para evitar alteração cega.");
if (after !== 0) throw new Error(`Ainda restam ${after} referências IUCN após a migração.`);
fs.writeFileSync(path, text);
console.log(`Migradas ${before} referências IUCN para GBIF; status de conservação legado removido para revisão oficial.`);
