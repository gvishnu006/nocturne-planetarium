import * as THREE from "three";
import { observerBasis } from "./frame";

export function buildLocalRotation(
  latDeg: number,
  lonDeg: number,
  gmst: number
): THREE.Matrix3 {
  return observerBasis(latDeg, lonDeg, gmst);
}
