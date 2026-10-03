"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { raDecToVec3 } from "@/lib/astro";
import type { Constellation, Star } from "@/types/astro";

export function Constellations({ constellations, stars, radius = 121 }: { constellations: Constellation[]; stars: Star[]; radius?: number }) {
  const group = useRef<THREE.Group>(null);
  const starMap = useMemo(() => {
    const m = new Map<string, { ra: number; dec: number }>();
    for (const s of stars) m.set(s.id, { ra: s.ra, dec: s.dec });
    return m;
  }, [stars]);

  const lines = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: 0x7f92b3, transparent: true, opacity: 0.22 });
    const geoms: THREE.BufferGeometry[] = [];
    const meshes: THREE.Line[] = [];
    for (const c of constellations) {
      for (const pair of c.lines) {
        const a = starMap.get(pair[0]);
        const b = starMap.get(pair[1]);
        if (!a || !b) continue;
        const g = new THREE.BufferGeometry();
        const p = new Float32Array(6);
        const v1 = raDecToVec3(a.ra, a.dec, radius);
        const v2 = raDecToVec3(b.ra, b.dec, radius);
        p[0] = v1[0]; p[1] = v1[1]; p[2] = v1[2];
        p[3] = v2[0]; p[4] = v2[1]; p[5] = v2[2];
        g.setAttribute("position", new THREE.BufferAttribute(p, 3));
        geoms.push(g);
        meshes.push(new THREE.Line(g, mat));
      }
    }
    return meshes;
  }, [constellations, starMap, radius]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.0004;
    }
  });

  return <group ref={group}>{lines.map((l, i) => <primitive key={i} object={l} />)}</group>;
}
