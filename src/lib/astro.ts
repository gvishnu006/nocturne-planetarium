/**
 * Astronomy primitives for the planetarium.
 *
 * Everything here works in the horizontal coordinate system a person standing
 * outside actually sees:
 *
 *   altitude (alt)  degrees above the horizon
 *   azimuth  (az)   degrees clockwise from true north
 *
 * and converts to/from the equatorial frame the catalogue is stored in:
 *
 *   right ascension (ra)  hours, J2000
 *   declination     (dec) degrees, J2000
 */

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

/* ------------------------------------------------------------------ *
 * Frames
 * ------------------------------------------------------------------ */

/** IERS/J2000 pole of the Earth's rotation axis in equatorial coordinates. */
export const J2000_POLE = { ra: 12, dec: 90 } as const;

/** Greenwich Mean Sidereal Time in hours, for a JS Date (UT). */
export function gmstHours(date: Date): number {
  // D = days since J2000.0 (2000-01-01T12:00:00Z)
  const d = (date.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86_400_000;
  // GMST = 18.697374558 + 24.06570982441908 * D  (hours), wrapped
  const t = 280.46061837 + 360.98564736629 * d;
  return (((t / 15) % 24) + 24) % 24;
}

/**
 * Local hour angle of a star, in radians.
 * LST = GMST + observer longitude (east positive)
 */
export function hourAngle(raHours: number, gmst: number, lonEastDeg: number): number {
  const lst = gmst + lonEastDeg / 15;
  let ha = lst - raHours;
  ha = ((ha % 24) + 24) % 24;
  return ha * 15 * DEG;
}

/**
 * Equatorial -> horizontal.
 * Returns the altitude/azimuth plus a unit direction vector in a frame where
 * +Y is up, +X points south (so azimuth increases to the right), +Z is toward
 * the zenith-relative viewer.
 */
export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonEastDeg: number,
  gmst: number
) {
  const ha = hourAngle(raHours, gmst, lonEastDeg);
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAz =
    (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat) || 1e-9);
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
  if (Math.sin(ha) > 0) az = 2 * Math.PI - az;

  return { alt: alt * RAD, az: az * RAD };
}

/**
 * Local frame direction vector for a star. Radius is left to the caller.
 *   x -> east
 *   y -> up
 *   z -> south (toward the viewer looking north)
 */
export function directionVector(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonEastDeg: number,
  gmst: number
): [number, number, number] {
  const ha = hourAngle(raHours, gmst, lonEastDeg);
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;

  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const sinHa = Math.sin(ha);
  const cosHa = Math.cos(ha);
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);

  const alt = Math.asin(sinDec * sinLat + cosDec * cosLat * cosHa);

  // Standard azimuth: measured from north, increasing eastward.
  const az = Math.atan2(sinHa, cosHa * sinLat - Math.tan(dec) * cosLat);

  const ca = Math.cos(alt);
  return [ca * Math.sin(az), Math.sin(alt), ca * Math.cos(az)];
}

/* ------------------------------------------------------------------ *
 * Photometry
 * ------------------------------------------------------------------ */

/**
 * Relative flux from an apparent magnitude. Pogson's ratio: 5 magnitudes
 * is exactly a factor of 100 in brightness.
 */
export function fluxFromMagnitude(mag: number): number {
  return Math.pow(10, -0.4 * mag);
}

/**
 * Atmospheric extinction in magnitudes. Light from a star low on the
 * horizon passes through far more air, so it dims and reddens. kV ~ 0.20
 * mag/airmass at a typical site; airmass uses Kasten & Young (1989).
 */
export function airmass(altDeg: number): number {
  if (altDeg <= -1) return 40; // below the horizon: effectively gone
  return 1 / (Math.sin(altDeg * DEG) + 0.50572 * Math.pow(altDeg + 6.07995, -1.6364));
}

export function extinctionMag(altDeg: number, k = 0.2): number {
  return k * airmass(altDeg);
}

