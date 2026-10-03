"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import mwVert from "@/shaders/milkyway.vert";
import mwFrag from "@/shaders/milkyway.frag";

export function MilkyWay({ strength = 0.18, color = "#7a8fbf" }: { strength?: number; color?: string }) {
  const { viewport } = useThree();
  const geom = useMemo(() => new THREE.PlaneGeometry(200, 200), []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          strength: { value: strength },
          color: { value: new THREE.Color(color) },
        },
        vertexShader: mwVert,
        fragmentShader: mwFrag,
        transparent: true,
        depthWrite: false,
      }),
    [strength, color]
  );
  return (
    <mesh geometry={geom} material={mat} position={[0, -5, -80]} rotation={[Math.PI / 12, 0, 0]} />
  );
}
