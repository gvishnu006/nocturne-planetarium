import fs from "fs";
import path from "path";
const OUT = path.join(process.cwd(), "public", "data", "sky.json");
const DATA_DIR = path.join(process.cwd(), "public", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const sky = {
  name: "deep-night",
  bg: { top: "#050814", mid: "#050816", bottom: "#040510" },
  airglow: { strength: 0.04, color: "#1a2a4f" },
  milkyWay: { enabled: true, strength: 0.18, color: "#7a8fbf" },
  stars: { baseSize: 0.8, maxSize: 3.2, minMag: 6.5 }
};
fs.writeFileSync(OUT, JSON.stringify(sky, null, 2));
console.log("ok");
