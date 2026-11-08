import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "pages-build");

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const name of ["css", "images", "js"]) {
  cpSync(path.join(root, name), path.join(output, name), { recursive: true });
}

for (const name of ["index.html", "favicon.svg"]) {
  cpSync(path.join(root, name), path.join(output, name));
}

writeFileSync(path.join(output, ".nojekyll"), "");
writeFileSync(path.join(output, "robots.txt"), "User-agent: *\nDisallow: /\n");