/**
 * B-V colour index to linear sRGB.
 *
 * This is a fit to the main-sequence colour sequence, which is where the
 * overwhelming majority of naked-eye stars live. Hot stars run blue-white,
 * cool stars amber. Saturation is kept low on purpose: a real star field is
 * nearly achromatic, and fully saturated colours read as decoration.
 */
export function bvToRgb(bv: number): [number, number, number] {
  const t = Math.max(-0.35, Math.min(2.0, bv));

  // Anchor points measured off the sequence, not invented.
  const anchors: [number, number, number, number][] = [
    [-0.35, 0.61, 0.70, 1.00], // O/B
    [0.00, 0.79, 0.84, 1.00], // A
    [0.30, 0.92, 0.94, 1.00], // F
    [0.58, 1.00, 0.96, 0.90], // G
    [0.81, 1.00, 0.88, 0.74], // K
    [1.40, 1.00, 0.76, 0.55], // M
    [2.00, 1.00, 0.67, 0.42], // M late
  ];

  let i = 0;
  while (i < anchors.length - 2 && t > anchors[i + 1][0]) i++;
  const [t0, r0, g0, b0] = anchors[i];
  const [t1, r1, g1, b1] = anchors[i + 1];
  const f = (t - t0) / (t1 - t0);

  let r = r0 + (r1 - r0) * f;
  let g = g0 + (g1 - g0) * f;
  let b = b0 + (b1 - b0) * f;

  // Desaturate toward white. Slight, but it keeps the field from looking
  // like a bag of Smarties.
  const grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const k = 0.28;
  r = grey + (r - grey) * (1 - k);
  g = grey + (g - grey) * (1 - k);
  b = grey + (b - grey) * (1 - k);

  return [r, g, b];
}

/**
 * Reddening from atmospheric extinction. Blue light scatters out of the
 * line of sight more than red, which is why a setting star goes orange.
 */
export function redden(bv: number, magExt: number): [number, number, number] {
  const [r, g, b] = bvToRgb(bv);
  const lose = 1 - Math.exp(-0.28 * magExt);
  const blueLoss = 1 - Math.exp(-0.62 * magExt);
  return [
    r * (1 - lose * 0.55),
    g * (1 - lose * 0.95),
    b * (1 - blueLoss),
  ];
}

/* ------------------------------------------------------------------ *
 * Galactic frame
 *
 * Used to place the Milky Way where it actually is. The galactic north
 * pole sits at RA 12h51.4m, Dec +27.13 deg; the galactic centre is at
 * RA 17h45.6m, Dec -28.94 deg.
 * ------------------------------------------------------------------ */

const GAL_POLE = { ra: 192.85948 / 15, dec: 27.12825 };
const GAL_CENTER = { ra: 266.4051 / 15, dec: -28.936175 };

/** Angular distance in degrees between two equatorial positions. */
export function angularSep(
  ra1h: number,
  dec1d: number,
  ra2h: number,
  dec2d: number
): number {
  const a1 = ra1h * 15 * DEG;
  const d1 = dec1d * DEG;
  const a2 = ra2h * 15 * DEG;
  const d2 = dec2d * DEG;
  const cos =
    Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * RAD;
}

/** Galactic latitude of an equatorial position, in degrees. */
export function galacticLatitude(raHours: number, decDeg: number): number {
  const dec = decDeg * DEG;
  const poleRa = GAL_POLE.ra * 15 * DEG;
  const poleDec = GAL_POLE.dec * DEG;
  const ra = raHours * 15 * DEG;
  const sinB =
    Math.sin(dec) * Math.sin(poleDec) +
    Math.cos(dec) * Math.cos(poleDec) * Math.cos(ra - poleRa);
  return Math.asin(Math.max(-1, Math.min(1, sinB))) * RAD;
}

/** Angular radius, in degrees, of the galactic plane band at galactic longitude l. */
export const MILKY_WAY_CENTER = GAL_CENTER;