"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { raDecToVec3, bvToColor, magToSize } from "@/lib/astro";
import type { Star } from "@/types/astro";
import starsVert from "@/shaders/stars.vert";
import starsFrag from "@/shaders/stars.frag";

export function StarField({ stars, radius = 120, minMag = 6.5 }: { stars: Star[]; radius?: number; minMag?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { gl } = useThree();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(stars.length * 3);
    const col = new Float32Array(stars.length * 3);
    const sz = new Float32Array(stars.length);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const [x, y, z] = raDecToVec3(s.ra, s.dec, radius);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const c = bvToColor(s.bv);
      const cc = new THREE.Color(c);
      col[i * 3] = cc.r;
      col[i * 3 + 1] = cc.g;
      col[i * 3 + 2] = cc.b;

      sz[i] = magToSize(s.mag, 0.8, 3.2, minMag);
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [stars, radius, minMag]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.0005; // slow natural drift
    }
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, colors, sizes]);

  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: starsVert,
      fragmentShader: starsFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
    });
    return m;
  }, []);

  return <points ref={ref} geometry={geom} material={mat} />;
}
