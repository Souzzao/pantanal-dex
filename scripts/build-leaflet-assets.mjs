// Gera shared/leaflet-assets.ts com o Leaflet 1.9.4 embutido (BSD-2-Clause), para o mapa
// funcionar sem baixar código de CDN. Rodar de novo só se trocar a versão do Leaflet:
//   node scripts/build-leaflet-assets.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "node_modules", "leaflet", "dist");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "node_modules", "leaflet", "package.json"), "utf8"));
const js = fs.readFileSync(path.join(dist, "leaflet.js"), "utf8").replace(/\n\/\/# sourceMappingURL=.*$/m, "");
const css = fs.readFileSync(path.join(dist, "leaflet.css"), "utf8");
const out = `// Arquivo gerado por scripts/build-leaflet-assets.mjs — não editar à mão.
// Leaflet ${pkg.version} · BSD-2-Clause · © Volodymyr Agafonkin, © CloudMade · https://leafletjs.com
export const LEAFLET_VERSION = ${JSON.stringify(pkg.version)};
export const LEAFLET_CSS = ${JSON.stringify(css)};
export const LEAFLET_JS = ${JSON.stringify(js)};
`;
fs.writeFileSync(path.join(root, "shared", "leaflet-assets.ts"), out);
console.log(`shared/leaflet-assets.ts: Leaflet ${pkg.version}, ${(out.length / 1024).toFixed(0)} KB`);
