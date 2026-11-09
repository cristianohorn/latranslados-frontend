// Gera a versão publicável do site.
//
//   node scripts/prepare-pages.mjs               -> pages-build/  (prévia no GitHub Pages, fora do Google)
//   node scripts/prepare-pages.mjs --production  -> dist/         (site oficial, latranslados.com na Hostinger)
//
// A prévia recebe <meta name="robots" content="noindex">, porque um robots.txt numa subpasta
// do GitHub Pages (/latranslados-frontend/) é ignorado pelos buscadores.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const production = process.argv.includes("--production");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, production ? "dist" : "pages-build");

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const name of ["css", "images", "js"]) {
  cpSync(path.join(root, name), path.join(output, name), { recursive: true });
}

for (const name of ["index.html", "404.html", "favicon.svg", "apple-touch-icon.png"]) {
  cpSync(path.join(root, name), path.join(output, name));
}

if (production) {
  for (const name of ["robots.txt", "sitemap.xml", "llms.txt", ".htaccess"]) {
    cpSync(path.join(root, name), path.join(output, name));
  }
} else {
  const robotsMeta = /<meta name="robots" content="[^"]*">/;
  for (const name of ["index.html", "404.html"]) {
    const file = path.join(output, name);
    const html = readFileSync(file, "utf8");
    if (!robotsMeta.test(html)) throw new Error(`${name}: meta robots não encontrada`);
    writeFileSync(file, html.replace(robotsMeta, '<meta name="robots" content="noindex, nofollow">'));
  }
  writeFileSync(path.join(output, ".nojekyll"), "");
  writeFileSync(path.join(output, "robots.txt"), "User-agent: *\nDisallow: /\n");
}

console.log(`Site gerado em ${path.relative(root, output)}/ (${production ? "produção" : "prévia"})`);
