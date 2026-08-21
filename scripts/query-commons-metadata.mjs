const titles = process.argv.slice(2);
const params = new URLSearchParams({
  action: "query",
  format: "json",
  prop: "imageinfo",
  iiprop: "url|extmetadata",
  titles: titles.map((title) => `File:${title}`).join("|")
});
const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
if (!response.ok) throw new Error(`Commons API HTTP ${response.status}`);
const payload = await response.json();
for (const page of Object.values(payload.query?.pages ?? {})) {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata ?? {};
  const clean = (value) => String(value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  console.log(JSON.stringify({
    title: page.title,
    url: info?.url,
    author: clean(metadata.Artist?.value),
    license: clean(metadata.LicenseShortName?.value),
    credit: clean(metadata.Credit?.value),
    source: page.title.replace(/^File:/, "https://commons.wikimedia.org/wiki/File:").replaceAll(" ", "_")
  }));
}
