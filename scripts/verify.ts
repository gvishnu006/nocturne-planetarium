import { directionVector, gmstHours, equatorialToHorizontal, bvToRgb } from "../src/lib/astro";

// Polaris should be at altitude ~= observer latitude, azimuth ~= north
const lat = 40;
const d = new Date("2026-06-21T04:00:00Z");
const gmst = gmstHours(d);

// Polaris J2000: ra 2.5303h dec 89.2641
const p = equatorialToHorizontal(2.5303, 89.2641, lat, 0, gmst);
console.log("Polaris alt", p.alt.toFixed(2), "az", p.az.toFixed(2), "expect alt ~", lat);

// Sirius: ra 6.7525h dec -16.7161, mag -1.46
const s = equatorialToHorizontal(6.7525, -16.7161, lat, 0, gmst);
console.log("Sirius alt", s.alt.toFixed(2), "az", s.az.toFixed(2));

// Deneb should be high in summer evening
const dn = equatorialToHorizontal(20.6905, 45.2803, lat, 0, gmst);
console.log("Deneb alt", dn.alt.toFixed(2));

// Arczen-ish Polaris
const v = directionVector(6.7525, -16.7161, lat, 0, gmst);
const len = Math.hypot(v[0], v[1], v[2]);
console.log("Sirius vec", v.map(x=>x.toFixed(3)).join(","), "len", len.toFixed(6));

console.log("bv 0.0 (A0)", bvToRgb(0.0).map(x=>x.toFixed(3)).join(","));
console.log("bv 0.65 (G)", bvToRgb(0.65).map(x=>x.toFixed(3)).join(","));
console.log("bv 1.5 (M)",  bvToRgb(1.5).map(x=>x.toFixed(3)).join(","));
