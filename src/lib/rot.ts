import { observerBasis } from "./frame";

export function buildLocalRotation(
  latDeg: number,
  lonDeg: number,
  gmst: number
): THREE.Matrix3 {
  // left as-is, computed on demand
  return observerBasis(latDeg, lonDeg, gmst);
}