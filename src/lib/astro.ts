import type { Star } from "@/types/astro";

export function raDecToVec3(raHours: number, decDeg: number, radius = 1): [number, number, number] {
  const ra = (raHours * 15 * Math.PI) / 180; // to rad
  const dec = (decDeg * Math.PI) / 180;
  const x = radius * Math.cos(dec) * Math.cos(ra);
  const y = radius * Math.sin(dec);
  const z = radius * Math.cos(dec) * Math.sin(ra);
  return [x, y, z];
}

export function bvToColor(bv: number | undefined): string {
  if (bv === undefined) return "#f5f5ff";
  const t = Math.max(-0.5, Math.min(1.8, bv));
  if (t < 0) return "#d6e5ff";
  if (t < 0.3) return "#f5f7ff";
  if (t < 0.6) return "#fff3e6";
  if (t < 0.9) return "#ffe1c2";
  if (t < 1.2) return "#ffd0a3";
  return "#ffb07a";
}

export function magToSize(mag: number, base = 0.8, max = 3.2, minMag = 6.5): number {
  const m = Math.min(mag, minMag);
  const norm = (minMag - m) / minMag;
  return base + norm * (max - base);
}
