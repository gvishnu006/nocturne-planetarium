"use client";

import { useMemo } from "react";
import * as THREE from "three";
import skyVert from "@/shaders/sky.vert";
import skyFrag from "@/shaders/sky.frag";

export function SkyGradient({ top = "#050814", bottom = "#040510" }: { top?: string; bottom?: string }) {
  const geom = useMemo(() => new THREE.SphereGeometry(150, 32, 32), []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(top) },
          bottomColor: { value: new THREE.Color(bottom) },
        },
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [top, bottom]
  );
  return <mesh geometry={geom} material={mat} />;
}
