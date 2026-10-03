"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useScroll, useTransform } from "framer-motion";
import { StarField } from "./StarField";
import { SkyGradient } from "./SkyGradient";
import { MilkyWay } from "./MilkyWay";
import { Constellations } from "./Constellations";
import type { Star, Constellation, SkyConfig } from "@/types/astro";

export function PlanetariumScene({ stars, constellations, sky }: { stars: Star[]; constellations: Constellation[]; sky: SkyConfig }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const rotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  const camZ = useTransform(scrollYProgress, [0, 1], [40, 25]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY * 0.8, behavior: "auto" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={container} className="relative h-[300vh] w-full bg-[#03040a]">
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 40], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <color attach="background" args={[sky.bg.top]} />
          <Suspense fallback={null}>
            <SkyGradient top={sky.bg.top} bottom={sky.bg.bottom} />
            <MilkyWay strength={sky.milkyWay.strength} color={sky.milkyWay.color} />
            <StarField stars={stars} minMag={sky.stars.minMag} />
            <Constellations constellations={constellations} stars={stars} />
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-10 pointer-events-none">
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-3xl text-center text-neutral-200">
            <h1 className="text-4xl md:text-6xl tracking-[0.3em] uppercase">Nocturne Planetarium</h1>
            <p className="mt-6 text-sm md:text-base tracking-[0.2em] uppercase opacity-70">Real stars. Slow passage of time.</p>
            <p className="mt-4 text-xs tracking-[0.15em] uppercase opacity-50">Scroll to rotate the night sky</p>
          </div>
        </section>
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-neutral-200">
            <h2 className="text-2xl md:text-4xl tracking-[0.25em] uppercase">Sidereal motion</h2>
            <p className="mt-4 text-sm tracking-[0.15em] uppercase opacity-70">Scroll-driven rotation reveals the turning sky</p>
          </div>
        </section>
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-neutral-200">
            <h2 className="text-2xl md:text-4xl tracking-[0.25em] uppercase">Constellations traced</h2>
            <p className="mt-4 text-sm tracking-[0.15em] uppercase opacity-70">Minimal lines against deep indigo field</p>
          </div>
        </section>
      </div>
    </div>
  );
}
