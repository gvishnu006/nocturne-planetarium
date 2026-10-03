"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Constellation } from "@/types/astro";
import { useSkyStore } from "@/lib/skyStore";
import { observerBasis } from "@/lib/frame";
import { labelDirection } from "@/lib/catalog";

export function Constellations({ constellations }: { constellations: Constellation[] }) {
  const { gmst, latDeg, lonDeg, lines } = useSkyStore();
  const basis = useMemo(() => observerBasis(latDeg, lonDeg, gmst), [latDeg, lonDeg, gmst]);

  const group = useMemo(() => {
    const g = new THREE.Group();
    if (!lines) return g;
    const mat = new THREE.LineBasicMaterial({
      color: 0x7f95b9,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const radius = 90.2;
    for (const c of constellations) {
      for (const pair of c.lines) {
        const a = (c as any).starMap?.[pair[0]];
        const b = (c as any).starMap?.[pair[1]];
        if (!a || !b) continue;
        const v1 = labelDirection(a.ra, a.dec);
        const v2 = labelDirection(b.ra, b.dec);
        const geom = new THREE.BufferGeometry();
        const p = new Float32Array(6);
        p[0] = v1[0] * radius;
        p[1] = v1[1] * radius;
        p[2] = v1[2] * radius;
        p[3] = v2[0] * radius;
        p[4] = v2[1] * radius;
        p[5] = v2[2] * radius;
        geom.setAttribute("position", new THREE.BufferAttribute(p, 3));
        g.add(new THREE.Line(geom, mat));
      }
    }
    return g;
  }, [constellations, lines]);

  useFrame(() => {
    const m = observerBasis(latDeg, lonDeg, gmst);
    group.children.forEach((child) => {
      if (child instanceof THREE.Line) {
        (child.material as THREE.LineBasicMaterial).opacity = lines ? 0.16 : 0;
      }
    });
    group.matrix.identity();
    group.applyMatrix4(new THREE.Matrix4().setFromMatrix3(m));
  });

  return <primitive object={group} />;
}