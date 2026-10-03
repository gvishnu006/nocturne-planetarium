"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { StarCatalog } from "@/lib/catalog";
import { starVertex, starFragment } from "@/lib/starShaders";
import { observerBasis } from "@/lib/frame";
import { useSkyStore } from "@/lib/skyStore";

type Props = {
  catalog: StarCatalog;
  radius?: number;
  /** Degrees below the horizon at which stars are fully extinguished. */
  /** fadeStart handled in-shader. */
  size?: number;
};

export function StarField({ catalog, radius = 90, size = 2.6 }: Props) {
  const points = useRef<THREE.Points>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(catalog.eq, 3));
    g.setAttribute("aMag", new THREE.BufferAttribute(catalog.mag, 1));
    g.setAttribute("aBV", new THREE.BufferAttribute(catalog.bv, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(catalog.phase, 1));
    // The field is drawn at a fixed radius; culling against the default
    // bounding sphere would clip it as soon as the camera moves.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius * 1.05);
    return g;
  }, [catalog, radius]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uBasis: { value: new THREE.Matrix3() },
          uLimitMag: { value: 6.5 },
          uExposure: { value: 1 },
          uTime: { value: 0 },
          uTwinkle: { value: 1 },
          uPixelRatio: { value: 1 },
          uSize: { value: size },
          uRadius: { value: radius },
          uOpacity: { value: 1 },
        },
        vertexShader: starVertex,
        fragmentShader: starFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        // Additive is right for light sources: stars emit, they do not occlude.
        blending: THREE.AdditiveBlending,
      }),
    [radius, size]
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state) => {
    const u = material.uniforms;
    const { latDeg, lonDeg, gmst, twinkle, exposure } = useSkyStore.getState();

    u.uBasis.value.copy(observerBasis(latDeg, lonDeg, gmst));
    u.uTime.value = state.clock.elapsedTime;
    u.uTwinkle.value = twinkle;
    u.uExposure.value = exposure;
    u.uPixelRatio.value = gl.getPixelRatio();
  });

  return <primitive object={new THREE.Points(geometry, material)} ref={points} />;
}