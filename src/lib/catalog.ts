import type { Star } from "@/types/astro";

export type StarCatalog = {
  /** Equatorial cartesian direction, unit length. x toward RA 0, z toward NCP. */
  eq: Float32Array;
  /** Apparent visual magnitude, V. */
  mag: Float32Array;
  /** B-V colour index. */
  bv: Float32Array;
  /** Random phase in [0, 2pi) so scintillation is uncorrelated between stars. */
  phase: Float32Array;
  count: number;
};

const HEADER_BYTES = 16;

function parseHeader(buf: ArrayBuffer): { version: number; count: number } {
  const view = new DataView(buf);
  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );
  if (magic !== "NSTR") throw new Error("stars.bin: bad magic, expected NSTR");
  return { version: view.getUint32(4, true), count: view.getUint32(8, true) };
}

/**
 * Convert catalogue right ascension / declination into a unit cartesian vector.
 *
 * RA is hours and wraps at 24, so the hour angle is folded to [-12, +12)
 * before taking the cosine. Skipping that fold is what makes starfields
 * mirrored or smeared along the meridian.
 */
export function loadCatalog(buffer: ArrayBuffer): StarCatalog {
  const { count } = parseHeader(buffer);
  const raw = new Float32Array(buffer, HEADER_BYTES, count * 4);

  const eq = new Float32Array(count * 3);
  const mag = new Float32Array(count);
  const bv = new Float32Array(count);
  const phase = new Float32Array(count);

  const DEG = Math.PI / 180;

  for (let i = 0; i < count; i++) {
    const raHours = raw[i * 4];
    const decDeg = raw[i * 4 + 1];

    let ra = raHours * 15;
    if (ra < 0) ra += 360;
    if (ra >= 360) ra -= 360;

    const a = ra * DEG;
    const d = decDeg * DEG;
    const cd = Math.cos(d);

    eq[i * 3] = cd * Math.cos(a);
    eq[i * 3 + 1] = cd * Math.sin(a);
    eq[i * 3 + 2] = Math.sin(d);

    mag[i] = raw[i * 4 + 2];
    bv[i] = raw[i * 4 + 3];
    phase[i] = (i * 0.6180339887498949) % 1 * Math.PI * 2;
  }

  return { eq, mag, bv, phase, count };
}

export type StarLabel = {
  ra: number;
  dec: number;
  mag: number;
  bayer?: string;
  con?: string;
};

/** Bayer designations need the genitive constellation to read properly. */
export function labelText(name: string, l: StarLabel): string {
  if (l.bayer && l.con) return `${l.bayer} ${l.con}`;
  return name;
}

/** Direction vector for a labelled star, matching loadCatalog's frame. */
export function labelDirection(raHours: number, decDeg: number): [number, number, number] {
  const DEG = Math.PI / 180;
  let ra = raHours * 15;
  if (ra < 0) ra += 360;
  if (ra >= 360) ra -= 360;
  const a = ra * DEG;
  const d = decDeg * DEG;
  const cd = Math.cos(d);
  return [cd * Math.cos(a), cd * Math.sin(a), Math.sin(d)];
}

export type { Star };