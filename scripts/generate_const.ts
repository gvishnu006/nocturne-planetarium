import fs from "fs";
import path from "path";
const OUT = path.join(process.cwd(), "public", "data", "constellations.json");
const DATA_DIR = path.join(process.cwd(), "public", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const constellations = [
  {
    name: "Ursa Major",
    abbrev: "UMa",
    lines: [
      ["Dubhe","Merak"],
      ["Merak","Phecda"],
      ["Phecda","Megrez"],
      ["Megrez","Alioth"],
      ["Alioth","Mizar"],
      ["Mizar","Alkaid"]
    ]
  },
  {
    name: "Ursa Minor",
    abbrev: "UMi",
    lines: [
      ["Polaris","Polaris"]
    ]
  },
  {
    name: "Orion",
    abbrev: "Ori",
    lines: [
      ["Alnitak","Alnilam"],
      ["Alnilam","Mintaka"],
      ["Mintaka","Saiph"],
      ["Saiph","Rigel"]
    ]
  },
  {
    name: "Lyra",
    abbrev: "Lyr",
    lines: [
      ["Vega","Sulafat"],
      ["Sulafat","Sheliak"],
      ["Sheliak","Vega"]
    ]
  },
  {
    name: "Cassiopeia",
    abbrev: "Cas",
    lines: [
      ["Schedar","Caph"],
      ["Caph","GammaCas"],
      ["GammaCas","Ruchbah"]
    ]
  }
];
fs.writeFileSync(OUT, JSON.stringify(constellations, null, 2));
console.log("done", constellations.length);
