// Lista os textos em português das telas (para traduzir em shared/i18n/ui.*.ts).
// Uso: node scripts/extract-ui-strings.js saida.json
const ts = require("typescript"), fs = require("fs"), path = require("path");
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.tsx$/.test(f) && !/theme-lab|oauth|hello-wave|parallax|external-link|DevCollab/.test(p)) files.push(p); } })("app");
for (const f of fs.readdirSync("components")) if (/\.tsx$/.test(f) && !/hello-wave|parallax|external-link|DevCollab|themed/.test(f)) files.push(path.join("components", f));
const out = { table: new Map(), loose: new Map() };
const wordy = (s) => /[A-Za-zÀ-ÿ]{3,}/.test(s) && (/\s/.test(s.trim()) || /[À-ÿ]/.test(s) || /^[A-ZÀ-Ý][a-zà-ÿ]{2,}[.!?…:]?$/.test(s.trim()) || /^‹/.test(s.trim()));
const skipAttr = /^(accessibilityLabel|accessibilityHint|accessibilityRole|className|testID|name|key|style|keyboardType|autoCapitalize|autoComplete|textContentType|returnKeyType|edges|href|behavior|mode|presentation|animation|resizeMode|contentFit|pointerEvents|role|type|id)$/;
for (const file of files) {
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const langOf = (node) => {
    for (let n = node; n.parent; n = n.parent) {
      const p = n.parent;
      if (ts.isPropertyAssignment(p) && p.initializer === n && /^(pt|en|es|de)$/.test(p.name.getText())) return p.name.getText();
      if (ts.isConditionalExpression(p)) {
        const c = p.condition.getText();
        if (p.whenTrue === n && /english|"English"|=== "en"/.test(c)) return "en";
        if (p.whenTrue === n && /spanish|"Español"|=== "es"/.test(c)) return "es";
        if (p.whenFalse === n && /spanish|"Español"|=== "es"/.test(c)) return "pt";
      }
    }
    return null;
  };
  const add = (text, node) => {
    const t = text.replace(/\s+/g, " ").trim();
    if (!wordy(t.replace(/\{\d+\}/g, ""))) return;
    const lang = langOf(node);
    if (lang === "en" || lang === "es" || lang === "de") return;
    const bucket = lang === "pt" ? out.table : out.loose;
    if (!bucket.has(t)) bucket.set(t, new Set());
    bucket.get(t).add(path.basename(file));
  };
  const skipped = (node) => {
    for (let n = node; n.parent; n = n.parent) {
      const p = n.parent;
      if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return true;
      if (ts.isJsxAttribute(p) && skipAttr.test(p.name.getText())) return true;
      if (ts.isPropertyAssignment(p) && p.initializer === n && /^(accessibilityLabel|fontFamily|fontWeight|testID|key|pathname|name)$/.test(p.name.getText())) return true;
      if (ts.isCallExpression(p) && /^(console\.|router\.|require|useLocalSearchParams|Linking\.|AsyncStorage\.|normalize|new RegExp)/.test(p.expression.getText())) return true;
      if (ts.isNewExpression(p) && /Error/.test(p.expression.getText())) return true;
      if (ts.isBinaryExpression(p) && /===|!==/.test(p.operatorToken.getText())) return true;
      if (ts.isElementAccessExpression(p) || ts.isCaseClause(p) || ts.isTypeNode(p)) return true;
    }
    return false;
  };
  (function visit(node) {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const kids = node.children.filter((k) => !(ts.isJsxText(k) && !k.text.trim()));
      const simple = kids.length > 0 && kids.every((k) => ts.isJsxText(k) || (ts.isJsxExpression(k) && k.expression && !ts.isJsxElement(k.expression) && !/=>|<|\?/.test(k.expression.getText())));
      if (simple && kids.some(ts.isJsxText)) {
        let i = 0; add(kids.map((k) => (ts.isJsxText(k) ? k.text : `{${i++}}`)).join(""), node);
      } else for (const k of kids) if (ts.isJsxText(k)) add(k.text, k);
    } else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !skipped(node)) add(node.text, node);
    else if (ts.isTemplateExpression(node) && !skipped(node)) {
      let s = node.head.text; node.templateSpans.forEach((sp, i) => { s += `{${i}}` + sp.literal.text; }); add(s, node);
    }
    ts.forEachChild(node, visit);
  })(sf);
}
const dump = (m) => [...m.entries()].map(([k, v]) => [k, [...v].join(",")]);
fs.writeFileSync(process.argv[2], JSON.stringify({ table: dump(out.table), loose: dump(out.loose) }, null, 0));
console.log("table", out.table.size, "loose", out.loose.size, "chars", [...out.table.keys(), ...out.loose.keys()].join("").length);
