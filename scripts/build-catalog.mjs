/**
 * Build the planetarium star catalog from the HYG database v4.0.
 *
 * Source: astronexus/HYG-Database — hyg/CURRENT/hygdata_v40.csv.gz
 * HYG merges Hipparcos, Tycho-2 and Gliese 3 with positions reduced to J2000.
 *
 * We keep only what a dark-adapted eye can actually resolve (V <= 6.5) and emit
 * a compact binary payload, so the client never ships a multi-megabyte CSV.
 *
 *   stars.bin           header + Float32 records [ra, dec, mag, ci]
 *   stars.labels.json   { properName: { ra, dec, mag, bayer, con } }
 *
 * HYG v4 column indices (verified against the published header):
 *   1 hip   6 proper   7 ra (hours)   8 dec (degrees)   9 dist (pc)
 *   13 mag  16 ci (B-V)   26 bayer   28 con
 */

import { createReadStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline";
import { writeFileSync, statSync } from "node:fs";

const CACHE = process.argv[2];
const LIMIT_MAG = 6.5; // naked-eye limit at a genuinely dark site
const MIN_MAG = -1.5; // Sirius; anything brighter is Sol or a Solar System body

const I = {
  hip: 1,
  proper: 6,
  ra: 7,
  dec: 8,
  dist: 9,
  mag: 13,
  ci: 16,
  bayer: 26,
  con: 28,
};

const expected = [
  "id", "hip", "hd", "hr", "gl", "bf", "proper", "ra", "dec", "dist",
  "pmra", "pmdec", "rv", "mag", "absmag", "spect", "ci", "x", "y", "z",
  "vx", "vy", "vz", "rarad", "decrad", "pmrarad", "pmdecrad", "bayer",
  "flam", "con", "comp", "comp_primary", "base", "lum", "var", "var_min", "var_max",
];

const rows = [];
const named = new Map();
const spectrumCounts = new Map();
let seen = 0;

await new Promise((resolve, reject) => {
  const rl = createInterface({
    input: createReadStream(CACHE).pipe(createGunzip()),
    crlfDelay: Infinity,
  });

  rl.once("line", (headerLine) => {
    const cols = headerLine.replace(/^"|"$/g, "").split('","');
    if (cols.length !== expected.length || cols[7] !== "ra") {
      reject(new Error(`unexpected HYG header: ${cols.length} columns`));
    }
  });

  rl.on("line", (line) => {
    if (seen++ === 0) return;

    const c = line.split(",");
    const mag = parseFloat(c[I.mag]);
    if (!Number.isFinite(mag) || mag > LIMIT_MAG || mag < MIN_MAG) return;

    // Sol and the planets share the catalog with dist ~ 0; they are not sky.
    const dist = parseFloat(c[I.dist]);
    if (!Number.isFinite(dist) || dist < 0.01) return;

    const ra = parseFloat(c[I.ra]);
    const dec = parseFloat(c[I.dec]);
    if (!Number.isFinite(ra) || !Number.isFinite(dec)) return;

    const ciRaw = parseFloat(c[I.ci]);
    const ci = Number.isFinite(ciRaw) ? Math.max(-0.4, Math.min(2.4, ciRaw)) : 0.65;

    rows.push(ra, dec, mag, ci);

    const spect = (c[15] || "").trim();
    if (spect) spectrumCounts.set(spect[0], (spectrumCounts.get(spect[0]) || 0) + 1);

    const proper = (c[I.proper] || "").trim();
    if (proper && !named.has(proper)) {
      named.set(proper, {
        ra,
        dec,
        mag,
        ci,
        bayer: (c[I.bayer] || "").trim(),
        con: (c[I.con] || "").trim(),
        hip: (c[I.hip] || "").trim(),
      });
    }
  });

  rl.on("close", resolve);
  rl.on("error", reject);
});

const n = rows.length / 4;
const buf = new Float32Array(rows);

// magic "NSTR" | version | count | reserved
const header = Buffer.alloc(16);
header.write("NSTR", 0, "ascii");
header.writeUInt32LE(1, 4);
header.writeUInt32LE(n, 8);
header.writeUInt32LE(0, 12);

writeFileSync("public/data/stars.bin", Buffer.concat([header, Buffer.from(buf.buffer)]));

/**
 * Label budget. A real sky chart labels maybe 40 things; more than that is noise.
 *   proper names to mag 2.4  — the stars people actually know
 *   Bayer letters to mag 4.0 — enough to read the constellation figures
 */
const labels = {};
for (const [name, s] of named) {
  const isProper = /^[A-Z][a-z]{2,}$/.test(name);
  const keep =
    (isProper && s.mag <= 2.4) ||
    (s.bayer && s.con && s.mag <= 4.0) ||
    (isProper && s.mag <= 3.6);
  if (!keep) continue;
  labels[name] = {
    ra: +s.ra.toFixed(5),
    dec: +s.dec.toFixed(5),
    mag: +s.mag.toFixed(2),
    bayer: s.bayer || undefined,
    con: s.con || undefined,
  };
}

writeFileSync("public/data/stars.labels.json", JSON.stringify(labels));

const mags = [];
for (let i = 2; i < buf.length; i += 4) mags.push(buf[i]);
mags.sort((a, b) => a - b);
const at = (p) => mags[Math.floor(p * (mags.length - 1))].toFixed(2);
const countTo = (m) => {
  let c = 0;
  for (let i = 2; i < buf.length; i += 4) if (buf[i] <= m) c++;
  return c;
};

console.log(`stars kept      ${n}`);
console.log(`binary          ${(statSync("public/data/stars.bin").size / 1024).toFixed(0)} KB`);
console.log(`labels          ${Object.keys(labels).length}`);
console.log(`mag percentiles p05 ${at(0.05)}  p50 ${at(0.5)}  p95 ${at(0.95)}`);
console.log(`cumulative: <=1.0 ${countTo(1)}  <=2.0 ${countTo(2)}  <=3.0 ${countTo(3)}  <=4.0 ${countTo(4)}  <=5.0 ${countTo(5)}  <=6.0 ${countTo(6)}`);