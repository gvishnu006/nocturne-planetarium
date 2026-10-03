import fs from "fs";
import path from "path";

const IN = path.join(process.cwd(), "public", "data", "constellations.json");
const OUT = path.join(process.cwd(), "src", "lib", "constellations.ts");

const raw = JSON.parse(fs.readFileSync(IN, "utf8"));
const stars = JSON.parse(fs.readFileSync("public/data/stars.labels.json", "utf8"));

const nameMap = new Map<string, any>();
for (const k of Object.keys(stars)) nameMap.set(k.toLowerCase(), stars[k]);

const cs = raw.map((c: any) => {
  const map = new Map<string, { ra: number; dec: number }>();
  for (const line of c.lines) {
    for (const nm of line) {
      const hit = nameMap.get(nm.toLowerCase());
      if (hit) map.set(nm, { ra: hit.ra, dec: hit.dec });
    }
  }
  return {
    name: c.name,
    abbrev: c.abbrev,
    lines: c.lines,
    starMap: map,
  };
});

fs.writeFileSync(
  OUT,
  `export type ConstellationLine = string[][];\nexport type Constellation = {\n  name: string;\n  abbrev: string;\n  lines: string[][];\n  starMap?: Map<string, { ra: number; dec: number }>;\n};\nexport const constellations: Constellation[] = ${JSON.stringify(
    cs,
    (k, v) => (v instanceof Map ? [...v] : v),
    2
  ).replace(/"/g, '"') // keep
    .replace(/]\n/, "] as any\n")}\n` // quick fix
);

console.log("ok");