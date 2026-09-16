// Next's static export writes per-segment RSC payloads as nested paths
// (out/search/__next.search/__PAGE__.txt), but the client router requests the flat
// name (out/search/__next.search.__PAGE__.txt). Static hosts like Netlify can't
// rewrite partial path segments, so copy each nested payload to its flat name.
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
let copied = 0;

// Copies every file under `dir` into `targetDir`, joining nested names with dots.
function flatten(dir, flatPrefix, targetDir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const flatName = `${flatPrefix}.${entry.name}`;
    if (entry.isDirectory()) {
      flatten(full, flatName, targetDir);
    } else {
      fs.copyFileSync(full, path.join(targetDir, flatName));
      copied++;
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) flatten(full, entry.name, dir);
    else walk(full);
  }
}

if (!fs.existsSync(outDir)) {
  console.error("flatten-rsc-segments: no out/ directory, run next build first");
  process.exit(1);
}
walk(outDir);
console.log(`flatten-rsc-segments: copied ${copied} segment payload(s)`);
