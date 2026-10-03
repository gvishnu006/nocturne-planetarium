import * as THREE from "three";
import { DEG } from "./astro";

/**
 * Build the 3x3 matrix that takes a star's equatorial cartesian direction
 * into the observer's local frame, expressed as (east, up, south).
 *
 * The three local axes, written in equatorial coordinates, are:
 *   east   = (-sin th,  cos th, 0)        th = local sidereal time
 *   up     = ( cos f cos th, cos f sin th, sin f)   f = latitude
 *   north  = (-sin f cos th, -sin f sin th, cos f)
 *
 * Putting `south` in the third slot instead of `north` means +z points at the
 * viewer when they are facing north, which is the natural way round for a
 * scene where the camera looks down -z.
 */
export function observerBasis(
  latDeg: number,
  lonEastDeg: number,
  gmstHours: number
): THREE.Matrix3 {
  const th = ((gmstHours + lonEastDeg / 15) * 15) * DEG;
  const f = latDeg * DEG;

  const st = Math.sin(th);
  const ct = Math.cos(th);
  const sf = Math.sin(f);
  const cf = Math.cos(f);

  // rows: east, up, south = -north
  return new THREE.Matrix3().set(
    -st, ct, 0,
    cf * ct, cf * st, sf,
    sf * ct, sf * st, -cf
  );
}

/** Local sidereal time in hours. */
export function lstHours(gmst: number, lonEastDeg: number): number {
  return ((gmst + lonEastDeg / 15) % 24 + 24) % 24;
}