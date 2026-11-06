import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

for (const [route, source] of [
  ["opcao1", "index.html"],
  ["opcao2", "index2.html"],
  ["opcao3", "index3.html"],
]) {
  const directory = path.join(output, route);
  mkdirSync(directory, { recursive: true });

  const html = readFileSync(path.join(root, source), "utf8")
    .replaceAll('href="css/', 'href="../css/')
    .replaceAll('href="favicon.svg"', 'href="../favicon.svg"')
    .replaceAll('href="images/', 'href="../images/')
    .replaceAll('src="images/', 'src="../images/')
    .replaceAll('src="js/', 'src="../js/');

  writeFileSync(path.join(directory, "index.html"), html);
}
